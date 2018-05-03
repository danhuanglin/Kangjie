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
			//Janine:获取用户名和密码的input框的值
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
		dataType: 'json', //服务器返回json格式数据
		contentType: 'application/json',
		timeout: 5000, //超时时间设置为5秒
		data: JSON.stringify(user_login_data), // 将字符串转成JSON
		// 发送数据成功
		success: function(data) {
			// alert("Janine:返回结果===>" + data.result);
			if(data.result != undefined) {
				// Janine:获取到data中的result的auth，用于给用户授权
				var auth = data.result;
				localStorage.setItem("auth", auth); // 存储auth的值
				window.location.href = "html/tab-webview-main.html"; // 进行页面跳转

			} else if(data.result == undefined) {
				if(data.error.code == -32602 && data.error.data == "Login name or password is incorrect.") {
					alert("用户名或密码错误！");
					// alert("2");
				} else {
					alert("登录失败");
					// alert("3");
				}
			}
		},
		// 发送数据失败
		error: function(xhr, type, errorThrown) {
			// Janine
			// alert("Janine:error--->" +"xhr:" + JSON.stringify(xhr));
//			alert("服务器出错！");

		},

	});
}

///////////////////////////////////////////////////////////////////获取主机，并执行三级联动////////////////////////////////////////////////////////////////////////
/*
 * hostgroup.get : 获取主机群组
 */
function hostgroup_getName() {
	console.log("Janine:获取主机群组========================" + "1");
	var hostgroup_get_data = {
		"jsonrpc": "2.0",
		"method": "hostgroup.get",
		"params": {
			"output": "extend",
			"real_hosts": true // 包含主机的群组

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
		data: JSON.stringify(hostgroup_get_data),
		success: function(data) {
			$('#groupid').attr("length", '0');
			for(var i = 0; i <= data.result.length - 1; i++) {
				$("#groupid").append($('<option value=' + data.result[i].groupid + '>' + data.result[i].name + '</option>'));
			}
		}
	});
}

var host_getName_data = {
	"jsonrpc": "2.0",
	"method": "host.get",
	"params": {
		"output": "extend",
		"monitored_hosts": true //仅返回受监视的主机
	},
	"auth": localStorage.getItem('auth'),
	"id": 1
};

/*
 * 获取主机id
 */
function host_getName(host_data) {
	console.log("Janine：获取主机========================" + "2");
	/**
	 * 发送请求request，根据主机群组ID，获取主机名字
	 */

	$.ajax({
		type: "post",
		url: httpctx,
		async: true,
		dataType: 'json', //服务器返回json数据
		contentType: 'application/json',
		timeout: 5000, //超时时间设置为5秒
		data: JSON.stringify(host_data),
		success: function(data) {
			$('#hostid').attr("length", '0');
			for(var i = 0; i <= data.result.length - 1; i++) {
				$("#hostid").append($('<option value=' + data.result[i].hostid + '>' + data.result[i].name + '</option>'));
			}
			get_graph_byhostids(data.result[1].hostid);
			//			trigger_getDescription(data.result[1].hostid, data.result[1].name);
		}
	});
}

/*
 * 群组select框点击事件。获取对应主机值
 */
function Groupid_click(selectedGroupid) {
	console.log("Janine：点击群组，使主机获取联动========================" + "3");
	var aSelected_Gids = '"' + selectedGroupid + '"';
	if(selectedGroupid == 0) {
		host_getName();
	}
	var SeHostid_data = {
		"jsonrpc": "2.0",
		"method": "host.get",
		"params": {
			"groupids": JSON.parse(aSelected_Gids),
			"getAccess": "flag"

		},
		"auth": localStorage.getItem('auth'),
		"id": 1
	};
	$("#hostid").append($('<option value="0">所有</option>'));
	$("#graphid").append($('<option value="0">所有</option>'));
	host_getName(SeHostid_data);
}

// 发送请求request，获取触发器的描述
function trigger_getDescription(index, name) {
	console.log("获取触发器的描述========================》" + "4");
	$("#triggerid").html("<option value='' selected>所有</option>");
	var aSelected_Hids = '"' + index + '"';
	var trigger_get_data = {
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
		data: JSON.stringify(trigger_get_data),
		success: function(data) {
			console.log("触发器======》" + JSON.stringify(data));

			$('#triggerid').attr("length", '0');
			for(var i = 0; i <= data.result.length - 1; i++) {
				// replace()将触发器里面的{HOST.NAME}字符串换成对应的主机号
				$("#triggerid").append($('<option value=' + data.result[i].triggerid + '>' + data.result[i].description.replace(/{HOST.NAME}/g, name) + '</option>'));
			}
			//			$("#triggerid").find("option:contains(" + data.result[1].description.replace(/{HOST.NAME}/g, name) + ")").attr("selected", true); // 选择第二个值
		}
	});
}

