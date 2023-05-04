var stationInfo_manage_tool = null; 
$(function () { 
	initStationInfoManageTool(); //建立StationInfo管理对象
	stationInfo_manage_tool.init(); //如果需要通过下拉框查询，首先初始化下拉框的值
	$("#stationInfo_manage").datagrid({
		url : '/StationInfo/list',
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
		sortName : "stationId",
		sortOrder : "desc",
		toolbar : "#stationInfo_manage_tool",
		columns : [[
			{
				field : "stationName",
				title : "机场名称",
				width : 140,
			},
			{
				field : "connectPerson",
				title : "联系人",
				width : 140,
			},
			{
				field : "telephone",
				title : "联系电话",
				width : 140,
			},
			{
				field : "postcode",
				title : "邮编",
				width : 140,
			},
			{
				field : "address",
				title : "通讯地址",
				width : 140,
			},
		]],
	});

	$("#stationInfoEditDiv").dialog({
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
				if ($("#stationInfoEditForm").form("validate")) {
					//验证表单 
					if(!$("#stationInfoEditForm").form("validate")) {
						$.messager.alert("错误提示","你输入的信息还有错误！","warning");
					} else {
						$("#stationInfoEditForm").form({
						    url:"/StationInfo/update/" + $("#stationInfo_stationId_edit").val(),
						    onSubmit: function(){
								if($("#stationInfoEditForm").form("validate"))  {
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
			                        $("#stationInfoEditDiv").dialog("close");
			                        stationInfo_manage_tool.reload();
			                    }else{
			                        $.messager.alert("消息",obj.message);
			                    } 
						    }
						});
						//提交表单
						$("#stationInfoEditForm").submit();
					}
				}
			},
		},{
			text : "取消",
			iconCls : "icon-redo",
			handler : function () {
				$("#stationInfoEditDiv").dialog("close");
				$("#stationInfoEditForm").form("reset"); 
			},
		}],
	});
});

function initStationInfoManageTool() {
	stationInfo_manage_tool = {
		init: function() {
		},
		reload : function () {
			$("#stationInfo_manage").datagrid("reload");
		},
		redo : function () {
			$("#stationInfo_manage").datagrid("unselectAll");
		},
		search: function() {
			var queryParams = $("#stationInfo_manage").datagrid("options").queryParams;
			queryParams["stationName"] = $("#stationName").val();
			queryParams["connectPerson"] = $("#connectPerson").val();
			queryParams["telephone"] = $("#telephone").val();
			queryParams["postcode"] = $("#postcode").val();
			queryParams["csrfmiddlewaretoken"] = $('input[name="csrfmiddlewaretoken"]').val();
			$("#stationInfo_manage").datagrid("options").queryParams=queryParams; 
			$("#stationInfo_manage").datagrid("load");
		},
		exportExcel: function() {
			$("#stationInfoQueryForm").form({
			    url:"/StationInfo/OutToExcel?csrfmiddlewaretoken" + $('input[name="csrfmiddlewaretoken"]').val(),
			});
			//提交表单
			$("#stationInfoQueryForm").submit();
		},
		remove : function () {
			var rows = $("#stationInfo_manage").datagrid("getSelections");
			if (rows.length > 0) {
				$.messager.confirm("确定操作", "您正在要删除所选的记录吗？", function (flag) {
					if (flag) {
						var stationIds = [];
						for (var i = 0; i < rows.length; i ++) {
							stationIds.push(rows[i].stationId);
						}
						$.ajax({
							type : "POST",
							url : "/StationInfo/deletes",
							data : {
								stationIds : stationIds.join(","),
								"csrfmiddlewaretoken": $('input[name="csrfmiddlewaretoken"]').val()
							},
							beforeSend : function () {
								$("#stationInfo_manage").datagrid("loading");
							},
							success : function (data) {
								if (data.success) {
									$("#stationInfo_manage").datagrid("loaded");
									$("#stationInfo_manage").datagrid("load");
									$("#stationInfo_manage").datagrid("unselectAll");
									$.messager.show({
										title : "提示",
										msg : data.message
									});
								} else {
									$("#stationInfo_manage").datagrid("loaded");
									$("#stationInfo_manage").datagrid("load");
									$("#stationInfo_manage").datagrid("unselectAll");
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
			var rows = $("#stationInfo_manage").datagrid("getSelections");
			if (rows.length > 1) {
				$.messager.alert("警告操作！", "编辑记录只能选定一条数据！", "warning");
			} else if (rows.length == 1) {
				$.ajax({
					url : "/StationInfo/update/" + rows[0].stationId,
					type : "get",
					data : {
						//stationId : rows[0].stationId,
					},
					beforeSend : function () {
						$.messager.progress({
							text : "正在获取中...",
						});
					},
					success : function (stationInfo, response, status) {
						$.messager.progress("close");
						if (stationInfo) { 
							$("#stationInfoEditDiv").dialog("open");
							$("#stationInfo_stationId_edit").val(stationInfo.stationId);
							$("#stationInfo_stationId_edit").validatebox({
								required : true,
								missingMessage : "请输入记录编号",
								editable: false
							});
							$("#stationInfo_stationName_edit").val(stationInfo.stationName);
							$("#stationInfo_stationName_edit").validatebox({
								required : true,
								missingMessage : "请输入机场名称",
							});
							$("#stationInfo_connectPerson_edit").val(stationInfo.connectPerson);
							$("#stationInfo_connectPerson_edit").validatebox({
								required : true,
								missingMessage : "请输入联系人",
							});
							$("#stationInfo_telephone_edit").val(stationInfo.telephone);
							$("#stationInfo_postcode_edit").val(stationInfo.postcode);
							$("#stationInfo_postcode_edit").validatebox({
								required : true,
								missingMessage : "请输入邮编",
							});
							$("#stationInfo_address_edit").val(stationInfo.address);
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
