$(function(){
	/*
	$(".navs").on('mouseenter', function() {
		$(".navs > .nav2").slideDown('slow');
	});
	*/
	var innerGroup = $(".innerwraper");
	var spanGroup = $(".pagination span");
	var imgWidth = $(".innerwraper img:first-child").eq(0).width();
	var _index = 0;
	var timer = null;
	spanGroup.on("click", function() {
	    //导航切换
	    _index = spanGroup.index($(this));
	    selectPic(_index);

	})

	function autoGo() {
	    //自动行走
	    timer = setInterval(go, 5000);
	}
	//调用自动播放
	autoGo();

	function go() {
	    //计时器的函数
	    _index++;
	    selectPic(_index);
	}

	function selectPic(num) {
	    clearInterval(timer);
	    //让我们点击的小圆点背景色变白
	    $(".pagination span").eq(num).addClass("active").siblings().removeClass("active");
	    //小圆点切换至最后的时候,再次切换的时候呢,让第一个小圆点变白,周而复始
	    if (num % 4 == 0) {
	        $(".pagination span").eq(0).addClass("active").siblings().removeClass("active");
	    }
	    $(".inner").stop().animate({
	        left: -num * imgWidth,
	    }, 1000, function() {
	        //点击切换图片效果结束以后,要开始自动播放啦
	        timer = setInterval(go, 3000);
	        //自动播放检查是否到最后一张
	        if (_index == innerGroup.length - 1) {
	            //最后一张图片的时候,让_index = 0
	            _index %= 4;
	            $(".inner").css("left", "0px");
	        }
	    })
	}
})


			
			