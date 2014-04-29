var db = require("../server/db");
var u = require("./utils");
function Player(id,socket){
	this.id = id;
	this.so = socket;
	this.info;
	this.updateList = [];
	var _this = this
	//玩家加入游戏
	this.init = function(){
		db.find("player",{_id:this.id},{password:0},function(data){
			_this.info = data[0];
			_this.so.emit("welcome",{info:data[0]});
			_this.so.emit("worldTime",{time:world.worldTime()});
			_this.so.emit("worldMap",{map:world.map,size:world.size});
			var currentField = world.fieldXYtoId(data[0].location[0],data[0].location[1]);
			world.setFieldPlayer(currentField,{id:_this.id,name:_this.info.name},1);
			logger.log("玩家:"+_this.info.name+"加入了游戏")
		});
	}
	
	//玩家退出游戏
	this.quit = function(){
		for(v in playerList){
			if(playerList[v].id == this.id){
				playerList.splice(v,1);
			}
		}
		logger.log("玩家:"+_this.info.name+"退出了游戏")
		var currentField = world.fieldXYtoId(this.info.location[0],this.info.location[1]);
		world.setFieldPlayer(currentField,{id:_this.id,name:_this.info.name},2);
	}
	//发送邮件
	this.sendMail = function(data){
		var d = new Date();
		var nowTime = d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate()+" "+d.getHours()+":"+d.getMinutes()+":"+d.getSeconds(); 
		
		db.find("player",{_id:data.to},{mailHistory:1,name:1},function(playerInfo){
			if(playerInfo.length){
				if(_this.info.mailHistory.length >= 20){
					_this.info.mailHistory.shift();
				}
				_this.info.mailHistory.push({time:nowTime,from:"我",to:playerInfo[0].name,title:data.title,content:data.msg});
				playerInfo[0].mailHistory.push({time:nowTime,fromId:_this.id,from:_this.info.name,to:"我",title:data.title,content:data.msg});
				_this.info.save();
				playerInfo[0].save();
				var player = u.$player(data.to);
				if(player){
					player.so.emit("newMail",{from:_this.info.name,title:data.title});//发送新邮件提醒
					player.sendUpdate("mailHistory");
				}
				_this.sendUpdate("mailHistory");
			}else{
				console.log("无效的收信人");
			}
		});
	} 
	//雇佣
	this.hire = function(unitInfo,callback){
		var field = world.field(unitInfo.field);
		if(this.info.team.length < this.info.leadership/3){
			for(var i = 0;i < field.tavern.lansquenet.length;i++){
				if(field.tavern.lansquenet[i].id == unitInfo.id){
					if(this.cost(field.tavern.lansquenet[i].price)){//扣除价格
						var unit = field.tavern.lansquenet.splice(i,1);
						console.log(unit);
						this.info.team.push(unit[0]);
						console.log("雇佣军数量:"+field.tavern.lansquenet.length);
						//从酒馆删除单位并添加到玩家队伍
						this.so.emit("hireResult",{status:1,id:unitInfo.id});
						this.sendUpdate("team","money");
						this.info.save();
						field.save();
						return 1;
					}else{
						callback({status:0,msg:"资金不足"});
						return 0;
					}
				}
			}
			callback({status:0,msg:"该单位不存在"});
			return 0;
		}else{
			callback({status:0,msg:"已到达队伍上限"});
			return 0;
		}
	}
	//建造
	this.construct = function(id,callback){
		var field = world.field(this.info.base);
		var building = u.$building(id);
		if(field.buildings.length < 10){
			//检验材料是否充足
			var need = building.constructMaterial;
			for(var i = 0;i<need.length;i++){
				switch(need[i].type){
					case "money":
						if(this.info.money < need[i].num){
							callback({status:0,msg:"金钱不足"});
							return 0;
						}
						break;
					case "log":
						var condition = 0;
						for(var j = 0;j<this.info.items.length;j++){
							if(this.info.items[j].id == "" && this.info.items[j].num >= need[i].num){
								//引号内是木头的id
								condition = 1;
							}
						}
						if(!condition){
							callback({status:0,msg:"木材不足"});
							return 0;
						}
						break;
					case "rock":
						var condition = 0;
						for(var j = 0;j<this.info.items.length;j++){
							if(this.info.items[j].id == "" && this.info.items[j].num >= need[i].num){
								//引号内是石头的id
								condition = 1;
							}
						}
						if(!condition){
							callback({status:0,msg:"石材不足"});
							return 0;
						}
						break;
				}
			}
			//能跑到这里说明材料够,再跑一次扣除所需材料
			for(var i = 0;i<need.length;i++){
				switch(need[i].type){
					case "money":
						this.cost(need[i].num)
						break;
					case "log":
						this.reduceItem("",need[i].num);
						break;
					case "rock":
						this.reduceItem("",need[i].num);
						break;
				}
			}
			//领地新增建筑
			field.buildings.push({id:id,timer:0,status:"constructing"});
			field.save();//更新领地
			this.info.save();//更新玩家信息
			this.so.emit("constructResult",{status:1,id:id});
			this.sendUpdate("money","items");
		}else{
			callback({status:0,msg:"已到达建筑物上限"});
			return 0;
		}
	}
	this.move = function(tx,ty,fx,fy){
		if(this.info.location[0] == fx&&this.info.location[1] == fy){
			this.info.location = [tx,ty];
			world.playerMove({id:this.id,name:this.info.name},tx,ty,fx,fy);
		}
	}
	this.cost = function(num){
		if(this.info.money >= num){
			this.info.money -= num;
			return 1;
		}else{
			return 0;//金钱不足
		}
	}
	this.earn = function(num){
		this.info.money += num;
		return 1;
	}
	this.addItem = function(item,num){
		for(var v in this.info.items){
			if(this.info.items[v].id == item){
				this.info.items[v].num += num;//原有物品直接增加数量
				return 1;
			}
		}
		this.info.items.push({id:item,num:num});//新增物品
		return 1;
	}
	this.reduceItem = function(item,num){
		for(var v = 0;v<this.info.items.length;v++){
			if(this.info.items[v].id == item.toString()){
				//原有物品直接减去数量
				if(this.info.items[v].num >= num){
					this.info.items[v].num -= num;
					if(this.info.items[v].num == 0){
						this.info.items.splice(v,1);
					}
					return 1;
				}else{
					console.log("数量不足");
					return 0;//物品数量不足
				}
			}
		}
		console.log("没有物品");
		return 0;//没有物品
	}
	this.sendUpdate = function(){
		for(var v in arguments){
			this.updateList.push(arguments[v]);
		}
		var info ={};
		if(this.updateList && this.updateList[0] == "all"){
			info = this.info;
		}else{
			for(var v in this.updateList){
				info[this.updateList[v]] = this.info[this.updateList[v]];
			}
		}
		this.so.emit("update",info);
	}
	this.loop = function(){
		
	}
	this.updatedb = function(){
		this.info.save();
	}
}
module.exports = Player;