// 初始化，一点击页面，就加载出最近三天内的所有事件
function getAllEvent() {

	function fix(num, length) {
		return('' + num).length < length ? ((new Array(length + 1)).join('0') + num).slice(-length) : '' + num;
	}

	function getdatethree() {
		var now = new Date();
		now.setDate(now.getDate() - 2); //获取AddDayCount天后的日期
		var SstartData = now.getFullYear() + "-" + fix((now.getMonth() + 1), 2) + "-" + fix(now.getDate(), 2) + " " + fix(now.getHours(), 2) + ":" + fix(now.getMinutes(), 2) + ":" + fix(now.getSeconds(), 2);
		return SstartData;
	}
	var now = new Date();
	//	var SstartData = now.getFullYear() + "-" + fix((now.getMonth() + 1), 2) + "-" + fix(now.getDate() - 3, 2) + " " + fix(now.getHours(), 2) + ":" + fix(now.getMinutes(), 2) + ":" + fix(now.getSeconds(), 2);
	var SendData = now.getFullYear() + "-" + fix((now.getMonth() + 1), 2) + "-" + fix(now.getDate(), 2) + " " + fix(now.getHours(), 2) + ":" + fix(now.getMinutes(), 2) + ":" + fix(now.getSeconds(), 2);

	// 获取某个时间的时间戳
	var oTimeStart = document.getElementById("events_start_time");
	var oTimeEnd = document.getElementById("events_end_time");
	oTimeStart.value = getdatethree();
	oTimeEnd.value = SendData;

	var startStr = Date.parse(new Date(getdatethree()));
	startStr = '"' + startStr / 1000 + '"';
	var EndStr = Date.parse(new Date(SendData));
	EndStr = '"' + EndStr / 1000 + '"';

	Date.prototype.Format = function(fmt) {
		var o = {
			"M+": this.getMonth() + 1, //月份 
			"d+": this.getDate(), //日 
			"h+": this.getHours(), //小时 
			"m+": this.getMinutes(), //分 
			"s+": this.getSeconds(), //秒 
			"q+": Math.floor((this.getMonth() + 3) / 3), //季度 
			"S": this.getMilliseconds() //毫秒 
		};
		if(/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
		for(var k in o)
			if(new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
		return fmt;
	}

	var event_getData = {
		"jsonrpc": "2.0",
		"method": "event.get",
		"params": {
			"time_from": JSON.parse(startStr),
			"time_till": JSON.parse(EndStr),
			"sortfield": "clock", //按照clock降序排列
			"sortorder": "DESC"
		},
		"auth": localStorage.getItem('auth'),
		"id": 1
	};

	$.ajax({
		type: "post",
		url: httpctx,
		async: true,
		dataType: 'json', //服务器返回json数据
		contentType: 'application/json',
		timeout: 5000, //超时时间设置为5秒
		data: JSON.stringify(event_getData),
		success: function(data) {
			console.log("事件的数据===》" + JSON.stringify(data));
			for(var i = 0; i <= data.result.length - 1; i++) {
				var newDate = new Date();
				newDate.setTime(data.result[i].clock * 1000);
				getTH(data.result[i].eventid, newDate.Format('yyyy-MM-dd hh:mm:ss'), data.result[i].objectid, data.result[i].acknowledged, data.result[i].value);
			}
		}
	});

	function getTH(eid, t, oid, ack, esta) {
		var get_THost = {
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
			dataType: 'json', //服务器返回json数据
			contentType: 'application/json',
			timeout: 5000, //超时时间设置为5秒
			data: JSON.stringify(get_THost),
			success: function(data) {
				for(var i = 0; i <= data.result.length - 1; i++) {
					getTD(eid, t, oid, ack, esta, data.result[i].name);
				}
			}
		});
	}

	function getTD(eid, t, oid, ack, esta, hname) {
		console.log("执行顺序========================》" + "7");
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
			dataType: 'json', // 服务器返回json数据
			contentType: 'application/json',
			timeout: 5000, // 超时时间设置为5秒
			data: JSON.stringify(trigger_get_data),
			success: function(data) {
				console.log("全部查询触发器事件================》" + JSON.stringify(data));
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
					//					var estate = "";
					//					if(esta == 0) {
					//						estate = "正常";
					//					} else if(esta == 1) {
					//						estate = "问题";
					//					}

					// 是否确认状态
					var ackStr = '';
					var type_ack = ack;
					if(type_ack == 0) {
						ackStr = "否";
					} else if(type_ack == 1) {
						ackStr = "是";
					}

					$("#event-table").append($('<tr id=' + eid + 'style="border-bottom: dashed;"><td>' + t + '</td><td>' +
						data.result[i].description.replace(/{HOST.NAME}/g, hname) + '</td><td>' + pri + '</td><td>' + ackStr + '</td></tr>'));
				}

			}

		});
	}

}

