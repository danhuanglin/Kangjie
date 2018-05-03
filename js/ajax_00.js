/**
 * Janine:该文件用于公用的一些数据请求
 */
var httpctx = 'http://114.214.164.48:8888/kangj/api_jsonrpc.php';
console.log("=============================================================进入接口请求=============================================================");
/*Janine:获取登录的数据*/
function user_login() {
	var user_login_data = {
		"jsonrpc": "2.0",
		"method": "user.login",
		"params": {
			// Janine:获取用户名和密码的input框的值
			"user": $("#account").val(),
			"password": $("#password").val(),
		},
		"id": 0
	};
	/**Janine:登录数据请求**/
	$.ajax({
		type: 'post',
		url: httpctx,
		async: true,
		dataType: 'json',
		contentType: 'application/json',
		timeout: 5000,
		data: JSON.stringify(user_login_data),
		// 发送数据成功
		success: function(data) {
			if(data.result != undefined) {
				// Janine:获取到data中的result的auth，用于给用户授权
				var auth = data.result;
				localStorage.setItem("auth", auth); // 存储auth的值
				window.location.href = "html/tab-webview-main.html"; // 进行页面跳转

			} else if(data.result == undefined) {
				if(data.error.code == -32602 && data.error.data == "Login name or password is incorrect.") {
					alert("用户名或密码错误！");
				} else {
					alert("登录失败");
				}
			}
		},
		// 发送数据失败
		error: function(xhr, type, errorThrown) {
			mui.toast("服务器出错！");

		},

	});
}

/**
 * 1.获取主机群组
 */
function get_grouphosts() {
	console.log("Janine:获取主机群组================》");
	var get_hostgroupid_data = {
		"jsonrpc": "2.0",
		"method": "hostgroup.get",
		"params": {
			"output": "extend",
			"real_hosts": true
		},
		"auth": localStorage.getItem("auth"),
		"id": 1
	};
	$.ajax({
		type: 'post',
		url: httpctx,
		async: true,
		dataType: 'json',
		contentType: 'application/json',
		timeout: 5000,
		data: JSON.stringify(get_hostgroupid_data),

		success: function(data) {
			// 使用for循环，在下拉框中，显示数据
			$('#data_groupid').attr("length", '0');
			$('#event_groupid').attr("length", '0');
			$('#graph_groupid').attr("length", '0');
			for(var i = 0; i <= data.result.length - 1; i++) {
				$("#data_groupid").append($('<option value=' + data.result[i].groupid + '>' + data.result[i].name + '</option>'));
				$("#event_groupid").append($('<option value=' + data.result[i].groupid + '>' + data.result[i].name + '</option>'));
				$("#graph_groupid").append($('<option value=' + data.result[i].groupid + '>' + data.result[i].name + '</option>'));
			}

			var group_currentWebview = plus.webview.currentWebview();
			console.log("Janine:当前窗口名称=====>" + group_currentWebview.id);
			if(group_currentWebview.id == "tab-webview-subpage-graph.html") {
				var graph_item = $("#graph_groupid").val();
				get_host_name(graph_item);
				// 绑定点击事件
				$("#graph_groupid").change(function() {
					graph_item = $("#graph_groupid").val();
					get_host_name(graph_item);
				});
				console.log("Janine:graph_host_name().graph_item======>" + graph_item);
			}
			if(group_currentWebview.id == "tab-webview-subpage-events.html") {
				var event_item = $("#event_groupid").val();
				get_host_name(event_item);
				// 绑定点击事件
				$("#event_groupid").change(function() {
					event_item = $("#event_groupid").val();
					get_host_name(event_item);
				});
				console.log("Janine:event_host_name().event_item======>" + event_item);
			}
			if(group_currentWebview.id == "tab-webview-subpage-data.html") {
				var data_item = $("#data_groupid").val();
				get_host_name(data_item);
				// 绑定点击事件
				$("#data_groupid").change(function() {
					data_item = $("#data_groupid").val();
					get_host_name(data_item);
				});
				console.log("Janine:data_host_name().data_item======>" + data_item);
			}

		},
		// 数据传输失败，可能是发送的地址有问题，或服务器自身的问题，例如：服务器没有启动
		error: function(xhr, type, errorThrown) {
			mui.toast("服务器出错!!!");
		},
	});
	return true;

}

