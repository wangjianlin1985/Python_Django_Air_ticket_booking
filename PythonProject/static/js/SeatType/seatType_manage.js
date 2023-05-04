var seatType_manage_tool = null; 
$(function () { 
	initSeatTypeManageTool(); //建立SeatType管理对象
	seatType_manage_tool.init(); //如果需要通过下拉框查询，首先初始化下拉框的值
	$("#seatType_manage").datagrid({
		url : '/SeatType/list',
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
		sortName : "seatTypeId",
		sortOrder : "desc",
		toolbar : "#seatType_manage_tool",
		columns : [[
			{
				field : "seatTypeId",
				title : "记录编号",
				width : 70,
			},
			{
				field : "seatTypeName",
				title : "席别名称",
				width : 140,
			},
		]],
	});

	$("#seatTypeEditDiv").dialog({
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
				if ($("#seatTypeEditForm").form("validate")) {
					//验证表单 
					if(!$("#seatTypeEditForm").form("validate")) {
						$.messager.alert("错误提示","你输入的信息还有错误！","warning");
					} else {
						$("#seatTypeEditForm").form({
						    url:"/SeatType/update/" + $("#seatType_seatTypeId_edit").val(),
						    onSubmit: function(){
								if($("#seatTypeEditForm").form("validate"))  {
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
			                        $("#seatTypeEditDiv").dialog("close");
			                        seatType_manage_tool.reload();
			                    }else{
			                        $.messager.alert("消息",obj.message);
			                    } 
						    }
						});
						//提交表单
						$("#seatTypeEditForm").submit();
					}
				}
			},
		},{
			text : "取消",
			iconCls : "icon-redo",
			handler : function () {
				$("#seatTypeEditDiv").dialog("close");
				$("#seatTypeEditForm").form("reset"); 
			},
		}],
	});
});

function initSeatTypeManageTool() {
	seatType_manage_tool = {
		init: function() {
		},
		reload : function () {
			$("#seatType_manage").datagrid("reload");
		},
		redo : function () {
			$("#seatType_manage").datagrid("unselectAll");
		},
		search: function() {
			$("#seatType_manage").datagrid("options").queryParams=queryParams; 
			$("#seatType_manage").datagrid("load");
		},
		exportExcel: function() {
			$("#seatTypeQueryForm").form({
			    url:"/SeatType/OutToExcel?csrfmiddlewaretoken" + $('input[name="csrfmiddlewaretoken"]').val(),
			});
			//提交表单
			$("#seatTypeQueryForm").submit();
		},
		remove : function () {
			var rows = $("#seatType_manage").datagrid("getSelections");
			if (rows.length > 0) {
				$.messager.confirm("确定操作", "您正在要删除所选的记录吗？", function (flag) {
					if (flag) {
						var seatTypeIds = [];
						for (var i = 0; i < rows.length; i ++) {
							seatTypeIds.push(rows[i].seatTypeId);
						}
						$.ajax({
							type : "POST",
							url : "/SeatType/deletes",
							data : {
								seatTypeIds : seatTypeIds.join(","),
								"csrfmiddlewaretoken": $('input[name="csrfmiddlewaretoken"]').val()
							},
							beforeSend : function () {
								$("#seatType_manage").datagrid("loading");
							},
							success : function (data) {
								if (data.success) {
									$("#seatType_manage").datagrid("loaded");
									$("#seatType_manage").datagrid("load");
									$("#seatType_manage").datagrid("unselectAll");
									$.messager.show({
										title : "提示",
										msg : data.message
									});
								} else {
									$("#seatType_manage").datagrid("loaded");
									$("#seatType_manage").datagrid("load");
									$("#seatType_manage").datagrid("unselectAll");
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
			var rows = $("#seatType_manage").datagrid("getSelections");
			if (rows.length > 1) {
				$.messager.alert("警告操作！", "编辑记录只能选定一条数据！", "warning");
			} else if (rows.length == 1) {
				$.ajax({
					url : "/SeatType/update/" + rows[0].seatTypeId,
					type : "get",
					data : {
						//seatTypeId : rows[0].seatTypeId,
					},
					beforeSend : function () {
						$.messager.progress({
							text : "正在获取中...",
						});
					},
					success : function (seatType, response, status) {
						$.messager.progress("close");
						if (seatType) { 
							$("#seatTypeEditDiv").dialog("open");
							$("#seatType_seatTypeId_edit").val(seatType.seatTypeId);
							$("#seatType_seatTypeId_edit").validatebox({
								required : true,
								missingMessage : "请输入记录编号",
								editable: false
							});
							$("#seatType_seatTypeName_edit").val(seatType.seatTypeName);
							$("#seatType_seatTypeName_edit").validatebox({
								required : true,
								missingMessage : "请输入席别名称",
							});
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