// 根据群组、主机、触发器和时间，加载出事件
function getTriggerEvent(name, hostid, groupid, triggerid) {
	console.log("根据群组、主机、触发器和时间，加载出事件========================" + "8");

	//获取我们选择的群组和主机的ID值
	var aSelected_Gids = '"' + groupid + '"';
	var aSelected_Hids = '"' + hostid + '"';
	var aSelected_Tids = '"' + triggerid + '"';

	//获取某个时间的时间戳
	var oTimeStart = document.getElementById("events_start_time");
	var oTimeEnd = document.getElementById("events_end_time");
	var startStr = Date.parse(new Date(oTimeStart.value));
	startStr = '"' + startStr / 1000 + '"';
	var EndStr = Date.parse(new Date(oTimeEnd.value));
	EndStr = '"' + EndStr / 1000 + '"';

	// 判断触发器输入框内容是否为空
	var oTriggerid = document.getElementById("triggerid");

	// 触发器内容为空，即查询在时间段内所有的触发事件    	 
	if(oTriggerid.value == '') {
		alert("没有选择触发器，无法查询数据！！");
	}
	// 不为空，即查询选择的触发器的事件
	else {
		var event_getData = {
			"jsonrpc": "2.0",
			"method": "event.get",
			"params": {
				"output": "extend",
				"select_acknowledges": "extend",
				"groupids": JSON.parse(aSelected_Gids),
				"hostids": JSON.parse(aSelected_Hids),
				"objectids": JSON.parse(aSelected_Tids),
				"time_from": JSON.parse(startStr),
				"time_till": JSON.parse(EndStr),
				"sortfield": "eventid", //按照clock降序排列
				"sortorder": "DESC"
			},
			"auth": localStorage.getItem('auth'),
			"id": 1
		};
	}
	console.log("数据传输查询触发器事件===" + JSON.stringify(event_getData));
	$.ajax({
		type: "post",
		url: httpctx,
		async: true,
		dataType: 'json', //服务器返回json数据
		contentType: 'application/json',
		timeout: 5000, //超时时间设置为5秒
		data: JSON.stringify(event_getData),
		success: function(data) {

			for(var i = 0; i <= data.result.length - 1; i++) {
				var newDate = new Date();
				newDate.setTime(data.result[i].clock * 1000);
				getTD(data.result[i].eventid, newDate.Format('yyyy-MM-dd hh:mm:ss'), data.result[i].objectid, data.result[i].acknowledged, data.result[i].value);

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

					//转换触发器的状态类型
					//					var estate = "";
					//					if(esta == 0) {
					//						estate = "正常";
					//					} else if(esta == 1) {
					//						estate = "问题";
					//					}

					// 是否确认状态
					var ackStr = '';
					var type_ack = ack;
					if(type_ack == 0) {
						ackStr = "否";
					} else if(type_ack == 1) {
						ackStr = "是";
					}

					$("#event-table").append($('<tr id=' + eid + 'style="border-bottom: dashed;"><td>' + t + '</td><td>' +
						data.result[i].description.replace(/{HOST.NAME}/g, name) + '</td><td>' + pri + '</td><td>' + ackStr + '</td></tr>'));
				}
			}
		});
	}

}

