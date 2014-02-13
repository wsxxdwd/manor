var thisURL = '127.0.0.1:3000';
var socket = io.connect(thisURL);

var pannel = 'player';
var value = {};//临时保存修改前值
window.onload = function(){
	socket.emit("adminLogin",{});
	socket.on("serverLogger",function(data){
		$("#monitor").prepend('<P>'+data.time+"  "+data.msg+'</p>');
	})
	//玩家列表
	$("#player").bind("click",function(){
		playerList();
	});
	playerList();
	
	//列表视图
	$("table").on("click",".edit",function(){
		var params = $(this).parent().parent().children();
		for(var i = 1;i<params.length;i++){
			if(i<params.length-2){
				var val = $(params[i]).html();
				var key = $(params[i]).data("key");
				value[key] = val;
				$(params[i]).html('<input type="text" value="'+val+'">');
			}else if(i == params.length -2){
				$(params[i]).html('<div class="btn btn-danger cancel">取消</div>');
			}else if(i == params.length -1){
				$(params[i]).html('<div class="btn btn-success done">确定</div>');
			}
		}
	});
	
	$("table").on("click",".done",function(){
		var params = $(this).parent().parent().children();//td
		for(var i = 1;i<params.length;i++){
			var val = $($(params[i]).children()[0]).val();
			var key = $(params[i]).data("key");
			if(i<params.length-2){
				value[key] = val;
			}
		}
		edit_info($(this).parent().parent());
	});
	$("table").on("click",".cancel",function(){
		cancel($(this).parent().parent());
	});
	$("table").on("click",".del",function(){
		//删除
	});
}
function playerList(){
	$.ajax({
		url:'./data',
		type:'post',
		data:"data=playerlist",
		success:function(res){
			var json = JSON.parse(res);
			if(json.status == 1){
				$("#main h3").html("玩家");
				pannel = 'player';
				var t_head = '<tr><th>_id</th><th>用户名</th><th>密码(MD5)</th><th>修改</th><th>删除</th></tr>';
				var t_body = '';
				for(var i in json.list){
					t_body += '<tr><td data-key="_id">'+json.list[i]._id+'</td><td data-key="username">'+json.list[i].username+'</td><td data-key="password">'+json.list[i].password+'</td><td><div class="btn btn-info edit">修改</div></td><td><div class="btn btn-danger del">删除</div></td></tr>';
				}
				$("#info_table").html(t_head+t_body);
			}else{
				alert(json.msg);
			}
		}
	});
}
function edit_info(elem){
	var _id = $($(elem).children()[0]).html();//目标的_id
	$.ajax({
		url:'./edit',
		type:'post',
		data:'data={"type":"'+pannel+'","_id":"'+_id+'","data":'+JSON.stringify(value)+'}',
		success:function(res){
			var json = JSON.parse(res);
			if(json.status == 1){
				alert("ok");
				cancel(elem);//已经更新value()数组,cancel相当于更新数据
			}else{
				alert(json.msg);
			}
		}
	});
}
function cancel(elem){
	var params = $(elem).children();
	for(var i = 1;i<params.length;i++){
		if(i<params.length-2){
			$(params[i]).html(value[$(params[i]).data("key")]);
		}else if(i == params.length -2){
			$(params[i]).html('<div class="btn btn-info edit">修改</div>');
		}else if(i == params.length -1){
			$(params[i]).html('<div class="btn btn-danger del">删除</div>');
		}
	}
}