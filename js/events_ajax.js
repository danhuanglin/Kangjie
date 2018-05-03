var httpctx = 'http://114.214.164.48:8888/kangj/api_jsonrpc.php';
//发送请求request，获取主机群组名字
function hostgroup_getName() {
	console.log("执行顺序========================" + "1");
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
//			alert(JSON.stringify(data));
			$('#groupid').attr("length", '0');
			for(var i = 0; i <= data.result.length - 1; i++) {
				$("#groupid").append($('<option value=' + data.result[i].groupid + '>' + data.result[i].name + '</option>'));
			}
		}
	});
}

//发送请求request，根据主机群组ID，获取主机名字
var Allhost_data = {
	"jsonrpc": "2.0",
	"method": "host.get",
	"params": {
		"output": "extend",
		"monitored_hosts": true //仅返回受监视的主机
	},
	"auth": localStorage.getItem('auth'),
	"id": 1
};

//执行请求，并将服务器返回的response结果转换为数组格式，并输出到指定内容上
function host_getName(aData) {
	console.log("执行顺序========================" + "2");
	$.ajax({
		type: "post",
		url: httpctx,
		async: true,
		dataType: 'json', //服务器返回json数据
		contentType: 'application/json',
		timeout: 5000, //超时时间设置为5秒
		data: JSON.stringify(aData),
		success: function(data) {
			$('#hostid').attr("length", '0');
			for(var i = 0; i <= data.result.length - 1; i++) {
				$("#hostid").append($('<option value=' + data.result[i].hostid + '>' + data.result[i].name + '</option>'));

			}
		}
	});
}

// 群组select框点击事件。获取对应主机值
function Groupid_click() {
	console.log("执行顺序========================" + "3");
	var selected_Gid = localStorage.getItem('selectedGroupid');
	var aSelected_Gids = '"' + selected_Gid + '"';
	if(selected_Gid == 0) {
		host_getName(Allhost_data);
	}
//	alert("群组ID============" + aSelected_Gids);
	var SeHost_data = {
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
	host_getName(SeHost_data);
}



//发送请求request，获取触发器的描述
function trigger_getDescription() {
	console.log("执行顺序========================" + "4");
	
	var selected_Hid = localStorage.getItem('slectedHostid');
	var aSelected_Hids = '"' + selected_Hid + '"';
	
//	var indexHost = oHostid.options[oHostid.selectedIndex].innerHTML;
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
		dataType: 'json', // 服务器返回json数据
		contentType: 'application/json',
		timeout: 5000, // 超时时间设置为5秒
		data: JSON.stringify(trigger_get_data),
		success: function(data) {
			alert(JSON.stringify(data));
			$('#trigger_modal').attr("length", '0');
			for(var i = 0; i <= data.result.length - 1; i++) {
				//转换触发器的安全类型
				var pri = "";
				var type_pri = data.result[i].priority;
				if(type_pri == 0) {
					pri = "not classified";
				} else if(type_pri == 1) {
					pri = "information";
				} else if(type_pri == 2) {
					pri = "warning";
				} else if(type_pri == 3) {
					pri = "average";
				} else if(type_pri == 4) {
					pri = "high";
				} else if(type_pri == 5) {
					pri = "disaster";
				}

				//转换触发器的状态类型
				var state = "";
				var type_state = data.result[i].state;
				if(type_state == 0) {
					state = "启用";
				} else if(type_state == 1) {
					state = "禁用";
				}
				//replace()将触发器里面的{HOST.NAME}字符串换成对应的主机号
				$("#triggerid").append($('<option value=' + data.result[i].triggerid + '>' + data.result[i].name + '</option>'));
//				$("#trigger_modal").append($('<tr id=' + data.result[i].triggerid + '><td><a href="javaScript:getTrigger(' + i + ');">' + data.result[i].description.replace(/{HOST.NAME}/g, selected_Hid) +
//					'</a></td><td>' + pri + '</td><td>' + state + '</td></tr>'));
				//				alert(data.result[i].triggerid);
			}
		}
	});
}