/*2.获取主机群组对应的主机*/
function get_host_name(groupid) {
	console.log("Janine:获取主机群组对应的主机名=======》");

	// 需要发送的JSON数据
	var get_hosts_name = {
		"jsonrpc": "2.0",
		"method": "host.get",
		"params": {
			"groupids": JSON.parse(groupid)
		},
		"auth": localStorage.getItem("auth"),
		"id": 1

	};
	console.log("Janine:获取主机群组相应的主机====》" + JSON.stringify(get_hosts_name));
	$.ajax({
		type: 'post', // 数据的传输方式为post
		url: httpctx, // 数据的传输地址
		async: true, // 是否进行异步通信
		dataType: 'json', // 服务器返回json格式数据
		contentType: 'application/json', // 数据的内容类型为application/json
		timeout: 5000, // 超时时间设置为5秒
		data: JSON.stringify(get_hosts_name), // 将字符串转成JSON
		// 数据传输成功后，返回结果，对结果进行相应的操作
		success: function(data) {
			$('#data_hostid').empty();
			$('#event_hostid').empty();
			$('#graph_hostid').empty();

			$('#data_hostid').attr("length", '0');
			$('#event_hostid').attr("length", '0');
			$('#graph_hostid').attr("length", '0');

			for(var i = 0; i <= data.result.length - 1; i++) {
				$("#data_hostid").append($('<option value=' + data.result[i].hostid + '>' + data.result[i].name + '</option>'));
				$("#event_hostid").append($('<option value=' + data.result[i].hostid + '>' + data.result[i].name + '</option>'));
				$("#graph_hostid").append($('<option value=' + data.result[i].hostid + '>' + data.result[i].name + '</option>'));
			}

			var host_currentWebview = plus.webview.currentWebview();
			console.log("Janine:当前窗口名称.host_currentWebview=====>" + host_currentWebview.id);
			if(host_currentWebview.id == "tab-webview-subpage-graph.html") {
				var graph_hostid = $("#graph_hostid").val();
				get_graph_hostids(graph_hostid);
				// 绑定点击事件
				$("#graph_hostid").change(function() {
					graph_hostid = $("#graph_hostid").val();
					get_graph_hostids(graph_hostid);
				});
				console.log("Janine:graph_host_name().graph_hostid======>" + graph_hostid);
			}

			if(host_currentWebview.id == "tab-webview-subpage-events.html") {
				var event_hostid = $("#event_hostid").val();
				var event_hostname = $("#event_hostid").find("option:selected").text();
				get_trigger_description(event_hostid, event_hostname);
				// 绑定点击事件
				$("#event_hostid").change(function() {
					console.log("=================点击事件页面的主机================");
					event_hostid = $("#event_hostid").val();
					event_hostname = $("#event_hostid").find("option:selected").text();
					get_trigger_description(event_hostid, event_hostname);
				});
				console.log("Janine:graph_host_name().event_hostid======>" + event_hostid);
			}

		},
		// 数据传输失败，可能是发送的地址有问题，或服务器自身的问题，例如：服务器没有启动
		error: function(xhr, type, errorThrown) {
			mui.toast("服务器出错!!!");
		},
	});

}

/**
 * 获得主机对应的图
 * hostids —— Return only graphs that belong to the given hosts.
 * 仅返回属于给定主机的图
 */
function get_graph_hostids(hostid) {
	console.log("===========" + hostid + "============================获取主机相应的图=======================================");

	// 需要发送的JSON数据
	var get_graph_byhostids = {
		"jsonrpc": "2.0",
		"method": "graph.get",
		"params": {
			"hostids": JSON.parse(hostid)
		},
		"auth": localStorage.getItem("auth"),
		"id": 1
	};
	$.ajax({
		type: 'post', // 数据的传输方式为post
		url: httpctx, // 数据的传输地址
		async: true, // 是否进行异步通信
		dataType: 'json', // 服务器返回json格式数据
		contentType: 'application/json', // 数据的内容类型为application/json
		timeout: 5000, // 超时时间设置为5秒
		data: JSON.stringify(get_graph_byhostids), // 将字符串转成JSON
		// 数据传输成功后，返回结果，对结果进行相应的操作
		success: function(data) {
			$('#graphid').empty();
			// 使用for循环，在下拉框中，显示数据
			$('#graphid').attr("length", '0');
			for(var i = 0; i <= data.result.length - 1; i++) {
				$("#graphid").append($('<option value=' + data.result[i].graphid + '>' + data.result[i].name + '</option>'));
			}
			var graphid = $("#graphid").val();
			get_single_graph(graphid);
			// 绑定点击事件
			$("#graphid").change(function() {
				graphid = $("#graphid").val();
				get_single_graph(graphid);
			});
			console.log("Janine: get_graph_hostids(hostid).graphid======>" + graphid);

		},
		// 数据传输失败，可能是发送的地址有问题，或服务器自身的问题，例如：服务器没有启动
		error: function(xhr, type, errorThrown) {
			mui.toast("服务器出错！");
		},

	});
}

