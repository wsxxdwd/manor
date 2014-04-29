function render(template,option){
	var html = "";
	switch(template){
		case "public_screen":
			html += '<div id="main"><div data-src="public_screen"></div>';
				html += '<div id="main_screen"></div>';
				html += '<div id="main_nav">';
					html += '<div class="nav_btn" id="player"><div data-src="player_btn"></div></div>';
					html += '<div class="nav_btn" id="items"><div data-src="items_btn"></div></div>';
					html += '<div class="nav_btn" id="team"><div data-src="team_btn"></div></div>';
					html += '<div class="nav_btn" id="mail"><div data-src="mail_btn"></div></div>';
					html += '<div class="nav_btn" id="record"><div data-src="record_btn"></div></div>';
					html += '<div class="nav_btn" id="world_time"><div data-src="time_btn"></div><div id="time"></div></div>';
				html += '</div>';
			html += '</div>';
			break;
		case 'map':
			html += '<canvas id="worldMap_background" class="mapCanvas" width="1300px" height="500px"></canvas>';
			html += '<canvas id="worldMap_foreground" class="mapCanvas" width="1300px" height="500px"></canvas>';
			html += '<canvas id="worldMap_control" class="mapCanvas" width="1300px" height="500px"></canvas>';
			
			break;
		case "field":
			html += '<div  id="field_bg" class="panel_bg" data-src="field_bg"></div>';
			html += '<div id="menu_list">';
			html +=		'<div class="menu_btn" id="field_menu_1"><div data-src="sub_nav"></div><span>议事厅</span></div>';
			html +=		'<div class="menu_btn" id="field_menu_2"><div data-src="sub_nav"></div><span>城镇建设</span></div>';
			html +=		'<div class="menu_btn" id="field_menu_3"><div data-src="sub_nav"></div><span>城防</span></div>';
			html +=		'<div class="menu_btn" id="field_menu_4"><div data-src="sub_nav"></div><span>公告板</span></div>';
			html +=		'<div class="menu_btn" id="field_menu_5"><div data-src="sub_nav"></div><span>酒馆</span></div>';
			html +=		'<div class="menu_btn" id="field_menu_6"><div data-src="sub_nav"></div><span>集市</span></div>';
			html +=		'<div class="menu_btn" id="field_menu_7"><div data-src="sub_nav"></div><span>返回</span></div>';
			html +=	'</div>';
			html +=	'<div id="field_content">'+render("field_hall",option)+'</div>';
			break;
		case "field_hall":
			//议事厅
			html += '<div id="info_screen">';
			html +=	'<div id="hall_bg" data-src="hall_bg"></div>';
			html +=		'<div id="field_info">领地名 : '+option.info.name+'</br>'+option.info.name+'位于坐标(X:'+option.info.location[0]+',Y:'+option.info.location[1]+')</br>拥有者是'+option.info.holderName+'</div>';
			if(option.info.holder == game.player._id){
				html += '<div class="small_btn" id="edit_description"><div data-src="btn"></div><div class="innerText">编辑</div></div>';
			}
			html += '</div>';
			//展示图片
			if(option.info.type == 1){
				var img = "village";
				var description = "是一个村庄,人们为了自己的生计努力奋斗在,虽然大多数时候活下去都是一件艰难的事!"
			}else if(option.info.type == 2){
				var img = "castle";
				var description = "是一个城堡,一座军事要塞能为周围的领地提供庇护,同时也能自给自足,你可以在这里向领主宣誓效忠并获得他封给你的土地."
			}
			html += '<div id="detail_box">';
			html += 	'<div  data-src="detail_box"></div>';
			html += 	'<div id="detail_title">'+option.info.name+'</div>';
			html += 	'<div id="detail_img">';
			html += 		'<div data-src="img_box"></div>';
			html += 		'<div data-src="'+img+'"  style="height:150px;width:auto;left:30px;top:20px;"/>';
			html += 	'</div>';
			html += 	'<div id="description">'+option.info.name+description+'</div>';
			if(option.info.type == 2&&option.info.holder != game.player._id){
				html += '<div class="small_btn detail_btn_right" id="apply"><div data-src="btn"></div><div class="innerText">宣誓</div></div>';
			}
			html += '</div>';
			break;
		case "field_buildings":
			//城镇建设
			html += '<div id="info_screen">';
			html +=		'<div class="title">城镇建设--'+option.info.name+'</div>'
						for(var i = 0 ;i < option.info.buildings.length;i++){
							html += '<div class="building" data-src="building"><div class="buildingInfo" data-info=\'{"id":"'+option.info.buildings[i].id+'","index":'+i+'}\'><div class="buildingName">'+$building(option.info.buildings[i].id).name+'</div><div class="workerList"></div></div></div>';
						}
			if(option.info.holder == game.player._id){
				html += '<div class="building" id="new_building" data-src="new_building"></div>'; 
			}
			html += 	'</div>';
			html += '</div>';
			
			html += '<div id="detail_box">';
			html += 	'<div data-src="detail_box"></div>';
			html += 	'<div id="detail_title"></div>';
			html += 	'<div id="detail_img">';
			html += 		'<div data-src="img_box"></div>';
			html += 		'<div  data-src=""></div>';
			html += 	'</div>';
			html += 	'<div id="description"></div>';
			html += '</div>';
			break;
		case "new_building":
			//新建建筑
			for(var i = 0 ;i < option.buildingList.length;i++){
				var need = '';
				for(var j = 0; j<option.buildingList[i].constructMaterial.length;j++){
					switch(option.buildingList[i].constructMaterial[j].type){
						case "money":
							need += '金龙币:'+ option.buildingList[i].constructMaterial[j].num+'</br>';
							break;
						case "rock":
							need += '石材:'+ option.buildingList[i].constructMaterial[j].num+'</br>';
							break;
						case "log":
							need += '木材:'+ option.buildingList[i].constructMaterial[j].num+'</br>';
							break;
					}
				}
				html += '<div class="building" data-src="building"><div class="buildingInfo"><div class="buildingName">'+option.buildingList[i].name+'</div><div class="materials">建筑材料'+need+'</br></div><div class="construct" data-id="'+option.buildingList[i]._id+'">开始建造</div></div></div>';
			}
			break;
		case "field_garrison":
			//城防
			html += '<div id="garrison_bg" data-src="garrison_bg"></div>';
			html +=	'<div id="garrison_title">城防--'+option.field.name+'</div>'
			html +=	'<div id="garrison_text">本地防务:城镇守卫军'+option.field.garrison+'人</div>';
			html +=	'<div id="garrisonList" class="text text_min" data-src="garrison">';
			html +=		'<div class="list scroll_min">';
						for(var i = 0 ;i < option.field.solider.length;i++){
							html +=	'<div class="unitInfo" data-info=\'{"id":"'+option.field.solider[i].id+'"}\'>'+option.field.solider[i].name+'</div>';
						}
			html +=		'</div>';
			html += '</div>';
			if(option.field.holder == option.player._id){
			html += 	'<div class="small_btn" id="get_solider"><div data-src="btn"></div><div class="innerText">取回</div></div>';
			html +=	'<div id="teamList_min" class="text text_min" data-src="teamList_min">';
			html +=		'<div class="list scroll_min">';
							for(var i = 0;i<option.player.team.length;i++){
								html +=	'<div class="unitInfo" data-info=\'{"id":"'+option.player.team[i].id+'"}\'>'+option.player.team[i].name+'</div>';
							}
			html +=		'</div>';
			html +=	'</div>';
			html += 	'<div class="small_btn" id="give_solider"><div data-src="btn"></div><div class="innerText">驻守</div></div>';
			}
			html += '<div id="detail_box">';
			html += 	'<div data-src="detail_box"></div>';
			html += 	'<div id="detail_title"></div>';
			html += 	'<div id="detail_img">';
			html += 		'<div data-src="img_box"></div>';
			html += 		'<div  data-src=""></div>';
			html += 	'</div>';
			html += 	'<div id="description"></div>';
			html += '</div>';
			break;
		case "field_quest":
			//公告板
			html += '<div id="quest_panel">';
			for(var i = 0 ;i < option.info.quest.length;i++){
				html += '<div class="quest" data-src="quest"><div class="questInfo" data-id="'+option.info.quest[i]._id+'"><div class="questName">'+option.info.quest[i].name+'</div><div class="qusstDescription">'+option.info.quest[i].description+'</br><span>需求:&nbsp&nbsp'+$item(option.info.quest[i].requirement).name+'</span></br><span>数量:&nbsp&nbsp'+option.info.quest[i].num+'<span></br><span>报酬:&nbsp&nbsp'+option.info.quest[i].reward+'</span></div><div class="completeQuest">完成任务</div></div></div>';
			}
			html += '</div>';
			break;
		case "field_tavern":
			//酒馆
			html +=		'<div class="text" id="lansquenet" data-src="lansquenet">';
			html +=			'<div class="list scroll">';
							for(var i = 0;i<option.info.tavern.lansquenet.length;i++){
								html +=	'<div class="unitInfo" data-info=\'{"id":"'+option.info.tavern.lansquenet[i].id+'","cost":'+option.info.tavern.lansquenet[i].price+',"field":"'+option.info._id+'"}\'>'+option.info.tavern.lansquenet[i].name+'(价格:'+option.info.tavern.lansquenet[i].price+')</div>';
							}
			html +=			'</div>';
			html +=		'</div>';
			html +=		'<div class="text" id="vistor" data-src="playerList">';
			html +=			'<div class="list scroll">';
			html +=			'</div>';
			html +=		'</div>';
			html += '<div id="detail_box">';
			html += 	'<div data-src="detail_box"></div>';
			html += 	'<div id="detail_title"></div>';
			html += 	'<div id="detail_img">';
			html += 		'<div data-src="img_box"></div>';
			html += 		'<div  data-src=""></div>';
			html += 	'</div>';
			html += 	'<div id="description"></div>';
			html += '<div class="small_btn detail_btn_right" id="tavern_action"><div data-src="btn"></div><div class="innerText"></div></div>';
			html += '</div>';
			break;
		case "field_market":
			//市场
			html += '<div id="listBox">';
						for(var i = 0;i<60;i++){
							html += '<div class="box">';
							html +=		'<div class="box_bg" data-src="img_box"></div>';
							if(option.info.market[i]){
								html +=	'<div class="item">'+$item(option.info.market[i].id).name+'(数量:'+option.info.market[i].num+')</div>';
							}
							html += '</div>';
						}
			html += '</div>';
			html += '<div id="detail_box">';
			html += 	'<div data-src="detail_box"></div>';
			html += 	'<div id="detail_title"></div>';
			html += 	'<div id="detail_img">';
			html += 		'<div data-src="img_box"></div>';
			html += 		'<div  data-src=""></div>';
			html += 	'</div>';
			html += 	'<div id="description"></div>';
			html += '<div class="small_btn detail_btn_right" id="buyItem"><div data-src="btn"></div><div class="innerText">购买</div></div>';
			html += '</div>';
			break;
		case "player":
			//人物
			html += '<div class="panel_bg" id="player_bg" data-src="player_bg"></div>';
			html +=	'<div class="small_btn" id="back"><div data-src="btn"></div><div class="innerText">返回</div></div>';
			html += '<div id="playerInfo" data-src="playerInfo">';
			html +=		'<div id="playerInfo_container">';
			html +=			'<div class="param">领地名 :</div><div class="value">'+option.info.name+'</div>'
			var placeName = game.worldMap.findField(option.info.location[0],option.info.location[1]).name
			html +=			'<div class="param">所在地 :</div><div class="value"> '+(placeName?placeName:"无名之地")+'(X:'+option.info.location[0]+'Y:'+option.info.location[1]+')</div>';
			html +=			'<div class="param">封地 : </div><div class="value">'+(option.info.base?game.worldMap.findField(option.info.base).name:"无")+'</div>'
			html +=			'<div class="param">领地 : </div><div class="value">'+(option.info.manor.name?option.info.manor.name:"无")+'</div>'
			html +=			'<div class="param">声望 : </div><div class="value">'+option.info.leadership+'</div>'
			html +=			'<div class="param">关系 : </div><div class="value">'
							for(var i = 0;i < option.info.friends.length;i++)
								html += option.info.friends[i].name+'&nbsp&nbsp';
			html +=			'</div>'
			html +=			'<div class="param">阵营 : </div><div class="value">'+option.info.alignment+'</div>'
			html +=			'<div class="param"></div>';
			html +=			'<p>按Tab返回</p>'
			
			html += 	'</div>';
			html += '</div>';
			
			break;
		case "items":
			//物品
			html += '<div class="panel_bg" id="items_bg" data-src="items_bg"></div>';
			html += '<div id="money">金龙币:<span>'+option.info.money+'</span></div>';
			html +=	'<div class="small_btn" id="back"><div data-src="btn"></div><div class="innerText">返回</div></div>';
			html += '<div id="listBox">';
						for(var i = 0;i<24;i++){
							html += '<div class="box">';
							html +=		'<div class="box_bg" data-src="img_box"></div>';
							if(option.info.items[i]){
								html +=	'<div class="item" data-info=\'{"id":"'+option.info.items[i].id+'","index":"'+i+'"}\'>'+$item(option.info.items[i].id).name+'(数量:'+option.info.items[i].num+')</div>';
							}
							html += '</div>';
						}
			html += '</div>';
			html += '<div id="detail_box">';
			html += 	'<div data-src="detail_box"></div>';
			html += 	'<div id="detail_title"></div>';
			html += 	'<div id="detail_img">';
			html += 		'<div data-src="img_box"></div>';
			html += 		'<div  data-src=""></div>';
			html += 	'</div>';
			html += 	'<div id="description"></div>';
			html += '<div class="small_btn detail_btn_right" id="useItem"><div data-src="btn"></div><div class="innerText">使用</div></div>';
			html += '<div class="small_btn detail_btn_left" id="sellItem"><div data-src="btn"></div><div class="innerText">寄售</div></div>';
			html += '</div>';
			break;
		case "team":
			//队伍
			html += '<div class="panel_bg" id="team_bg" data-src="team_bg"></div>';
			html +=	'<div class="small_btn" id="back"><div data-src="btn"></div><div class="innerText">返回</div></div>';
			html +=	'<div class="text" id="teamInfo" data-src="teamInfo">';
			html +=		'<div class="list">';
			html +=			'<div class="info_text">人数 : '+option.info.team.length+'</div>';
			html +=			'<div class="info_text">工资 : '+option.info.team.length*30+'</div>';
			html +=			'<div class="info_text">消耗 : '+option.info.team.length*5+'</div>';
			html +=			'<div class="info_text">上限 : '+Math.floor(option.info.leadership/3)+'</div>';
			html +=		'</div>';
			html += '</div>';
			html +=	'<div class="text" id="teamList" data-src="teamList">';
			html +=		'<div class="list scroll">';
							for(var i = 0;i<option.info.team.length;i++){
								html +=	'<div class="unitInfo" data-info=\'{"id":"'+option.info.team[i].id+'"}\'>'+option.info.team[i].name+'</div>';
							}
			html +=		'</div>';
			html +=	'</div>';
			html += '<div id="detail_box">';
			html += 	'<div data-src="detail_box"></div>';
			html += 	'<div id="detail_title"></div>';
			html += 	'<div id="detail_img">';
			html += 		'<div data-src="img_box"></div>';
			html += 		'<div  data-src=""></div>';
			html += 	'</div>';
			html += 	'<div id="description"></div>';
			html += '<div class="small_btn detail_btn_right" id="team_action"><div data-src="btn"></div><div class="innerText"></div></div>';
			html += '</div>';
			break;
		case "record":
			//记录
			html += '<div id="menu_list">';
			html +=		'<div class="menu_btn" id="record_menu_1"><div data-src="sub_nav"></div><span>迪维尔大陆</span></div>';
			html +=		'<div class="menu_btn" id="record_menu_2"><div data-src="sub_nav"></div><span>庄园</span></div>';
			html +=		'<div class="menu_btn" id="record_menu_3"><div data-src="sub_nav"></div><span>乱世</span></div>';
			html +=		'<div class="menu_btn" id="record_menu_4"><div data-src="sub_nav"></div><span>谋生</span></div>';
			html +=		'<div class="menu_btn" id="record_menu_5"><div data-src="sub_nav"></div><span>创世神</span></div>';
			html +=		'<div class="menu_btn" id="record_menu_6"><div data-src="sub_nav"></div><span>返回</span></div>';
			html += '</div>';
			html += render(option);
			break;
		case "record_land":
			html += '<div class="panel_bg" id="record_bg" data-src="record_land_bg"></div>';
			html +=	'<div id="bigText" class="land">'+record_text.land+'</div>';
			break;
		case "record_manor":
			html += '<div class="panel_bg" id="record_bg" data-src="record_manor_bg"></div>';
			html +=	'<div id="bigText" class="manor">'+record_text.help+'</div>';
			break;
		case "record_badage":
			html += '<div class="panel_bg" id="record_bg" data-src="record_badage_bg"></div>';
			html +=	'<div id="bigText" class="badage">'+record_text.land+'</div>';
			break;
		case "record_living":
			html += '<div class="panel_bg" id="record_bg" data-src="record_living_bg"></div>';
			html +=	'<div id="bigText" class="live">'+record_text.land+'</div>';
			break;
		case "mail_send":
			//邮件
			html +=	'<div class="small_btn" id="back"><div data-src="btn"></div><div class="innerText">返回</div></div>';
			html += '<div class="panel_bg" id="mail_bg" data-src="mail_bg"></div>';
			html += '<div id="mail_panel">';
			html += 	'<label for="reciver">收件人:</label>';
			html += 	'<select id="reciver">';
					for(var i = 0;i < option.info.friends.length;i++)
						html += '<option value="'+option.info.friends[i].id+'">'+option.info.friends[i].name+'</option>';
					html += '<option value="system">'+"系统"+'</option>';
					html += '<option value="world">'+"世界"+'</option>';
			html += 	'</select>';
			html += 	'<label for="mail_title">主题:</label>';
			html += 	'<input id="mail_title" type="text" maxlength="30" placeholder="<请输入主题>"/>';
			html +=	 	'<textarea id="mail_content"></textarea>';
			html += 	'<div class="small_btn detail_btn_left" id="toList"><div data-src="btn"></div><div class="innerText">取消</div></div>';
			html += 	'<div class="small_btn detail_btn_right" id="send"><div data-src="btn"></div><div class="innerText">发送</div></div>';
			html += '</div>';
			break;
		case "mail_info":
			//邮件
			html +=	'<div class="small_btn" id="back"><div data-src="btn"></div><div class="innerText">返回</div></div>';
			html += '<div class="panel_bg" id="mail_bg" data-src="mail_bg"></div>';
			html += '<div id="mail_panel">';
			html += 	'<label>发件人:</label>';
			html += 	'<div class="val">'+option.info.from+'</div>';
			html += 	'<label>主题:</label>';
			html += 	'<div class="val">'+option.info.title+'</div>';
			html += 	'<label>时间:</label>';
			html += 	'<div class="val">'+option.info.time+'</div>';
			html +=	 	'<div id="mail_content_min">'+option.info.content+'</div>';
			if(option.info.from != "我"){
				html +=	 	'<textarea id="reply_mail">Re:'+option.info.from+'</textarea>';
				html += 	'<div class="small_btn detail_btn_left" id="toList"><div data-src="btn"></div><div class="innerText">返回列表</div></div>';
				html += 	'<div class="small_btn detail_btn_right" id="reply" data-info=\'{"fromId":"'+option.info.fromId+'","title":"'+option.info.title+'"}\'><div data-src="btn" ></div><div class="innerText">发送</div></div>';
			}else{
				html += 	'<div class="small_btn detail_btn_right" id="toList"><div data-src="btn"></div><div class="innerText">返回列表</div></div>';
			}
			html += '</div>';
			break;
		case "mail_list":
			//邮件
			html +=	'<div class="small_btn" id="back"><div data-src="btn"></div><div class="innerText">返回</div></div>';
			html += '<div class="panel_bg" id="mail_bg" data-src="mail_bg"></div>';
			html += '<div id="mail_panel">';
			html += 	'<label>信件列表</label>';
			html += 	'<div id="mailList">';
						for(var i = 0;i < option.info.mailHistory.length;i++)
							html += '<div class="mailFeed" data-id="'+option.info.mailHistory[i]._id+'">'+option.info.mailHistory[i].title+'&nbsp&nbsp----'+option.info.mailHistory[i].from+'('+option.info.mailHistory[i].time+')</div>';
			html += 	'</div>';
			html += 	'<div class="small_btn detail_btn_right" id="newMail"><div data-src="btn"></div><div class="innerText">送出信件</div></div>';
			html += '</div>';
			break;
		case "sellInfo"://选择物品数量
			html += '<div id="sellItem_panel">';
			html +=	'<label for="sellItemNum">选择数量:(1-'+option.num+')</label>: <input type="number" id="sellItemNum" min="1" max="'+option.num+'" step="1"/>';
			html +=	'<label for="sellItemPrice">输入价格:</label>: <input type="number" id="sellItemPrice"/>';
			html += '<div class="small_btn" id="confirmSell"><div data-src="btn"></div><div class="innerText">开始寄售</div></div>';
			html += '</div>';
			break;
		case "chat"://及时聊天
			html += '<div id="chat_window"></div>'
			html += '<textarea id="chat_input"></textarea>';
			html += '<div class="small_btn" id="chat_send" data-info=\'{"so":"'+option.so+'","name":"'+option.name+'"}\'><div data-src="btn"></div><div class="innerText">发送</div></div>';
			break;
		case "newplayer_1"://新玩家引导
			html += '冒险者'+option.name+',你好,欢迎来到迪维尔大陆,请问你的名字叫什么?';
			html += '<label for="new_name">请输入角色名:</label><input id="new_name" type="text" >';
			html += '<div class="small_btn" id="sendInfo"><div data-src="btn"></div><div class="innerText">确认</div></div>';
			break;
	}
	return html;
}