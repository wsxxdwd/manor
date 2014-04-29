function showMsg(type,header,option){
	var html = '';
	switch(type){
		case 'tip':
			
			break;
	}
}
function e2c(type,en){
	var dictionary = {
		func:{
			wheat : "种植小麦",
			bread : "烘烤面包"
		}
	}
	return dictionary[type][en];
}
function $building(id){
	for(var i = 0; i<game.gameData.buildings.length;i++){
		if(game.gameData.buildings[i]._id == id){
			return game.gameData.buildings[i];
		}
	}
}
function $item(id){
	for(var i = 0; i<game.gameData.items.length;i++){
		if(game.gameData.items[i]._id == id){
			return game.gameData.items[i];
		}
	}
}
function imgRender(target){
	var divs = $(target).find("div");
	for(var i = 0;i < divs.length;i++){
		if($(divs[i]).data("src")){
			$(divs[i]).prepend($(game.images[$(divs[i]).data("src")]).clone());
		}
	}
}