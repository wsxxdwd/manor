function Game(){
	var _this = this;
	this.uid = uid;//在jade中定义
	this.player;
	this.field;
	this.manor;
	this.worldMap;
	this.panel = '';
	this.tavernSelect = "";
	this.imageURL = {	tip:'../images/tip.png',
						btn:'../images/btn.png',
						btn_active:'../images/btn_active.png',
						player_btn:'../images/player_btn.png',
						player_btn_active:'../images/player_btn_active.png',
						items_btn:'../images/items_btn.png',
						items_btn_active:'../images/items_btn_active.png',
						team_btn:'../images/team_btn.png',
						team_btn_active:'../images/team_btn_active.png',
						mail_btn:'../images/mail_btn.png',
						mail_btn_active:'../images/mail_btn_active.png',
						record_btn:'../images/record_btn.png',
						record_btn_active:'../images/record_btn_active.png',
						time_btn:'../images/time_btn.png',
						public_screen:'../images/public_screen.jpg',
						earth:'../images/earth98.jpg',
						castle:'../images/castle.png',
						village:'../images/village.png',
						arrow:'../images/arrow.png',
						field_bg:'../images/field_bg.jpg',
						hall_bg:'../images/hall_bg.jpg',
						player_bg:'../images/player_bg.jpg',
						team_bg:'../images/team_bg.jpg',
						items_bg:'../images/items_bg.jpg',
						mail_bg:'../images/mail_bg.jpg',
						record_land_bg:'../images/record_land_bg.jpg',
						record_manor_bg:'../images/record_manor_bg.jpg',
						record_badage_bg:'../images/record_badage_bg.jpg',
						record_living_bg:'../images/record_living_bg.jpg',
						garrison_bg:'../images/garrison_bg.png',
						sub_nav:'../images/sub_nav.png',
						sub_nav_active:'../images/sub_nav_active.png',
						detail_box:'../images/detail_box.png',
						img_box:'../images/img_box.png',
						lansquenet:'../images/lansquenet.png',
						playerList:'../images/playerList.png',
						playerInfo:'../images/playerInfo.jpg',
						teamInfo:'../images/teamInfo.png',
						teamList:'../images/teamList.png',
						scrollbar:'../images/scrollbar.png',
						scrollcontainer:'../images/scrollcontainer.png',
						scrollup:'../images/scrollup.png',
						scrolldown:'../images/scrolldown.png',
						garrison:'../images/garrison.jpg',
						teamList_min:'../images/teamList_min.jpg',
						building:'../images/building.png',
						new_building:'../images/new_building.png',
						quest:'../images/quest.jpg',
					};
	this.soundURL = {backgroundMusic:'../audios/bgm'};
	this.sounds = {};
	this.images = {};
	
	//初始化
	this.init = function(){
		this.sounds.backgroundMusic.loop = true;
		this.sounds.backgroundMusic.play();
		socket.emit("gameData",{});
		socket.emit("playerLogin",{_id:uid});
		//初始化游戏场景
		$('#gameScreen').html(render("public_screen"));
		imgRender('#gameScreen');
		bind_event();
	}
	//侦听器
	this.gameListener = function(){
		//连接成功
		socket.on("connect",function(data){
			console.log("connect success!");
		});
		//连接丢失
		socket.on("disconnect",function(data){
			console.log("disconnect!");
			wtalert("哦普斯,得给木一丝库热啊西的(oops,the game is crashed)!");
		});
		//服务器欢迎信息
		socket.on("welcome",function(data){
			_this.player = data.info;
			if(_this.player.isnew  == 1){
				var option = {
					name:_this.player.username
				}
				wtalert("欢迎你来到迪维尔大陆",render("newplayer_1",option));
				$("#wt_close").hide();
				imgRender('#wtalert_content');
			}else{
				close_wtalert();
			}
		});
		//数据更新
		socket.on("update",function(list){
			updateInfo(list);
		});
		//世界地图
		socket.on("worldMap",function(data){
			//初始场景为世界地图
			_this.worldMappanel(data);
		});
		//获取游戏数据
		socket.on("gameData",function(data){
			_this.gameData = data.data;
		});
		//雇佣单位结果
		socket.on("hireResult",function(data){
			if(data.status){
				for(var i = 0;i<_this.currentField[0].tavern.lansquenet.length;i++){//领地中删除雇佣兵
					if(_this.currentField[0].tavern.lansquenet[i].id == data.id){
						_this.currentField[0].tavern.lansquenet.splice(i,1);
						if($("#lansquenet .mCSB_container")){
							$($("#lansquenet .mCSB_container").children()[i]).remove();
						}
					}
				}
			}else{
				wtalert("雇佣失败",data.msg);
			}
		});
		//交易通知
		socket.on("dealDone",function(data){
			wtalert("交易完成",'您有一份寄卖货物已经出售,'+data.money+'金龙币已经送到你手上');
		});
		//新建建筑通知
		socket.on("constructResult",function(data){
			if(status == 1){
				wtalert("建筑开始建造",'您的领地开始建筑一个新的建筑设施');
			}else{
				wtalert("无法开始建筑",data.msg);
			}
		});
		//建筑生产通知
		socket.on("buildingStatuschange",function(data){
			for(var i = 0;i < game.currentField[0].buildings.length;i++){
				if(game.currentField[0].buildings[i]._id == data.id){
					game.currentField[0].buildings[i].status = data.status;
					game.currentField[0].buildings[i].timer = "0";
					switch(data.status){
						case "wait":
							var status = "等待生产";
							break;
						case "work":
							var status = "工作中";
							break;
						case "constructing":
							var status = "建造中";
							break;
					}
					if($("#detail_box").data("index") == i){
						$("#detail_box #description .status").html(status);
						$("#detail_box #description .timer").html("0");
					}
				}
			}
		});
		//建立即时聊天
		socket.on("chatConnect",function(data){
			if(data.status){
				wtalert("聊天",render("chat",data));
				imgRender('#wtalert_content');
				$("#chat_input").focus();
				$("#chat_window").mCustomScrollbar();
			}else{
				wtalert("聊天请求失败",data.msg);
			}
		});
		//收到及时聊天信息
		socket.on("chatMsg",function(data){
			if(data.status){
				var nowChatTarget = $("#chat_send").data("info");
				if(nowChatTarget.so == data.from){
					if(!$("#chat_window")){
						wtalert("聊天",render("chat",data));
						$("#chat_input").focus();
						imgRender('#wtalert_content');
						$("#chat_window").mCustomScrollbar();
					}
					var newMsg = '<div class="left_bubble bubble"><div class="sender">'+nowChatTarget.name+'</div><div class="chat_text">'+data.msg+'</div></div>'
					$("#chat_window .mCSB_container").append(newMsg); //load new content inside .mCSB_container
					$("#chat_window").mCustomScrollbar("update"); //update scrollbar according to newly loaded content
					$("#chat_window").mCustomScrollbar("scrollTo","bottom",{scrollInertia:200});
				}
			}else{
				wtalert("聊天终止",data.msg);
			}
		});
		//寄卖反馈
		socket.on("sellResult",function(data){
			if(data.status){
				wtalert("寄售完成","您的物品已经在当地市场进行寄售,当有人买下该物品后你即可收到货款");
				_this.itemspanel(_this.player);
			}else{
				wtalert("无法寄售",data.msg);
			}
		});
		//购买反馈
		socket.on("buyResult",function(data){
			if(data.status){
				wtalert("购买完成","您已成功买下该物品");
				var id = $("#detail_box").data("info")._id
				for(var i = 0;i < game.currentField[0].market.length;i++){
					if(id == game.currentField[0].market[i]._id){
						game.currentField[0].market.splice(i,1);
					}
				}
				_this.marketpanel(game.currentField);
			}else{
				wtalert("收购失败",data.msg);
			}
		});
		//任务反馈
		socket.on("questResult",function(data){
			if(data.status){
				var done_quest = _this.currentField[0].quest.splice(data.index,1);
				wtalert("任务完成","您完成了告示牌上张贴的任务--"+done_quest[0].name+",作为回报,您得到了"+done_quest[0].reward+"枚金龙币");
				game.questpanel(_this.currentField);
			}else{
				wtalert("未能顺利完成任务","条件不满足,你未能完成任务")
			}
		});
		//世界时间
		socket.on("newMail",function(data){
			wtalert("新邮件!","你有一封来自 "+data.from+" 的新邮件</br>"+data.title);
		});
		//世界时间
		socket.on("worldTime",function(data){
			_this.tick(data);
		});
		//获取指定领地信息
		socket.on("manorInfo",function(data){_this.getManorInfoCallback(data)});
		//获取指定玩家信息
		socket.on("playerInfo",function(data){_this.getPlayerInfoCallback(data)});
		//获取指定士兵信息
		socket.on("soliderInfo",function(data){_this.getSoliderInfoCallback(data)});
		//获取指定地区信息
		socket.on("fieldInfo",function(data){_this.getFieldInfoCallback(data)});
		//获取指定地区玩家列表
		socket.on("fieldPlayer",function(data){_this.getFieldPlayerCallback(data)});
	}
	
	this.getManorInfo = function(id,callback){
		_this.getManorInfoCallback = callback;
		socket.emit("getter",{type:"manor",id:id});
	}
	this.getPlayerInfo = function(id,callback){
		_this.getPlayerInfoCallback = callback;
		socket.emit("getter",{type:"player",id:id});
	}
	this.getSoliderInfo = function(id,callback){
		_this.getSoliderInfoCallback = callback;
		socket.emit("getter",{type:"solider",id:id});
	}
	this.getFieldInfo = function(id,callback){
		_this.getFieldInfoCallback = callback;
		socket.emit("getter",{type:"field",id:id});
	}
	this.getFieldPlayer = function(id,callback){
		_this.getFieldPlayerCallback = callback;
		socket.emit("getter",{type:"fieldPlayer",id:id});
	}
	this.broadcast = function(msg){
		mail.broadcast(msg);
	}
	
	this.getRecentMail = function(callback){
		mail.getHistory(this.id,callback);
	}
	this.getWorldMap = function(callback){
		_this.getWorldMapCallback = callback;
		socket.emit("getWorldMap",{});
	}
	this.logout = function(){
		$.ajax({
			url:'./logout',
			type:'post',
			success:function(res){
				var json = JSON.parse(res);
				if(json.status == 1){
					alert("退出成功!")
					window.location.href = '/';
				}else{
					alert(json.msg);
				}
			}
		});
	}
	//玩家移动
	this.playerMove = function(mx,my){
		socket.emit("playerMove",{toX:mx,toY:my,fromX:this.player.location[0],fromY:this.player.location[1]});
		this.player.location = [mx,my];
	}
	//发送邮件
	this.sendMail = function(id,title,content){
		socket.emit("sendMail",{to:id,title:title,msg:content});
	}
	this.hireUnit = function(info){
		//雇佣单位
		socket.emit("hireUnit",{unitInfo:info});
	}
	//世界循环
	this.tick = function(data){
		$("#world_time #time").html(data.time);
		if(game.currentField){
			for(var i = 0;i < game.currentField[0].buildings.length;i++){
				game.currentField[0].buildings[i].timer++;
			}
			if(this.panel = "field_buildings"&&typeof($("#detail_box").data("index")) == 'number'){
				var i = $("#detail_box").data("index");
				if(game.currentField[0].buildings[i].status == 'work'){
					$("#detail_box #description .timer").html(game.currentField[0].buildings[i].timer);
				}
			}
		}
	}
	//===========================================各个界面====================================
	
	//世界地图
	this.worldMappanel = function(data){
		if(this.panel == 'worldMap'){
			return false;
		}
		this.panel = 'worldMap';
		$('#main_screen').html(render('map'));
		_this.worldMap = new Map(data);
		_this.mouse = new Mouse();
		
		_this.worldMap.init();
		_this.mouse.init();
		
		_this.worldMap.drawBackground();
		
	}
	//领地界面
	this.fieldpanel = function(data){
		this.currentField = data;
		this.panel = 'field_hall';
		var option = {
			info : data[0]
		}
		$('#main_screen').html(render('field',option));
		imgRender('#main_screen');
	}
	//公告板界面
	this.questpanel = function(data){
		this.panel = 'field_quest';
		var option = {
			info : data[0]
		}
		$('#field_content').html(render('field_quest',option));
		imgRender('#field_content');
	}
	//城防界面
	this.garrisonpanel = function(data){
		this.panel = 'field_garrison';
		var option = {
			field : data[0],
			player  : this.player
		}
		$('#field_content').html(render('field_garrison',option));
		imgRender('#field_content');
		$("#garrisonList .list,#teamList_min .list").mCustomScrollbar({
			scrollButtons:{
				enable:true
			}
		});
	}
	//建筑界面
	this.buildingspanel = function(data){
		this.panel = 'field_buildings';
		var option = {
			info : data[0]
		}
		$('#field_content').html(render('field_buildings',option));
		imgRender('#field_content');
	}
	//酒馆界面
	this.tavernpanel = function(data){
		this.panel = 'field_tavern';
		var option = {
			info : data[0]
		}
		$('#field_content').html(render('field_tavern',option));
		imgRender('#field_content');
		$("#lansquenet .list").mCustomScrollbar({
			scrollButtons:{
				enable:true
			}
		});
	
		//请求当前领地玩家
		this.getFieldPlayer(data[0]._id,function(res){
			if(res.list){
				var html = '';
				for(var i = 0;i < res.list.length;i++){
					html +=	'<div class="unitInfo" data-info=\'{"id":"'+res.list[i].id+'"}\'>'+res.list[i].name+'</div>';
				}
				$("#vistor .list").html(html); 
				$("#vistor .list").mCustomScrollbar({
					scrollButtons:{
						enable:true
					}
				});
			}
		});
	}
	//集市界面
	this.marketpanel = function(data){
		this.panel = 'field_market';
		var option = {
			info : data[0]
		}
		$('#field_content').html(render('field_market',option));
		imgRender('#field_content');
		$("#listBox").mCustomScrollbar();
		for(var i = 0;i < data[0].market.length;i++){
			$($("#listBox").find(".box")[i]).data("info", data[0].market[i]);
		}
	}
	//角色信息
	this.playerpanel = function(data){
		this.panel = 'player';
		var option = {
			info : data
		}
		$('#main_screen').html(render('player',option));
		imgRender('#main_screen');
	}
	//物品信息
	this.itemspanel = function(data){
		this.panel = 'items';
		var option = {
			info : data
		}
		$('#main_screen').html(render('items',option));
		imgRender('#main_screen');
	}
	//队伍信息
	this.teampanel = function(data){
		this.panel = 'team';
		var option = {
			info : data
		}
		$('#main_screen').html(render('team',option));
		imgRender('#main_screen');
	}
	//邮件界面
	this.mailpanel = function(data){
		this.panel = 'mail';
		var option = {
			info : data
		}
		$('#main_screen').html(render('mail_list',option));
		imgRender('#main_screen');
		$("#mailList").mCustomScrollbar();
	}
	//新建邮件界面
	this.newMailpanel = function(data){
		this.panel = 'mail';
		var option = {
			info : data
		}
		$('#main_screen').html(render('mail_send',option));
		imgRender('#main_screen');
	}
	//邮件信息及回复
	this.mailInfopanel = function(id){
		this.panel = 'mail';
		for(var i = 0;i < game.player.mailHistory.length;i++){
			if(game.player.mailHistory[i]._id == id.toString()){
				var data = game.player.mailHistory[i];
			}
		}
		var option = {
			info : data
		}
		$('#main_screen').html(render('mail_info',option));
		imgRender('#main_screen');
	}
	//记录
	this.recordpanel = function(part){
		this.panel = 'record';
		$('#main_screen').html(render('record',part));
		imgRender('#main_screen');
		$("#bigText").mCustomScrollbar();
	}
}