exports.$player = function(id){
	for(var i = 0;i<playerList.length;i++){
		if(playerList[i].id == id){
			return playerList[i];
		}
	}
	return 0;
}