//mongo数据库操作
var mongoose = require('mongoose');

var Schema = mongoose.Schema;
	ObjectId = Schema.ObjectId;
mongoose.connect('mongodb://localhost/manor',function(err){
	if(err){
		console.log("Could not connect to mongo");
	}else{
		console.log("manor database connected!")
	}
});
//玩家
var PlayerSchema = new Schema({
	 username	: String
	,password	: String
	,name		: String
	,manor		: ObjectId
	,base		: ObjectId
	,friends	: Array
	,money		: Number
	,alignment	: Number
	,items		: [{
					id:ObjectId,
					num:Number
				}]
	,location	: Array
	,team		: Array
	,leadership : Number
	,mailHistory: [{
					time:String,
					from:String,
					content:String
				}]
});
//物品
var ItemSchema= new Schema({
	 name		: String
	,price		: Number
	,description: String
	,type		: String
	,value		: [{type: String,
					val : Number
					}]
});
//领地
var ManorSchema= new Schema({
	 name		: String
	,owner		: ObjectId
	,terrain	: Array
	,population	: Number
	
});
//领地城镇
var FieldSchema= new Schema({
	name		:String
	,holder		:ObjectId
	,type		:Number
	,location	:Array
	,buildings	: [{
		id		:String
		,timer	:Number
	}]
	,garrison	: Number
	,solider	: Array
	,quest		:{
					name:String,
					description:String,
					requirement:ObjectId,
					num:Number,
					reward:Number
				}
});
//人员单位
var UnitSchema = new Schema({
	 name		: String
	,master		: ObjectId
	,ATT		: Number
	,DEF		: Number
	,CRI		: Number
	,ACR		: Number
	,WGT		: Number
	,special	: String
	,ability	: Number
	,items		: Array
});
//领地建筑
var BuildingSchema = new Schema({
	 name			: String
	,price			: Number
	,constractTime	: Number
	,description	: String
	,func			: String
	,material		: {
						id:ObjectId,
						need:Number
						}
	,ability		: {
						time:Number,
						num :Number
						}
});
var WorldSchema = new Schema({
	 time			: Number
});
var UnitNameSchema = {
	 xing : String
	,ming : String
	,rd	  : Number
}

var Player = mongoose.model('Player',PlayerSchema);
var Item = mongoose.model('Item',ItemSchema);
var Building = mongoose.model('Building',BuildingSchema);
var Unit = mongoose.model('Unit',UnitSchema);
var Manor = mongoose.model('Manor',ManorSchema);
var World = mongoose.model('World',WorldSchema);
var UnitName = mongoose.model('unitName',UnitNameSchema);
var Field = mongoose.model('Field',FieldSchema);
var modal = {
	player: Player,
	item:Item,
	building:Building,
	unit:Unit,
	manor:Manor,
	world:World,
	unitName:UnitName,
	field:Field
}
//数据库接口
exports.create = function(){
	var model = arguments[0];
	var param = [];
	for(var i = 1; i<arguments.length-1;i++){
		param[i-1] = arguments[i];
	}
	var callback = arguments[arguments.length-1];
	//根据model类型创建数据
	switch(model){
		case 'player'://modal,用户名,密码
			var newPlayer = new Player({
				username:param[0],
				password:param[1],
				name:'冒险家',
				manor:null,
				base:null,
				money:20,
				alignment:0,
				items:[],
				friends:[]
			});
			newPlayer.save(function (err,docs) {
				if (err){
					console.log(err);
					callback(-1);
				}
				console.log('user sign in');
				callback(1);
			});
			break;
		case 'item'://modal,物品名称,价格,描述,种类,效果
			var newItem = new Item({
				name:param[0],
				price:param[1],
				description:param[2],
				type:param[3],
				value:param[4]
			});
			newItem.save(function (err,docs) {
				if (err){
					console.log(err);
					callback(-1);
				}
				console.log(docs);
				callback(1);
			});
			break;
		case 'world'://modal,时间
			var newWorld = new World({
				time:param[0],
			});
			newWorld.save(function (err,docs) {
				if (err){
					console.log(err);
					callback(-1);
				}
				console.log(docs);
				callback(1);
			});
			break;
		case 'manor'://modal,地名,领主,地形列表,人口,任务
			var newManor = new Manor({
				name:param[0],
				owner:param[1],
				terrain:param[2],
				population:param[3],
				quest:param[4]
			});
			newManor.save(function (err,docs) {
				if (err){
					console.log(err);
					callback(-1);
				}
				console.log(docs);
				callback(1);
			});
			break;
		case 'unitName'://modal,姓,名,随机键值
			var newUnitName = new UnitName({
				xing : param[0],
				ming : param[1],
				rd	 : param[2]	
			});
			newUnitName.save(function (err,docs) {
				if (err){
					console.log(err);
					callback(-1);
				}
				console.log(docs);
				callback(1);
			});
			break;
		case 'building'://modal,名字,建造时间,描述,功能,能力
			var newBuilding = new Building({
				name 			: param[0],
				price 			: param[1],
				constractTime 	: param[2],
				description	 	: param[3],	
				func			: param[4],
				ability			: param[5]
			});
			newBuilding.save(function (err,docs) {
				if (err){
					console.log(err);
					callback(-1);
				}
				console.log(docs);
				callback(1);
			});
			break;
		case 'field'://modal,名字,持有者,类型,坐标,建筑,卫戍,驻军
			var newField = new Field({
				name : param[0],
				holder : param[1],
				type : param[2],
				location:param[3],
				buildings:param[4],
				garrison:param[5],
				solider:param[6],
			});
			newField.save(function (err,docs) {
				if (err){
					console.log(err);
					callback(-1);
				}
				console.log(docs);
				callback(1);
			});
			break;
		default:
			callback(-1);
	}
}
exports.find = function(){
	var obj = arguments[0];
	var condition = arguments[1];
	if(typeof(arguments[2]) == 'function'){
		var callback = arguments[2];
		var option = {};
	}else{
		var initiator = arguments[2];
		var callback = arguments[3];
	}
	//根据model类型创建数据
	modal[obj].find(condition,option,function(err,docs){  
		if(!err){
			callback(docs);
		}else{
			callback(0);
			console.log(err);
		}
	}); 
}
exports.update = function(){
	var obj = arguments[0];
	var condition = arguments[1];//目标找寻条件
	var change = arguments[2];//将修改的参数和值
	var callback = arguments[3];
	modal[obj].update(condition,{$set:change},{multi:true},function(err,docs){ 
		if(docs){
			callback(docs);
		}else{
			callback(0);
		}
	});
}
exports.del = function(obj,condition,callback){
	modal[obj].remove(condition,function(err,docs){ 
		if(docs){
			callback(docs);
		}else{
			callback(-1);
		}
	});
};