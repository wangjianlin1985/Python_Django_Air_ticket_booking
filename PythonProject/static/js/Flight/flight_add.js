$(function () {
	//实例化航班描述编辑器
    tinyMCE.init({
        selector: "#flight_flightDesc",
        theme: 'advanced',
        language: "zh",
        strict_loading_mode: 1,
    });
	$("#flight_flightNumber").validatebox({
		required : true, 
		missingMessage : '请输入航班号',
	});

	$("#flight_startTime").datetimebox({
	    required : true, 
	    showSeconds: true,
	    editable: false
	});

	$("#flight_endTime").datetimebox({
	    required : true, 
	    showSeconds: true,
	    editable: false
	});

	$("#flight_totalTime").validatebox({
		required : true, 
		missingMessage : '请输入历时',
	});

	$("#flight_price").validatebox({
		required : true,
		validType : "number",
		missingMessage : '请输入票价',
		invalidMessage : '票价输入不对',
	});

	$("#flight_seatNumber").validatebox({
		required : true,
		validType : "integer",
		missingMessage : '请输入总票数',
		invalidMessage : '总票数输入不对',
	});

	$("#flight_leftSeatNumber").validatebox({
		required : true,
		validType : "integer",
		missingMessage : '请输入剩余票数',
		invalidMessage : '剩余票数输入不对',
	});

	//单击添加按钮
	$("#flightAddButton").click(function () {
		if(tinyMCE.editors['flight_flightDesc'].getContent() == "") {
			alert("请输入航班描述");
			return;
		}
		//验证表单 
		if(!$("#flightAddForm").form("validate")) {
			$.messager.alert("错误提示","你输入的信息还有错误！","warning");
			$(".messager-window").css("z-index",10000);
		} else {
			$("#flightAddForm").form({
			    url:"/Flight/add",
				queryParams: {
			    	"csrfmiddlewaretoken": $('input[name="csrfmiddlewaretoken"]').val()
				},
			    onSubmit: function(){
					if($("#flightAddForm").form("validate"))  { 
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
                        $("#flightAddForm").form("clear");
                        tinyMCE.editors['flight_flightDesc'].setContent("");
                    }else{
                        $.messager.alert("消息",obj.message);
                        $(".messager-window").css("z-index",10000);
                    }
			    }
			});
			//提交表单
			$("#flightAddForm").submit();
		}
	});

	//单击清空按钮
	$("#flightClearButton").click(function () { 
		//$("#flightAddForm").form("clear"); 
		location.reload()
	});
});
