var fs = require("fs");
function Logger(){
	this.logURL="./log/";
	this.today;
	this.nowTime;
	this.log = function(data){
		var d = new Date();
		this.today = d.getFullYear()+"-"+d.getMonth()+"-"+d.getDate();
		this.nowTime = d.getHours()+":"+d.getMinutes()+":"+d.getSeconds(); 
		var FileName = this.logURL+this.today+".log";
		console.log(data);
		for(v in adminList){
			adminList[v].so.emit("serverLogger",{msg:data,time:this.nowTime});
		}
		writeLog(data,FileName,this.nowTime);
	}
	function writeLog(msg,FileName,nowTime){
		fs.appendFile(FileName,nowTime+"  "+msg+"\n",function(err){
			if(err) throw err;
		})
	}
}
module.exports = Logger;