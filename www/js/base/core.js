
//loadNicely
(function ($) {

    $.fn.loadNicely = function (options) {

        var defaults = {
            src : "",
            preLoad: function (img) { },
            onLoad: function (img) { $(img).fadeIn(200); }
        };

        var options = $.extend(defaults, options);

        return this.each(function () {

//            debugger;

            if (!this.complete) {
                options.preLoad(this);
                $(this).load(function () { options.onLoad(this); }).attr("src", this.src);
            }
            else {
                options.onLoad(this);
            }
        });
    };
})(jQuery);
