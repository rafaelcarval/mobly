// --------------
// FIX IMAGENS ANIMADAS RATIO
// --------------
$(window).load(function(){
	var iaOriginalImgWidth = $('.digi-item-ia .digi-item-thumb').width();
	$('.digi-item-ia .digi-item-thumb').height(iaOriginalImgWidth * 0.55555555555);

	$(window).resize(function() {
		var iaRespImgWidth = $('.digi-item-ia .digi-item-thumb').width();
		$('.digi-item-ia .digi-item-thumb').height(iaRespImgWidth * 0.55555555555);
	});
});



// --------------
// EQUAL HEIGHTS
// Usage: $('.fix-height').eqHeights()
// Call after elements are loaded
// --------------
(function($) {
	jQuery.fn.eqHeights = function() {
		var el = $(this);
		if (el.length > 0 && !el.data('eqHeights')) {
			$(window).bind('resize.eqHeights', function() {
				el.eqHeights();
			});
			el.data('eqHeights', true);
		}
		return el.each(function() {
			var curHighest = 0;
			$(this).children().find('.thumbnail').each(function() {
				var el = $(this),
					elHeight = el.height('auto').height();
				if (elHeight > curHighest) {
					curHighest = elHeight;
				}
				if (curHighest !== 0) {
					$(this).height(curHighest);
				}
			});
		});
	};
})(jQuery);


