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
			_this.so.emit("welcome",{info:data[0]});
			_this.info = data[0];
			
		});
	}
	//玩家退出游戏
	this.quit = function(){
		for(v in playerList){
			if(playerList[v].id == this.id){
				playerList.splice(v,1);
			}
		}
	}
	this.sendMail = function(msg,target){
		var listener;
		var d = new Date();
		var nowTime = d.getFullYear()+"-"+d.getMonth()+"-"+d.getDate()+" "+d.getHours()+":"+d.getMinutes()+":"+d.getSeconds(); 
		if(target == "world"){
			this.cost(5);
			this.so.broadcast.emit("worldMsg",{msg:msg,from:this.id,time:nowTime});
			logger.log(socket.id+" say to world : "+msg)
		}else{
			if(u.$player(target)){
				this.cost(5);
				u.$player(target).so.emit("personalMsg",{msg:msg,from:this.id,time:nowTime});
			}
		}
	}
	this.cost = function(num){
		this.info.money -= num;
		db.update("player",{_id:this.id},{money:this.info.money},function(res){
			if(res){
				_this.update("money");
			}
		});
	}
	this.earn = function(num){
		this.info.money += num;
		db.update("player",{_id:this.id},{money:this.info.money},function(res){
			if(res){
				_this.update("money");
			}
		});
	}
	this.addItem = function(item,num){
		for(var v in this.info.items){
			if(this.info.items[v].id == item){
				this.info.items[v].num += num;//原有物品直接增加数量
				db.update("player",{_id:this.id},{items:this.info.items},function(res){
					if(res){
						_this.update("items");
					}
				});
				this.update("items");
				return 1;
			}
		}
		this.info.items.push({id:item,num:num});
		db.update("player",{_id:this.id},{items:this.info.items},function(res){
			if(res){
				_this.update("items");
			}
		});
	}
	this.reduceItem = function(item,num){
		for(var v = 0;v<this.info.items.length;v++){
			if(this.info.items[v].id == item.toString()){
				//原有物品直接减去数量
				if(this.info.items[v].num >= num){
					this.info.items[v].num -= num;
					db.update("player",{_id:this.id},{items:this.info.items},function(res){
						if(res){
							_this.update("items");
						}
					});
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
	this.update = function(){
		for(var v in arguments){
			this.updateList.push(arguments[v]);
		}
		var info ={};
		if(this.updateList == "all"){
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
}
module.exports = Player;