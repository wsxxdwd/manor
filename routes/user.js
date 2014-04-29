var db = require("../server/db");
var u = require("../server/utils");
exports.login = function(req, res){
	var json = JSON.parse(req.body.data);
	var username = json.username;
	var password = json.password;
	db.find("player",{"username":username},function(data){
		if(data == 0){
			res.send('{"status":2,"msg":"用户名不存在"}')
		}else if(data){
			var dbpassword = data[0].password;
			var uid = data[0]._id;
			var name = data[0].username;
			if(password == dbpassword){
				if(!u.$player(data[0]._id)){
					res.send('{"status":1,"uid":"'+uid+'"}');
					req.session.uid = uid;
					console.log("user "+uid+" name:"+name+" login");
				}else{
					res.send('{"status":2,"msg":"您的账号已经在其他设备登录,请先退出登录"}');
				}
			}else{
				res.send('{"status":3,"msg":"密码错误"}');
			}
		}else{
			res.send('{"status":-1,"msg":"unkonwn error : '+data+'"}');
		}
	});
};
exports.register = function(req, res){
	var json = JSON.parse(req.body.data);
	var invitecode = json.invitecode;
	var username = json.username;
	var password = json.password;
	db.find("invitecode",{code:invitecode},function(data){
		if(data.length&&data[0].valid){
			db.find("player",{"username":username},function(data){
				if(data == 0){
					db.create("player",username,password,function(status){
						if(status == 1){
							res.send('{"status":1,"msg":"ok"}');
							db.update("invitecode",{code:invitecode},{valid:0},function(data){
								logger.log("邀请码:"+invitecode+"已被使用")
							});
						}else{
							res.send('{"status":-1,"msg":"404"}');
						}
					});
				}else if(data){
					res.send('{"status":-1,"msg":"用户名已被注册"}')
				}else{
					res.send('{"status":-1,"msg":"unkonwn error : '+data+'"}');
				}
			});
		}else{
			res.send('{"status":-1,"msg":"邀请码无效"}');
		}
	});
};
exports.logout = function(req, res){
	req.session.uid = null;
	res.send('{"status":1,"msg":"成功注销"}')
};