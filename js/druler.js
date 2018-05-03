/**
 * Linda:该文件用于公用的一些数据请求
 */
var httpctx = 'http://114.214.164.48:8888/kangj/api_jsonrpc.php';
console.log("hello,ajax");
/*获取自动发现规则*/
function get_ruler() {
	console.log("hello,get_ruler()");
	// 需要发送的JSON数据
	var get_ruler= {
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
		type: 'post', // 数据的传输方式为post
		url: httpctx, // 数据的传输地址
		async: true, // 是否进行异步通信
		dataType: 'json', // 服务器返回json格式数据
		contentType: 'application/json', // 数据的内容类型为application/json
		timeout: 5000, // 超时时间设置为5秒
		data: JSON.stringify(get_ruler), // 将字符串转成JSON
		// 数据传输成功后，返回结果，对结果进行相应的操作
		success: function(data) {
			console.log("Linda:get_ruler().success.data===>" + data);
			// 使用for循环，在下拉框中，显示数据
			$('#select_real_ruler').attr("length", '0');
			for(var i = 0; i <= data.result.length - 1; i++) {
				console.log("Linda:get_ruler().success.data.result[" + i + "]===>" + data.result[i].groupid);
				$("#select_real_ruler").append($('<option value=' + data.result[i].druleid + '>' + data.result[i].name + '</option>'));
			}
			// 绑定点击事件
			$("#select_real_ruler").change(function() {
				var item = $("#select_real_ruler").val();
				get_dhost(item);
				console.log("Linda:获取单个选项的值====》" + item);
			});
		},
		// 数据传输失败，可能是发送的地址有问题，或服务器自身的问题，例如：服务器没有启动
		error: function(xhr, type, errorThrown) {
			console.log("服务器出错！");
		},
	});
}

/*Linda:获取发现规则对应的设备*/
function get_dhost(druleid) {
	console.log("hello,get_dhost()");
	// 需要发送的JSON数据
	var get_dhost= {
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
		type: 'post', // 数据的传输方式为post
		url: httpctx, // 数据的传输地址
		async: true, // 是否进行异步通信
		dataType: 'json', // 服务器返回json格式数据
		contentType: 'application/json', // 数据的内容类型为application/json
		timeout: 5000, // 超时时间设置为5秒
		data: JSON.stringify(get_dhost), // 将字符串转成JSON
		// 数据传输成功后，返回结果，对结果进行相应的操作
		success: function(data) {
			$('#select_host_name').empty();
			// 使用for循环，在下拉框中，显示数据
			$('#select_host_name').attr("length", '0');
			for(var i = 0; i <= data.result.length - 1; i++){
				$('#table_id').append($('<tr><td>'+data.result[i].dservices[0].ip+'</td><td></td><td>'+data.result[i].dservices[0].lastup+'</td><td style="background:limegreen;"></td></tr>'));
				
			}
			
			// 绑定点击事件
			$("#select_host_name").change(function() {
				var item = $("#select_host_name").val();
				get_graph_byhostids(item);
				console.log("Janine:获取单个选项的值====》" + item);
			});
		},
		// 数据传输失败，可能是发送的地址有问题，或服务器自身的问题，例如：服务器没有启动
		error: function(xhr, type, errorThrown) {
			// alert("Janine:error--->" +"xhr:" + JSON.stringify(xhr));
			console.log("服务器出错！");
		},
	});

}