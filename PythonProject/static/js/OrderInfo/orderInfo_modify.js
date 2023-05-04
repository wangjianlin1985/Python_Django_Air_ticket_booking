$(function () {
    setTimeout(ajaxModifyQuery,"100");
  function ajaxModifyQuery() {	
	$.ajax({
		url : "/OrderInfo/update/" + $("#orderInfo_orderId_modify").val(),
		type : "get",
		data : {
			//orderId : $("#orderInfo_orderId_modify").val(),
		},
		beforeSend : function () {
			$.messager.progress({
				text : "正在获取中...",
			});
		},
		success : function (orderInfo, response, status) {
			$.messager.progress("close");
			if (orderInfo) { 
				$("#orderInfo_orderId_modify").val(orderInfo.orderId);
				$("#orderInfo_orderId_modify").validatebox({
					required : true,
					missingMessage : "请输入记录编号",
					editable: false
				});
				$("#orderInfo_userObj_user_name_modify").combobox({
					url:"/UserInfo/listAll?csrfmiddlewaretoken=" + $('input[name="csrfmiddlewaretoken"]').val(),
					method: "GET",
					valueField:"user_name",
					textField:"realName",
					panelHeight: "auto",
					editable: false, //不允许手动输入 
					onLoadSuccess: function () { //数据加载完毕事件
						$("#orderInfo_userObj_user_name_modify").combobox("select", orderInfo.userObjPri);
						//var data = $("#orderInfo_userObj_user_name_edit").combobox("getData"); 
						//if (data.length > 0) {
							//$("#orderInfo_userObj_user_name_edit").combobox("select", data[0].user_name);
						//}
					}
				});
				$("#orderInfo_flightObj_flightId_modify").combobox({
					url:"/Flight/listAll?csrfmiddlewaretoken=" + $('input[name="csrfmiddlewaretoken"]').val(),
					method: "GET",
					valueField:"flightId",
					textField:"flightNumber",
					panelHeight: "auto",
					editable: false, //不允许手动输入 
					onLoadSuccess: function () { //数据加载完毕事件
						$("#orderInfo_flightObj_flightId_modify").combobox("select", orderInfo.flightObjPri);
						//var data = $("#orderInfo_flightObj_flightId_edit").combobox("getData"); 
						//if (data.length > 0) {
							//$("#orderInfo_flightObj_flightId_edit").combobox("select", data[0].flightId);
						//}
					}
				});
				$("#orderInfo_startStation_stationId_modify").combobox({
					url:"/StationInfo/listAll?csrfmiddlewaretoken=" + $('input[name="csrfmiddlewaretoken"]').val(),
					method: "GET",
					valueField:"stationId",
					textField:"stationName",
					panelHeight: "auto",
					editable: false, //不允许手动输入 
					onLoadSuccess: function () { //数据加载完毕事件
						$("#orderInfo_startStation_stationId_modify").combobox("select", orderInfo.startStationPri);
						//var data = $("#orderInfo_startStation_stationId_edit").combobox("getData"); 
						//if (data.length > 0) {
							//$("#orderInfo_startStation_stationId_edit").combobox("select", data[0].stationId);
						//}
					}
				});
				$("#orderInfo_endStation_stationId_modify").combobox({
					url:"/StationInfo/listAll?csrfmiddlewaretoken=" + $('input[name="csrfmiddlewaretoken"]').val(),
					method: "GET",
					valueField:"stationId",
					textField:"stationName",
					panelHeight: "auto",
					editable: false, //不允许手动输入 
					onLoadSuccess: function () { //数据加载完毕事件
						$("#orderInfo_endStation_stationId_modify").combobox("select", orderInfo.endStationPri);
						//var data = $("#orderInfo_endStation_stationId_edit").combobox("getData"); 
						//if (data.length > 0) {
							//$("#orderInfo_endStation_stationId_edit").combobox("select", data[0].stationId);
						//}
					}
				});
				$("#orderInfo_startTime_modify").datetimebox({
					value: orderInfo.startTime,
					required: true,
					showSeconds: true,
				});
				$("#orderInfo_endTime_modify").datetimebox({
					value: orderInfo.endTime,
					required: true,
					showSeconds: true,
				});
				$("#orderInfo_seatType_seatTypeId_modify").combobox({
					url:"/SeatType/listAll?csrfmiddlewaretoken=" + $('input[name="csrfmiddlewaretoken"]').val(),
					method: "GET",
					valueField:"seatTypeId",
					textField:"seatTypeName",
					panelHeight: "auto",
					editable: false, //不允许手动输入 
					onLoadSuccess: function () { //数据加载完毕事件
						$("#orderInfo_seatType_seatTypeId_modify").combobox("select", orderInfo.seatTypePri);
						//var data = $("#orderInfo_seatType_seatTypeId_edit").combobox("getData"); 
						//if (data.length > 0) {
							//$("#orderInfo_seatType_seatTypeId_edit").combobox("select", data[0].seatTypeId);
						//}
					}
				});
				$("#orderInfo_seatNum_modify").val(orderInfo.seatNum);
				$("#orderInfo_seatNum_modify").validatebox({
					required : true,
					validType : "integer",
					missingMessage : "请输入预定票数",
					invalidMessage : "预定票数输入不对",
				});
				$("#orderInfo_totalPrice_modify").val(orderInfo.totalPrice);
				$("#orderInfo_totalPrice_modify").validatebox({
					required : true,
					validType : "number",
					missingMessage : "请输入总票价",
					invalidMessage : "总票价输入不对",
				});
				$("#orderInfo_orderMemo_modify").val(orderInfo.orderMemo);
			} else {
				$.messager.alert("获取失败！", "未知错误导致失败，请重试！", "warning");
				$(".messager-window").css("z-index",10000);
			}
		}
	});

  }

	$("#orderInfoModifyButton").click(function(){ 
		if ($("#orderInfoModifyForm").form("validate")) {
			$("#orderInfoModifyForm").form({
			    url:"OrderInfo/update/" + $("#orderInfo_orderId_modify").val(),
			    onSubmit: function(){
					if($("#orderInfoEditForm").form("validate"))  {
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
			$("#orderInfoModifyForm").submit();
		} else {
			$.messager.alert("错误提示","你输入的信息还有错误！","warning");
			$(".messager-window").css("z-index",10000);
		}
	});
});
