var flight_manage_tool = null; 
$(function () { 
	initFlightManageTool(); //建立Flight管理对象
	flight_manage_tool.init(); //如果需要通过下拉框查询，首先初始化下拉框的值
	$("#flight_manage").datagrid({
		url : '/Flight/list',
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
		sortName : "flightId",
		sortOrder : "desc",
		toolbar : "#flight_manage_tool",
		columns : [[
			{
				field : "flightNumber",
				title : "航班号",
				width : 140,
			},
			{
				field : "flightPhoto",
				title : "航班图片",
				width : "70px",
				height: "65px",
				formatter: function(val,row) {
					return "<img src='" + val + "' width='65px' height='55px' />";
				}
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
				field : "totalTime",
				title : "历时",
				width : 140,
			},
			{
				field : "seatType",
				title : "席别",
				width : 140,
			},
			{
				field : "price",
				title : "票价",
				width : 70,
			},
			{
				field : "seatNumber",
				title : "总票数",
				width : 70,
			},
			{
				field : "leftSeatNumber",
				title : "剩余票数",
				width : 70,
			},
		]],
	});

	$("#flightEditDiv").dialog({
		title : "修改管理",
		top: "10px",
		width : 1000,
		height : 600,
		modal : true,
		closed : true,
		iconCls : "icon-edit-new",
		buttons : [{
			text : "提交",
			iconCls : "icon-edit-new",
			handler : function () {
				if ($("#flightEditForm").form("validate")) {
					//验证表单 
					if(!$("#flightEditForm").form("validate")) {
						$.messager.alert("错误提示","你输入的信息还有错误！","warning");
					} else {
						$("#flightEditForm").form({
						    url:"/Flight/update/" + $("#flight_flightId_edit").val(),
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
						    	console.log(data);
			                	var obj = jQuery.parseJSON(data);
			                    if(obj.success){
			                        $.messager.alert("消息","信息修改成功！");
			                        $("#flightEditDiv").dialog("close");
			                        flight_manage_tool.reload();
			                    }else{
			                        $.messager.alert("消息",obj.message);
			                    } 
						    }
						});
						//提交表单
						$("#flightEditForm").submit();
					}
				}
			},
		},{
			text : "取消",
			iconCls : "icon-redo",
			handler : function () {
				$("#flightEditDiv").dialog("close");
				$("#flightEditForm").form("reset"); 
			},
		}],
	});
});

