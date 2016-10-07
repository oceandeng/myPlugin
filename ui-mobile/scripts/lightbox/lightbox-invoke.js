(function($){
	var sW = 0, sH = 0, dW = 0, dH = 0;
	$(window).load(function(){
		sW = $(window).width();
		sH = $(window).height();
		dW = document.body.clientWidth;
		dH = $('body').height();

		var $postImg = $('.p-img');

		$postImg.each(function(k, v){
			var $_this = $(v);

			var $pImg = $_this.find('.p-img-box');
			var $pImgp = $_this.find('.p-img-box').find('img');
			var pImgW = $pImg.width();

			$pImg.height(pImgW);

			$pImgp.each(function(k, v){
				var w = $(v).width();
				var h = $(v).height();
				var r = w / h;

				if(h < pImgW){
					$(v).css({
						'max-width': 'none',
						'width': parseInt(pImgW * r),
						'height': pImgW,
						'margin-left': -(parseInt(pImgW * r) - pImgW) / 2
					})
				}
			})
		})

		// 图片大图显示
		$postImg.lightBox && $postImg.lightBox({
			width: sW,
			height: sH,
			cEvent: oTools.clickEvent,
			parentClass: '.p-img-box'
		});

		var nImgW = $('.normal').find('.n-icon').find('img').width(),
			nImgH = $('.normal').find('.n-icon').find('img').height();

		$('.n-icon').css({
			height: nImgW,
			overflow: 'hidden'
		});
		$('.n-icon').find('img').css({
			marginTop: -(nImgH - nImgW) / 2
		});

		var nH = $('.n-icon').height();

		$('.n-info').css({
			'height': nH,
			'overflow': 'hidden',
	    	'text-overflow': 'ellipsis'
		});

		$('.activity').find('li').each(function(k, v){
			var $_this = $(this);
			var iH = $_this.find('img').first().height();

			$_this.css({
				height: iH
			})
		});
	})
})(Zepto);