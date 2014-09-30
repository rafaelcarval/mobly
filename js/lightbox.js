// --------------
// DETECT FLASH
// Usage:
// apply .detect-flash to link (anchor) element that points to flash content
// e.g. <a href="file.swf" class="detect-flash">
// --------------
(function($) {
	jQuery.fn.detectFlash = function() {
		if(!swfobject.hasFlashPlayerVersion("1")){
			$(this).filter("[href$='.swf'],[data-media-url$='.swf']")
				.append('<span class="no-flash-message">Você precisa do Flash Player para ver esse conteúdo.</span>')
				.addClass('no-flash');
			$(this).filter("[data-media-type='swf']").attr('data-media-type','').click(function(e){
				e.preventDefault();
			});
		}
		return this;
	};
	$(function() {
		$('.lightbox').detectFlash();
	});
})(jQuery);

// --------------
// DETECT HTML5
// Usage:
// apply .detect-html5 to link (anchor) element that points to HTML5 content
// e.g. <a href="file.swf" class="detect-html5">
// --------------
(function($) {
	jQuery.fn.detectHtml5 = function() {
		var isIE8 = $.browser.msie && +$.browser.version <= 8;
		if ( isIE8 ) {
			$(this).filter("[data-media-type$='html']")
				.append('<span class="no-html5-message">Você precisa de um browser compatível com HTML5 para ver esse conteúdo.</span>')
				.addClass('no-html5');
			$(this).filter("[data-media-type='html']").attr('data-media-type','').click(function(e){
				e.preventDefault();
			});
		}
		return this;
	};
	$(function() {
		$('.lightbox').detectHtml5();
	});
})(jQuery);


// --------------
// LIGHTBOX
// Usage:
// apply .lightbox to link (anchor) element that points to the media file that should open in a lightbox
// needs attribute data-media-type
// --------------
var mediaURL;
var mediaType;

(function($) {
	jQuery.fn.lightbox = function() {

		var $this = $(this);

		// Creates flash container, if it doesn't exist yet
		if($("#flash").length === 0) {
			$("body").append('<div id="flash" style="display:none;"></div>');
		}

		$(this).each(function() {
			// Swaps attributes for flash
			if($(this).is("[data-media-type='swf']")) {
				var swfUrl = $(this).attr('href');
				$(this).attr('data-media-url',swfUrl).attr('href','#flash');
			}
		});

		// Updates variables for fancybox
		$(this).on('click', function(event){
			// update variables
			mediaURL = $(this).attr('href');
			mediaType = $(this).attr('data-media-type');
			if ($(this).is("[data-media-type='swf']")) {
				mediaURL = $(this).attr('data-media-url');
			}
		});

		if ($(this).attr('href')!== ''){

		// Open flash modal
		$(this).filter("[data-media-type='swf']").fancybox({
			width: 1024,
			height: 768,
			autoSize: false,
			aspectRatio: true,
			scrolling: 'no',
			type: 'inline',
			beforeShow: function() {
				$("#flash").empty();
				var flashEmbed = '<object type="application/x-shockwave-flash" data="assets/flash/preloader.swf" width="100%" height="100%">' +
				'<param name="movie" value="assets/flash/preloader.swf">' +
				'<param name="quality" value="high">' +
				'<param name="bgcolor" value="#000000">' +
				'<param name="play" value="true">' +
				'<param name="loop" value="true">' +
				'<param name="wmode" value="transparent">' +
				'<param name="scale" value="showall">' +
				'<param name="menu" value="true">' +
				'<param name="devicefont" value="false">' +
				'<param name="salign" value="lt">' +
				'<param name="allowFullScreen" value="true">' +
				'<param name="flashvars" value="main=' + mediaURL + '">' +
				'<param name="allowScriptAccess" value="sameDomain">' +
				'<a href="http://www.adobe.com/go/getflash">' +
					'<img src="http://www.adobe.com/images/shared/download_buttons/get_flash_player.gif" alt="Get Adobe Flash player">' +
				'</a>' +
				'</object>';
				$('#flash').append(flashEmbed);
			}
		});


		// Trigger video modal
		flowplayer.conf = {
			key: '$280768492889414'
		};
		$(this).filter("[data-media-type='video']").fancybox({
			aspectRatio: true,
			width: '90%',
			height: '90%',
			fitToView: true,
			autoSize: false,
			type: 'video',
			tpl: {
				wrap:   '<div class="fancybox-wrap" tabIndex="-1">' +
						'<div class="fancybox-skin">' +
						'<div class="fancybox-outer">' +
						'<div id="player" class="fixed-controls play-button" data-embed="false">' +
						'</div></div></div></div>'
			},
			beforeShow  : function() {
				$("#player").flowplayer({
					swf: "http://172.16.24.53/~erica/id-ftd/www/digital/assets/flowplayer/flowplayer.swf",
					splash: true,
					playlist: [
						[
							{ mp4:  mediaURL }
						]
					],
				});
				flowplayer("#player").play(0);
			},
			beforeClose : function() {
				flowplayer("#player").unload();
				$("#player").empty();
			}
		});

		// Trigger HTML modal
		$(this).filter("[data-media-type='html']").fancybox({
			width: 1024,
			height: 768,
			autoSize: false,
			aspectRatio: true,
			scrolling: 'no',
			type: 'iframe',
			afterShow: function() {
				$('.fancybox-iframe').contents().find('#_FTD_fechar').bind('click', function(){
					$.fancybox.close( true );
				});
			}
		});

		// Trigger external site modal
		// $(this).filter("[data-media-type='link']").fancybox({
		// 	width: 1024,
		// 	height: 768,
		// 	autoSize: false,
		// 	aspectRatio: true,
		// 	scrolling: 'no',
		// 	type: 'iframe'
		// });

		// Instead, just open in new tab
		$(this).filter("[data-media-type='link']").attr("target", "_blank");

		};

		return this;
	};
	$(function() {
		$('.lightbox').lightbox();
	});
})(jQuery);