/******************************************************* 获取起始页的图片  *******************************************************/
function get_single_graph(graphid) {
	console.log("getSingleGraph()======》");

	function fix(num, length) {
		return('' + num).length < length ? ((new Array(length + 1)).join('0') + num).slice(-length) : '' + num;
	}

	function getdatethree() {
		var now = new Date();
		now.setDate(now.getDate() - 2); // 获取AddDayCount天后的日期
		var GstartData = now.getFullYear() + "-" + fix((now.getMonth() + 1), 2) + "-" + fix(now.getDate(), 2) + " " + fix(now.getHours(), 2) + ":" + fix(now.getMinutes(), 2) + ":" + fix(now.getSeconds(), 2);
		return GstartData;
	}
	var now = new Date();
	var GendData = now.getFullYear() + "-" + fix((now.getMonth() + 1), 2) + "-" + fix(now.getDate(), 2) + " " + fix(now.getHours(), 2) + ":" + fix(now.getMinutes(), 2) + ":" + fix(now.getSeconds(), 2);

	// 获取某个时间的时间戳
	var oTimeStart = document.getElementById("graph_start_time");
	var oTimeEnd = document.getElementById("graph_end_time");
	oTimeStart.value = getdatethree();
	oTimeEnd.value = GendData;
	show_img(graphid);
}

function show_img(graphid) {
	console.log("点击查询图像======");
	$("#pic").empty();
	// 获取开始时间的值
	var stime = document.getElementById("graph_start_time");
	var stime_value = stime.value;
	// 获取结束时间的值
	var etime = document.getElementById("graph_end_time");
	var etime_value = etime.value; //获取时间下拉菜单的值

	// 计算两个时间相差的秒数
	var date1 = new Date(stime_value); //开始时间
	var date2 = new Date(etime_value); //结束时间
	//相差秒数
	var get_time = (date2.getTime() - date1.getTime()) / 1000;

	var graph = document.getElementById("graphid");
	var graphid = graph.options[graph.selectedIndex].value;

//	var width = document.body.clientWidth;
	var width = (window.screen.width * 0.72);
	console.log("获取屏幕的宽度=====》" + width);

	//判断时间
	if(get_time < 0) {
		alert("结束时间应大于开始时间，请重新选择时间");
	} else if(get_time < 60 || get_time > 63072000) {
		alert("时间差应在1分钟至两年之间，请重新选择时间");
	} else {
		$("#pic").css('display', 'block'); //显示div
		$("#pic").attr("length", '0');
		$("#pic").append($('<center><img src="http://114.214.164.48:8888/kangjie/kangj/chart2.php?graphid=' + graphid + '&period=' + get_time +
			'&width=' + width + '" data-preview-src="" data-preview-group="1"></img></center>'));
		//		$("#pic").append($('<img src="../images/yuantiao.jpg" data-preview-src="" data-preview-group="1" />'));
		//			'&width=900" data-preview-src="" data-preview-group="1"></img></center>'));
	}
}

/*
 * get获取触发器的描述
 */
function get_trigger_description(index, name) {

	var aSelected_Hids = '"' + index + '"';
	var get_trigger_data = {
		"jsonrpc": "2.0",
		"method": "trigger.get",
		"params": {
			"hostids": JSON.parse(aSelected_Hids)
		},
		"auth": localStorage.getItem('auth'),
		"id": 1
	};

	//执行请求，并将服务器返回的response结果转换为数组格式，并输出到指定内容上
	$.ajax({
		type: "post",
		url: httpctx,
		async: true,
		dataType: 'json', //服务器返回json数据
		contentType: 'application/json',
		timeout: 5000, //超时时间设置为5秒
		data: JSON.stringify(get_trigger_data),
		success: function(data) {
			$('#triggerid').empty();
			$('#triggerid').attr("length", '0');
			for(var i = 0; i <= data.result.length - 1; i++) {
				// replace()将触发器里面的{HOST.NAME}字符串换成对应的主机号
				$("#triggerid").append($('<option value=' + data.result[i].triggerid + '>' + data.result[i].description.replace(/{HOST.NAME}/g, name) + '</option>'));
			}
		}
	});
}

