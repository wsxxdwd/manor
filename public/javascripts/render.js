function render(template,option){
	var html = "";
	switch(template){
		//封地总览
		case "field_overview":
			switch(option.field.type){
				case 0:
					var type = "荒野";
					break;
				case 1:
					var type = "村庄";
					break;
				case 2:
					var type = "城堡";
					break;
				case 3:
					var type = "城镇";
					break;
			}
			html = "<p>"+option.field.name+"资源总览</p>";
			html += "<p>"+option.field.name+"是"+option.field.holdername+"的封地</p>";
			html += "领地规模为:"+type+"</p>";
			html += "<p>地图坐标:"+option.field.location+"</p>";
			break;
		//封地建筑列表
		case "field_building":
			html = '<p>'+option.name+'的拥有如下建筑</P>';
			for(var v in option.buildings){
				html += '<div class="buildingList"><img src=""><div class="timer">'+option.buildings[v].timer+'</div></img><div class="info"><p>'+$building(option.buildings[v].id).name+'</p><p>'+e2c("func",$building(option.buildings[v].id).func)+'</p></div></div>';
			}
			break;
		//封地城防
		case "field_garrison":
			html = "<p>"+option.name+"的城防部队可以在领地危机时刻招募到"+option.garrison+"名自卫武装民兵</p>";
			break;
		//玩家驻军
		case "field_solider":
			html = "<p>"+option.owner+"在"+option.name+"的驻军</P>";
			break;
		//城镇任务
		case "field_quest":
			html = "<p>"+option.name+"的人们最近有如下需求:</p>";
			html += "<p>"+option.quest.description+"</p>";
			html += '<div id="reward">报酬 : '+option.quest.reward+"金龙币</div>";
			html += '<div class="btn disabled" id="quest_done" data-status="disabled">完成任务</div>';
			break;
		//领地总览
		case "manor_overview":
			html = "<p>"+option.manor.name+"资源总览</p>";
			for(var v in option.manor.terrain){
				var field = option.manor.terrain[v];
				html += '<div class="fieldList" data="'+field.id+'">'+field.name+'</div>';
			}
			return html;
			break;
		//世界地图
		case "worldMap":
			html = '<div id="map">';
			for(var i = 0;i < option.map.length;i++){
				html += '<div class="mapRow">';
				for(var j = 0;j < option.map[i].length;j++){
					var field = option.map[i][j];
					var type = "neutrality";
					if(field&&typeof(field.id) != "undefined"){
						
						if(field.id.toString() == game.player.base){
							type = "mine";
						}else if(game.player.manor){
							for(var k = 0;k < option.myManor.terrain.length;k++){
								console.log(field.id.toString(),option.myManor.terrain[k].id);
								if(field.id.toString() == option.myManor.terrain[k].id){
									type = "friendly";
								}
							}
						}
						if(i == option.location[0]&&j == option.location[1]){
							type += " current_place";
						}
						html += '<div class="mapUnit '+type+'" data="'+field.id+'">'+field.name+'</div>';
					}else{
						html += '<div class="mapUnit uncapture"></div>';
					}
				}
				html += '</div>';
			}
			html += '</div>';
			return html;
			break;
		case "item":
			var box = $("#item_list").children();
			for(var v in option.items){
				$(box[v]).html($item(option.items[v].id).name+'<div class="item_num">'+option.items[v].num+'</div>');
				//弹出提示
				$(box[v]).popover({trigger:"hover",title:$item(option.items[v].id).name,content:$item(option.items[v].id).description});
			}
			break;
		
		//好友列表
		case "friendList":
			for(var i = 0; i<option.friends.length;i++){
				var name = option.friends[i].username
				var id = option.friends[i]._id
				html += '<div data-id="'+id+'" class="friendLink">'+name+'</div>';
			}
			break;
		//新手引导
		case "newplayer":
			html = '<p>勇敢的冒险者你好,欢迎来到这个新的大陆,您的用户名<span>'+option.name+'</span>将作为登录用户名,现在你需要决定游戏中角色的名字.</p>'
			html += '<input type="text" placeholder="冒险者">';
			html += '<div class="btn">确定</div>'
			break;
		/* case "mailList":
			for(var i = 0; i<option.mails.length;i++){
				var time = option.mails[i].time;
				var from = option.friends[i]._id;
				html += '<div data-id="'+id+'">'+name+'</div>';
			}
			return html;
			break;
			$("#mail_table tbody").html( */
	}
	return html;
}