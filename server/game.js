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
		world = new World();
		world.init();
		logger.log("server on");
		//服务器启动
		start();
	};
	this.addListener = function(io){
		//连接
		io.sockets.on('connection',function(socket){
			//玩家加入游戏
			socket.on("playerLogin",function(data){
				if(!_this.status){
					return 0;
				}
				var newplayer = new Player(data._id,socket);
				playerList.push(newplayer);
				db.find("player",{_id:data._id},{username:1,isnew:1},function(data){
					if(data[0].isnew){
						socket.emit("welcome",{info:data[0]});
					}else{
						newplayer.init();
					}
				})
			});
			//新玩家设置名字
			socket.on("setPlayerName",function(data){
				if(!_this.status){
					return 0;
				}
				var player = u.$player_so(socket.id);
				db.update("player",{_id:player.id},{name:data.name,isnew:0},function(data){
					player.init();
				});
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
				u.$player_so(socket.id).sendMail(data);
			});
			
			//玩家移动
			socket.on("playerMove",function(data){
				if(!_this.status){
					return 0;
				}
				var player = u.$player_so(socket.id);
				player.move(data.toX,data.toY,data.fromX,data.fromY);
				player.updatedb();
			});
			//创建聊天
			socket.on("createChat",function(data){
				if(!_this.status){
					return 0;
				}
				var player = u.$player_so(socket.id);
				var target = u.$player(data.id);
				if(target){
					socket.emit("chatConnect",{status:1,so:target.so.id,name:target.info.name});//返回对方socket
					target.so.emit("chatConnect",{status:1,so:socket.id,name:player.info.name});//给对方返回自己socket和信息
				}else{
					socket.emit("chatConnect",{status:0,msg:"无法联系到对方玩家"});//对象不存在
				}
			});
			//聊天
			socket.on("chat",function(data){
				var reciver = u.$player_so(data.reciver);
				if(reciver){
					reciver.so.emit("chatMsg",{status:1,from:socket.id,msg:data.msg});
				}else{
					socket.emit("chatMsg",{status:0,msg:"无法联系到对方玩家"});//玩家socket不存在
				}
			});
			//雇佣士兵
			socket.on("hireUnit",function(data){
				if(!_this.status){
					return 0;
				}
				console.log(data);
				var player = u.$player_so(socket.id);
				player.hire(data.unitInfo,function(res){
					if(res.status == 1){
						logger.log("玩家:"+player.name+"花了"+data.info.cost+"金龙币雇佣了佣兵");
					}else{
						socket.emit("hireResult",res);
					}
				});
				player.updatedb();
			});
			//建造建筑
			socket.on("construct",function(data){
				if(!_this.status){
					return 0;
				}
				console.log(data);
				var player = u.$player_so(socket.id);
				player.construct(data.buildingId,function(res){
					if(res.status == 1){
						logger.log("玩家:"+player.name+"开始建造新的建筑"+data.buildingId);
						player.updatedb();
					}else{
						socket.emit("constructResult",res);
					}
				});
			});
			//寄售物品
			socket.on("sellItem",function(data){
				if(!_this.status){
					return 0;
				}
				console.log(data);
				var player = u.$player_so(socket.id);
				if(player.reduceItem(data.id,data.num)){
					var fieldId = world.fieldXYtoId(player.info.location[0],player.info.location[1]);
					if(fieldId){
						var field = world.field(fieldId);
						field.market.push({id:data.id,num:data.num,price:data.price,seller:player.id});
						socket.emit("sellResult",{status:1});
						player.sendUpdate("items");
						player.updatedb();
						field.save();
					}else{
						socket.emit("sellResult",{status:0,msg:"必须在有市场的领地寄售物品"});
					}
				}else{
					socket.emit("sellResult",{status:0,msg:"物品不足"});
				}
			});
			//购买物品
			socket.on("buyItem",function(data){
				if(!_this.status){
					return 0;
				}
				console.log(data);
				var player = u.$player_so(socket.id);
				var field = world.field(data.fieldId);
				for(var i = 0;i < field.market.length;i++){
					if(field.market[i]._id == data.cargoId){
						if(player.cost(field.market[i].price)){//玩家金钱扣除物品价格
							player.addItem(field.market[i].id,field.market[i].num);//玩家获得物品
							player.sendUpdate("items","money");
							player.updatedb();
							socket.emit("buyResult",{status:1});
							
							var seller = u.$player(field.market[i].seller);
							if(seller){//卖家在线,通知交易成功
								seller.earn(field.market[i].price);
								player.sendUpdate("items","money");
								player.updatedb();
								if(seller.id != player.id){
									seller.so.emit("dealDone",{money:field.market[i].price});
								}
								field.market.splice(i,1);//删除寄卖信息
								field.save();
							}else{//卖家离线更新
								db.find("player",{_id:field.market[i].seller},function(seller){
									seller[0].money += field.market[i].price;
									seller[0].save();//卖家获得交易额
									field.market.splice(i,1);//删除寄卖信息
									field.save();
								})
							}
							return 1;
						}else{
							socket.emit("buyResult",{status:0,msg:"金钱不足"});
							return 0;
						}
					}
				}
				socket.emit("buyResult",{status:0,msg:"货品不存在"});
			});
			//获取世界地图
			socket.on("getWorldMap",function(data){
				if(!_this.status){
					return 0;
				}
				socket.emit("worldMap",{map:world.map,size:world.size});
			});
			//查找信息(通过objectID)
			socket.on("getter",function(data){
				if(!_this.status){
					return 0;
				}
				searchById(socket,data);
			});
			//完成任务
			socket.on("completeQuest",function(data){
				if(!_this.status){
					return 0;
				}
				var field = world.field(data.fieldId);
				var player = u.$player_so(socket.id);
				for(var i = 0 ;i < field.quest.length;i++){
					if(field.quest[i]._id == data.id){
						var quest = field.quest[i];
						break;
					}
				}
				if(quest){
					var items = player.info.items;
					for(var i = 0;i<items.length;i++){
						if(items[i].id == quest.requirement.toString()){
							console.log('find item');
							if(items[i].num >= quest.num){
								player.earn(quest.reward);
								player.reduceItem(items[i].id,quest.num);
								socket.emit("questResult",{status:1,index:i});
								field.quest.splice(i,1);
								field.save();
								return 1;
							}else{
								socket.emit("questResult",{status:0,msg:"任务条件不满足"});
								return 0;
							}
						}
					}
				}
			});
			//游戏静态信息获取
			socket.on("gameData",function(data){
				if(!_this.status){
					return 0;
				}
				var gameData = {items:itemInfo,buildings:buildingInfo};
				socket.emit("gameData",{data:gameData});
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
			//停止服务器
			socket.on("shutdown",function(){
				if(!_this.status){
					return 0;
				}
				shutdown();
				logger.log("管理员 "+socket.id+" 关闭了服务器");
			});
			//启动服务器
			socket.on("start",function(){
				start();
				logger.log("管理员 "+socket.id+" 启动了服务器");
			});
			//生成邀请码
			socket.on("createInvite",function(data){
				db.create("invitecode",data.code,function(res){
					if(res == 1){
						socket.emit("inviteSuccess",{code:data.code})
					}
				});
			});
		});
	}//end listener
	function tick(){
		world.time ++;
		world.loopList();
		//logger.log("world time : "+world.worldTime());
		if(!(world.time%3)){
			db.update("world",{},{time:world.time},function(){
				//logger.log("world time update--> "+world.worldTime())
			});
		}
		//5分钟保存一次数据
		if(!(world.time%60)){
			for(var i = 0;i<world.fields.length;i++){
				world.fields[i].save();
			}
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
			case "solider":
				db.find("unit",{_id:{$in:data.id}},function(data){
					socket.emit("soliderInfo",data);
				});
				break;
			case "fieldPlayer":
				console.log(world.field(data.id).name);
				var players = world.field(data.id).playerList;
				socket.emit("fieldPlayer",{list:players});
				break;
		}
	}
	//终止游戏服务器
	function shutdown(){
		if(_this.status == 1){
			_this.status = 0;
			clearInterval(_this.worldTimer);
			for(var i = 0;i<world.fields.length;i++){
				world.fields[i].save();
			}
			logger.log("update fields info");
		}
	}
	function start(){
		if(_this.status == 0){
			_this.status = 1;
			_this.worldTimer = setInterval(tick,5000);
		}
	}
}
module.exports = Game;