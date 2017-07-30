/**
 *  @Date: [2017/07/27]
 *  @author [hoyin]
 *  @description [底栏配置的文案滑动组件]
 **/

 var cache = {
    clientWidth: document.documentElement.clientWidth,
    currentLeft:0,
    index: 0,
    time:0,
    startPosX: 0,
    minDistanceX: 20,
    moveDistanceX: 0,
    slidePosX:0,
    pauseMove: false,
    hasMove: false,
    right2left: false
 };
 var slide = function(options,downLoadFun) {
    var options = $.extend({}, options);
    var targetUl = options.targetUl;
    var target = options.target;
    var btnName = options.btnName;
    var targetDot = options.targetDot;
    var currentDot = options.currentDot;
    var counts = options.counts;
    $(targetUl).on('touchstart', target, function(e){
        var startTarget = e.targetTouches[0];
        e.preventDefault();
        cache.time = new Date();
        cache.currentLeft = parseInt($(targetUl).css('left'));
        // cache.currentLeft = parseInt(/(\d+)/.test($(targetUl).css('transform')) ? RegExp.$1 : 0);
        cache.startPosX = startTarget.pageX;
    });

    $(targetUl).on('touchmove', target, function(e){
        var moverTarget = e.targetTouches[0];
        cache.index = $(e.currentTarget).index();
        cache.hasMove = true;
        e.preventDefault();
        if(moverTarget.pageX - cache.startPosX < 0){
            cache.right2left = true; //从右到左
        }else{
            cache.right2left = false; // 从左到右
        }
        if(cache.index == 0 && !cache.right2left || cache.index == (counts-1) && cache.right2left){
            cache.pauseMove = true;
        }else{
            cache.pauseMove = false;
            cache.moveDistanceX = moverTarget.pageX - cache.startPosX;
            $(targetUl).css('left', cache.currentLeft + cache.moveDistanceX);
            // $(targetUl).css('transform', 'translateX(' + (cache.currentLeft + cache.moveDistanceX)+ 'px)');
        }
    });
    $(targetUl).on('touchend', target, function(e){
        e.preventDefault();
        cache.time = new Date() - cache.time;
        if(cache.time < 120){
            if(e.target.className == btnName){
                downLoadFun(e);
            }
            // $(targetUl).css('left', cache.currentLeft);
            $(targetUl).css('transform', 'translateX(' + cache.currentLeft + ')');
        }else{
            if(Math.abs(cache.moveDistanceX) < cache.minDistanceX){
                $(targetUl).css('left', cache.currentLeft);
            }else if(!(cache.pauseMove || !cache.hasMove)){
                cache.index = cache.right2left ? cache.index+1 : cache.index-1;
                cache.slidePosX = cache.index * cache.clientWidth;
                $(targetUl).css('left', -cache.slidePosX);
                // $(targetUl).css('transform', 'translateX(' + (-cache.slidePosX) + 'px)');
                $(targetDot).eq(cache.index).addClass(currentDot).siblings(targetDot).removeClass(currentDot);
            }
        }
        cache.hasMove = false;
    });
 };
 if(typeof define == 'function' && define.amd){
    define('slide', [], function(){
        return slide;
    });
}else if(typeof module != 'undefined'){
    module.exports = slide;
}