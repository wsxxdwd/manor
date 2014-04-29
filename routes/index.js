var db = require("../server/db");
var gamename = '庄园:乱世';
/*
 * GET home page.
 */
exports.index = function(req, res){
	res.render('index', { title: gamename });
};
exports.game = function(req, res){
	db.find("player",{_id:req.session.uid},function(data){
		res.render('main', { title: gamename,name:data[0].username,uid:req.session.uid});
	});
	
};
exports.adminLogin = function(req, res){
	console.log('zx!!!!!!!!!!!!!!!!!');
	res.render('adminLogin', { title: gamename});
};
exports.admin = function(req, res){
	db.find("admin",{_id:req.session.aid},function(data){
		res.render('admin', { title: gamename});
	});
};