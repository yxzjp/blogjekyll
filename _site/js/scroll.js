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
})(window,$);