function initFlightManageTool() {
	flight_manage_tool = {
		init: function() {
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
			//实例化编辑器
			tinyMCE.init({
				selector: "#flight_flightDesc_edit",
				theme: 'advanced',
				language: "zh",
				strict_loading_mode: 1,
			});
		},
		reload : function () {
			$("#flight_manage").datagrid("reload");
		},
		redo : function () {
			$("#flight_manage").datagrid("unselectAll");
		},
		search: function() {
			var queryParams = $("#flight_manage").datagrid("options").queryParams;
			queryParams["flightNumber"] = $("#flightNumber").val();
			queryParams["startStation.stationId"] = $("#startStation_stationId_query").combobox("getValue");
			queryParams["endStation.stationId"] = $("#endStation_stationId_query").combobox("getValue");
			queryParams["startTime"] = $("#startTime").datebox("getValue"); 
			queryParams["endTime"] = $("#endTime").datebox("getValue"); 
			queryParams["seatType.seatTypeId"] = $("#seatType_seatTypeId_query").combobox("getValue");
			queryParams["csrfmiddlewaretoken"] = $('input[name="csrfmiddlewaretoken"]').val();
			$("#flight_manage").datagrid("options").queryParams=queryParams; 
			$("#flight_manage").datagrid("load");
		},
		exportExcel: function() {
			$("#flightQueryForm").form({
			    url:"/Flight/OutToExcel?csrfmiddlewaretoken" + $('input[name="csrfmiddlewaretoken"]').val(),
			});
			//提交表单
			$("#flightQueryForm").submit();
		},
		remove : function () {
			var rows = $("#flight_manage").datagrid("getSelections");
			if (rows.length > 0) {
				$.messager.confirm("确定操作", "您正在要删除所选的记录吗？", function (flag) {
					if (flag) {
						var flightIds = [];
						for (var i = 0; i < rows.length; i ++) {
							flightIds.push(rows[i].flightId);
						}
						$.ajax({
							type : "POST",
							url : "/Flight/deletes",
							data : {
								flightIds : flightIds.join(","),
								"csrfmiddlewaretoken": $('input[name="csrfmiddlewaretoken"]').val()
							},
							beforeSend : function () {
								$("#flight_manage").datagrid("loading");
							},
							success : function (data) {
								if (data.success) {
									$("#flight_manage").datagrid("loaded");
									$("#flight_manage").datagrid("load");
									$("#flight_manage").datagrid("unselectAll");
									$.messager.show({
										title : "提示",
										msg : data.message
									});
								} else {
									$("#flight_manage").datagrid("loaded");
									$("#flight_manage").datagrid("load");
									$("#flight_manage").datagrid("unselectAll");
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
			var rows = $("#flight_manage").datagrid("getSelections");
			if (rows.length > 1) {
				$.messager.alert("警告操作！", "编辑记录只能选定一条数据！", "warning");
			} else if (rows.length == 1) {
				$.ajax({
					url : "/Flight/update/" + rows[0].flightId,
					type : "get",
					data : {
						//flightId : rows[0].flightId,
					},
					beforeSend : function () {
						$.messager.progress({
							text : "正在获取中...",
						});
					},
					success : function (flight, response, status) {
						$.messager.progress("close");
						if (flight) { 
							$("#flightEditDiv").dialog("open");
							$("#flight_flightId_edit").val(flight.flightId);
							$("#flight_flightId_edit").validatebox({
								required : true,
								missingMessage : "请输入记录编号",
								editable: false
							});
							$("#flight_flightNumber_edit").val(flight.flightNumber);
							$("#flight_flightNumber_edit").validatebox({
								required : true,
								missingMessage : "请输入航班号",
							});
							$("#flight_flightPhotoImg").attr("src", flight.flightPhoto);
							$("#flight_startStation_stationId_edit").combobox({
								url:"/StationInfo/listAll?csrfmiddlewaretoken=" + $('input[name="csrfmiddlewaretoken"]').val(),
								method: "GET",
							    valueField:"stationId",
							    textField:"stationName",
							    panelHeight: "auto",
						        editable: false, //不允许手动输入 
						        onLoadSuccess: function () { //数据加载完毕事件
									$("#flight_startStation_stationId_edit").combobox("select", flight.startStationPri);
									//var data = $("#flight_startStation_stationId_edit").combobox("getData"); 
						            //if (data.length > 0) {
						                //$("#flight_startStation_stationId_edit").combobox("select", data[0].stationId);
						            //}
								}
							});
							$("#flight_endStation_stationId_edit").combobox({
								url:"/StationInfo/listAll?csrfmiddlewaretoken=" + $('input[name="csrfmiddlewaretoken"]').val(),
								method: "GET",
							    valueField:"stationId",
							    textField:"stationName",
							    panelHeight: "auto",
						        editable: false, //不允许手动输入 
						        onLoadSuccess: function () { //数据加载完毕事件
									$("#flight_endStation_stationId_edit").combobox("select", flight.endStationPri);
									//var data = $("#flight_endStation_stationId_edit").combobox("getData"); 
						            //if (data.length > 0) {
						                //$("#flight_endStation_stationId_edit").combobox("select", data[0].stationId);
						            //}
								}
							});
							$("#flight_startTime_edit").datetimebox({
								value: flight.startTime,
							    required: true,
							    showSeconds: true,
							});
							$("#flight_endTime_edit").datetimebox({
								value: flight.endTime,
							    required: true,
							    showSeconds: true,
							});
							$("#flight_totalTime_edit").val(flight.totalTime);
							$("#flight_totalTime_edit").validatebox({
								required : true,
								missingMessage : "请输入历时",
							});
							$("#flight_seatType_seatTypeId_edit").combobox({
								url:"/SeatType/listAll?csrfmiddlewaretoken=" + $('input[name="csrfmiddlewaretoken"]').val(),
								method: "GET",
							    valueField:"seatTypeId",
							    textField:"seatTypeName",
							    panelHeight: "auto",
						        editable: false, //不允许手动输入 
						        onLoadSuccess: function () { //数据加载完毕事件
									$("#flight_seatType_seatTypeId_edit").combobox("select", flight.seatTypePri);
									//var data = $("#flight_seatType_seatTypeId_edit").combobox("getData"); 
						            //if (data.length > 0) {
						                //$("#flight_seatType_seatTypeId_edit").combobox("select", data[0].seatTypeId);
						            //}
								}
							});
							$("#flight_price_edit").val(flight.price);
							$("#flight_price_edit").validatebox({
								required : true,
								validType : "number",
								missingMessage : "请输入票价",
								invalidMessage : "票价输入不对",
							});
							$("#flight_seatNumber_edit").val(flight.seatNumber);
							$("#flight_seatNumber_edit").validatebox({
								required : true,
								validType : "integer",
								missingMessage : "请输入总票数",
								invalidMessage : "总票数输入不对",
							});
							$("#flight_leftSeatNumber_edit").val(flight.leftSeatNumber);
							$("#flight_leftSeatNumber_edit").validatebox({
								required : true,
								validType : "integer",
								missingMessage : "请输入剩余票数",
								invalidMessage : "剩余票数输入不对",
							});
							tinyMCE.editors['flight_flightDesc_edit'].setContent(flight.flightDesc);
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
