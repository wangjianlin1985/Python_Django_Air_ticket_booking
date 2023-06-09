var recharge_manage_tool = null; 
$(function () { 
	initRechargeManageTool(); //建立Recharge管理对象
	recharge_manage_tool.init(); //如果需要通过下拉框查询，首先初始化下拉框的值
	$("#recharge_manage").datagrid({
		url : '/Recharge/list',
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
		sortName : "id",
		sortOrder : "desc",
		toolbar : "#recharge_manage_tool",
		columns : [[
			{
				field : "userObj",
				title : "充值用户",
				width : 140,
			},
			{
				field : "money",
				title : "充值金额",
				width : 70,
			},
			{
				field : "chargeTime",
				title : "充值时间",
				width : 140,
			},
		]],
	});

	$("#rechargeEditDiv").dialog({
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
				if ($("#rechargeEditForm").form("validate")) {
					//验证表单 
					if(!$("#rechargeEditForm").form("validate")) {
						$.messager.alert("错误提示","你输入的信息还有错误！","warning");
					} else {
						$("#rechargeEditForm").form({
						    url:"/Recharge/update/" + $("#recharge_id_edit").val(),
						    onSubmit: function(){
								if($("#rechargeEditForm").form("validate"))  {
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
			                        $("#rechargeEditDiv").dialog("close");
			                        recharge_manage_tool.reload();
			                    }else{
			                        $.messager.alert("消息",obj.message);
			                    } 
						    }
						});
						//提交表单
						$("#rechargeEditForm").submit();
					}
				}
			},
		},{
			text : "取消",
			iconCls : "icon-redo",
			handler : function () {
				$("#rechargeEditDiv").dialog("close");
				$("#rechargeEditForm").form("reset"); 
			},
		}],
	});
});

function initRechargeManageTool() {
	recharge_manage_tool = {
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
		},
		reload : function () {
			$("#recharge_manage").datagrid("reload");
		},
		redo : function () {
			$("#recharge_manage").datagrid("unselectAll");
		},
		search: function() {
			var queryParams = $("#recharge_manage").datagrid("options").queryParams;
			queryParams["chargeTime"] = $("#chargeTime").val();
			queryParams["userObj.user_name"] = $("#userObj_user_name_query").combobox("getValue");
			queryParams["csrfmiddlewaretoken"] = $('input[name="csrfmiddlewaretoken"]').val();
			$("#recharge_manage").datagrid("options").queryParams=queryParams; 
			$("#recharge_manage").datagrid("load");
		},
		exportExcel: function() {
			$("#rechargeQueryForm").form({
			    url:"/Recharge/OutToExcel?csrfmiddlewaretoken" + $('input[name="csrfmiddlewaretoken"]').val(),
			});
			//提交表单
			$("#rechargeQueryForm").submit();
		},
		remove : function () {
			var rows = $("#recharge_manage").datagrid("getSelections");
			if (rows.length > 0) {
				$.messager.confirm("确定操作", "您正在要删除所选的记录吗？", function (flag) {
					if (flag) {
						var ids = [];
						for (var i = 0; i < rows.length; i ++) {
							ids.push(rows[i].id);
						}
						$.ajax({
							type : "POST",
							url : "/Recharge/deletes",
							data : {
								ids : ids.join(","),
								"csrfmiddlewaretoken": $('input[name="csrfmiddlewaretoken"]').val()
							},
							beforeSend : function () {
								$("#recharge_manage").datagrid("loading");
							},
							success : function (data) {
								if (data.success) {
									$("#recharge_manage").datagrid("loaded");
									$("#recharge_manage").datagrid("load");
									$("#recharge_manage").datagrid("unselectAll");
									$.messager.show({
										title : "提示",
										msg : data.message
									});
								} else {
									$("#recharge_manage").datagrid("loaded");
									$("#recharge_manage").datagrid("load");
									$("#recharge_manage").datagrid("unselectAll");
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
			var rows = $("#recharge_manage").datagrid("getSelections");
			if (rows.length > 1) {
				$.messager.alert("警告操作！", "编辑记录只能选定一条数据！", "warning");
			} else if (rows.length == 1) {
				$.ajax({
					url : "/Recharge/update/" + rows[0].id,
					type : "get",
					data : {
						//id : rows[0].id,
					},
					beforeSend : function () {
						$.messager.progress({
							text : "正在获取中...",
						});
					},
					success : function (recharge, response, status) {
						$.messager.progress("close");
						if (recharge) { 
							$("#rechargeEditDiv").dialog("open");
							$("#recharge_id_edit").val(recharge.id);
							$("#recharge_id_edit").validatebox({
								required : true,
								missingMessage : "请输入记录编号",
								editable: false
							});
							$("#recharge_userObj_user_name_edit").combobox({
								url:"/UserInfo/listAll?csrfmiddlewaretoken=" + $('input[name="csrfmiddlewaretoken"]').val(),
								method: "GET",
							    valueField:"user_name",
							    textField:"realName",
							    panelHeight: "auto",
						        editable: false, //不允许手动输入 
						        onLoadSuccess: function () { //数据加载完毕事件
									$("#recharge_userObj_user_name_edit").combobox("select", recharge.userObjPri);
									//var data = $("#recharge_userObj_user_name_edit").combobox("getData"); 
						            //if (data.length > 0) {
						                //$("#recharge_userObj_user_name_edit").combobox("select", data[0].user_name);
						            //}
								}
							});
							$("#recharge_money_edit").val(recharge.money);
							$("#recharge_money_edit").validatebox({
								required : true,
								validType : "number",
								missingMessage : "请输入充值金额",
								invalidMessage : "充值金额输入不对",
							});
							$("#recharge_rechargeMemo_edit").val(recharge.rechargeMemo);
							$("#recharge_chargeTime_edit").val(recharge.chargeTime);
							$("#recharge_chargeTime_edit").validatebox({
								required : true,
								missingMessage : "请输入充值时间",
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
