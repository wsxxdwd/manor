var thisURL = '127.0.0.1:3000';
var socket = io.connect(thisURL);

window.onload = function(){
	socket.emit("adminLogin",{});
	socket.on("adminWelcome",function(data){
		$("#adminName").html("管理员 : "+data.name);
	});
	socket.on("serverLogger",function(data){
		$("#monitor").prepend('<P>'+data.time+"  "+data.msg+'</p>');
	});
	socket.on("inviteSuccess",function(data){
		$("#code").val(data.code);
	});
	$("#shutdown").click(function(){
		socket.emit("shutdown",{});
	});
	$("#start").click(function(){
		socket.emit("start",{});
	});
	$("#invite").click(function(){
		$("#code").val("");
		var data = new Date();
		socket.emit("createInvite",{code:$.md5(data.toString())});
	});
}