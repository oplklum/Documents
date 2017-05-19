var p2p_base='http://c.h3c.com.cn/';

function init(){
	var _href=window.location.href;
	if(is_mobile()){
		var phone_p2p_flag=false;
		if(_href.indexOf("#p2p")>0){
		    phone_p2p_flag=true;
		}
		var myFun2=function(param) {
			if(phone_p2p_flag||param){				
				if(phone_p2p_flag){
					set_phone_p2p();					
				}
				share2pc();				
			}else{				
				var preShare=function(param){};
				pre_share(preShare);
			}
		}
		check_phone_p2p(myFun2);
	}else{		
		var p2p_flag=false;
		if(_href.indexOf("#p2p")>0){
		    p2p_flag=true;
		}
		var myFun=function(param){
			if(p2p_flag||param){
				if(p2p_flag){
					setp2p();
				}
				phone_waiting();
			}else{}
		}
		check_p2p(myFun);
	}
}
function set_phone_p2p(){
	var param='';
	$.ajax({
		async:false,
		type : 'get',
		url: p2p_base+'set_phone_p2p.php',
		dataType:'jsonp',
		data: param,
        jsonp:'callback',
		jsonpCallback:"spp_success_jsonpCallback",
		success:function(result){}
	});
}
function setp2p(){
	var param='';
	$.ajax({
		async:false,
		type : 'get',
		url: p2p_base+'set_p2p.php',
		dataType:'jsonp',
		data: param,
        jsonp:'callback',
		jsonpCallback:"sp_success_jsonpCallback",
		success:function(result){}
	});
}
function share2pc(){
	var _href=window.location.href;
	var param={"href":_href};
	$.ajax({
		async:false,
		type : 'get',
		url: p2p_base+'share2pc.php',
		dataType:'jsonp',
		data: param,
        jsonp:'callback',
		jsonpCallback:"s2pc_success_jsonpCallback",
		success:function(result){}
	});
}
function pre_share(func){
	var _href=window.location.href;
	var param={"href":_href};
	$.ajax({
		async:false,
		type : 'get',
		url: p2p_base+'pre_share.php',
		dataType:'jsonp',
		data: param,
        jsonp:'callback',
		jsonpCallback:"ps_success_jsonpCallback",
		success:function(result){
			func(result);
		}
	});
}
function check_phone_p2p(func){
	var param='';
	$.ajax({
		async:false,
		type : 'get',
		url: p2p_base+'check_phone_p2p.php',
		dataType:'jsonp',
		data: param,
        jsonp:'callback',
		jsonpCallback:"cpp_success_jsonpCallback",
		success:function(result){
			func(result);
		}
	});
}
function phone_waiting(){
	$.ajax({
		async:false,
		type : 'get',
		url: p2p_base+'load.php',
		dataType:'jsonp',
		data: '',
        jsonp:'callback',
		jsonpCallback:"pw_success_jsonpCallback",
		success:function(result){
			if(result=='blank'){
                window.setTimeout(function(){
					phone_waiting();
				},2000);
            }else{
                window.location.href=result;
            }
		},
		'error':function(code){
			console.log(code);
			window.setTimeout(function(){
				phone_waiting();
			},5000);
		}
	});
}
function check_p2p(func){
	$.ajax({
		async:false,
		type : 'get',
		url: p2p_base+'check_p2p.php',
		dataType:'jsonp',
		data: '',
        jsonp:'callback',
		jsonpCallback:"cp_success_jsonpCallback",
		success:function(result){
			func(result);
		}
	});
}
//判断是否为移动端运行环境
function is_mobile(){
	if(/AppleWebKit.*Mobile/i.test(navigator.userAgent) || (/MIDP|SymbianOS|NOKIA|SAMSUNG|LG|NEC|TCL|Alcatel|BIRD|DBTEL|Dopod|PHILIPS|HAIER|LENOVO|MOT-|Nokia|SonyEricsson|SIE-|Amoi|ZTE/.test(navigator.userAgent))){
		if(window.location.href.indexOf("?mobile")<0){
			return true;
			try{
				if(/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)){
					// 判断访问环境是 Android|webOS|iPhone|iPod|BlackBerry 则加载以下样式
				}else if(/iPad/i.test(navigator.userAgent)){
					// 判断访问环境是 iPad 则加载以下样式
				}else{
					// 判断访问环境是 其他移动设备 则加载以下样式
				}
			}catch(e){}
		}
	}else{
		return false;
	}
}



















