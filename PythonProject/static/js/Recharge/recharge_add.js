$(function () {
	$("#recharge_money").validatebox({
		required : true,
		validType : "number",
		missingMessage : '请输入充值金额',
		invalidMessage : '充值金额输入不对',
	});

	/*
	$("#recharge_chargeTime").validatebox({
		required : true,
		missingMessage : '请输入充值时间',
	});
	*/

	//单击添加按钮
	$("#rechargeAddButton").click(function () {
		//验证表单 
		if(!$("#rechargeAddForm").form("validate")) {
			$.messager.alert("错误提示","你输入的信息还有错误！","warning");
			$(".messager-window").css("z-index",10000);
		} else {
			$("#rechargeAddForm").form({
			    url:"/Recharge/add",
				queryParams: {
			    	"csrfmiddlewaretoken": $('input[name="csrfmiddlewaretoken"]').val()
				},
			    onSubmit: function(){
					if($("#rechargeAddForm").form("validate"))  { 
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
                    //此处data={"Success":true}是字符串
                	var obj = jQuery.parseJSON(data); 
                    if(obj.success){ 
                        $.messager.alert("消息","充值成功！");
                        $(".messager-window").css("z-index",10000);
                        $("#rechargeAddForm").form("clear");
                    }else{
                        $.messager.alert("消息",obj.message);
                        $(".messager-window").css("z-index",10000);
                    }
			    }
			});
			//提交表单
			$("#rechargeAddForm").submit();
		}
	});

	//单击清空按钮
	$("#rechargeClearButton").click(function () { 
		//$("#rechargeAddForm").form("clear"); 
		location.reload()
	});
});
