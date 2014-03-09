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
			_this.so.emit("worldTime",{time:world.worldTime()});
			_this.so.emit("worldMap",{map:world.map});
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
	this.sendMail = function(msg){
		var listener;
		var d = new Date();
		var nowTime = d.getFullYear()+"-"+d.getMonth()+"-"+d.getDate()+" "+d.getHours()+":"+d.getMinutes()+":"+d.getSeconds(); 
		if(_this.mailHistory.length >= 20){
			_this.mailHistory.shift();
		}
		_this.info.mailHistory.push({time:nowTime,from:"我",content:msg});
		/* if(target == "world"){
			this.cost(5);
			this.so.broadcast.emit("worldMsg",{msg:msg,from:this.id,time:nowTime});
			logger.log(socket.id+" say to world : "+msg)
		}else{
			if(u.$player(target)){
				this.cost(5);
				u.$player(target).so.emit("personalMsg",{msg:msg,from:this.id,time:nowTime});
			}
		}*/
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
				this.update("items");
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
	this.updatedb = function(param){
		switch(param){
			case "name":
				db.update("player",{_id:this.id},{name:this.info.name},function(res){logger.log("玩家 "+this.info.name+"("+this.info.id+")"+" 更新了昵称")});
			break;
			case "manor":
				db.update("player",{_id:this.id},{manor:this.info.manor},function(res){logger.log("玩家 "+this.info.name+"("+this.info.id+")"+" 更新了领地")});
				break;
			case "base":
				db.update("player",{_id:this.id},{base:this.info.base},function(res){logger.log("玩家 "+this.info.name+"("+this.info.id+")"+" 更新了封地")});
				break;
			case "friends":
				db.update("player",{_id:this.id},{friends:this.info.friends},function(res){logger.log("玩家 "+this.info.name+"("+this.info.id+")"+" 更新了好友信息")});
				break;
			case "money":
				db.update("player",{_id:this.id},{money:this.info.money},function(res){logger.log("玩家 "+this.info.name+"("+this.info.id+")"+" 更新了金龙币")});
				break;
			case "alignment":
				db.update("player",{_id:this.id},{alignment:this.info.alignment},function(res){logger.log("玩家 "+this.info.name+"("+this.info.id+")"+" 更新了阵营")});
				break;
			case "items":
				db.update("player",{_id:this.id},{items:this.info.items},function(res){logger.log("玩家 "+this.info.name+"("+this.info.id+")"+" 更新了物品")});
				break;
			case "location":
				db.update("player",{_id:this.id},{location:this.info.location},function(res){logger.log("玩家 "+this.info.name+"("+this.info.id+")"+" 更新了地点")});
				break;
			case "team":
				db.update("player",{_id:this.id},{team:this.info.team},function(res){logger.log("玩家 "+this.info.name+"("+this.info.id+")"+" 更新了队伍")});
				break;
			case "leadership":
				db.update("player",{_id:this.id},{leadership:this.info.leadership},function(res){logger.log("玩家 "+this.info.name+"("+this.info.id+")"+" 更新了统御值")});
				break;
			case "mailHistory":
				db.update("player",{_id:this.id},{mailHistory:this.info.mailHistory},function(res){logger.log("玩家 "+this.info.name+"("+this.info.id+")"+" 更新了邮件历史")});
				break;
		}
	}
}
module.exports = Player;