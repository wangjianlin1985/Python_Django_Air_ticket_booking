var orderInfo_manage_tool = null; 
$(function () { 
	initOrderInfoManageTool(); //建立OrderInfo管理对象
	orderInfo_manage_tool.init(); //如果需要通过下拉框查询，首先初始化下拉框的值
	$("#orderInfo_manage").datagrid({
		url : '/OrderInfo/list',
		queryParams: {
			"csrfmiddlewaretoken": $('input[name="csrfmiddlewaretoken"]').val()
		},
		fit : true,
		fitColumns : true,
		striped : true,
		rownumbers : true,
		border : false,
		pagination : true,
		pageSize : 5,
		pageList : [5, 10, 15, 20, 25],
		pageNumber : 1,
		sortName : "orderId",
		sortOrder : "desc",
		toolbar : "#orderInfo_manage_tool",
		columns : [[
			{
				field : "userObj",
				title : "预定用户",
				width : 140,
			},
			{
				field : "flightObj",
				title : "预定航班",
				width : 140,
			},
			{
				field : "startStation",
				title : "始发机场",
				width : 140,
			},
			{
				field : "endStation",
				title : "终到机场",
				width : 140,
			},
			{
				field : "startTime",
				title : "起飞时间",
				width : 140,
			},
			{
				field : "endTime",
				title : "终到时间",
				width : 140,
			},
			{
				field : "seatType",
				title : "席别",
				width : 140,
			},
			{
				field : "seatNum",
				title : "预定票数",
				width : 70,
			},
			{
				field : "totalPrice",
				title : "总票价",
				width : 70,
			},
		]],
	});

	$("#orderInfoEditDiv").dialog({
		title : "修改管理",
		top: "50px",
		width : 700,
		height : 515,
		modal : true,
		closed : true,
		iconCls : "icon-edit-new",
		buttons : [{
			text : "提交",
			iconCls : "icon-edit-new",
			handler : function () {
				if ($("#orderInfoEditForm").form("validate")) {
					//验证表单 
					if(!$("#orderInfoEditForm").form("validate")) {
						$.messager.alert("错误提示","你输入的信息还有错误！","warning");
					} else {
						$("#orderInfoEditForm").form({
						    url:"/OrderInfo/update/" + $("#orderInfo_orderId_edit").val(),
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
						    	console.log(data);
			                	var obj = jQuery.parseJSON(data);
			                    if(obj.success){
			                        $.messager.alert("消息","信息修改成功！");
			                        $("#orderInfoEditDiv").dialog("close");
			                        orderInfo_manage_tool.reload();
			                    }else{
			                        $.messager.alert("消息",obj.message);
			                    } 
						    }
						});
						//提交表单
						$("#orderInfoEditForm").submit();
					}
				}
			},
		},{
			text : "取消",
			iconCls : "icon-redo",
			handler : function () {
				$("#orderInfoEditDiv").dialog("close");
				$("#orderInfoEditForm").form("reset"); 
			},
		}],
	});
});

