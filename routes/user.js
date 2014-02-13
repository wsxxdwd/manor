var db = require("../server/db");

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
				res.send('{"status":1,"uid":"'+uid+'"}');
				req.session.uid = uid;
				console.log("user "+uid+" name:"+name+" login");
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
	var username = json.username;
	var password = json.password;
	db.find("player",{"username":username},function(data){
		if(data == 0){
			db.create("player",username,password,function(status){
				switch(status){
					case 1:
						res.send('{"status":1,"msg":"ok"}');
						break;
					case 404:
						res.send('{"status":-1,"msg":"404"}');
					default:
						res.send('{"status":-1,"msg":"unkonwn error : '+status+'"}');
				}
			});
		}else if(data){
			res.send('{"status":-1,"msg":"用户名已被注册"}')
		}else{
			res.send('{"status":-1,"msg":"unkonwn error : '+data+'"}');
		}
	});
};
exports.logout = function(req, res){
	req.session.uid = null;
	res.send('{"status":1,"msg":"成功注销"}')
};