// 警报确认信息弹框
function setEventAck(eid, oid, esta, ack) {
	console.log("执行顺序========================" + "10");
	var oRadio = $('input[name="selectAck"]:checked').val();
	var oModalAck = document.getElementById('modal-ack');
	var oAclose = document.getElementById('ack-close');
	oModalAck.style.display = "block";
	// 点击 <span> (x), 关闭弹窗
	oAclose.onclick = function() {
		oModalAck.style.display = "none";
	}
	// 在用户点击其他地方时，关闭弹窗
	window.onclick = function(event) {
		if(event.target == oModalAck) {
			oModalAck.style.display = "none";
		}
	}
	$("#ack-history").html('');
	$("#ack-message").val('');

	//点击某一条事件确认时，获取此事件的历史确认消息加载到弹框的历史记录里面
	var getAckHistoryData = {
		"jsonrpc": "2.0",
		"method": "event.get",
		"params": {
			"output": ["acknowledges"],
			"select_acknowledges": "extend",
			"eventids": JSON.parse(eid)
		},
		"auth": localStorage.getItem('auth'),
		"id": 1
	};
	$.ajax({
		type: "post",
		url: httpctx,
		async: true,
		dataType: 'json', //服务器返回json数据
		contentType: 'application/json',
		timeout: 5000, //超时时间设置为5秒
		data: JSON.stringify(getAckHistoryData),
		success: function(data) {
			$('#ack-history').attr("length", '0');
			for(var j = 0; j < data.result[0].acknowledges.length; j++) {
				var newDate = new Date();
				newDate.setTime(data.result[0].acknowledges[j].clock * 1000);
				$("#ack-history").append($('<tr id=' + data.result[0].acknowledges[j].acknowledgeid + '><td>' + newDate.format('yyyy-MM-dd h:m:s') + '</td><td>' +
					data.result[0].acknowledges[j].alias + ' ( ' + data.result[0].acknowledges[j].name + ' ' + data.result[0].acknowledges[j].surname + ' )</td><td>' + data.result[0].acknowledges[j].message + '</td></tr>'));
			}
		}
	});
	//清除之前的单选按钮的可选样式
	var aRadInit = document.getElementsByName('selectAck');
	for(var i = 0; i < aRadInit.length; i++) {
		aRadInit[i].disabled = false;
	}

	getUnAckQues(oid, 1);
	getUnAck(oid, 2);

	//警报确认，点击确定按钮，向数据库提交我们填写的信息和单选的选择
	var oAckSubmit = document.getElementById("ack-submit");
	oAckSubmit.onclick = function() {
		var oAckMessage = document.getElementById("ack-message").value;
		//数据提交之前，先判断文本域内的内容是否为空！
		oAckMessage = '"' + oAckMessage + '"';
		if(oAckMessage == '""') {
			alert("消息文本框内为空，请填写内容！");
		} else if(oRadio == 'one-Ack') {
			setAckMessage(eid);
		} else if(oRadio == 'all-unAckQues') {
			//当点击选择和所有未确认问题的事件单选时,先从触发器接口中获得status=1即有问题的触发器ID，然后将值传给event。get中objectID
			getUnAckQues(oid, 1);
		} else if(oRadio == 'all-unAck') {
			//当点击选择和所有未确认事件的单选按钮时，先从事件接口中获得事件的ID，存入数据中
			getUnAck(oid, 2);
		}

	};

}

// 加载时，先判断是否有未确认问题的事件，要是没有，设置单选按钮为不可选
function getUnAckQues(oid, index) {
	console.log("执行顺序========================" + "11");
	var aRad = document.getElementsByName('selectAck')[index];
	var oAckMessage = document.getElementById("ack-message").value;
	//数据提交之前，先判断文本域内的内容是否为空！
	oAckMessage = '"' + oAckMessage + '"';
	var aEventids = [];
	var getEventidArr = {
		"jsonrpc": "2.0",
		"method": "event.get",
		"params": {
			"objectids": JSON.parse(oid),
			"acknowledged": "0",
			"value": "1"
		},
		"auth": localStorage.getItem('auth'),
		"id": 1
	};
	$.ajax({
		type: 'post',
		url: httpctx,
		async: true,
		dataType: 'json', //服务器返回json格式数据
		contentType: 'application/json',
		timeout: 5000, //超时时间设置为5秒
		data: JSON.stringify(getEventidArr),
		success: function(data) {
			//			alert("getUnAckQues===============>" + data.result.length);
			$('#all-unAckQues').html(data.result.length);
			if(data.result.length == 0) {
				aRad.disabled = true;
			} else if(oAckMessage != '""') {
				for(var i = 0; i <= data.result.length - 1; i++) {
					aEventids[i] = '"' + data.result[i].eventid + '"';
				}
				setAckMessage(aEventids);
			}

		}
	});
}

