var db = require("../server/db");
var Player = require("../server/player");
var Admin = require("../server/admin");
var World = require("../server/world");
var u = require("./utils");
var crypto = require("crypto");
function Game(){
	playerList = new Array();
	adminList = new Array();
	//初始化
	this.init = function(){
		world = new World();
		world.init();
		logger.log("server on");
		//世界滴答
		var timer = setInterval(tick,5000);
	};
	this.addListener = function(io){
		//连接
		io.sockets.on('connection',function(socket){
			//加入游戏
			socket.on("join",function(data){
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
			});
			//广播
			socket.on("say_to_world",function(data){
				for(var v in playerList){
					if(playerList[v].so.id == socket.id){
						playerList[v].sendMail(data.msg,"world");
					}
				}
			});
			//私人邮件
			socket.on("say_to_player",function(data){
				for(var v in playerList){
					if(playerList[v].so.id == socket.id){
						playerList[v].sendMail(data.msg,data.id);
					}
				}
			});
			//查找信息(通过objectID)
			socket.on("getter",function(data){
				searchById(socket,data);
			});
			socket.on("completeQuest",function(data){
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
				checkupdate(socket,data.md5);
			});
			//丢失连接
			socket.on("disconnect",function(){
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
		db.find("item",{},function(items){
			db.find("building",{},function(buildings){
				var gameData = {items:items,buildings:buildings};
				var md5 = crypto.createHash("md5");
				var server_md5 = md5.update(JSON.stringify(gameData));
				server_md5 = server_md5.digest('hex');
				if(server_md5 == user_md5){
					socket.emit("gameData",{update:0});
				}else{
					socket.emit("gameData",{update:1,data:gameData});
				}
			});
		});
	}
	function randomQuest(){
		var quests = [
			{
				name:"饥荒",
				description:"庄园北部的小镇发生了饥荒,现在有人大量在收购面包,提供20个面包将会对缓解状况起到很大的帮助",
				requirement:"52ef8fd60163106814ff823d",
				num:20,
				reward:50
			}
		];
		var index = parseInt(Math.random()*quests.length);
		return quests[index];
	}
}
module.exports = Game;