var db = require("./db");
var u = require("./utils");
function World(){
	this.name = "庄园:乱世";
	this.time = 0;
	this.map = [];
	this.size = 0;
	var _this = this;
	//世界时间
	
	this.init = function(){
		this.getWorldInfo();
		db.find("field",{},{playerList:0},function(fields){
			_this.fields = fields;
			console.log("world init");
		});	
	}
	this.worldTime = function(time){
		if(typeof(time) == "undefined"){
			return tran(this.time);
		}else{
			return tran(time);
		}
		function tran(t){
			var min = t%60;
			var hour = ((t - min)/60)%24;
			var day = ((t - min - hour*60)/(24*60))%365;
			var year = (t - min - hour*60 - day*24*60)/(365*24*60);
			return format(year)+"年"+format(day)+"日"+format(hour)+"时"+format(min)+"分";
			function format(s){
				if(s<10)
					return "0"+s;
				else
					return s;
					
			}
		}
	}
	//根据id返回领地
	this.field = function(id){
		for(var i = 0;i<this.fields.length;i++){
			if(this.fields[i]._id.toString() == id){
				return this.fields[i];
			}
		}
	}
	//根据id更新领地
	this.updateField = function(id){
		for(var i = 0;i<this.fields.length;i++){
			if(this.fields[i]._id == id){
				fields[i].save();
				return 1;
			}
		}
		return 0;
	}
	//根据坐标返回领地id
	this.fieldXYtoId = function(x,y){
		for(var i = 0;i<this.fields.length;i++){
			if(this.fields[i].location[0] == x&&this.fields[i].location[1] == y){
				return this.fields[i].id;
			}
		}
		return false;
	}
	this.playerMove = function(player,tx,ty,fx,fy){
		var fromField = this.fieldXYtoId(fx,fy);
		this.setFieldPlayer(fromField,player,2);
		var toField = this.fieldXYtoId(tx,ty);
		this.setFieldPlayer(toField,player,1);
	}
	this.setFieldPlayer = function(id,player,type){
		if(type == 1){
			for(var i = 0;i<this.fields.length;i++){
				if(this.fields[i]._id == id){
					if(this.fields[i].playerList){
						this.fields[i].playerList.push(player);
						return 1;
					}else{
						this.fields[i].playerList = [player];
						return 1;
					}
				}
			}
			return false;
		}else if(type == 2){
			for(var i = 0;i<this.fields.length;i++){
				if(this.fields[i]._id == id){
					for(var j = 0;j<this.fields[i].playerList.length;j++){
						if(this.fields[i].playerList[j].id == player.id){
							this.fields[i].playerList.splice(j,1);
						}
					}
				}
			}
			return false;
		}
	}
	this.getWorldInfo = function(){
		db.find("world",{},function(data){
			var world = data[0];
			_this.time = world.time;
			_this.map = world.map;
			_this.size = world.size;
		});
	}
	//世界循环
	this.loopList = function(){
		io.sockets.emit("worldTime",{time:this.worldTime()});
		buildingEvent();
		tavernEvent();
		if(!(world.time%120)){//10分钟刷新一次任务
			refreshQuest()
		}
	}
	//建筑循环
	function buildingEvent(){
		for(var i = 0;i<_this.fields.length;i++){
			//闭包
			(function(x){
				db.find("player",{_id:_this.fields[x].holder},function(holder){
					var holder = holder[0];
					for(var j = 0;j<_this.fields[x].buildings.length;j++){
						var status = _this.fields[x].buildings[j].status;
						var timer = _this.fields[x].buildings[j].timer;
						building = u.$building(_this.fields[x].buildings[j].id);
						if(status == 'wait'){
							//默认生成条件满足
							var condition = 1;
							if(building.material.id){
								//需要原料产,判断原料是否充足
								condition = 0;
								for(var k = 0;k<holder.items.length;k++){
									if(holder.items[k].id == building.material.id.toString()){
										if(holder.items[k].num >= building.material.need){
											//条件满足,消耗物品
											holder.items[k].num -= building.material.need;
											var player;
											if(player = u.$player(player)){
												//玩家在线,更新玩家对象并发送通知
												player.reduceItem(building.material.id,building.material.need);
												player.sendUpdate('items');
												//发送建筑状态改变信息
												player.so.emit("buildingStatuschange",{id:_this.fields[x].buildings[j]._id,status:"work"});
											}
											//更新数据库
											holder.save();
											logger.log(holder.name+"的建筑"+building.name+"消耗了"+building.material.need+"单位的"+u.$item(building.material.id).name);
											condition = 1;
										}
									}
								}
							}
							if(condition){
								_this.fields[x].buildings[j].status = 'work';
								_this.fields[x].save();
							}
						}else if(status == 'work'){
							if(timer >= building.ability.time){
								//生产完毕
								//flag判断玩家是否有该物品
								var flag = 1;
								for(var l = 0;l<holder.items.length;l++){
									if(holder.items[l].id == building.ability.id){
										holder.items[l].num += building.ability.num;
										flag = 0;
									}
								}
								if(flag){//玩家没有该物品,添加
									holder.items.push({id:building.ability.id,num:building.ability.num});
								}
								var player;
								if(player = u.$player(player)){
									//玩家在线,更新玩家对象并发送通知
									player.addItem(building.ability.id,building.ability.num);
									player.sendUpdate('items');
									//发送建筑状态改变信息
									player.so.emit("buildingStatuschange",{id:_this.fields[x].buildings[j]._id,status:"wait"});
								}
								//更新数据库
								logger.log(holder.name+"的建筑"+building.name+"生产了"+building.ability.num+"单位的"+u.$item(building.ability.id).name);
								holder.save();
								_this.fields[x].save();
								_this.fields[x].buildings[j].status = 'wait';
								_this.fields[x].buildings[j].timer = 0;
							}else{
								_this.fields[x].buildings[j].timer ++;
								_this.fields[x].save();
							}
						}
					}
				});
			})(i)//end of find player
		}
	}//end of buildingEvent
	//酒馆生成新单位
	function tavernEvent(){
		for(var i = 0;i<_this.fields.length;i++){
			(function(x){
				if(_this.fields[x].tavern.timer >= 720){
					if(_this.fields[x].tavern.lansquenet.length < 20){//酒馆雇佣军上限
						var name = '';
						var condition = [u.random(52638),u.random(52638)];
						db.find("unitName",{rd:{$in:condition}},function(data){
							name = data[0].xing;
							name += data[1].ming
							master = '';
							ATT = u.random(3,10);
							DEF = u.random(1,6);
							CRI = 0.1;
							ACR = 0;
							special = '';
							type = 'worker';
							items = [];
							items[0] = u.random()<0.2?'531f3bf582ddfac41ffcc521':'';
							items[1] = u.random()<0.2?'531f3cc31c4370281dc39251':'';
							db.create('unit',name,master,ATT,DEF,CRI,ACR,special,type,items,function(lansquenet){
								_this.fields[x].tavern.timer = 0;
								_this.fields[x].tavern.lansquenet.push({id:lansquenet._id,name:lansquenet.name,price:u.random(200,500)});
								_this.fields[x].save()
								logger.log(_this.fields[x].name+" 生成了新的雇佣军:"+lansquenet.name);
							});
						});
					}
				}else{
					_this.fields[x].tavern.timer ++;
				}
			})(i);
		}
	}
	//刷新任务
	function refreshQuest(){
		for(var i = 0;i<_this.fields.length;i++){
			(function(x){
				if(_this.fields[x].quest.length < 3){//根据日常任务数决定
					var newQuest = randomQuest();
					for(var j = 0;j < _this.fields[x].quest.length;j++){
						if(_this.fields[x].quest.name == newQuest.name){
							return 0;//重名任务,不添加
						}
					}
					_this.fields[x].quest.push(newQuest);
					_this.fields[x].save();
					logger.log(_this.fields[x].name+"刷新了任务"+newQuest.name);
				}
			})(i);
		}
	}
	function randomQuest(){
		var quests = [
			{
				name:"饥荒",
				description:"庄园北部的小镇发生了饥荒,现在有人大量在收购面包",
				requirement:"52ef8fd60163106814ff823d",
				num:u.random(20,100),
				reward:u.random(60,500)
			},
			{
				name:"南方的商人",
				description:"南方来了个商人在城镇中大量收购小麦",
				requirement:"52f395588d619f88084491e4",
				num:u.random(20,50),
				reward:u.random(50,200)
			},
			{
				name:"奇怪的嗜好",
				description:"一个本地富豪突然想吃咸鱼,他的仆人正在收购",
				requirement:"52ef9017b1366a24101cca65",
				num:u.random(40,60),
				reward:u.random(200,300)
			}
		];
		var index = u.random(quests.length);
		return quests[index];
	}
}

module.exports = World;