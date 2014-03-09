var thisURL = '127.0.0.1:3000';
var socket = io.connect(thisURL);

var pannel = 'player';
window.onload = function(){
	socket.emit("adminLogin",{});
	socket.on("adminWelcome",function(data){
		$("#adminName").html("管理员 : "+data.name);
	});
	socket.on("serverLogger",function(data){
		$("#monitor").prepend('<P>'+data.time+"  "+data.msg+'</p>');
	});
	$("#shutdown").click(function(){
		socket.emit("shutdown",{});
	});
}