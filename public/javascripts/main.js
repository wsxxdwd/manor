var gameURL = 'http://127.0.0.1:3000';
var socket = io.connect(gameURL);

window.onload = function(){
	
	$('.gameLayer').hide();
	game = new Game();
	loader.init();
	for(var v in game.imageURL){
		game.images[v] = loader.loadImage(game.imageURL[v]);
	}
	for(var v in game.soundURL){
		game.sounds[v] = loader.loadSound(game.soundURL[v]);
	}
}
//邮件界面
function mail_page(){
	if(game.player.friends.length){
		game.getPlayerInfo(game.player.friends,function(friends){
			var option = {
				friends : friends
			}
			$("#friendList").html(render("friendList",option)); 
		});
	}
	/* game.getRecentMail(function(mails){
		var option = {
			mails : mails
		}
		render("mailList",option);
	}); */
}
//物品界面
function item_page(){
		var option = {
			items : game.player.items
		}
		render("item",option);
}
//领地界面
function manor_page(id){
	if(id){
		game.getManorInfo([id],function(manor){
			game.manor = manor[0];
			game.getPlayerInfo([game.manor.owner],function(owner){
				game.manor.ownername = owner[0].username;
				$("#manor_page h2").html(manor[0].name);
				manor_info("manor_overview");
			});
		});
	}else{
		showMsg("您还没有属于自己的领地","获得领地的方法提示文本");
	}
}
//领地二级菜单
function manor_info(key){
	var manor = game.manor;
	var ownername = game.manor.ownername;
	switch(key){
		case "manor_overview":
			var option = {
				manor:manor,
				owner:ownername
			};
			$("#manor_info").html(render("manor_overview",option));
			break;
		case "world":
			
			game.getManorInfo([game.player.manor],function(manor){
				var option = {
					location : game.player.location,
					myManor : manor[0],
					map:game.worldMap
				};console.log(option)
				$("#manor_info").html(render("worldMap",option));
			});
			break;
	}
}
//封地界面
function field_page(id){
	if(id){
		game.getFieldInfo([id],function(field){
			game.field = field[0];
			game.getPlayerInfo([game.field.holder],function(holder){
				game.field.holdername = holder[0].username;
				$("#field_page h2").html(field[0].name);
				field_info("overview");
			});
		});
	}else{
		showMsg("您还没有属获得任何封地","获得封地的方法提示文本");
	}
}
//封地二级菜单
function field_info(key){
	var field = game.field;
	var holdername = game.field.holdername;
	switch(key){
		case "overview":
			var option = {
				field:field,
				owner:holdername
			};
			$("#field_info").html(render("field_overview",option));
			break;
		case "buildings":
			var option ={
				name:field.name,
				buildings:field.buildings
			};
			$("#field_info").html(render("field_building",option));
			break;
		case "garrison":
			var option ={
					name:field.name,
					garrison:field.garrison
				};
			$("#field_info").html(render("field_garrison",option));
			break;
		case "solider":
			var option ={
					owner:holdername,
					name:field.name,
					solider:field.solider
			};
			$("#field_info").html(render("field_solider",option));
			break;
		case "quest":
			var option = {
					name:field.name,
					quest:field.quest
				};
			$("#field_info").html(render("field_quest",option));
			for(var i = 0;i<game.player.items.length;i++){
				if(game.player.items[i].id == field.quest.requirement&&game.player.items[i].num > field.quest.num){
					$("#quest_done").removeClass("disabled");
					$("#quest_done").attr("data-status","active");
					$("#quest_done").addClass("btn-success");
				}
			}
			break;
	}
}
//发出邮件
function sendMail(){
	var msg = $("#mail_page textarea").val();
	if($("#mailTo").attr("name")){
		game.sendMail($("#mailTo").attr("name"),msg);
	}else{
		game.broadcast(msg);
	}
	alert("邮件已送出");
	$("#mail_page textarea").val("");
}
function updateInfo(list){
	for(var v in list){
		game.player[v] = list[v];
		switch(v){
			case "username":
				$("#username span").html(game.player.username);
				break;
			case "money":
				$("#money span").html(game.player.money);
				break;
			case "alignment":
				$("#alignment span").html(game.player.alignment);
				break;
			case "team":
			case "leadership":
				$("#team span").html(game.player.team.length+"/"+game.player.leadership);
				break;
			case "items":
				item_page();
				break;
		}
	}
}