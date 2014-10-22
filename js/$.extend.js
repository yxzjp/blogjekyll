(function($) {
	$.extend($, {
		getUrlParam: function(p, l) {
			var r = new RegExp("[\?&]+" + p + "=([^&#]+)", "gi");
			var m = r.exec(l || location.href);
			return !m ? "" : m[1];
		}
	});
	$.fn.inUserView = function(mod) {
		if($(this).is(":hidden")){
			return false;
		}
		var docscrol = {
			left: document.documentElement.scrollLeft || document.body.scrollLeft,
			top: document.documentElement.scrollTop || document.body.scrollTop
		}
		mod = mod || (document.compatMode == "CSS1Compat" ? document.documentElement : document.body);
		var pos = $(this).offset() || {};
		var modpos = {
			"left": $(mod).offset().left + mod.scrollLeft + docscrol.left,
			"top": $(mod).offset().top + mod.scrollTop + docscrol.top,
			"right": $(mod).offset().top + mod.scrollLeft + docscrol.left + mod.clientWidth,
			"bottom": $(mod).offset().top + mod.scrollTop + docscrol.top + mod.clientHeight
		}
		return pos.left+$(this).width() >= modpos.left && pos.top+$(this).height() >= modpos.top && pos.left <= modpos.right && pos.top <= modpos.bottom;
	};
})($);