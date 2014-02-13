var db = require("../server/db");
exports.data = function(req, res){
	db.find("player","",function(data){
		if(data){
			console.log('{"status":1,"list":['+data+']}');
			res.send('{"status":1,"list":'+JSON.stringify(data)+'}');
		}else{
			res.send('{"status":-1,"msg":"error"}');
		}
	});
};
exports.edit = function(req, res){
	var json = JSON.parse(req.body.data);
	var type = json.type;
	var _id = json._id;
	var data = json.data;
	console.log(type,_id,data)
	switch(type){
		case "player":
			updataPlyaer(_id,data);
			break;
		default:
			res.send('{"status":2,"msg":"invalid type"}');
	}
	function updataPlyaer(uid,data){
	for(var param in data){
		db.update("player",{_id:uid},data,function(data){
			if(data == 1){
				res.send('{"status":1,"msg":"ok"}');
			}else{
				res.send('{"status":-1,"msg":"updata error"}');
				return;
			}
		});
	}
}
};

