function ShowDiv() {
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
	var graphid = graph.options[graph.selectedIndex].value;
	alert("图片的id====" + graphid);
	//判断时间
	if(get_time < 0) {
		alert("结束时间应大于开始时间，请重新选择时间");
	} else if(get_time < 60 || get_time > 63072000) {
		alert("时间差应在1分钟至两年之间，请重新选择时间");
	} else {
		alert("显示图片====" + graphid);
		$("#pic").css('display', 'block'); //显示div
		$("#pic").attr("length", '0');
		$("#pic").append($('<center><iframe src="http://114.214.164.48:8888/kangj/chart2.php?graphid=' + graphid + '&period=' + get_time + '&width=1543"' +
			'width="900px" height="600px" scrolling="no" frameborder="0"></iframe></center>'));
	}
}

