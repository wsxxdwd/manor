window.onload = function(){
	//切换登录注册界面
	$("#to_register").click(function(){$(".pannel").hide();$("#register").show()})
	$("#to_login").click(function(){$(".pannel").hide();$("#login").show()})
	$("#login_btn").click(function(){
		//登录
		var username = $("#username").val().replace(/\s+/g,"");
		var password = $("#password").val().replace(/\s+/g,"");
		if(!username||!password){
			alert("信息不全");
			return;
		}
		//密码MD5加密
		password = $.md5(password);
		var data = '{"username":"'+username+'","password":"'+password+'"}';
		$.ajax({
			url:'./login',
			type:'post',
			data:"data="+data,
			success:function(res){
				var json = JSON.parse(res);
				if(json.status == 1){
					alert("登录成功!")
					window.location.href = './game';
				}else{
					alert(json.msg);
				}
			}
		});
	});
	$("#register_btn").click(function(){
		//注册
		var username = $("#reg_username").val().replace(/\s+/g,"");
		var password = $("#reg_password").val().replace(/\s+/g,"");
		var password_c = $("#reg_password_c").val().replace(/\s+/g,"");
		if(!username||!password||!password_c){
			alert("信息不全");
			return;
		}
		if(password_c != password){
			alert("两次密码输入不同");
			return;
		}
		//密码MD5加密
		password = $.md5(password);
		var data = '{"username":"'+username+'","password":"'+password+'"}';
		$.ajax({
			url:'./register',
			type:'post',
			data:"data="+data,
			success:function(res){
				var json = JSON.parse(res);
				if(json.status == 1){
					alert("注册成功!");
					window.location.href = './game';
				}else{
					alert(json.msg);
				}
			}
		});
	});
}