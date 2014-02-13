var db = require("../server/db");
function Admin(socket){
	this.so = socket;
	this.quit = function(){
		for(v in adminList){
			if(adminList[v].so.id == this.so.id){
				adminList.splice(v,1);
			}
		}
	}
	
}
module.exports = Admin;