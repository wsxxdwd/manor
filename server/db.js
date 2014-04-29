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
	,manor		: {
					 name		: String
					,lord		: ObjectId
					,lordName	: String
					,terrain	: Array
				}
	,base		: ObjectId
	,friends	: Array
	,money		: Number
	,alignment	: String
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
					fromId:String,
					to:String,
					title:String,
					content:String
				}]
	,isnew		:Number
});
var AdminSchema = new Schema({
	 username	: String
	,password	: String
});
//物品
var ItemSchema= new Schema({
	 name		: String
	,price		: Number
	,description: String
	,type		: String
	,effect		: [{type: String,
					val : Number
					}]
});
//领地城镇
var FieldSchema= new Schema({
	name		:String
	,holder		:ObjectId
	,holderName :String
	,type		:Number
	,location	:Array
	,buildings	: [{
		id		:String
		,status	:String
		,timer	:Number
	}]
	,tavern		:{timer:Number,
				  lansquenet:[{
					id		:String,
					name	:String,
					price	:Number
				}]}
	,market		:[{
		id		:String,
		num		:Number,
		price	:Number,
		seller	:String
	}]
	,garrison	: Number
	,solider	: Array
	,quest		:[{
					name:String,
					description:String,
					requirement:ObjectId,
					num:Number,
					reward:Number
				}]
	,playerList :Array
});
//人员单位
var UnitSchema = new Schema({
	 name		: String
	,master		: String
	,ATT		: Number
	,DEF		: Number
	,CRI		: Number
	,ACR		: Number
	,special	: String
	,type		: String
	,items		: Array
});
//领地建筑
var BuildingSchema = new Schema({
	 name			: String
	,constructTime	: Number
	,constructMaterial	: Array
	,description	: String
	
	,material		: {
						id:ObjectId,
						need:Number
						}
	,ability		: {
						time:Number,
						id:String,
						num :Number
						}
});
var WorldSchema = new Schema({
	  time			: Number
	 ,size			: Number
	 ,map			: Array
});
var InvitecodeSchema = new Schema({
	  code			: String
	 ,valid			: Number
});
var UnitNameSchema = {
	 xing : String
	,ming : String
	,rd	  : Number
}

var Player = mongoose.model('Player',PlayerSchema);
var Admin = mongoose.model('Admin',AdminSchema);
var Item = mongoose.model('Item',ItemSchema);
var Building = mongoose.model('Building',BuildingSchema);
var Unit = mongoose.model('Unit',UnitSchema);
var World = mongoose.model('World',WorldSchema);
var UnitName = mongoose.model('unitName',UnitNameSchema);
var Invitecode = mongoose.model('invitecode',InvitecodeSchema);
var Field = mongoose.model('Field',FieldSchema);
var modal = {
	player: Player,
	admin: Admin,
	item:Item,
	building:Building,
	unit:Unit,
	world:World,
	unitName:UnitName,
	field:Field,
	invitecode:Invitecode
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
				name:'无名的冒险家',
				manor:null,
				base:null,
				money:500,
				alignment:'',
				friends:[],
				items:[{ id: "52ef8fd60163106814ff823d",
						   num: 20 },
						 { id: "52ef9017b1366a24101cca65",
						   num: 20},
						 { id: "52f395588d619f88084491e4",
						   num: 20 } ],
				location:[0,0],
				team:[],
				leadership:10,
				mailHistory:[],
				isnew:1
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
		case 'admin'://modal,username,password
			var newAdmin = new Admin({
				username:param[0],
				password:param[1]
			});
			newAdmin.save(function (err,docs) {
				if (err){
					console.log(err);
					callback(-1);
				}
				console.log(docs);
				callback(1);
			});
			break;
		case 'item'://modal,物品名称,建议价格,描述,种类,效果
			var newItem = new Item({
				name:param[0],
				price:param[1],
				description:param[2],
				type:param[3],
				effect:param[4]
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
		case 'world'://modal,时间,尺寸
			var newWorld = new World({
				time:param[0],
				size:param[1]
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
		case 'invitecode'://modal,code
			var newCode = new Invitecode({
				code:param[0],
				valid:1
			});
			newCode.save(function (err,docs) {
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
		case 'unit'://modal,name,master,ATT,DEF,CRI,ACR,special,type,items
			var newUnit = new Unit({
				name : param[0],
				master : param[1],
				ATT : param[2],
				DEF : param[3],
				CRI : param[4],
				ACR : param[5],
				special : param[6],
				type : param[7],
				items	 : param[8]	
			});
			newUnit.save(function (err,docs) {
				if (err){
					console.log(err);
					callback(-1);
				}
				callback(docs);
			});
			break;
		case 'building'://modal,名字,建造时间,建造材料,描述,原料,能力
			var newBuilding = new Building({
				name 			: param[0],
				constructTime 	: param[1],
				constructMaterial	: param[2],
				description	 	: param[3],	
				material		: param[4],
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
		case 'field'://modal,名字,持有者,类型,坐标,建筑,卫戍,驻军,任务
			var newField = new Field({
				name : param[0],
				holder : param[1],
				type : param[2],
				location:param[3],
				buildings:param[4],
				garrison:param[5],
				solider:param[6],
				quest:param[7]
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
		var option = arguments[2];
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
			callback(err);
		}
	});
}
exports.unset = function(){
	var obj = arguments[0];
	var condition = arguments[1];//目标找寻条件
	var change = arguments[2];//将修改的参数和值
	var callback = arguments[3];
	modal[obj].update(condition,{$unset:change},{multi:true},function(err,docs){ 
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