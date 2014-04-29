exports.$player = function(id){
	for(var i = 0;i<playerList.length;i++){
		if(playerList[i].id == id){
			return playerList[i];
		}
	}
	return 0;
}
exports.$player_so = function(so){
	for(var i = 0;i<playerList.length;i++){
		if(playerList[i].so.id == so){
			return playerList[i];
		}
	}
	return 0;
}
//通过id找到建筑信息
exports.$building = function(id){
	for(var i = 0;i<buildingInfo.length;i++){
		if(buildingInfo[i].id == id){
			return buildingInfo[i];
		}
	}
	return 0;
}
//通过id找到物品信息
exports.$item = function(id){
	for(var i = 0;i<itemInfo.length;i++){
		if(itemInfo[i].id == id){
			return itemInfo[i];
		}
	}
	return 0;
}
exports.random = function(){
	if(arguments.length == 0){
		return Math.random();
	}else if(arguments.length == 1){
		return Math.floor(Math.random()*arguments[0]);
	}else{
		return Math.floor(Math.random()*(arguments[1] - arguments[0]) + arguments[0]);
	}
}