//加载时，先判断是否有未确认的事件，结果为否，设置单独按按钮为不可选
function getUnAck(oid, index) {
	console.log("执行顺序========================" + "12");
	var aRad = document.getElementsByName('selectAck')[index];
	var oAckMessage = document.getElementById("ack-message").value;
	oAckMessage = '"' + oAckMessage + '"';
	var aEventids = [];
	var getEventidArr = {
		"jsonrpc": "2.0",
		"method": "event.get",
		"params": {
			"objectids": JSON.parse(oid),
			"acknowledged": "0"
		},
		"auth": localStorage.getItem('auth'),
		"id": 1
	};
	$.ajax({
		type: 'post',
		url: httpctx,
		async: true,
		dataType: 'json', //服务器返回json格式数据
		contentType: 'application/json',
		timeout: 5000, //超时时间设置为5秒
		data: JSON.stringify(getEventidArr),
		success: function(data) {
			//			alert("getUnAck===============>" + data.result.length);
			$('#all-unAck').html(data.result.length);
			if(data.result.length == 0) {
				aRad.disabled = true;
			} else if(oAckMessage != '""') {
				for(var i = 0; i <= data.result.length - 1; i++) {
					aEventids[i] = '"' + data.result[i].eventid + '"';
				}
				setAckMessage(aEventids);
			}

		}
	});
}

//设置 变量eventID传参，从event.acknowledge
function setAckMessage(eventid) {
	console.log("执行顺序========================" + "13");
	var selected_Gid = document.getElementById("groupid");
	var oModalAck = document.getElementById('modal-ack');
	var oAckMessage = document.getElementById("ack-message").value;
	oAckMessage = '"' + oAckMessage + '"';
	var setDataAck = {
		"jsonrpc": "2.0",
		"method": "event.acknowledge",
		"params": {
			"eventids": JSON.parse(eventid),
			"message": JSON.parse(oAckMessage)
		},
		"auth": localStorage.getItem('auth'),
		"id": 1
	};
	$.ajax({
		type: 'post',
		url: httpctx,
		async: true,
		dataType: 'json', //服务器返回json格式数据
		contentType: 'application/json',
		timeout: 5000, //超时时间设置为5秒
		data: JSON.stringify(setDataAck),
		success: function(data) {
			if(data.result != undefined) {
				//数据发送成功后隐藏弹框，并重新加载数据，相当于刷新页面
				oModalAck.style.display = "none";
				oEventTab.innerHTML = '';
				if(selected_Gid.value == 0) {
					getAllEvent();
				} else {
					getTriggerEvent();
				}

			} else if(data.result == undefined) {
				alert("您还未填写信息！");
			} else {
				alert("数据请求错误！");
			}
		}
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

/**
 * Linda:该文件用于公用的一些数据请求
 */
/*1.获取主机群组*/
function get_real_hosts() {
	console.log("hello,get_real_hosts()");
	// 需要发送的JSON数据
	var get_real_hosts = {
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
		type: 'post', // 数据的传输方式为post
		url: httpctx, // 数据的传输地址
		async: true, // 是否进行异步通信
		dataType: 'json', // 服务器返回json格式数据
		contentType: 'application/json', // 数据的内容类型为application/json
		timeout: 5000, // 超时时间设置为5秒
		data: JSON.stringify(get_real_hosts), // 将字符串转成JSON
		// 数据传输成功后，返回结果，对结果进行相应的操作
		success: function(data) {
			// 使用for循环，在下拉框中，显示数据
			//$('#select_hosts').attr("length", '0');
			for(var i = 0; i <= data.result.length - 1; i++) {
				$("#select_hosts").append($('<option value=' + data.result[i].groupid + '>' + data.result[i].name + '</option>'));
			}
			var item = $("#select_hosts").val();
			get_host_name(item);
			// 绑定点击事件
			$("#select_hosts").change(function() {
				item = $("#select_hosts").val();
				get_host_name(item);
			});
		},
		// 数据传输失败，可能是发送的地址有问题，或服务器自身的问题，例如：服务器没有启动
		error: function(xhr, type, errorThrown) {
			console.log("服务器出错！");
		},
	});
}

/*2.获取主机群组对应的主机*/
function get_host_name(groupid) {
	console.log("hello,get_host_name()");

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
			$('#host_name').empty();
			// 使用for循环，在下拉框中，显示数据
			$('#host_name').attr("length", '0');
			for(var i = 0; i <= data.result.length - 1; i++) {
				console.log("Janine:get_host_name().success.data.result[" + i + "]===>" + data.result[i].name);
				$("#host_name").append($('<option value=' + data.result[i].hostid + '>' + data.result[i].name + '</option>'));
			}
			// 绑定点击事件
			$("#host_name").change(function() {
				console.log("xjl--------------" + $("#host_name").val());
				var item = $("#host_name").val();
				//get_application(item);
			});
		},
		// 数据传输失败，可能是发送的地址有问题，或服务器自身的问题，例如：服务器没有启动
		error: function(xhr, type, errorThrown) {
			// alert("Janine:error--->" +"xhr:" + JSON.stringify(xhr));
			console.log("服务器出错！");
		},
	});

}