// 初始化，一点击页面，就加载出最近三天内的所有事件
function get_all_event() {

	/*
	 * 统一个位数和十位数
	 */
	function fix(num, length) {
		return('' + num).length < length ? ((new Array(length + 1)).join('0') + num).slice(-length) : '' + num;
	}
	/*
	 * 获取当前天数的之前的三天的日期
	 */
	function get_date_three() {
		var now = new Date();
		now.setDate(now.getDate() - 2);
		var SstartData = now.getFullYear() + "-" + fix((now.getMonth() + 1), 2) + "-" + fix(now.getDate(), 2) + " " + fix(now.getHours(), 2) + ":" + fix(now.getMinutes(), 2) + ":" + fix(now.getSeconds(), 2);
		return SstartData;
	}
	var now = new Date();
	var SendData = now.getFullYear() + "-" + fix((now.getMonth() + 1), 2) + "-" + fix(now.getDate(), 2) + " " + fix(now.getHours(), 2) + ":" + fix(now.getMinutes(), 2) + ":" + fix(now.getSeconds(), 2);

	// 将日期转成时间戳，用于传输数据
	var oTimeStart = document.getElementById("events_start_time");
	var oTimeEnd = document.getElementById("events_end_time");
	oTimeStart.value = get_date_three();
	oTimeEnd.value = SendData;

	var startStr = Date.parse(new Date(get_date_three()));
	startStr = '"' + startStr / 1000 + '"';
	var EndStr = Date.parse(new Date(SendData));
	EndStr = '"' + EndStr / 1000 + '"';

	Date.prototype.Format = function(fmt) {
		var o = {
			"M+": this.getMonth() + 1, // 月份 
			"d+": this.getDate(), // 日 
			"h+": this.getHours(), // 小时 
			"m+": this.getMinutes(), // 分 
			"s+": this.getSeconds(), // 秒 
			"q+": Math.floor((this.getMonth() + 3) / 3), // 季度 
			"S": this.getMilliseconds() // 毫秒 
		};
		if(/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
		for(var k in o)
			if(new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
		return fmt;
	}

	var get_event_data = {
		"jsonrpc": "2.0",
		"method": "event.get",
		"params": {
			"time_from": JSON.parse(startStr),
			"time_till": JSON.parse(EndStr),
			"sortfield": "clock", // 按照clock降序排列
			"sortorder": "DESC"
		},
		"auth": localStorage.getItem('auth'),
		"id": 1
	};

	$.ajax({
		type: "post",
		url: httpctx,
		async: true,
		dataType: 'json', // 服务器返回json数据
		contentType: 'application/json',
		timeout: 5000, // 超时时间设置为5秒
		data: JSON.stringify(get_event_data),
		success: function(data) {
			console.log("Janine.event.get.获取到的数据====》" + JSON.stringify(data));
			for(var i = 0; i <= data.result.length - 1; i++) {
				var newDate = new Date();
				newDate.setTime(data.result[i].clock * 1000);
				getTH(data.result[i].eventid, newDate.Format('yyyy-MM-dd hh:mm:ss'), data.result[i].objectid, data.result[i].acknowledged, data.result[i].value);
			}
		}
	});

	function getTH(eid, t, oid, ack, esta) {
		var get_thost_data = {
			"jsonrpc": "2.0",
			"method": "host.get",
			"params": {
				"triggerids": JSON.parse(oid)
			},
			"auth": localStorage.getItem('auth'),
			"id": 1
		};
		// 执行请求，并将服务器返回的response结果转换为数组格式，并输出到指定内容上
		$.ajax({
			type: "post",
			url: httpctx,
			async: true,
			dataType: 'json', // 服务器返回json数据
			contentType: 'application/json',
			timeout: 5000, // 超时时间设置为5秒
			data: JSON.stringify(get_thost_data),
			success: function(data) {
				//				console.log("Janine.host.get.获取到的数据====》" + JSON.stringify(data));
				for(var i = 0; i <= data.result.length - 1; i++) {
					getTD(eid, t, oid, ack, esta, data.result[i].name);
				}
			}
		});
	}

	function getTD(eid, t, oid, ack, esta, hname) {
		$('#event-table').html("");
		var trigger_get_data = {
			"jsonrpc": "2.0",
			"method": "trigger.get",
			"params": {
				"triggerids": JSON.parse(oid)
			},
			"auth": localStorage.getItem('auth'),
			"id": 1
		};

		// 执行请求，并将服务器返回的response结果转换为数组格式，并输出到指定内容上
		$.ajax({
			type: "post",
			url: httpctx,
			async: true,
			dataType: 'json', // 服务器返回json数据
			contentType: 'application/json',
			timeout: 5000, // 超时时间设置为5秒
			data: JSON.stringify(trigger_get_data),
			success: function(data) {
				//				console.log("Janine:全部查询触发器事件================》" + JSON.stringify(data));
				$('#event-table').attr("length", '0');
				for(var i = 0; i <= data.result.length - 1; i++) {
					// 转换触发器的安全类型
					var pri = "";
					var type_pri = data.result[i].priority;
					if(type_pri == 0) {
						//						pri = "not classified";
						pri = "不分类"
					} else if(type_pri == 1) {
						//						pri = "information";
						pri = "信息"
					} else if(type_pri == 2) {
						//						pri = "warning";
						pri = "警告"
					} else if(type_pri == 3) {
						//						pri = "average";
						pri = "一般严重"
					} else if(type_pri == 4) {
						//						pri = "high";
						pri = "严重"
					} else if(type_pri == 5) {
						//						pri = "disaster";
						pri = "灾难"
					}

					// 转换触发器的状态类型
					var estate = "";
					if(esta == 0) {
						estate = "正常";
					} else if(esta == 1) {
						estate = "问题";
					}

					// 是否确认状态
					var ackStr = '';
					var type_ack = ack;
					if(type_ack == 0) {
						ackStr = "否";
					} else if(type_ack == 1) {
						ackStr = "是";
					}
					$("#event-table").append($('<tr id=' + eid + 'style="border-bottom: dashed;"><td>' + t + '</td><td>' +
						data.result[i].description.replace(/{HOST.NAME}/g, hname) + '</td><td>' + estate + '</td><td>' + pri + '</td><td>' + ackStr + '</td></tr>'));
				}
			}
		});
	}

}

/*
 * 点击查询： 获取触发器事件
 */
function get_trigger_event(name, hostid, groupid, triggerid) {
	console.log("Janine：根据群组、主机、触发器和时间，加载出事件========================》");
	$('#event-table').empty();
	// 获取我们选择的群组和主机的ID值
	var aSelected_Gids = '"' + groupid + '"';
	var aSelected_Hids = '"' + hostid + '"';
	var aSelected_Tids = '"' + triggerid + '"';

	// 获取某个时间的时间戳
	var oTimeStart = document.getElementById("events_start_time");
	var oTimeEnd = document.getElementById("events_end_time");

	var sdate = new Date(oTimeStart.value);
	var edate = new Date(oTimeEnd.value)
	var get_time = (edate.getTime() - sdate.getTime()) / 1000;

	var startStr = Date.parse(sdate);
	startStr = '"' + startStr / 1000 + '"';
	var endStr = Date.parse(edate);
	endStr = '"' + endStr / 1000 + '"';

	// 判断触发器输入框内容是否为空
	var oTriggerid = document.getElementById("triggerid");

	// 触发器内容为空，即查询在时间段内所有的触发事件    	 
	if(oTriggerid.value == '') {
		alert("没有选择触发器，无法查询数据！！");
	} else if(get_time < 0) {
		alert("结束时间应大于开始时间，请重新选择时间");
	} else if(get_time < 60 || get_time > 63072000) {
		alert("时间差应在1分钟至两年之间，请重新选择时间");
	} else { // 不为空，时间差也正确，即可查询选择的触发器的事件
		var get_event_data = {
			"jsonrpc": "2.0",
			"method": "event.get",
			"params": {
				"output": "extend",
				//				"select_acknowledges": "extend",
				//				"groupids": JSON.parse(aSelected_Gids),
				//				"hostids": JSON.parse(aSelected_Hids),
				"objectids": JSON.parse(aSelected_Tids),
				"time_from": JSON.parse(startStr),
				"time_till": JSON.parse(endStr),
				"sortfield": "eventid", // 按照clock降序排列
				"sortorder": "DESC"
			},
			"auth": localStorage.getItem('auth'),
			"id": 1
		};
	}
	console.log("Janine:触发器事件的数据======》" + JSON.stringify(get_event_data));
	$.ajax({
		type: "post",
		url: httpctx,
		async: true,
		dataType: 'json', // 服务器返回json数据
		contentType: 'application/json',
		timeout: 5000, // 超时时间设置为5秒
		data: JSON.stringify(get_event_data),
		success: function(data) {
			console.log("==========1.执行无果============>" + JSON.stringify(data.result));
			if(data.result == "" || data.result == undefined) {
				$("#event-table").append($('<tr><td colspan="5"><h3 style="text-align:center;">没有查到相应数据！！！</h3></td></tr>'));
			} else {
				for(var i = 0; i <= data.result.length - 1; i++) {
					var newDate = new Date();
					newDate.setTime(data.result[i].clock * 1000);
					getTD(data.result[i].eventid, newDate.Format('yyyy-MM-dd hh:mm:ss'), data.result[i].objectid, data.result[i].acknowledged, data.result[i].value);

				}
			}
		}
	});

	function getTD(eid, t, oid, ack, esta) {
		$('#event-table').html("");
		var trigger_get_data = {
			"jsonrpc": "2.0",
			"method": "trigger.get",
			"params": {
				"triggerids": JSON.parse(oid)
			},
			"auth": localStorage.getItem('auth'),
			"id": 1
		};

		//执行请求，并将服务器返回的response结果转换为数组格式，并输出到指定内容上
		$.ajax({
			type: "post",
			url: httpctx,
			async: true,
			dataType: 'json', //服务器返回json数据
			contentType: 'application/json',
			timeout: 5000, //超时时间设置为5秒
			data: JSON.stringify(trigger_get_data),
			success: function(data) {
				console.log("==========2.执行无果============>" + JSON.stringify(data));
				$('#event-table').attr("length", '0');
				for(var i = 0; i <= data.result.length - 1; i++) {
					// 转换触发器的安全类型
					var pri = "";
					var type_pri = data.result[i].priority;
					if(type_pri == 0) {
						//						pri = "not classified";
						pri = "不分类"
					} else if(type_pri == 1) {
						//						pri = "information";
						pri = "信息"
					} else if(type_pri == 2) {
						//						pri = "warning";
						pri = "警告"
					} else if(type_pri == 3) {
						//						pri = "average";
						pri = "一般严重"
					} else if(type_pri == 4) {
						//						pri = "high";
						pri = "严重"
					} else if(type_pri == 5) {
						//						pri = "disaster";
						pri = "灾难"
					}

					// 转换触发器的状态类型
					var estate = "";
					if(esta == 0) {
						estate = "正常";
					} else if(esta == 1) {
						estate = "问题";
					}

					// 是否确认状态
					var ackStr = '';
					var type_ack = ack;
					if(type_ack == 0) {
						ackStr = "否";
					} else if(type_ack == 1) {
						ackStr = "是";
					}

					$("#event-table").append($('<tr id=' + eid + 'style="border-bottom: dashed;"><td>' + t + '</td><td>' +
						data.result[i].description.replace(/{HOST.NAME}/g, name) + '</td><td>' + estate + '</td><td>' + pri + '</td><td>' + ackStr + '</td></tr>'));
				}

			}
		});
	}

}

/*
 * 获取自动发现规则
 * */
function get_ruler() {
	var get_ruler_data = {
		"jsonrpc": "2.0",
		"method": "drule.get",
		"params": {
			"output": "extend",
			"selectDChecks": "extend"
		},
		"auth": localStorage.getItem("auth"),
		"id": 1
	};
	$.ajax({
		type: 'post',
		url: httpctx,
		async: true,
		dataType: 'json',
		contentType: 'application/json',
		timeout: 5000,
		data: JSON.stringify(get_ruler_data),
		success: function(data) {
			$("#select_real_ruler").empty();
			$('#select_real_ruler').attr("length", '0');
			for(var i = 0; i <= data.result.length - 1; i++) {
				$("#select_real_ruler").append($('<option value=' + data.result[i].druleid + '>' + data.result[i].name + '</option>'));
			}

			var item = $("#select_real_ruler").val();
			get_dhost(item);
			// 绑定点击事件
			$("#select_real_ruler").change(function() {
				item = $("#select_real_ruler").val();
				get_dhost(item);
			});
		},
		// 数据传输失败，可能是发送的地址有问题，或服务器自身的问题，例如：服务器没有启动
		error: function(xhr, type, errorThrown) {
			mui.toast("服务器出错！");
		},
	});
}

/*Linda:获取发现规则对应的设备*/
function get_dhost(druleid) {
	/*
	 * 统一个位数和十位数
	 */
	function fix(num, length) {
		return('' + num).length < length ? ((new Array(length + 1)).join('0') + num).slice(-length) : '' + num;
	}

	// 将时间戳转化成2014-06-18 10:33:24的格式
	function timestampToTime(timestamp) {
		var date = new Date(timestamp * 1000); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
		Y = date.getFullYear() + '-';
		M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
		D = date.getDate() + ' ';
		h = date.getHours() + ':';
		m = date.getMinutes() + ':';
		s = date.getSeconds();
		return Y + M + D + h + m + s;
	}

	function GetDateDiff(oldtime, newdate) {
		var startTime = new Date(Date.parse(oldtime.replace(/-/g, "/"))).getTime();
		var endTime = new Date(Date.parse(newdate.replace(/-/g, "/"))).getTime();

		var differ_day = endTime - startTime; // 时间差秒
		var days = Math.floor(differ_day / (1000 * 3600 * 24)); // 计算出相差的天数

		var differ_hours = differ_day % (24 * 3600 * 1000); // 计算天数后剩余的毫秒数
		var hours = Math.floor(differ_hours / (3600 * 1000));

		var differ_min = differ_hours % (3600 * 1000); // 计算小时数后剩余的毫秒数
		var minutes = Math.floor(differ_min / (60 * 1000));

		var differ_sec = differ_min % (60 * 1000); // 计算分钟数后剩余的毫秒数
		var seconds = Math.round(differ_sec / 1000);
		return days + "天" + "," + hours + ":" + minutes + ":" + seconds;
	}

	var get_dhost = {
		"jsonrpc": "2.0",
		"method": "dhost.get",
		"params": {
			"output": "extend",
			"selectDServices": "extend",
			"druleids": JSON.parse(druleid)
		},
		"auth": localStorage.getItem("auth"),
		"id": 1

	};
	$.ajax({
		type: 'post',
		url: httpctx,
		async: true,
		dataType: 'json',
		contentType: 'application/json',
		timeout: 5000,
		data: JSON.stringify(get_dhost),
		success: function(data) {
			console.log("Janine:get_dhost(druleid).JSON.stringify(get_dhost)=======》" + JSON.stringify(data));
			$('#discover_table').empty();
			$('#discover_table').attr("length", '0');

			if(data.result == "" || data.result == undefined) {
				$('#discover_table').append($('<tr><td <td colspan="4"><h4 style="text-align:center;">没有查到相应数据！！！</h4></td></tr>'));
			} else {
				// 获取当前天数
				var now = new Date();
				var newdate = now.getFullYear() + "-" + fix((now.getMonth() + 1), 2) + "-" + fix(now.getDate(), 2) + " " + fix(now.getHours(), 2) + ":" + fix(now.getMinutes(), 2) + ":" + fix(now.getSeconds(), 2);
				for(var i = 0; i <= data.result.length - 1; i++) {

					if(data.result[i].status == 1) {
						var last = data.result[i].dservices[0].lastdown - data.result[i].dservices[0].lastup;
						var last_time = Math.abs(last); // 时间差
						var oldtime = timestampToTime(last_time);
						console.log("相差的天数：" + last + "," + last_time + "," + oldtime);
						//						GetDateDiff(oldtime, newdate);
						$('#discover_table').append($('<tr><td>' + data.result[i].dservices[0].ip + '</td><td></td><td>' + GetDateDiff(oldtime, newdate) + '</td><td style="background:red;"></td></tr>'));
						//						$('#discover_table').append($('<tr><td>' + data.result[i].dservices[0].ip + '</td><td></td><td>' + data.result[i].dservices[0].lastup + '</td><td style="background:red;"></td></tr>'));
					} else {
						var last = data.result[i].dservices[0].lastdown - data.result[i].dservices[0].lastup;
						var last_time = Math.abs(last); // 时间差
						var oldtime = timestampToTime(last_time);
						//						GetDateDiff(oldtime, newdate);
						$('#discover_table').append($('<tr><td>' + data.result[i].dservices[0].ip + '</td><td></td><td>' + GetDateDiff(oldtime, newdate) + '</td><td style="background:limegreen;"></td></tr>'));
						//						$('#discover_table').append($('<tr><td>' + data.result[i].dservices[0].ip + '</td><td></td><td>' + data.result[i].dservices[0].lastup + '</td><td style="background:limegreen;"></td></tr>'));
					}

				}
			}

		},
		// 数据传输失败，可能是发送的地址有问题，或服务器自身的问题，例如：服务器没有启动
		error: function(xhr, type, errorThrown) {
			// alert("Janine:error--->" +"xhr:" + JSON.stringify(xhr));
			mui.toast("服务器出错！");
		},
	});

}

/*4.获取触发器*/
function get_trigger_state(group, host, state, ack, priority) {
	console.log("Janine：get_trigger_state()===============>" + group + "," + host + "," + state + "," + priority);

	// 需要发送的JSON数据
	var get_trigger_data = {
		"jsonrpc": "2.0",
		"method": "trigger.get",
		"params": {
			"output": "extend",
			"withUnacknowledgedEvents": (ack == 2) ? true : null, // 有未确认的事件
			"withLastEventUnacknowledged": (ack == 3) ? true : null,
			"min_severity": (state > 2) ? state : null,
			"filter": {
				"priority": priority
			},
			"only_true": (state == 1) ? true : null,
			"group": group,
			"host": host,
			"sortfield": "priority",
			"sortorder": "DESC"
		},
		"auth": localStorage.getItem("auth"),
		"id": 1

	};
	console.log("Janine：JSON.stringify(get_trigger_data)===============>" + JSON.stringify(get_trigger_data));

	$.ajax({
		type: 'post',
		url: httpctx,
		async: true,
		dataType: 'json',
		contentType: 'application/json',
		timeout: 5000,
		data: JSON.stringify(get_trigger_data),
		//		data.result[i].description.replace(/{HOST.NAME}/g, name)
		success: function(data) {
			console.log("Janine：JSON.stringify(data)===============>" + JSON.stringify(data));
			$("#trigger_table").empty();
			for(var i = 0; i <= data.result.length - 1; i++) {
				//				$("#trigger_table").append($('<tr><td>' + data.result[i].description.replace(/{HOST.NAME}/g, host) + '</td><td style="text-align:center;">' + ackArr[data.result[i].value] + '</td><td style="background:' + bgColor[(data.result[i].priority) - 1] + '">' + degree[data.result[i].priority - 1] + '</td></tr>'));
				get_list(data.result[i].triggerid, data.result[i].description.replace(/{HOST.NAME}/g, host), data.result[i].priority);
			}
		},
		// 数据传输失败，可能是发送的地址有问题，或服务器自身的问题，例如：服务器没有启动
		error: function(xhr, type, errorThrown) {
			mui.toast("服务器出错！");
		},
	});

}

function get_list(triggerid, description_host, priority) {

	var bgColor = ["#59DB8F", "#7499FF", "#FFC859", "#E67457", "#E45959"];
	var degree = ["信息", "警告", "一般严重", "严重", "灾难"];
	var ackArr = ["", "✔"];
	var get_trigger_ack_data = {
		"jsonrpc": "2.0",
		"method": "event.get",
		"params": {
			"output": ["acknowledged"],
			"objectids": JSON.parse(triggerid),
			"sortorder": "DESC"
		},
		"auth": localStorage.getItem("auth"),
		"id": 1
	}
	console.log("Janine：JSON.stringify(get_trigger_data)===============>" + JSON.stringify(get_trigger_ack_data));

	$.ajax({
		type: 'post',
		url: httpctx,
		async: true,
		dataType: 'json',
		contentType: 'application/json',
		timeout: 5000,
		data: JSON.stringify(get_trigger_ack_data),
		success: function(data) {
			$('#trigger_table').attr("length", '0');
			if(data.result == "" || data.result == undefined) {
				$("#trigger_table").append($('<tr><td>' + description_host + '</td><td style="text-align:center;">' + ackArr[0] + '</td><td style="background:' + bgColor[priority - 1] + '">' + degree[priority - 1] + '</td></tr>'));
			} else {
				$("#trigger_table").append($('<tr><td>' + description_host + '</td><td style="text-align:center;">' + ackArr[data.result[0].acknowledged] + '</td><td style="background:' + bgColor[priority - 1] + '">' + degree[priority - 1] + '</td></tr>'));
			}

		},
		// 数据传输失败，可能是发送的地址有问题，或服务器自身的问题，例如：服务器没有启动
		error: function(xhr, type, errorThrown) {
			mui.toast("服务器出错！");
		},
	});
}
/**
 * 退出方法
 */
function user_logout() {
	var user_logout_data = {
		"jsonrpc": "2.0",
		"method": "user.logout",
		"params": [],
		"id": 1,
		"auth": localStorage.getItem("auth")
	};
	console.log("user_logout_data====>" + JSON.stringify(user_logout_data));
	/**Janine:登录数据请求**/
	$.ajax({
		type: 'post',
		url: httpctx,
		async: true,
		dataType: 'json', //服务器返回json格式数据
		contentType: 'application/json',
		timeout: 5000, //超时时间设置为5秒
		data: JSON.stringify(user_logout_data), // 将字符串转成JSON
		// 发送数据成功
		success: function(data) {
			alert("Janine:退出===返回结果===>" + data.result);
			if(data.result != undefined && data.result == true) {
				localStorage.clear("auth");
				localStorage.getItem("auth");
				window.location.href = "login.html"; // 进行页面跳转

			}
		},
		// 发送数据失败
		error: function(xhr, type, errorThrown) {
			// Janine
			// alert("Janine:error--->" + "xhr:" + JSON.stringify(xhr));
			alert("服务器出错！");

		},

	});
}