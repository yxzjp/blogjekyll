(function(window,$){
	function Scroller(){
		this.mods = $("[data-type='mod']");
		this.triggers = $("[data-type='trigger']");
		this.curPage = 0;
		this.init();
		this.bindTrigger();
		this.scrolling = false;
	}
	Scroller.prototype.init = function(){
		var self = this;
		if(window.addEventListener){
			window.addEventListener("DOMMouseScroll",function(e){
				self.go(-e.detail);
				e.preventDefault();
			});
			window.addEventListener("mousewheel",function(e){
				self.go(e.wheelDelta);
				e.preventDefault();
			});
			window.addEventListener("MozMousePixelScroll",function(e){
				e.preventDefault();
			});
		} else {
			window.onmousewheel = document.onmousewheel = function(e){
				self.go(e.wheelDelta);
				e.returnValue = false;
			};
		}
	}
	Scroller.prototype.bindTrigger = function(){
		var self = this;
		this.triggers.on("click",function(){
			self.scroll(self.triggers.index($(this)));
		});
	}
	Scroller.prototype.go = function(direct){
		var self = this;
		if(this.scrolling) {
			return;
		}
		if(direct > 0){
			if(this.curPage > 0){
				this.scroll(--this.curPage);
			}
		} else {
			if(this.curPage < this.mods.size()-1){
				this.scroll(++this.curPage);
			}
		}
	}
	Scroller.prototype.scroll = function(page){
		var self = this;
		if(page < 0) return ;
		this.curPage = (page === "undefined" ? this.curPage : page);
		this.scrolling = true;
		$('html,body').animate({
			scrollTop : self.mods.eq(self.curPage).offset().top
		},1000,function(){
			self.scrolling = false;
			self.triggers.removeClass("current").eq(self.curPage).addClass("current");
		});
	}
	var page = new Scroller();
	$(window).on("scroll",_.throttle(function(){
		if($(window).scrollTop() >= page.mods.eq(1).offset().top){
			$(".gotop").show();
		}else {
			$(".gotop").hide();
		}
	},300));
	$(".gotop").on("click",function(){
		page.scroll(0);
	});
	var st = $(window).scrollTop();
	for(var i=0,t=0;i<page.mods.size();i++){
		if(t>=st){
			page.scroll(--i);
			break;
		}else {
			t+=page.mods.eq(i).offset().top;
		}
	}
	if(t>=st && i==page.mods.size()){
		page.scroll(--i);
	}
})(window,$);;(function($){
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