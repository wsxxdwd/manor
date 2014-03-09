var db = require("../server/db");
var Player = require("../server/player");
var Admin = require("../server/admin");
var World = require("../server/world");
var u = require("./utils");
var crypto = require("crypto");
function Game(){
	this.status = 0;
	playerList = new Array();
	adminList = new Array();
	var _this = this;
	//初始化
	this.init = function(){
		db.find("item",{},function(items){
			itemInfo = items;
		});
		db.find("building",{},function(buildings){
			buildingInfo = buildings;
		});
		this.status = 1;
		world = new World();
		world.init();
		logger.log("server on");
		//世界滴答
		worldTimer = setInterval(tick,5000);
	};
	this.addListener = function(io){
		//连接
		io.sockets.on('connection',function(socket){
			//加入游戏
			socket.on("playerLogin",function(data){
				if(!_this.status){
					return 0;
				}
				if(!u.$player(data._id)){
					var newplayer = new Player(data._id,socket);
					newplayer.init();
					playerList.push(newplayer);
					logger.log(data._id+" join the game!");
				}else{
					logger.log(data._id+" reconnect!");
				}
			});
			//管理员登陆
			socket.on("adminLogin",function(data){
				if(!_this.status){
					return 0;
				}
				var inArray = false;
				for(v in adminList){
					if(adminList[v].id == socket.id){
						inArray = true;
						return;
					}
				}
				if(!inArray){
					var newadmin = new Admin(socket);
					adminList.push(newadmin);
					logger.log(socket.id+" start monitor!");
				}else{
					logger.log(socket.id+" reconnect!");
				}
				socket.emit("adminWelcome",{name:socket.id});
			});
			//发送邮件
			socket.on("sendMail",function(data){
				if(!_this.status){
					return 0;
				}
				u.$player_so(socket.id).sendMail(data.msg);
			});
			//查找信息(通过objectID)
			socket.on("getter",function(data){
				if(!_this.status){
					return 0;
				}
				searchById(socket,data);
			});
			socket.on("completeQuest",function(data){
				if(!_this.status){
					return 0;
				}
				var quest = world.field(data.fieldId).quest;
				var items = u.$player(data.playerId).info.items;
				for(var i = 0;i<items.length;i++){
					if(items[i].id == quest.requirement.toString()){
						console.log('find item');
						if(items[i].num>=quest.num){
							u.$player(data.playerId).earn(quest.reward);
							u.$player(data.playerId).reduceItem(items[i].id,quest.num);
							db.update("field",{_id:data.field},{quest:randomQuest()},function(){
								socket.emit("questResult",{result:1,money:quest.reward});
							});
							return 1;
						}else{
							socket.emit("questResult",{result:0});
							return 0;
						}
					}
				}
			});
			//游戏静态信息获取
			socket.on("gameData",function(data){
				if(!_this.status){
					return 0;
				}
				checkupdate(socket,data.md5);
			});
			//丢失连接
			socket.on("disconnect",function(){
				if(!_this.status){
					return 0;
				}
				for(var v in playerList){
					if(playerList[v].so.id == socket.id){
						playerList[v].quit();
					}
				}
				for(var v in adminList){
					if(adminList[v].so.id == socket.id){
						adminList[v].quit();
					}
				}
				logger.log(socket.id+" disconnect!");
			});
			//丢失连接
			socket.on("shutdown",function(){
				if(!_this.status){
					return 0;
				}
				shutdown();
				logger.log("管理员 "+socket.id+" 关闭了服务器");
			});
		});
	}//end listener
	function tick(){
		world.time ++;
		world.loopList();
		//logger.log("world time : "+world.worldTime());
		if(!(world.time%3)){
			db.update("world",{},{time:world.time},function(){
				logger.log("world time update--> "+world.worldTime())
			});
		}
	}
	function searchById(socket,data){
		console.log(data);
		switch(data.type){
			case "player":
				db.find("player",{_id:{$in:data.id}},{password:0},function(data){
					socket.emit("playerInfo",data);
				});
				break;
			case "manor":
				db.find("manor",{_id:{$in:data.id}},function(data){
					socket.emit("manorInfo",data);
				});
				break;
			case "field":
				db.find("field",{_id:{$in:data.id}},function(data){
					socket.emit("fieldInfo",data);
				});
				break;
		}
	}
	//检查玩家游戏数据是否需要更新缓存
	function checkupdate(socket,user_md5){
		var gameData = {items:items,buildings:buildings};
		var md5 = crypto.createHash("md5");
		var server_md5 = md5.update(JSON.stringify(gameData));
		server_md5 = server_md5.digest('hex');
		if(server_md5 == user_md5){
			socket.emit("gameData",{update:0});
		}else{
			socket.emit("gameData",{update:1,data:gameData});
		}
	}
	function randomQuest(){
		var quests = [
			{
				name:"饥荒",
				description:"庄园北部的小镇发生了饥荒,现在有人大量在收购面包,提供20个面包将会对缓解状况起到很大的帮助",
				requirement:"52ef8fd60163106814ff823d",
				num:20,
				reward:50
			},
			{
				name:"南方的商人",
				description:"南方来了个商人在城镇中大量收购小麦",
				requirement:"52f395588d619f88084491e4",
				num:30,
				reward:50
			}
		];
		var index = parseInt(Math.random()*quests.length);
		return quests[index];
	}
	//终止游戏服务器
	function shutdown(){
		clearInterval(worldTimer);
		for(var i = 0;i<world.fields.length;i++){
			db.update("field",{_id:world.fields[i]._id},{buildings:world.fields[i].buildings},function(){
				
			});
		}
		console.log("update fields info")
	}
}
module.exports = Game;