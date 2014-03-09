function Game(){
	var _this = this;
	this.uid = uid;//在jade中定义
	this.player;
	this.field;
	this.manor;
	this.worldMap;
	var mail = new Chat();
	this.init = function(){
		if(window.localStorage){
			if(localStorage.gameData){
				var data_md5 = $.md5(localStorage.gameData);
				socket.emit("gameData",{md5:data_md5});
			}else{
				socket.emit("gameData",{md5:"1"});
			}
		}else{
			socket.emit("gameData",{md5:"1"});
		}
		socket.emit("join",{_id:uid});
		mail.init();
	}
	//侦听器
	this.gameListener = function(){
		//连接成功
		socket.on("connect",function(data){
			console.log("connect success!");
		});
		//连接丢失
		socket.on("disconnect",function(data){
			console.log("disconnect!");
			showMsg("哦普斯,得给木一丝库热啊西的!","<p>请检查网络连接或者刷新游戏</p>");
		});
		//服务器欢迎信息
		socket.on("welcome",function(data){
			_this.player = data.info;
			if(!_this.player.name){
				$("#username span").html(_this.player.username);
				$("#money span").html(_this.player.money);
				$("#alignment span").html(_this.player.alignment);
				$("#team span").html(_this.player.team.length+"/"+_this.player.leadership);
				//showMsg("获取角色信息成功","<p>欢迎来到您的庄园</p>");
			}else{
				var option = {
					name:_this.player.username
				}
				showMsg("欢迎新的冒险者加入到游戏",render("newplayer",option));
			}
		});
		socket.on("update",function(list){
			updateInfo(list);
		});
		//世界地图
		socket.on("worldMap",function(data){
			_this.worldMap = data.map;
		});
		//获取游戏数据
		socket.on("gameData",function(data){
			if(data.update){
				if(window.localStorage){
					localStorage.gameData = JSON.stringify(data.data);
				}
				_this.gameData = data.data;
			}else{
				_this.gameData = localStorage.gameData;
			}
		});
		//任务反馈
		socket.on("questResult",function(data){
			if(data.result){
				showMsg("任务完成","您完成了告示牌上张贴的任务,作为回报,您得到了"+data.money+"枚金龙币");
			}else{
				showMsg("未能顺利完成任务","因为某些原因,你未能完成任务")
			}
		});
		//世界时间
		socket.on("worldTime",function(data){
			$("#time span").html(data.time);
			//更新建筑计时器
			if($($(".buildingList .timer")[0]).html()){
				for(var i = 0;i<_this.field.buildings.length;i++){
					_this.field.buildings[i].timer ++;
					$($(".buildingList .timer")[i]).html(_this.field.buildings[i].timer);
				}
			}
		});
		//获取指定领地信息
		socket.on("manorInfo",function(data){_this.getManorInfoCallback(data)});
		//获取指定玩家信息
		socket.on("playerInfo",function(data){_this.getPlayerInfoCallback(data)});
		//获取指定士兵信息
		socket.on("soliderInfo",function(data){_this.getSoliderInfoCallback(data)});
		//获取指定地区信息
		socket.on("fieldInfo",function(data){_this.getFieldInfoCallback(data)});
	}
	this.getManorInfo = function(id,callback){
		_this.getManorInfoCallback = callback;
		socket.emit("getter",{type:"manor",id:id});
	}
	this.getPlayerInfo = function(id,callback){
		_this.getPlayerInfoCallback = callback;
		socket.emit("getter",{type:"player",id:id});
	}
	this.getSoliderInfo = function(id,callback){
		_this.getSoliderInfoCallback = callback;
		socket.emit("getter",{type:"solider",id:id});
	}
	this.getFieldInfo = function(id,callback){
		_this.getFieldInfoCallback = callback;
		socket.emit("getter",{type:"field",id:id});
	}
	this.broadcast = function(msg){
		mail.broadcast(msg);
	}
	this.sendMail = function(id,msg){
		mail.send_to_player(id,msg);
	}
	this.getRecentMail = function(callback){
		mail.getHistory(this.id,callback);
	}
	this.logout = function(){
		$.ajax({
			url:'./logout',
			type:'post',
			success:function(res){
				var json = JSON.parse(res);
				if(json.status == 1){
					alert("退出成功!")
					window.location.href = '/';
				}else{
					alert(json.msg);
				}
			}
		});
	}
}