//点击选中的触发器，加载到指定输入框内
function getTrigger(index) {
	console.log("执行顺序========================" + "5");
	var oTriggerTab = document.getElementById("trigger_modal");
	var aTriggerTr = oTriggerTab.getElementsByTagName('tr')[index];
	var aTriggerA = oTriggerTab.getElementsByTagName('a')[index];
	var oTriggerid = document.getElementById("triggerid");
	//将点击的触发器的描述和ID值赋给输入框的value和name，便于后面获取其ID
	oTriggerid.name = aTriggerTr.id;
	oTriggerid.value = oHostid.options[oHostid.selectedIndex].innerHTML + ' : ' + aTriggerA.innerHTML;
	oModal.style.display = "none";
	//			alert("触发器ID============" + aTriggerTr.id);
}

//初始化，一点击页面，就加载出最近三天内的所有事件
function getAllEvent() {
	console.log("执行顺序========================" + "6");
	$('#event-thead').attr("length", '0');
	$('#event-thead').html('');
	$('#event-thead').append($('<tr><th>时间</th><th>主机</th><th>描述</th><th>状态</th><th>严重性</th><th>持续时间</th><th>确认</th><th>动作</th></tr>'));

	function fix(num, length) {
		return('' + num).length < length ? ((new Array(length + 1)).join('0') + num).slice(-length) : '' + num;
	}
	var now = new Date();
	var SstartData = now.getFullYear() + "-" + fix((now.getMonth() + 1), 2) + "-" + fix(now.getDate() - 3, 2) + " " + fix(now.getHours(), 2) + ":" + fix(now.getMinutes(), 2) + ":" + fix(now.getSeconds(), 2);
	var SendData = now.getFullYear() + "-" + fix((now.getMonth() + 1), 2) + "-" + fix(now.getDate(), 2) + " " + fix(now.getHours(), 2) + ":" + fix(now.getMinutes(), 2) + ":" + fix(now.getSeconds(), 2);

	//获取某个时间的时间戳
	var oTimeStart = document.getElementById("datebut1");
	var oTimeEnd = document.getElementById("datebut2");
	oTimeStart.value = SstartData;
	oTimeEnd.value = SendData;
	var startStr = Date.parse(new Date(SstartData));
	startStr = '"' + startStr / 1000 + '"';
	var EndStr = Date.parse(new Date(SendData));
	EndStr = '"' + EndStr / 1000 + '"';
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
			for(var i = 0; i <= data.result.length - 1; i++) {
				var newDate = new Date();
				newDate.setTime(data.result[i].clock * 1000);
				getTH(data.result[i].eventid, newDate.format('yyyy-MM-dd hh:mm:ss'), data.result[i].objectid, data.result[i].acknowledged, data.result[i].value);
			}
			$('#all-data-length').html(data.result.length);

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
		//执行请求，并将服务器返回的response结果转换为数组格式，并输出到指定内容上
		$.ajax({
			type: "post",
			url: httpctx,
			async: true,
			dataType: 'json', //服务器返回json数据
			contentType: 'application/json',
			timeout: 5000, //超时时间设置为5秒
			data: JSON.stringify(get_THost),
			success: function(data) {
				$('#groupid').attr("length", '0');
				for(var i = 0; i <= data.result.length - 1; i++) {
					getTD(eid, t, oid, ack, esta, data.result[i].name);
				}
			}
		});
	}

	function getTD(eid, t, oid, ack, esta, hname) {
		console.log("执行顺序========================" + "7");
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
					//转换触发器的安全类型
					var pri = "";
					var type_pri = data.result[i].priority;
					if(type_pri == 0) {
						pri = "not classified";
					} else if(type_pri == 1) {
						pri = "information";
					} else if(type_pri == 2) {
						pri = "warning";
					} else if(type_pri == 3) {
						pri = "average";
					} else if(type_pri == 4) {
						pri = "high";
					} else if(type_pri == 5) {
						pri = "disaster";
					}

					//转换触发器的状态类型
					var estate = "";
					if(esta == 0) {
						estate = "正常";
					} else if(esta == 1) {
						estate = "问题";
					}

					//是否确认状态
					var ackStr = '';
					var type_ack = ack;
					if(type_ack == 0) {
						ackStr = "否";
					} else if(type_ack == 1) {
						ackStr = "是";
					}
					$("#event-table").append($('<tr id=' + eid + '><td><a href="tr_event.html">' + t +
						'</a></td><td>' + hname + '</td><td>' + data.result[i].description.replace(/{HOST.NAME}/g, hname) + '</td><td>' + estate +
						'</td><td>' + pri + '</td><td>' + ackStr + '</td><td><a href="javaScript:setEventAck(' + eid + "," + oid + "," + esta + "," + ack + ');">' + ackStr + '</a><span id="ackCount' + eid + '"></span></td></tr>'));

				}

			}

		});
	}
	
}


