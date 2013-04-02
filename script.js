$(function() {
   var isWhiteout = false;
   var whiteoutTimeout = null;

   var makeAllPanelsAppear = function() {
      var i = -1;
      var arr = $(".panel");
      (function(){
         if(arr[++i])
         $(arr[i]).animate({width: 'show'}, 250, arguments.callee)
      })();
   };

   var clearWhiteout = function() {
      if (!isWhiteout) return;

      whiteoutTimeout = null;
      $("#whiteout").fadeOut(200, function() {
         $("#whiteout").css("display", "none");
         makeAllPanelsAppear();
      });
      isWhiteout = false;
   };

   var doWhiteout = function() {
      if (whiteoutTimeout)
      {
         clearTimeout(whiteoutTimeout);
      }
      whiteoutTimeout = setTimeout(clearWhiteout, 500);

      if (!isWhiteout)
      {
         $("#whiteout").fadeIn(50);

         isWhiteout = true;
      }
   };

   var handleResize = function() {
      var height = $(window).height();
      var width = $(window).width();

      var backgroundImageHeightWillBe = width * (1200/1920);
      if (backgroundImageHeightWillBe > height)
      {
         $("#background").width(width);
         $("#background").height("");
      }
      else
      {
         $("#background").width("");
         $("#background").height(height);
      }

      doWhiteout();
   };

   $(window).resize(handleResize);
   handleResize();

   $(window).bind("load", function() {
      isLoaded = true;
      clearWhiteout();
   });
});
