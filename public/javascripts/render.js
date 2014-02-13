function render(template,option){
	var html = "";
	switch(template){
		//封地总览
		case "field_overview":
			html = "<p>"+option.name+"资源总览</p>";
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
			html = "<p>"+option.name+"资源总览</p>";
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