//根据群组、主机、触发器和时间，加载出事件
function getTriggerEvent() {
	console.log("执行顺序========================" + "8");
	$('#event-thead').attr("length", '0');
	$('#event-thead').html('');
	$('#event-thead').append($('<tr><th>时间</th><th>描述</th><th>状态</th><th>严重性</th><th>持续时间</th><th>确认</th><th>动作</th></tr>'));

	//当前主机名字
	var indexHost = oHostid.options[oHostid.selectedIndex].innerHTML;
	//获取我们选择的群组和主机的ID值
	var selected_Gid = localStorage.getItem('selectedGroupid');
	var aSelected_Gids = '"' + selected_Gid + '"';
	var selected_Hid = localStorage.getItem('slectedHostid');
	var aSelected_Hids = '"' + selected_Hid + '"';
	//获取某个时间的时间戳
	var oTimeStart = document.getElementById("datebut1");
	var oTimeEnd = document.getElementById("datebut2");
	var startStr = Date.parse(new Date(oTimeStart.value));
	startStr = '"' + startStr / 1000 + '"';
	var EndStr = Date.parse(new Date(oTimeEnd.value));
	EndStr = '"' + EndStr / 1000 + '"';
	//判断触发器输入框内容是否为空
	var oTriggerid = document.getElementById("triggerid");
	var aSelected_Tids = '"' + oTriggerid.name + '"'; //触发器ID

	//触发器内容为空，即查询在时间段内所有的触发事件    	 
	if(oTriggerid.value == '') {
		var event_getData = {
			"jsonrpc": "2.0",
			"method": "event.get",
			"params": {
				"output": "extend",
				"select_acknowledges": "extend",
				"groupids": JSON.parse(aSelected_Gids),
				"hostids": JSON.parse(aSelected_Hids),
				"time_from": JSON.parse(startStr),
				"time_till": JSON.parse(EndStr),
				"sortfield": "eventid", //按照clock降序排列
				"sortorder": "DESC"
			},
			"auth": localStorage.getItem('auth'),
			"id": 1
		};
	}
	//不为空，即查询选择的触发器的事件
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
				getTD(data.result[i].eventid, newDate.format('yyyy-MM-dd hh:mm:ss'), data.result[i].objectid, data.result[i].acknowledged, data.result[i].value);

			}
			$('#all-data-length').html(data.result.length);

		}
	});

	function getTD(eid, t, oid, ack, esta) {
		console.log("执行顺序========================" + "9");
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
					//转换触发器的安全类型
					var pri = "";
					var type_pri = data.result[i].priority;
					if(type_pri == 0) {
						pri = "not classified";
					} else if(type_pri == 1) {
						pri = "information";
					} else if(type_pri == 2) {
						pri = "warning";
					} else if(type_pri == 3) {
						pri = "average";
					} else if(type_pri == 4) {
						pri = "high";
					} else if(type_pri == 5) {
						pri = "disaster";
					}

					//转换触发器的状态类型
					var estate = "";
					if(esta == 0) {
						estate = "正常";
					} else if(esta == 1) {
						estate = "问题";
					}

					//是否确认状态
					var ackStr = '';
					var type_ack = ack;
					if(type_ack == 0) {
						ackStr = "否";
					} else if(type_ack == 1) {
						ackStr = "是";
					}

					$("#event-table").append($('<tr id=' + eid + '><td><a href="tr_event.html">' + t +
						'</a></td><td>' + data.result[i].description.replace(/{HOST.NAME}/g, indexHost) + '</td><td>' + estate +
						'</td><td>' + pri + '</td><td>' + ackStr + '</td><td><a href="javaScript:setEventAck(' + eid + "," + oid + "," + esta + "," + ack + ');">' + ackStr + '</a><span id="ackCount' + eid + '"></span></td></tr>'));
				}
			}
		});
	}

}

//警报确认信息弹框
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
//			$('#ackCount516').html(data.result[0].acknowledges.length);
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

//加载时，先判断是否有未确认问题的事件，要是没有，设置单选按钮为不可选
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