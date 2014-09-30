// -----------------------------------------------------------------------
// printThis v1.1
// Printing plug-in for jQuery
//
// Resources (based on) :
//              jPrintArea: http://plugins.jquery.com/project/jPrintArea
//              jqPrint: https://github.com/permanenttourist/jquery.jqprint
//              Ben Nadal: http://www.bennadel.com/blog/1591-Ask-Ben-Print-Part-Of-A-Web-Page-With-jQuery.htm
//
// Dual licensed under the MIT and GPL licenses:
//              http://www.opensource.org/licenses/mit-license.php
//              http://www.gnu.org/licenses/gpl.html
//
// (c) Jason Day 2012
//
// Usage:
//
// $("#mySelector").printThis({
//      debug: false, //show the iframe for debugging
//      importCSS: true, // import page CSS
//      printContainer: true, // grab outer container as well as the contents of the selector
//      loadCSS: "path/to/my.css" //path to additional css file
//  });
//
// Notes:
//  - the loadCSS option does not need @media print
//------------------------------------------------------------------------
 
(function($) {
    var opt;
 
    $.fn.printThis = function (options) {
        opt = $.extend({}, $.fn.printThis.defaults, options);
 
        var $element = (this instanceof jQuery) ? this : $(this);

        var strFrameName = ("printThis-" + (new Date()).getTime());
         
            var $iframe = $("<iframe id='" + strFrameName +"' src='about:blank'/>");
 
            if (!opt.debug) { $iframe.css({ position: "absolute", width: "0px", height: "0px", left: "-600px", top: "-600px" }); }
 
            $iframe.appendTo("body");
         
      
    // allow iframe to fully render before action
    setTimeout ( function () {
		
		var $doc = $("#" + strFrameName).contents();

        // import page css
        if (opt.importCSS)
        {
                $("link[rel=stylesheet]").each(function(){
                var href = $(this).attr('href');
                if(href){
                        var media = $(this).attr('media') || 'all';
                        $doc.find("head").append("<link type='text/css' rel='stylesheet' href='" + href + "' media='"+media+"'>");
                    }
        });
        }
         
        // add another stylesheet
        if (opt.loadCSS)
        {
        $doc.find("head").append("<link type='text/css' rel='stylesheet' href='" + opt.loadCSS + "'>");
        }
        
        //add title of the page
        if (opt.titlePage)
        {
        $doc.find("head").append('<title>'+opt.titlePage+'</title>');
        } 
        //grab outer container
        if (opt.printContainer) { $doc.find("body").append($element.outer()); }
        else { $element.each( function() { $doc.find("body").append($(this).html()); }); }
     
        //$doc.close();
        // print
        $iframe[0].contentWindow.focus();
        setTimeout( function() { $iframe[0].contentWindow.print(); }, 1000);
        console.log( 'set out timeout');
        //removed iframe after 60 seconds
        setTimeout(
        function(){
        $iframe.remove();
        },
        (60 * 1000)
        );
    }, 333 );
    }
     
 
    $.fn.printThis.defaults = {
        debug: false, //show the iframe for debugging
        importCSS: true, // import page CSS
        printContainer: true, // grab outer container as well as the contents of the selector
        loadCSS: "", //path to additional css file
        titlePage: "" //add title to print page
    };
 
     
    jQuery.fn.outer = function() {
      return $($('<div></div>').html(this.clone())).html();
    }
})(jQuery);
