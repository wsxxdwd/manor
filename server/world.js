var db = require("./db");
var u = require("./utils");
function World(){
	this.name = "庄园:乱世";
	this.time = 0;
	this.map = [];
	var _this = this;
	//世界时间
	
	this.init = function(){
		this.getWorldInfo();
		db.find("field",{},function(fields){
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
	this.field = function(id){
		for(var i = 0;i<this.fields.length;i++){
			if(this.fields[i]._id = id){
				return this.fields[i];
			}
		}
	}
	this.getWorldInfo = function(){
		db.find("world",{},function(data){
			var world = data[0];
			_this.time = world.time;
			_this.map = world.map;
		});
	}
	//世界循环
	this.loopList = function(){
		io.sockets.emit("worldTime",{time:this.worldTime()});
		buildingEvent();
	}
	
	function buildingEvent(){
		for(var i = 0;i<_this.fields.length;i++){
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
									if(holder.items[k].id == building.material.id){
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
											db.update("player",{_id:holder._id},{items:holder.items},function(){
												logger.log(holder.name+"的建筑"+building.name+"消耗了"+building.material.need+"单位的"+$item(building.material.id).name);
											});
											condition = 1;
										}
									}
								}
							}
							if(condition){
								_this.fields[x].buildings[j].status = 'work';
							}
						}else if(status == 'work'){
							if(timer >= building.ability.time){
								//生产完毕
								var flag = 1;
								for(var l = 0;l<holder.items.length;l++){
									if(holder.items[l].id == building.ability.id){
										holder.items[l].num += building.ability.num;
										flag = 0;
									}
								}
								if(flag){
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
								db.update("player",{_id:holder._id},{items:holder.items},function(){
									logger.log(holder.name+"的建筑"+building.name+"生产了"+building.ability.num+"单位的"+$item(building.ability.id).name);
								});
								_this.fields[x].buildings[j].status = 'wait';
							}
						}
					}
				});
			})(i)//end of find player
		}
	}
}

module.exports = World;