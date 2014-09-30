(function () {
    tinymce.PluginManager.requireLangPack("latex");
    tinymce.create("tinymce.plugins.LatexPlugin", {
        init: function (a, b) {
        	var latexImgRendererUrlTempl = a.getParam('mathquill_latex_img_renderer_url_templ');
        	var processTags = false;
		    var latexOpenTag = '\\(';
		    var latexCloseTag = '\\)';
      
            a.addCommand("mceLatex", function () {
                a.windowManager.open({
                    file: b + "/dialog.htm",
                    width: 700,
                    height: 400,
                    inline: 1
                }, {
                    plugin_url: b,
                    some_custom_arg: "custom arg"
                })
            });
            a.addButton("latex", {
                title: "latex.desc",
                cmd: "mceLatex",
                image: b + "/img/latex.gif"
            });
            a.onNodeChange.add(function (d, c, e) {
                c.setActive("latex", e.nodeName == "IMG")
            });
            
            a.onInit.add(function() {
		        $(a.getDoc()).on('click', 'img.latex', function() {
		          var latex = $(this).attr('alt');
		          a.execCommand('mceLatex', latex);
		        });
		     });
            
                  
		      a.onPreProcess.add(function(ed, o) {
		        if (o.get) {
		          var mathquillimages = ed.dom.select('img.latex', o.node);
		          $(mathquillimages).replaceWith(function() {
		            var latex = $(this).attr('alt');
		            if (processTags) {
			            return '<span class="latex">' + latexOpenTag + latex + latexCloseTag + '</span>';
			        } else {
				        return '<span class="latex">' + latex + '</span>';
			        }
		          });
		        } 
		      });
			  
			  //ed.onLoadContent.add(function(ed,o) {
			  a.onSetContent.add(function(ed,o) {
		          var mathquills = ed.dom.select('span.latex', o.node);
		          $(mathquills).replaceWith(function() {
		          	var latex = $(this).text();
		          	if (processTags) {
			          	if (latex.length>=(latexOpenTag.length+latexCloseTag.length)) {
				          	if (latex.substr(0,latexOpenTag.length)==latexOpenTag) {
					          	latex = latex.substr(latexOpenTag.length,latex.length-latexOpenTag.length);
				          	}
				          	if (latex.substr(latex.length-latexCloseTag.length,latexCloseTag.length)==latexCloseTag) {
					          	latex = latex.substr(0,latex.length-latexCloseTag.length);
				          	}
			          	}
		          	}
		            var imgurl = '<img class="latex" '
		            	+ 'style="vertical-align:middle" '
		            	+ 'src="' + latexImgRendererUrlTempl.replace('*', latex) + '" '
		            	+ 'alt="' + latex + '"/>';
		            return imgurl;
		          });
			  });
        },
        createControl: function (b, a) {
            return null
        },
        getInfo: function () {
            return {
                longname: "LaTeX plugin",
                author: "Mauricio Piacentini",
                authorurl: "http://www.tabuleiro.com",
                infourl: "",
                version: "1.0"
            }
        }
    });
    tinymce.PluginManager.add("latex", tinymce.plugins.LatexPlugin)
})();