/*4.获取触发器*/

function get_trigger(group, host, state) {
	console.log("hello,get_trigger()");
	var bgColor = ["#59DB8F", "#7499FF", "#FFC859", "#E67457", "#E45959"];
	// 需要发送的JSON数据
	var get_trigger = {
		"jsonrpc": "2.0",
		"method": "trigger.get",
		"params": {
			"output": [
				"triggerid",
				"description",
				"priority"

			],

			"filter": {
				"value": 0,
				"state": state,
			},

			"group": group,
			"host": host,
			"sortfield": "priority",
			"sortorder": "DESC"
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
		data: JSON.stringify(get_trigger), // 将字符串转成JSON
		// 数据传输成功后，返回结果，对结果进行相应的操作
		success: function(data) {
			$('#trigger_table').attr("length", '0');
			$("#trigger_table").append($('<tr><th style="width:90%;">触发器</th><th>状况</th></tr>'));
			$("#trigger_table").append($('</tr>'));
			for(var i = 0; i <= data.result.length - 1; i++) {
				$("#trigger_table").append($('<tr><td >' + data.result[i].description + '</td><td style="background:' + bgColor[(data.result[i].priority) - 1] + '">' + data.result[i].priority + '</td></tr>'));

			}
			// 绑定点击事件
			$("#trigger_table").change(function() {
				console.log("xjl--------------" + $("#trigger_table").val());
				var item = $("#trigger_table").val();
				get_application(item);
			});
		},
		// 数据传输失败，可能是发送的地址有问题，或服务器自身的问题，例如：服务器没有启动
		error: function(xhr, type, errorThrown) {
			console.log("服务器出错！");
		},
	});

}



/**
 * 获得主机对应的图
 * hostids —— Return only graphs that belong to the given hosts.
 * 仅返回属于给定主机的图
 */
function get_graph_byhostids(hostid) {
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
		},
		// 数据传输失败，可能是发送的地址有问题，或服务器自身的问题，例如：服务器没有启动
		error: function(xhr, type, errorThrown) {
			console.log("服务器出错！");

		},

	});
}

///////////////////////////////////////////////////////////////////获取起始页的图片////////////////////////////////////////////////////////////////////////
function getSingleGraph() {
	function fix(num, length) {
		return('' + num).length < length ? ((new Array(length + 1)).join('0') + num).slice(-length) : '' + num;
	}

	function getdatethree() {
		var now = new Date();
		now.setDate(now.getDate() - 2); //获取AddDayCount天后的日期
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
	var graphid = $("#graphid").find("option:selected").val();
	
	ShowDiv(graphid);
}

function ShowDiv(graphid) {
	console.log("点击查询图像======");

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
	var graphid =graph.options[graph.selectedIndex].value;
	$("#pic").empty();
	
	//判断时间
	if(get_time < 0) {
		alert("结束时间应大于开始时间，请重新选择时间");
	} else if(get_time < 60 || get_time > 63072000) {
		alert("时间差应在1分钟至两年之间，请重新选择时间");
	} else {
		$("#pic").css('display', 'block'); //显示div
		$("#pic").attr("length", '0');
		$("#pic").append($('<center><iframe src="http://114.214.164.48:8888/kangj/chart2.php?graphid=' + graphid + '&period=' + get_time + '&width=543"' +
			'width="900px" height="600px" scrolling="no" frameborder="0"></iframe></center>'));
	}
}