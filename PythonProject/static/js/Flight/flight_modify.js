$(function () {
    //实例化航班描述编辑器
    tinyMCE.init({
        selector: "#flight_flightDesc_modify",
        theme: 'advanced',
        language: "zh",
        strict_loading_mode: 1,
    });
    setTimeout(ajaxModifyQuery,"100");
  function ajaxModifyQuery() {	
	$.ajax({
		url : "/Flight/update/" + $("#flight_flightId_modify").val(),
		type : "get",
		data : {
			//flightId : $("#flight_flightId_modify").val(),
		},
		beforeSend : function () {
			$.messager.progress({
				text : "正在获取中...",
			});
		},
		success : function (flight, response, status) {
			$.messager.progress("close");
			if (flight) { 
				$("#flight_flightId_modify").val(flight.flightId);
				$("#flight_flightId_modify").validatebox({
					required : true,
					missingMessage : "请输入记录编号",
					editable: false
				});
				$("#flight_flightNumber_modify").val(flight.flightNumber);
				$("#flight_flightNumber_modify").validatebox({
					required : true,
					missingMessage : "请输入航班号",
				});
				$("#flight_flightPhotoImgMod").attr("src", flight.flightPhoto);
				$("#flight_startStation_stationId_modify").combobox({
					url:"/StationInfo/listAll?csrfmiddlewaretoken=" + $('input[name="csrfmiddlewaretoken"]').val(),
					method: "GET",
					valueField:"stationId",
					textField:"stationName",
					panelHeight: "auto",
					editable: false, //不允许手动输入 
					onLoadSuccess: function () { //数据加载完毕事件
						$("#flight_startStation_stationId_modify").combobox("select", flight.startStationPri);
						//var data = $("#flight_startStation_stationId_edit").combobox("getData"); 
						//if (data.length > 0) {
							//$("#flight_startStation_stationId_edit").combobox("select", data[0].stationId);
						//}
					}
				});
				$("#flight_endStation_stationId_modify").combobox({
					url:"/StationInfo/listAll?csrfmiddlewaretoken=" + $('input[name="csrfmiddlewaretoken"]').val(),
					method: "GET",
					valueField:"stationId",
					textField:"stationName",
					panelHeight: "auto",
					editable: false, //不允许手动输入 
					onLoadSuccess: function () { //数据加载完毕事件
						$("#flight_endStation_stationId_modify").combobox("select", flight.endStationPri);
						//var data = $("#flight_endStation_stationId_edit").combobox("getData"); 
						//if (data.length > 0) {
							//$("#flight_endStation_stationId_edit").combobox("select", data[0].stationId);
						//}
					}
				});
				$("#flight_startTime_modify").datetimebox({
					value: flight.startTime,
					required: true,
					showSeconds: true,
				});
				$("#flight_endTime_modify").datetimebox({
					value: flight.endTime,
					required: true,
					showSeconds: true,
				});
				$("#flight_totalTime_modify").val(flight.totalTime);
				$("#flight_totalTime_modify").validatebox({
					required : true,
					missingMessage : "请输入历时",
				});
				$("#flight_seatType_seatTypeId_modify").combobox({
					url:"/SeatType/listAll?csrfmiddlewaretoken=" + $('input[name="csrfmiddlewaretoken"]').val(),
					method: "GET",
					valueField:"seatTypeId",
					textField:"seatTypeName",
					panelHeight: "auto",
					editable: false, //不允许手动输入 
					onLoadSuccess: function () { //数据加载完毕事件
						$("#flight_seatType_seatTypeId_modify").combobox("select", flight.seatTypePri);
						//var data = $("#flight_seatType_seatTypeId_edit").combobox("getData"); 
						//if (data.length > 0) {
							//$("#flight_seatType_seatTypeId_edit").combobox("select", data[0].seatTypeId);
						//}
					}
				});
				$("#flight_price_modify").val(flight.price);
				$("#flight_price_modify").validatebox({
					required : true,
					validType : "number",
					missingMessage : "请输入票价",
					invalidMessage : "票价输入不对",
				});
				$("#flight_seatNumber_modify").val(flight.seatNumber);
				$("#flight_seatNumber_modify").validatebox({
					required : true,
					validType : "integer",
					missingMessage : "请输入总票数",
					invalidMessage : "总票数输入不对",
				});
				$("#flight_leftSeatNumber_modify").val(flight.leftSeatNumber);
				$("#flight_leftSeatNumber_modify").validatebox({
					required : true,
					validType : "integer",
					missingMessage : "请输入剩余票数",
					invalidMessage : "剩余票数输入不对",
				});
				tinyMCE.editors['flight_flightDesc_modify'].setContent(flight.flightDesc);
			} else {
				$.messager.alert("获取失败！", "未知错误导致失败，请重试！", "warning");
				$(".messager-window").css("z-index",10000);
			}
		}
	});

  }

	$("#flightModifyButton").click(function(){ 
		if ($("#flightModifyForm").form("validate")) {
			$("#flightModifyForm").form({
			    url:"Flight/update/" + $("#flight_flightId_modify").val(),
			    onSubmit: function(){
					if($("#flightEditForm").form("validate"))  {
	                	$.messager.progress({
							text : "正在提交数据中...",
						});
	                	return true;
	                } else {
	                    return false;
	                }
			    },
			    success:function(data){
			    	$.messager.progress("close");
                	var obj = jQuery.parseJSON(data);
                    if(obj.success){
                        $.messager.alert("消息","信息修改成功！");
                        $(".messager-window").css("z-index",10000);
                        //location.href="frontlist";
                    }else{
                        $.messager.alert("消息",obj.message);
                        $(".messager-window").css("z-index",10000);
                    } 
			    }
			});
			//提交表单
			$("#flightModifyForm").submit();
		} else {
			$.messager.alert("错误提示","你输入的信息还有错误！","warning");
			$(".messager-window").css("z-index",10000);
		}
	});
});
