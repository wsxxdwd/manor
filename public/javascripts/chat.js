function Chat(){
	this.init = function(){
		socket.on("worldMsg",function(data){
			var msg = data.msg;
			game.getPlayerInfoCallback = function(player){
				var from = player[0].username
				showMsg('来自世界的邮件','<p><span style="color:red;">'+from+'</span> : '+data.msg+'</p><p>发送时间:'+data.time+'</p>');
			}
			game.getPlayerInfo([data.from]);
		});
		socket.on("personalMsg",function(data){
			var msg = data.msg;
			game.getPlayerInfoCallback = function(player){
				var from = player[0].username
				showMsg('来自'+from+'的私人邮件','<p><span style="color:red;">'+from+'</span> : '+data.msg+'</p><p>发送时间:'+data.time+'</p>');
			}
			game.getPlayerInfo([data.from]);
		});
		socket.on("mailList",this.getHistoryCallback);
	}
	this.send_to_player = function(id,msg){
		socket.emit("say_to_player",{msg:msg,id:id});
	}
	this.broadcast = function(data){
		socket.emit("say_to_world",{msg:data});
	}
	this.getHistory = function(id,callback){
		socket.emit("getRecentMail",{_id:id});
	}
}