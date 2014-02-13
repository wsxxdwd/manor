var db = require("./db");
var u = require("./utils");
function World(){
	this.name = "庄园:乱世";
	this.time = 0;
	var _this = this;
	//世界时间
	this.worldTime = function(time){
		if(typeof(time) == "undefined"){
			return tran(this.time);
		}else{
			return tran(time);
		}
		function tran(t){
			var min = t%60;
			var hour = ((t - min)/60)%24;
			var day = ((t - min - hour*60)/(24*60))%365;
			var year = (t - min - hour*60 - day*24*60)/(365*24*60);
			return format(year)+"年"+format(day)+"日"+format(hour)+"时"+format(min)+"分";
			function format(s){
				if(s<10)
					return "0"+s;
				else
					return s;
					
			}
		}
	}
	this.init = function(){
		this.getWorldTime();
		db.find("field",{},function(fields){
			_this.fields = fields;
			for(var v = 0; v < fields.length;v++){
				var buildingList = [];
				for(var i = 0;i<fields[v].buildings.length;i++){
					buildingList.push(_this.fields[v].buildings[i].id);
				}
				getbuildingInfo(v,buildingList);
			}
		});
		console.log("world init")
	}
	this.field = function(id){
		for(var i = 0;i<this.fields.length;i++){
			if(this.fields[i]._id = id){
				return this.fields[i];
			}
		}
	}
	function getbuildingInfo(index,list){
		db.find("building",{_id:{$in:list}},function(buildings){
				for(var i = 0; i < buildings.length;i++){
				for(var j = 0;j < _this.fields[index].buildings.length;j++){
					if(_this.fields[index].buildings[j].id == buildings[i]._id){
						_this.fields[index].buildings[j].info = buildings[i];
					}
				}
			}
		});
	}
	this.getWorldTime = function(){
		db.find("world",{},function(data){
			var world = data[0];
			_this.time = world.time;
		});
	}
	//世界循环
	this.loopList = function(){
		io.sockets.emit("worldTime",{time:this.worldTime()});
		buildingEvent();
	}
	function buildingEvent(){
		for(var i = 0;i<_this.fields.length;i++){
			if(_this.fields[i].holder){
				var change = 0;
				(function(i){db.find("player",{_id:_this.fields[i].holder},function(holder){
					_this.tempItems = holder[0].items;
					for(var j = 0;j<_this.fields[i].buildings.length;j++){
						var building = _this.fields[i].buildings[j];
						//执行生产命令
						if(produce(holder[0]._id,i,j)){
							change = 1;
						}
					}
					if(change){
						db.update("player",{_id:holder[0]._id},{items:_this.tempItems},function(data){console.log("已离线更新生成列表--"+holder[0].username)});
					}
					db.update("field",{_id:_this.fields[i]._id},{buildings:_this.fields[i].buildings},function(){});
				});})(i);
			}
		}
		function produce(player,i,j){
			var building = _this.fields[i].buildings[j];
			var func = building.info.func;
			var material = building.info.material;
			var produceNum = building.info.ability.num;
			var reduce = material.id?material.id.toString():"";
			var needNum = material.need;
			var add = "";
			switch(func){
				case "bread":
					add = "52ef8fd60163106814ff823d";
					break;
				case "wheat":
					add = "52f395588d619f88084491e4";
					break;
			}
			if(u.$player(player)){//玩家在线,直接改变并通知
				if(reduce){
					if(building.timer == 0){
						if(u.$player(player).reduceItem(reduce,needNum)){
							building.timer ++;
						}else{
							//console.log("原料不足,无法开始生产")
						}
					}else if(building.timer >= building.info.ability.time){
						u.$player(player).addItem(add,produceNum);
						logger.log(u.$player(player).info.username+"生成了"+add);
						building.timer = 0;
					}else{
						building.timer ++;
					}
					return 0;
				}else{
					if(building.timer >= building.info.ability.time){
						u.$player(player).addItem(add,produceNum);
						building.timer = 0;
						logger.log(u.$player(player).info.username+"生成了"+add);
						return 0;
					}
					building.timer ++;
					return 0;
				}
			}else{
				if(reduce){
					if(building.timer == 0){
						for(var i =0; i<_this.tempItems.length;i++){
							if(_this.tempItems[i].id == reduce){
								//console.log(_this.tempItems[i].num,needNum);
								if(_this.tempItems[i].num >= needNum){
									_this.tempItems[i].num -= needNum;
									//console.log("原料充足,开始生产")
									building.timer ++;
									return 1;
								}else{
									//console.log("原料不足");
								}
							}
						}
						//console.log("没有原料");
					}else if(building.timer >= building.info.ability.time){
						for(var j =0; j<_this.tempItems.length;j++){
							if(_this.tempItems[j].id == add){
								_this.tempItems[j].num += produceNum;
								building.timer = 0;
								return 1;//添加完成
							}
						}
						_this.tempItems.push({id:add,num:produceNum});
						building.timer = 0;
						return 1;//新增完成
					}else{
						building.timer ++;
					}
					return 0;
				}else{
					//console.log("不需要原料,直接开始生产");
					if(building.timer >= building.info.ability.time){
						for(var j =0; j<_this.tempItems.length;j++){
							if(_this.tempItems[j].id == add){
								//console.log(_this.tempItems[j].num);
								_this.tempItems[j].num += produceNum;
								//console.log(_this.tempItems[j].num);
								building.timer = 0;
								return 1;//添加完成
							}
						}
						_this.tempItems.push({id:add,num:produceNum})
						building.timer = 0;
						return 1;//新增完成
					}
					building.timer ++;
					return 0;
				}//end add without meterial
			}
		}
	}
}

module.exports = World;