var db = require("../server/db");
var Logger = require("../server/logger");
adminList = [];
logger = new Logger();
//=================================调试===================
db.update("item",{},{value:1},function(data){logger.log(data);})

/*db.update("item",{_id:"52ef8fd60163106814ff823d"},{effect:[{type:"food",val:2}]},function(err){console.log(err)});
db.update("item",{_id:"52ef9017b1366a24101cca65"},{effect:[{type:"food",val:3}]},function(err){console.log(err)});
db.update("item",{_id:"52f395588d619f88084491e4"},{effect:[]},function(err){console.log(err)});
db.find("building",{},function(data){logger.log(data);})
db.update("building",{_id:"52f4792a297c5714151d404e"},{material:{id:"52f395588d619f88084491e4",need:20},ability:{time:60,id:"52ef8fd60163106814ff823d",num:10},func:null,description:"将小麦做成小麦的面包房,每小时消耗20个单位小麦生产10个单位面包"},function(data){logger.log(data);})
db.update("building",{_id:"52f478cb214f573010da51fc"},{ability:{time:1440,id:"52ef8fd60163106814ff823d",num:120},func:null,description:"种植小麦的农场,每天生产120单位的小麦"},function(data){logger.log(data);}) */
//db.find("field",{},{buildings:[{id:"52f4792a297c5714151d404e",timer:0,status:"wait"},{id:"52f478cb214f573010da51fc",timer:0,status:"wait"}]},function(data){console.log(data);})
/* 
/* var worldMap = [];
for(var i=0;i<20;i++){
	worldMap[i] = [];
	worldMap[i][19] = [];
}
worldMap[0][0] = {id:"52fbac0bb3cef6f8010d9e56",name:"德赫瑞姆城"};
worldMap[0][1] = {id:"52fbab954a436e901024c986",name:"依林贝尔"};
worldMap[1][0] = {id:"52fba9349abb4a8014072c9b",name:"哈林"};
console.log(worldMap)
db.update("world",{},{map:worldMap},function(player){
	console.log(player);
});



db.update("player",{},{location:[0,0]},function(data){
	console.log(data)
});
 */
/* db.update("player",{username:"wang"},{friends:["52ecae74de76df040b09cccc","52e3e7e621cd27b412872063"]},function(data){console.log(data)})
db.update("player",{username:"di"},{friends:["52ecae74de76df040b09cccc","52e3ed5308a726c41479a060"]},function(data){console.log(data)}) 
db.update("building",{_id:"52f4792a297c5714151d404e"},{material:{id:"52f395588d619f88084491e4",need:20}},function(data){logger.log(data);})
/* 
	
db.create("manor","德赫瑞姆","52ecae74de76df040b09cccc",["52fbac0bb3cef6f8010d9e56","52fbab954a436e901024c986","52fba9349abb4a8014072c9b"],2367,a,function(data){console.log(data)})
create("field","德赫瑞姆城","52ecae74de76df040b09cccc",1,[0,0],[{id:"52f4792a297c5714151d404e",timer:0},{id:"52f478cb214f573010da51fc",timer:0}],122,[],function(data){console.log(data)})
db.create("field","依林贝尔","52e3e7e621cd27b412872063",1,[1,0],[{id:"52f4792a297c5714151d404e",timer:0},{id:"52f478cb214f573010da51fc",timer:0}],33,[],function(data){console.log(data)}) */
/*


db.find("field",{},function(data){logger.log(data);})
/*[{name:"德赫瑞姆城",holder:"52ecae74de76df040b09cccc",type:3,location:[0,0]},{name:"依林贝尔",holder:"52e3e7e621cd27b412872063",type:1,location:[0,1]},{name:"哈林",holder:"52e3ed5308a726c41479a060",type:1,location:[1,0]}]
db.update("building",{_id:"52f4792a297c5714151d404e"},{ability:{time:50,num:10},material:{id:"52f395588d619f88084491e4",num:20}},function(items){console.log(items);});
db.update("building",{_id:"52f478cb214f573010da51fc"},{ability:{time:20,num:1}},function(items){console.log(items);});
var a = {
	name:"饥荒",
	description:"庄园北部的小镇发生了饥荒,为了缓解状况,现在有人大量在收购面包",
	requirement:"52ef8fd60163106814ff823d",
	num:20,
	reward:50};
db.update("manor",{},{quest:a},function(data){console.log(data);})


db.find("building",{},function(player){
	console.log(player);
})
var test_items = [ { id: "52ef8fd60163106814ff823d",
       num: 9 },
     { id: "52ef9017b1366a24101cca65",
       num: 1},
     { id: "52f395588d619f88084491e4",
       num: 13 } ];


db.update("player",{username:"wsxxdwd"},{friends:["52e3e7e621cd27b412872063","52e3ed5308a726c41479a060"]},function(data){
	console.log(data)
});
db.find("player",{username:"wsxxdwd"},function(player){
	var a = player[0].items;
	for(var v = 0;v<a.length;v++){
		console.log(a[v].id)
		if(typeof(a[v].id) == "undefined"){
			console.log("find");
			a[v].id = "52f395588d619f88084491e4";
		}
	}
	db.update("player",{username:"wsxxdwd"},{items:a},function(data){console.log(data)})
})

db.create("building","面包房",500,1440,"只要原料充足,每5分钟为您生产10个面包","bread",{time:5,num:10},function(data){
	console.log(data);})
db.del("building",{},function(){})
db.create("item","小麦","3","小麦面,补虚实人肤体,厚肠胃,强气力. ----《本草纲目》","food",[{type:"material",val:2}],function(res){
	console.log(res);
});


})
for(var i = 0;i<50;i++){
condition = [parseInt(Math.random()*52638),parseInt(Math.random()*52638)];
db.find("unitName",{rd:{$in:condition}},function(data){
	name = data[0].xing;
	name += data[1].ming
	console.log(name)
})
}
db.find("item",{},function(data){logger.log(data)})

db.find("player",{_id:{$in:["52ecae74de76df040b09cccc"]}},function(data){
	console.log(data);
})

db.find("unitName",{ming:"迪"},function(data){
	console.log(data);
});
db.create("manor","德赫瑞姆","52ecae74de76df040b09cccc",[0,0],[],57,[],[0,0,0,0],537,function(res){})



db.find("player","",function(player){
	for(var v in player){
		player[v].money = 100;
		player[v].save();
	}
})

db.create("item","咸鱼","5","人如果没有梦想,跟咸鱼有什么分别----周星星","food",[{type:"hunger",val:3}],function(res){});	



*/