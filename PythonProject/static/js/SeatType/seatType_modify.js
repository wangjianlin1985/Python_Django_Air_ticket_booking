$(function () {
    setTimeout(ajaxModifyQuery,"100");
  function ajaxModifyQuery() {	
	$.ajax({
		url : "/SeatType/update/" + $("#seatType_seatTypeId_modify").val(),
		type : "get",
		data : {
			//seatTypeId : $("#seatType_seatTypeId_modify").val(),
		},
		beforeSend : function () {
			$.messager.progress({
				text : "正在获取中...",
			});
		},
		success : function (seatType, response, status) {
			$.messager.progress("close");
			if (seatType) { 
				$("#seatType_seatTypeId_modify").val(seatType.seatTypeId);
				$("#seatType_seatTypeId_modify").validatebox({
					required : true,
					missingMessage : "请输入记录编号",
					editable: false
				});
				$("#seatType_seatTypeName_modify").val(seatType.seatTypeName);
				$("#seatType_seatTypeName_modify").validatebox({
					required : true,
					missingMessage : "请输入席别名称",
				});
			} else {
				$.messager.alert("获取失败！", "未知错误导致失败，请重试！", "warning");
				$(".messager-window").css("z-index",10000);
			}
		}
	});

  }

	$("#seatTypeModifyButton").click(function(){ 
		if ($("#seatTypeModifyForm").form("validate")) {
			$("#seatTypeModifyForm").form({
			    url:"SeatType/update/" + $("#seatType_seatTypeId_modify").val(),
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
			$("#seatTypeModifyForm").submit();
		} else {
			$.messager.alert("错误提示","你输入的信息还有错误！","warning");
			$(".messager-window").css("z-index",10000);
		}
	});
});
