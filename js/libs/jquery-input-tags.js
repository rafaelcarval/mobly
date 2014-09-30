(function ($) {
	$.fn.inputTags = function (options) {
		var _defaults = {
	 		container: '#tagsUl',
	 		liTemplate: '<li>{{tag}}<i class="icon-remove-sign"></i></li>',
	 		removeButtonSelector: '',
	 		onTagAdded: {},
	 		onTagRemoved: {}
	 	};
		var _options = $.extend({}, _defaults, options);
		var _$el = $(this);
		var _tagList = [];
		
		
		_$el.keypress(function (e) {
			var intKeyCode = e.which || e.keyCode;
			if (intKeyCode == 13 || intKeyCode == 44 || intKeyCode == 59) {
				
				var strNewTag = $.trim( _$el.val() );
				// check if tag is not empty
				if (strNewTag.length>0) {
					_addTag(strNewTag);
				}
				_$el.val('');
				if (e.preventDefault) {
					e.preventDefault();
				} else {
					e.returnValue = false;
				}
				return false;
			}
		});
		
		
		function _addTag(strNewTag, booSilent) {
			if ($.inArray(strNewTag, _tagList) == -1) {
				_tagList.push(strNewTag);
				var strTagItemHtml = Mustache.to_html( _options.liTemplate, {tag:strNewTag} );
				$tagItem = $(strTagItemHtml);
				$(_options.container).append($tagItem);
				$(_options.removeButtonSelector,  $tagItem ).on('click', {tag:strNewTag, $tagItem:$tagItem}, function(e){
					$.each(_tagList, function (i, strTag) {
			            if (e.data.tag === strTag) {
			                _tagList.splice(i, 1);
			            }
			        });
					e.data.$tagItem.remove();
			        if ( typeof(_options.onTagRemoved)=='function' ) {
						_options.onTagRemoved.call(this, strNewTag, _tagList);
					}
				});
				
				if ( !booSilent && typeof(_options.onTagAdded)=='function' ) {
					_options.onTagAdded.call(this, strNewTag, _tagList);
				}
			}
		}
		
		if (options.tags) {
			$.each(options.tags, function (i, strTag) {
				var strNewTag = $.trim(strTag);
				_addTag(strNewTag, true);
			});
		}
	}

})(jQuery);