function initOrderInfoManageTool() {
	orderInfo_manage_tool = {
		init: function() {
			$.ajax({
				url : "/UserInfo/listAll",
				data: {
					"csrfmiddlewaretoken": $('input[name="csrfmiddlewaretoken"]').val()
				},
				type : "get",
				success : function (data, response, status) {
					$("#userObj_user_name_query").combobox({ 
					    valueField:"user_name",
					    textField:"realName",
					    panelHeight: "200px",
				        editable: false, //不允许手动输入 
					});
					data.splice(0,0,{user_name:"",realName:"不限制"});
					$("#userObj_user_name_query").combobox("loadData",data); 
				}
			});
			$.ajax({
				url : "/Flight/listAll",
				data: {
					"csrfmiddlewaretoken": $('input[name="csrfmiddlewaretoken"]').val()
				},
				type : "get",
				success : function (data, response, status) {
					$("#flightObj_flightId_query").combobox({ 
					    valueField:"flightId",
					    textField:"flightNumber",
					    panelHeight: "200px",
				        editable: false, //不允许手动输入 
					});
					data.splice(0,0,{flightId:0,flightNumber:"不限制"});
					$("#flightObj_flightId_query").combobox("loadData",data); 
				}
			});
			$.ajax({
				url : "/StationInfo/listAll",
				data: {
					"csrfmiddlewaretoken": $('input[name="csrfmiddlewaretoken"]').val()
				},
				type : "get",
				success : function (data, response, status) {
					$("#startStation_stationId_query").combobox({ 
					    valueField:"stationId",
					    textField:"stationName",
					    panelHeight: "200px",
				        editable: false, //不允许手动输入 
					});
					data.splice(0,0,{stationId:0,stationName:"不限制"});
					$("#startStation_stationId_query").combobox("loadData",data); 
				}
			});
			$.ajax({
				url : "/StationInfo/listAll",
				data: {
					"csrfmiddlewaretoken": $('input[name="csrfmiddlewaretoken"]').val()
				},
				type : "get",
				success : function (data, response, status) {
					$("#endStation_stationId_query").combobox({ 
					    valueField:"stationId",
					    textField:"stationName",
					    panelHeight: "200px",
				        editable: false, //不允许手动输入 
					});
					data.splice(0,0,{stationId:0,stationName:"不限制"});
					$("#endStation_stationId_query").combobox("loadData",data); 
				}
			});
			$.ajax({
				url : "/SeatType/listAll",
				data: {
					"csrfmiddlewaretoken": $('input[name="csrfmiddlewaretoken"]').val()
				},
				type : "get",
				success : function (data, response, status) {
					$("#seatType_seatTypeId_query").combobox({ 
					    valueField:"seatTypeId",
					    textField:"seatTypeName",
					    panelHeight: "200px",
				        editable: false, //不允许手动输入 
					});
					data.splice(0,0,{seatTypeId:0,seatTypeName:"不限制"});
					$("#seatType_seatTypeId_query").combobox("loadData",data); 
				}
			});
		},
		reload : function () {
			$("#orderInfo_manage").datagrid("reload");
		},
		redo : function () {
			$("#orderInfo_manage").datagrid("unselectAll");
		},
		search: function() {
			var queryParams = $("#orderInfo_manage").datagrid("options").queryParams;
			queryParams["userObj.user_name"] = $("#userObj_user_name_query").combobox("getValue");
			queryParams["flightObj.flightId"] = $("#flightObj_flightId_query").combobox("getValue");
			queryParams["startStation.stationId"] = $("#startStation_stationId_query").combobox("getValue");
			queryParams["endStation.stationId"] = $("#endStation_stationId_query").combobox("getValue");
			queryParams["startTime"] = $("#startTime").datebox("getValue"); 
			queryParams["endTime"] = $("#endTime").datebox("getValue"); 
			queryParams["seatType.seatTypeId"] = $("#seatType_seatTypeId_query").combobox("getValue");
			queryParams["csrfmiddlewaretoken"] = $('input[name="csrfmiddlewaretoken"]').val();
			$("#orderInfo_manage").datagrid("options").queryParams=queryParams; 
			$("#orderInfo_manage").datagrid("load");
		},
		exportExcel: function() {
			$("#orderInfoQueryForm").form({
			    url:"/OrderInfo/OutToExcel?csrfmiddlewaretoken" + $('input[name="csrfmiddlewaretoken"]').val(),
			});
			//提交表单
			$("#orderInfoQueryForm").submit();
		},
		remove : function () {
			var rows = $("#orderInfo_manage").datagrid("getSelections");
			if (rows.length > 0) {
				$.messager.confirm("确定操作", "您正在要删除所选的记录吗？", function (flag) {
					if (flag) {
						var orderIds = [];
						for (var i = 0; i < rows.length; i ++) {
							orderIds.push(rows[i].orderId);
						}
						$.ajax({
							type : "POST",
							url : "/OrderInfo/deletes",
							data : {
								orderIds : orderIds.join(","),
								"csrfmiddlewaretoken": $('input[name="csrfmiddlewaretoken"]').val()
							},
							beforeSend : function () {
								$("#orderInfo_manage").datagrid("loading");
							},
							success : function (data) {
								if (data.success) {
									$("#orderInfo_manage").datagrid("loaded");
									$("#orderInfo_manage").datagrid("load");
									$("#orderInfo_manage").datagrid("unselectAll");
									$.messager.show({
										title : "提示",
										msg : data.message
									});
								} else {
									$("#orderInfo_manage").datagrid("loaded");
									$("#orderInfo_manage").datagrid("load");
									$("#orderInfo_manage").datagrid("unselectAll");
									$.messager.alert("消息",data.message);
								}
							},
						});
					}
				});
			} else {
				$.messager.alert("提示", "请选择要删除的记录！", "info");
			}
		},
		edit : function () {
			var rows = $("#orderInfo_manage").datagrid("getSelections");
			if (rows.length > 1) {
				$.messager.alert("警告操作！", "编辑记录只能选定一条数据！", "warning");
			} else if (rows.length == 1) {
				$.ajax({
					url : "/OrderInfo/update/" + rows[0].orderId,
					type : "get",
					data : {
						//orderId : rows[0].orderId,
					},
					beforeSend : function () {
						$.messager.progress({
							text : "正在获取中...",
						});
					},
					success : function (orderInfo, response, status) {
						$.messager.progress("close");
						if (orderInfo) { 
							$("#orderInfoEditDiv").dialog("open");
							$("#orderInfo_orderId_edit").val(orderInfo.orderId);
							$("#orderInfo_orderId_edit").validatebox({
								required : true,
								missingMessage : "请输入记录编号",
								editable: false
							});
							$("#orderInfo_userObj_user_name_edit").combobox({
								url:"/UserInfo/listAll?csrfmiddlewaretoken=" + $('input[name="csrfmiddlewaretoken"]').val(),
								method: "GET",
							    valueField:"user_name",
							    textField:"realName",
							    panelHeight: "auto",
						        editable: false, //不允许手动输入 
						        onLoadSuccess: function () { //数据加载完毕事件
									$("#orderInfo_userObj_user_name_edit").combobox("select", orderInfo.userObjPri);
									//var data = $("#orderInfo_userObj_user_name_edit").combobox("getData"); 
						            //if (data.length > 0) {
						                //$("#orderInfo_userObj_user_name_edit").combobox("select", data[0].user_name);
						            //}
								}
							});
							$("#orderInfo_flightObj_flightId_edit").combobox({
								url:"/Flight/listAll?csrfmiddlewaretoken=" + $('input[name="csrfmiddlewaretoken"]').val(),
								method: "GET",
							    valueField:"flightId",
							    textField:"flightNumber",
							    panelHeight: "auto",
						        editable: false, //不允许手动输入 
						        onLoadSuccess: function () { //数据加载完毕事件
									$("#orderInfo_flightObj_flightId_edit").combobox("select", orderInfo.flightObjPri);
									//var data = $("#orderInfo_flightObj_flightId_edit").combobox("getData"); 
						            //if (data.length > 0) {
						                //$("#orderInfo_flightObj_flightId_edit").combobox("select", data[0].flightId);
						            //}
								}
							});
							$("#orderInfo_startStation_stationId_edit").combobox({
								url:"/StationInfo/listAll?csrfmiddlewaretoken=" + $('input[name="csrfmiddlewaretoken"]').val(),
								method: "GET",
							    valueField:"stationId",
							    textField:"stationName",
							    panelHeight: "auto",
						        editable: false, //不允许手动输入 
						        onLoadSuccess: function () { //数据加载完毕事件
									$("#orderInfo_startStation_stationId_edit").combobox("select", orderInfo.startStationPri);
									//var data = $("#orderInfo_startStation_stationId_edit").combobox("getData"); 
						            //if (data.length > 0) {
						                //$("#orderInfo_startStation_stationId_edit").combobox("select", data[0].stationId);
						            //}
								}
							});
							$("#orderInfo_endStation_stationId_edit").combobox({
								url:"/StationInfo/listAll?csrfmiddlewaretoken=" + $('input[name="csrfmiddlewaretoken"]').val(),
								method: "GET",
							    valueField:"stationId",
							    textField:"stationName",
							    panelHeight: "auto",
						        editable: false, //不允许手动输入 
						        onLoadSuccess: function () { //数据加载完毕事件
									$("#orderInfo_endStation_stationId_edit").combobox("select", orderInfo.endStationPri);
									//var data = $("#orderInfo_endStation_stationId_edit").combobox("getData"); 
						            //if (data.length > 0) {
						                //$("#orderInfo_endStation_stationId_edit").combobox("select", data[0].stationId);
						            //}
								}
							});
							$("#orderInfo_startTime_edit").datetimebox({
								value: orderInfo.startTime,
							    required: true,
							    showSeconds: true,
							});
							$("#orderInfo_endTime_edit").datetimebox({
								value: orderInfo.endTime,
							    required: true,
							    showSeconds: true,
							});
							$("#orderInfo_seatType_seatTypeId_edit").combobox({
								url:"/SeatType/listAll?csrfmiddlewaretoken=" + $('input[name="csrfmiddlewaretoken"]').val(),
								method: "GET",
							    valueField:"seatTypeId",
							    textField:"seatTypeName",
							    panelHeight: "auto",
						        editable: false, //不允许手动输入 
						        onLoadSuccess: function () { //数据加载完毕事件
									$("#orderInfo_seatType_seatTypeId_edit").combobox("select", orderInfo.seatTypePri);
									//var data = $("#orderInfo_seatType_seatTypeId_edit").combobox("getData"); 
						            //if (data.length > 0) {
						                //$("#orderInfo_seatType_seatTypeId_edit").combobox("select", data[0].seatTypeId);
						            //}
								}
							});
							$("#orderInfo_seatNum_edit").val(orderInfo.seatNum);
							$("#orderInfo_seatNum_edit").validatebox({
								required : true,
								validType : "integer",
								missingMessage : "请输入预定票数",
								invalidMessage : "预定票数输入不对",
							});
							$("#orderInfo_totalPrice_edit").val(orderInfo.totalPrice);
							$("#orderInfo_totalPrice_edit").validatebox({
								required : true,
								validType : "number",
								missingMessage : "请输入总票价",
								invalidMessage : "总票价输入不对",
							});
							$("#orderInfo_orderMemo_edit").val(orderInfo.orderMemo);
						} else {
							$.messager.alert("获取失败！", "未知错误导致失败，请重试！", "warning");
						}
					}
				});
			} else if (rows.length == 0) {
				$.messager.alert("警告操作！", "编辑记录至少选定一条数据！", "warning");
			}
		},
	};
}
