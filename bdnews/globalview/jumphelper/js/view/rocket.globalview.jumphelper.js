(function ($) {
    rocket.globalview.jumphelper = rocket.globalview.extend({
        el: '#jumphelper_globalview',

        init: function () {
            var me = this;

            me.$el.jumpHelper({
                timeId: 700
            });
        }
    });
})(Zepto);