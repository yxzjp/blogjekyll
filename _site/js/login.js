(function($){
	var conf = {
	  btnId : "qqLoginBtn",//插入按钮的html标签id
	  size : "B_M",//按钮尺寸
	  scope : "get_user_info",//展示授权，全部可用授权可填 all
	  display : "pc"//应用场景，可选
	 }
	var loginFn = function(){
		$(window).trigger("login",{"oInfo":arguments[0],"oOpts":arguments[1]});
	}
	var logoutFn = function(){
		$(window).trigger("logout");
	};
   (function(){
   		if(window.localStorage){
   			try{
				window.localStorage.setItem("test",1);
				window.localStorage.removeItem("test",1);
				$.isSupportLS = true;
   			} catch(e){
   				$.isSupportLS = false;
   			}
   		} else {
   			$.isSupportLS = false;
   		}
   })();
   $.setCookie = function(key,value,hours,path,domain){
   		var slice = [].slice;
   		var args = slice.call(arguments);
   		args[3] = args[3] || "/";
   		args[4] = args[4] || document.domain;
   		document.cookie = args[0]+"="+args[1]+";expired="+new Date((new Date().getTime())+3600*args[2]*1000).toGMTString()+";path="+args[3]+";domain="+args[4];
   }
   $.getCookie = function(name){
   		var r = new RegExp("(?:^|;)\\s*"+name+"\\s*=\\s*([^;|$]+)","gi");
   		var m = r.exec(document.cookie);
   		return !m ? "" : m[1];
   }
   $.getUin = function(){
	   	if($.isSupportLS){
	   		return window.localStorage.getItem("uin");
	   	}
	   	else {
	   		return $.getCookie("uin");
	   	}
   }
	$(window).on("login",function(e,data){
		var tpl = '';
		tpl += '';
		_logoutTemplate=[
            //头像
            '<span><img src="{figureurl}" class="fill"/></span>',
            //昵称
            '<span class="nickname">{nickname}</span>',
            //退出
            '<span><a href="javascript:QC.Login.signOut();">[退出]</a></span>'    
       ].join("");
       $("#"+conf.btnId).html(QC.String.format(_logoutTemplate, {
           nickname : QC.String.escHTML(data.oInfo.nickname), //做xss过滤
           figureurl : data.oInfo.figureurl_qq_1
       }));
       $.ajax({
	       	"url":"http://w.cloud.music.qq.com/fcgi-bin/yqqformeshare.fcg?to=1",
	       	"dataType":"jsonp",
	       	"success":function(json){
	       		if(json.data && json.data.length > 0){
		       		if($.isSupportLS){
		       			window.localStorage.setItem("uin",json.data[0].uin);
		       		}else{
						$.setCookie("uin",json.data[0].uin,30*24);
		       		}
		       	}
	       	}
       });
       QC.Login.getMe(function(openId, accessToken){
       		if($.isSupportLS){
       			window.localStorage.setItem("openId",openId);
       			window.localStorage.setItem("token",accessToken);
       		}else {
       			$.setCookie("openId",openId,30*24);
       			$.setCookie("token",accessToken,30*24);
       		}
       });
	})
	QC.Login(conf,loginFn,logoutFn);
})($);