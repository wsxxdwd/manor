var fs = require("fs");
var db = require("../server/db");
var xingArr = [];
var mingArr = [];
fs.readFile("./nameBase.txt",'utf8',function(err,data){
	if(!err){
		arr = data.split('"\r');
		/* temp = arr[52640].split("");
		console.log(temp); */
		for(var v in arr){
			switch(arr[v].length){
				case 2:
				case 3:
					var xing = arr[v][0];
					/* if(inArray(xingArr,xing)){
						xingArr.push(xing);
					} */
					var ming = arr[v].slice(1);
					/* if(inArray(mingArr,ming)){
						xingArr.push(ming);
					} */
					
					db.create("unitName",xing,ming,v,function(res){console.log(res)});
					break;
				default:
					var xing = arr[v].slice(0,1);
					/* if(inArray(xingArr,xing)){
						xingArr.push(xing);
					} */
					var ming = arr[v].slice(2);
					/* if(inArray(mingArr,ming)){
						mingArr.push(ming);
					} */
					
					db.create("unitName",xing,ming,v,function(res){console.log(res)});
			}
		}
		//console.log(xingArr.length,mingArr.lengt)
	}else{
		console.log(err);
	}
});
function inArray(arr,val){
	for(var v in arr){
		if(arr[v] === val)
			return 1;
	}
	return -1;
}