
window.editor = {

	activate: function() {
		$('textarea.tinymce').tinymce({
			// Location of TinyMCE script
			script_url : 'javascripts/tiny_mce/tiny_mce.js',
			
			// Enlarge fonts
			content_css : "javascripts/tiny_mce/custom_content.css",
			theme_advanced_font_sizes: "10px,12px,13px,14px,16px,18px,20px",
			font_size_style_values : "10px,12px,13px,14px,16px,18px,20px",

			// General options
			theme : "advanced",
			//plugins : "autolink,lists,table,save,advhr,advimage,advlink,inlinepopups,preview,media,searchreplace,print,contextmenu,paste,directionality,fullscreen,noneditable,visualchars,xhtmlxtras,advlist,layer",
			
			plugins : "ccSimpleUploader,autolink,lists,pagebreak,style,layer,table,save,advhr,advimage,advlink,emotions,iespell,inlinepopups,insertdatetime,preview,media,searchreplace,print,contextmenu,paste,directionality,fullscreen,noneditable,visualchars,nonbreaking,xhtmlxtras,template,advlist",


			// Theme options
			theme_advanced_buttons1 : "bold,italic,underline,strikethrough,sub,sup,justifyleft,justifycenter,justifyright,justifyfull,forecolor,backcolor,|,charmap",
			theme_advanced_buttons2 : "cut,copy,pastetext,pasteword,|,search,replace,|,bullist,numlist,|,outdent,indent,blockquote,|,undo,redo,|,image,cleanup,code,preview",
			theme_advanced_buttons3 : "tablecontrols,|,hr,removeformat",
			//theme_advanced_buttons4 : "insertlayer,moveforward,movebackward,absolute,styleprops",
			theme_advanced_toolbar_location : "top",
			theme_advanced_toolbar_align : "left",
			theme_advanced_statusbar_location : "bottom",
			theme_advanced_resizing : true,

			// Example content CSS (should be your site CSS)
			//content_css : "css/content.css",

			// Drop lists for link/image/media/template dialogs
			/*template_external_list_url : "lists/template_list.js",
			external_link_list_url : "lists/link_list.js",
			external_image_list_url : "lists/image_list.js",
			media_external_list_url : "lists/media_list.js",*/
			
			language : 'pt',

			// Replace values for the template plugin
			template_replace_values : {
				username : "Some User",
				staffid : "991234"
			},
			
			//To paste as text by default
			paste_text_sticky : true,
			
			//For Mathquill plugin
			mathquill_latex_img_renderer_url_templ: 'http://gestor.nm.ftd.com.br/cgi-bin/mathtex.cgi?*',
			
			//For the upload plugin
			relative_urls : true,
			file_browser_callback: "ccSimpleUploader",
			plugin_ccSimpleUploader_upload_path: '../../../../media',                 
			plugin_ccSimpleUploader_upload_substitute_path: 'media',
			
			
			setup : function(ed) {
				ed.onInit.add(function(ed) {
					if (!tinymce.isGecko) {
						tinymce.dom.Event.add(ed.getBody().parentNode, "dragstart", function(e) {
		                    tinymce.dom.Event.cancel(e);
		                }); 
		                tinymce.dom.Event.add(ed.getBody().parentNode, "dragover", function(e) {
		                    tinymce.dom.Event.cancel(e);
		                });    
		                tinymce.dom.Event.add(ed.getBody().parentNode, "drop", function(e) {
		                    tinymce.dom.Event.cancel(e);
		                }); 
	                }
	                ed.pasteAsPlainText = true;
	             }); 
	       }
		});
	}
};


function active(id){
    
    $(id).tinymce({
        // Location of TinyMCE script
        script_url : 'javascripts/tiny_mce/tiny_mce.js',

        // Enlarge fonts
        content_css : "javascripts/tiny_mce/custom_content.css",
        theme_advanced_font_sizes: "10px,12px,13px,14px,16px,18px,20px",
        font_size_style_values : "10px,12px,13px,14px,16px,18px,20px",

        // General options
        theme : "advanced",
        //plugins : "autolink,lists,table,save,advhr,advimage,advlink,inlinepopups,preview,media,searchreplace,print,contextmenu,paste,directionality,fullscreen,noneditable,visualchars,xhtmlxtras,advlist,layer",

        plugins : "ccSimpleUploader,autolink,lists,pagebreak,style,layer,table,save,advhr,advimage,advlink,emotions,iespell,inlinepopups,insertdatetime,preview,media,searchreplace,print,contextmenu,paste,directionality,fullscreen,noneditable,visualchars,nonbreaking,xhtmlxtras,template,advlist",


        // Theme options
        theme_advanced_buttons1 : "bold,italic,underline,strikethrough,sub,sup,justifyleft,justifycenter,justifyright,justifyfull,forecolor,backcolor,|,charmap",
        theme_advanced_buttons2 : "cut,copy,pastetext,pasteword,|,search,replace,|,bullist,numlist,|,outdent,indent,blockquote,|,undo,redo,|,image,cleanup,code,preview",
        theme_advanced_buttons3 : "tablecontrols,|,hr,removeformat",
        //theme_advanced_buttons4 : "insertlayer,moveforward,movebackward,absolute,styleprops",
        theme_advanced_toolbar_location : "top",
        theme_advanced_toolbar_align : "left",
        theme_advanced_statusbar_location : "bottom",
        theme_advanced_resizing : true,

        // Example content CSS (should be your site CSS)
        //content_css : "css/content.css",

        // Drop lists for link/image/media/template dialogs
        /*template_external_list_url : "lists/template_list.js",
        external_link_list_url : "lists/link_list.js",
        external_image_list_url : "lists/image_list.js",
        media_external_list_url : "lists/media_list.js",*/

        language : 'pt',

        // Replace values for the template plugin
        template_replace_values : {
                username : "Some User",
                staffid : "991234"
        },

        //To paste as text by default
        paste_text_sticky : true,

        //For Mathquill plugin
        mathquill_latex_img_renderer_url_templ: 'http://gestor.nm.ftd.com.br/cgi-bin/mathtex.cgi?*',

        //For the upload plugin
        relative_urls : true,
        file_browser_callback: "ccSimpleUploader",
        plugin_ccSimpleUploader_upload_path: '../../../../media',                 
        plugin_ccSimpleUploader_upload_substitute_path: 'media',


        setup : function(ed) {
                ed.onInit.add(function(ed) {
                        if (!tinymce.isGecko) {
                                tinymce.dom.Event.add(ed.getBody().parentNode, "dragstart", function(e) {
                    tinymce.dom.Event.cancel(e);
                }); 
                tinymce.dom.Event.add(ed.getBody().parentNode, "dragover", function(e) {
                    tinymce.dom.Event.cancel(e);
                });    
                tinymce.dom.Event.add(ed.getBody().parentNode, "drop", function(e) {
                    tinymce.dom.Event.cancel(e);
                }); 
        }
        ed.pasteAsPlainText = true;
        }); 
        }
    });
}	