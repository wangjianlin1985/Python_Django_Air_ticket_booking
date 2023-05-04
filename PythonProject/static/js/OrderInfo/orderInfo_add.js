$(function () {
	$("#orderInfo_startTime").datetimebox({
	    required : true, 
	    showSeconds: true,
	    editable: false
	});

	$("#orderInfo_endTime").datetimebox({
	    required : true, 
	    showSeconds: true,
	    editable: false
	});

	$("#orderInfo_seatNum").validatebox({
		required : true,
		validType : "integer",
		missingMessage : '请输入预定票数',
		invalidMessage : '预定票数输入不对',
	});

	$("#orderInfo_totalPrice").validatebox({
		required : true,
		validType : "number",
		missingMessage : '请输入总票价',
		invalidMessage : '总票价输入不对',
	});

	//单击添加按钮
	$("#orderInfoAddButton").click(function () {
		//验证表单 
		if(!$("#orderInfoAddForm").form("validate")) {
			$.messager.alert("错误提示","你输入的信息还有错误！","warning");
			$(".messager-window").css("z-index",10000);
		} else {
			$("#orderInfoAddForm").form({
			    url:"/OrderInfo/add",
				queryParams: {
			    	"csrfmiddlewaretoken": $('input[name="csrfmiddlewaretoken"]').val()
				},
			    onSubmit: function(){
					if($("#orderInfoAddForm").form("validate"))  { 
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
                        $.messager.alert("消息","保存成功！");
                        $(".messager-window").css("z-index",10000);
                        $("#orderInfoAddForm").form("clear");
                    }else{
                        $.messager.alert("消息",obj.message);
                        $(".messager-window").css("z-index",10000);
                    }
			    }
			});
			//提交表单
			$("#orderInfoAddForm").submit();
		}
	});

	//单击清空按钮
	$("#orderInfoClearButton").click(function () { 
		//$("#orderInfoAddForm").form("clear"); 
		location.reload()
	});
});