// --------------
// DETECT FLASH
// Usage:
// apply .detect-flash to block of content containing a link to a swf file
// To use with OEDs: apply class .detect-flash to containing block.
// Thumbnail has to bo wrapped by container with class .icon.
// --------------
(function($) {
	jQuery.fn.detectFlash = function() {
		if(!swfobject.hasFlashPlayerVersion("1")){
			$(this).filter("a[data-media-type='swf']").addClass('no-flash');

			// Append message to element that contains OED image
			$('.no-flash.ftd-thumbnail').append('<span class="no-flash-message">Dispositivo não compatível.</span>');

			// Clear attributes and prevent link default behavior, so that user can't open content
			$('.no-flash.ftd-thumbnail').removeAttr('data-media-type').removeAttr('href').removeClass('lightbox').removeAttr('onclick').unbind('click').click(function(e){
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
		// If IE8 or less
		if (!$.support.leadingWhitespace) {
			
			// Add no-html5 class to content block
			$(this).filter("a[data-media-type='html']").addClass('no-html5');

			// Append message to element that contains OED image
			$('.no-html5.ftd-thumbnail').append('<span class="no-html5-message">Dispositivo não compatível.</span>');

			// Clear attributes and prevent link default behavior, so that user can't open content
			$('.no-html5.ftd-thumbnail').removeAttr('data-media-type').removeAttr('href').removeClass('lightbox').removeAttr('onclick').unbind('click').click(function(e){
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
// apply .lightbox to link (anchor) element that points to the
// media file that should open in a lightbox
// Needs attribute data-media-type.
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
		// Creates audio container, if it doesn't exist yet
		if($("#audio").length === 0) {
			$("body").append('<div id="audio" style="display:none;"></div>');
		}

		// Creates video container, if it doesn't exist yet
		if($("#video").length === 0) {
			$("body").append('<div id="video" style="display:none;"></div>');
		}


		$(this).each(function() {
			// Swaps attributes for flash
			if($(this).is("[data-media-type='swf'],[data-media-type='video-swf']")) {
				if($(this).attr('href') != '#flash'){
					var swfUrl = $(this).attr('href');
					$(this).attr('data-media-url',swfUrl).attr('href','#flash');
				}
			}
			// Swaps attributes for audio
			if($(this).is("[data-media-type='audio']")) {
				if($(this).attr('href') != '#audio'){
					var swfUrl = $(this).attr('href');
					$(this).attr('data-media-url',swfUrl).attr('href','#audio');
				}
			}
			// Swaps attributes for video
			if($(this).is("[data-media-type='video']")) {
				if($(this).attr('href') != '#video'){
					var swfUrl = $(this).attr('href');
					$(this).attr('data-media-url',swfUrl).attr('href','#video');
				}
			}
			// update URL to PDF viewer
			if ($(this).is("[data-media-type='pdf'],a[href$='.pdf']")) {
				var urlToPdf = '../js/pdfjs/web/viewer.html?file=' + $(this).attr('href');
				$(this).attr('href', urlToPdf);
			}
		});

		// Updates variables for fancybox
		$(this).on('click', function(event){

			// update variables
			mediaURL = $(this).attr('href');
			mediaType = $(this).attr('data-media-type');
			if ($(this).is("[data-media-type='swf'],[data-media-type='audio'],[data-media-type='video']")) {
				mediaURL = $(this).attr('data-media-url');
			}
			if ($(this).attr("data-media-type")) {
				mediaTitle = $(this).attr('data-media-title');
			}

		});

		// if ($(this).attr('href')!== ''){

			// Open flash modal
			$(this).filter("[data-media-type='swf']").not("[data-media-url$='?fixLB=1']").fancybox({
				width: 1024,
				height: 768,
				autoSize: false,
				aspectRatio: true,
				scrolling: 'no',
				type: 'inline',
				helpers : { 
					overlay : {closeClick: false}
				},
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
				},
				beforeClose : function() {
					$("#flash").empty();
				}
			});

			// Open flash modal (special case where preloader is not used)
			// Mostly the case with OEDs from P14/flash
			// URL of OED file should have parameter "?fixLB=1"
			$(this).filter("[data-media-type='swf']").filter("[data-media-url$='?fixLB=1']").fancybox({
				width: 1024,
				height: 768,
				autoSize: false,
				aspectRatio: true,
				scrolling: 'no',
				type: 'inline',
				helpers : {
					overlay : {closeClick: false}
				},
				beforeShow: function() {
					$("#flash").empty();
					var flashEmbed = '<object type="application/x-shockwave-flash" data="' + mediaURL + '" width="100%" height="100%">' +
					'<param name="bgcolor" value="#000000">' +
					'<param name="wmode" value="opaque">' +
					'<param name="allowFullScreen" value="true">' +
					'<param name="allowScriptAccess" value="always">' +
					'<param name="movie" value="' + mediaURL + '">' +
					'</object>';
					$('#flash').append(flashEmbed);
				},
				beforeClose : function() {
					$("#flash").empty();
				}
			});

			// Open HTML5 video modal (mediaelementjs)
			height = (screen.height * .9);
			$(this).filter("[data-media-type='video']").fancybox({
				aspectRatio: true,
				width: 16/9 * height,
				height: height,
				fitToView: true,
				autoSize: false,
				type: 'inline',
				scrolling: false,
				helpers : { 
					overlay : {closeClick: false}
				},
				beforeShow  : function() {
					$("#video").empty();
					// Legendas disabled until we have them
					// var mediaTrackURL = mediaURL.replace('.mp4','.vtt');
					var videoEmbed = '<video autoplay="autoplay" id="video-player" controls="controls" width="100%" height="100%">' +
						'<source type="video/mp4" src="' + mediaURL + '" />' +
						// '<track kind="subtitles" label="Legenda" src="' + mediaTrackURL + '" srclang="pt" default="default"></track>' +
					'</video>';
					$('#video').append(videoEmbed);
					$('#video-player').mediaelementplayer({
						
					});
					if ($.support.leadingWhitespace) {
						var video = document.getElementsByTagName("video")[0];
						function endVideo() {
							$.fancybox.close( true );
						}
						video.addEventListener('webkitendfullscreen', endVideo, false);
					}
				},
				beforeClose : function() {
					$("#video").empty();
				}
			});

			// Trigger HTML5 modal
			$(this).filter("[data-media-type='html']").fancybox({
				width: 1024,
				height: 768,
				autoSize: false,
				aspectRatio: true,
				scrolling: 'no',
				type: 'iframe',
				helpers : { 
					overlay : {
						closeClick: false
					}
				},
				afterShow: function() {
					$('.fancybox-iframe').contents().find('#_FTD_fechar').bind('click', function(){
						$.fancybox.close( true );
					});
				}
			});

			// Trigger external site modal
			$(this).filter("[data-media-type='iframe']").fancybox({
				width: 1024,
				height: 768,
				autoSize: false,
				aspectRatio: true,
				scrolling: 'no',
				type: 'iframe'
			});

			// Trigger image modal
			$(this).filter("[data-media-type='image'],a[href$='.jpg'],a[href$='.jpeg'],a[href$='.png']").fancybox({
				width: 1024,
				height: 768,
				autoSize: false,
				aspectRatio: true,
				scrolling: 'no'
			});

			// Instead, just open in new tab
			$(this).filter("[data-media-type='link']").attr("target", "_blank");

			// Trigger PDF viewer modal
			$(this).filter("[data-media-type='pdf']").fancybox({
				width: 1024,
				height: 768,
				autoSize: false,
				aspectRatio: true,
				scrolling: 'no',
				type: 'iframe'
			});

			// Trigger audio modal
			$(this).filter("[data-media-type='audio']").fancybox({
				width: 400,
				height: 36,
				autoSize: false,
				scrolling: 'no',
				type: 'inline',
				helpers : { 
					overlay : {closeClick: false}
				},
				beforeShow: function() {
					$("#audio").empty();
					var audioEmbed = '<audio id="audio-player" preload="auto" autoplay="autoplay">' +
						'<source type="audio/mp3" src="' + mediaURL + '" />' +
						'</audio>' +
						'<p class="meta">' + mediaTitle + '</p>';
					$('#audio').append(audioEmbed);
					// Init audio player
					$('#audio audio').mediaelementplayer({
						
					});
				},
				beforeClose : function() {
					$("#audio").empty();
					$(".me-plugin").remove();
				}
			});

		// };

		return this;
	};
	$(function() {
		// $('.lightbox').lightbox();
	});
})(jQuery);
