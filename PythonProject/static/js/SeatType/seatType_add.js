$(function () {
	$("#seatType_seatTypeName").validatebox({
		required : true, 
		missingMessage : '请输入席别名称',
	});

	//单击添加按钮
	$("#seatTypeAddButton").click(function () {
		//验证表单 
		if(!$("#seatTypeAddForm").form("validate")) {
			$.messager.alert("错误提示","你输入的信息还有错误！","warning");
			$(".messager-window").css("z-index",10000);
		} else {
			$("#seatTypeAddForm").form({
			    url:"/SeatType/add",
				queryParams: {
			    	"csrfmiddlewaretoken": $('input[name="csrfmiddlewaretoken"]').val()
				},
			    onSubmit: function(){
					if($("#seatTypeAddForm").form("validate"))  { 
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
                        $("#seatTypeAddForm").form("clear");
                    }else{
                        $.messager.alert("消息",obj.message);
                        $(".messager-window").css("z-index",10000);
                    }
			    }
			});
			//提交表单
			$("#seatTypeAddForm").submit();
		}
	});

	//单击清空按钮
	$("#seatTypeClearButton").click(function () { 
		//$("#seatTypeAddForm").form("clear"); 
		location.reload()
	});
});
