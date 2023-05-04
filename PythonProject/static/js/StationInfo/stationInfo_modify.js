$(function () {
    setTimeout(ajaxModifyQuery,"100");
  function ajaxModifyQuery() {	
	$.ajax({
		url : "/StationInfo/update/" + $("#stationInfo_stationId_modify").val(),
		type : "get",
		data : {
			//stationId : $("#stationInfo_stationId_modify").val(),
		},
		beforeSend : function () {
			$.messager.progress({
				text : "正在获取中...",
			});
		},
		success : function (stationInfo, response, status) {
			$.messager.progress("close");
			if (stationInfo) { 
				$("#stationInfo_stationId_modify").val(stationInfo.stationId);
				$("#stationInfo_stationId_modify").validatebox({
					required : true,
					missingMessage : "请输入记录编号",
					editable: false
				});
				$("#stationInfo_stationName_modify").val(stationInfo.stationName);
				$("#stationInfo_stationName_modify").validatebox({
					required : true,
					missingMessage : "请输入机场名称",
				});
				$("#stationInfo_connectPerson_modify").val(stationInfo.connectPerson);
				$("#stationInfo_connectPerson_modify").validatebox({
					required : true,
					missingMessage : "请输入联系人",
				});
				$("#stationInfo_telephone_modify").val(stationInfo.telephone);
				$("#stationInfo_postcode_modify").val(stationInfo.postcode);
				$("#stationInfo_postcode_modify").validatebox({
					required : true,
					missingMessage : "请输入邮编",
				});
				$("#stationInfo_address_modify").val(stationInfo.address);
			} else {
				$.messager.alert("获取失败！", "未知错误导致失败，请重试！", "warning");
				$(".messager-window").css("z-index",10000);
			}
		}
	});

  }

	$("#stationInfoModifyButton").click(function(){ 
		if ($("#stationInfoModifyForm").form("validate")) {
			$("#stationInfoModifyForm").form({
			    url:"StationInfo/update/" + $("#stationInfo_stationId_modify").val(),
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
			$("#stationInfoModifyForm").submit();
		} else {
			$.messager.alert("错误提示","你输入的信息还有错误！","warning");
			$(".messager-window").css("z-index",10000);
		}
	});
});
