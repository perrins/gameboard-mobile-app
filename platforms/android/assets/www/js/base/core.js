//loadNicely
(function ($) {
	$.fn.loadNicely = function (options) {

		var defaults = {
			src : "",
			preLoad: function () {},
			onLoad: function (img) {
				$(img).fadeIn(200);
			}
		};

		options = $.extend(defaults, options);

		return this.each(function () {
			if (!this.complete) {
				options.preLoad(this);
				$(this).load(function () {
					options.onLoad(this);
				}).attr("src", this.src);
			} else {
				options.onLoad(this);
			}
		});
	};
})(jQuery);