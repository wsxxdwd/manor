window.onload = function(){
	//过滤特殊字符
	var txt = new RegExp("[\\*,\\&,\\\\,\\/,\\?,\\|,\\:,\\<,\\>,\"]"); 
	//切换登录注册界面
	$("#to_register").click(function(){
		$(".pannel").hide();
		$("#register").show();
		$(".pannel").animate({height:'290px'});
		$("#outter").animate({height:'310px'});
	});
	$("#to_login").click(function(){
		$(".pannel").hide();
		$("#login").show();
		$(".pannel").animate({height:'220px'});
		$("#outter").animate({height:'240px'});
	});
	$("#login_btn").click(function(){
		//登录
		var username = $("#username").val().replace(/\s+/g,"");
		var password = $("#password").val().replace(/\s+/g,"");
		if (txt.test(username)||txt.test(password)){
			$('#login .alert').html("输入包含非法字符")//"输入不能包含下列字符之一:\n \\ / : * ? \" < > | & , "
			shake();
			return;
		}
		if(!username||!password){
			$('#login .alert').html("信息不全");
			shake();
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
					$('#login .alert').html("登录成功!")
					window.location.href = './game';
				}else{
					$('#login .alert').html(json.msg);
					shake();
				}
			}
		});
	});
	$("#register_btn").click(function(){
		//注册
		var code = $("#code").val().replace(/\s+/g,"");
		var username = $("#reg_username").val().replace(/\s+/g,"");
		var password = $("#reg_password").val().replace(/\s+/g,"");
		var password_c = $("#reg_password_c").val().replace(/\s+/g,"");
		if (txt.test(username)||txt.test(password)||txt.test(code)){
			$('#register .alert').html("输入包含非法字符");
			shake();
			return;
		}
		if(password.length<6){
			$('#register .alert').html("密码不符合规范","密码是至少6位英文数字字符组合");
			shake();
			return;
		}
		if(!username||!password||!password_c){
			$('#register .alert').html("信息不全");
			shake();
			return;
		}
		if(password_c != password){
			$('#register .alert').html("两次密码输入不同");
			shake();
			return;
		}
		//密码MD5加密
		password = $.md5(password);
		var data = '{"invitecode":"'+code+'","username":"'+username+'","password":"'+password+'"}';
		$.ajax({
			url:'./register',
			type:'post',
			data:"data="+data,
			success:function(res){
				var json = JSON.parse(res);
				if(json.status == 1){
					$('#register .alert').html("注册成功!");
					window.location.href = './game';
				}else{
					$('#register .alert').html(json.msg);
					shake();
				}
			}
		});
	});
	$("#login input").keydown(function(event){ 
		if(event.which == 13){
			$("#login_btn").click();
		}
	});
	$("#register input").keydown(function(event){ 
		if(event.which == 13){
			$("#register_btn").click();
		}
	});
}
function shake(){
	$(".pannel,#outter").animate({left:"49%"},50);
	$(".pannel,#outter").animate({left:"51%"},100);
	$(".pannel,#outter").animate({left:"50%"},50);
}