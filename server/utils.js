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
//ͨ��id�ҵ�������Ϣ
exports.$building = function(id){
	for(var i = 0;i<buildingInfo.length;i++){
		if(buildingInfo[i].id == id){
			return buildingInfo[i];
		}
	}
	return 0;
}
//ͨ��id�ҵ���Ʒ��Ϣ
exports.$item = function(id){
	for(var i = 0;i<itemInfo.length;i++){
		if(itemInfo[i].id == id){
			return itemInfo[i];
		}
	}
	return 0;
}