$(function() {
   var isWhiteout = false;
   var whiteoutTimeout = null;

   var isShowingContent = false;

   var makeAllPanelsAppear = function() {
      if (isShowingContent)
      {
         $(".panel").css("margin-left", "0px");
         return;
      }

      var i = -1;
      var arr = $(".panel");
      (function(){
         if(arr[++i])
            $(arr[i]).animate({'margin-left': '0px'}, 250, arguments.callee)
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
         $("#whiteout").fadeIn(50, function() {
            $(".panel").css('margin-left', '500px');
         });

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

   var openPanel = function(panelName, duration) {
      if (!duration)
      {
         duration = 400;
      }

      $(".content-body").hide();
      $("#content-" + panelName).show();

      $("#content").fadeIn(duration);

      isShowingContent = true;

      //location.replace(('' + window.location).split("#")[0] + "#!" + panelName);
      window.location.hash = "!" + panelName;
   };

   var closePanel = function() {
      $("#content").fadeOut();
      window.location.hash = "";

      isShowingContent = false;
   };

   var getCurrentHashRequest = function() {
      if (window.location.hash && window.location.hash.substring(0, 2) == "#!")
      {
         var hashRequest = window.location.hash.substring("#!".length);

         if ($("#content-" + hashRequest).length > 0)
         {
            return hashRequest;
         }
      }
      return "";
   }

   var checkHash = function() {
      var request = getCurrentHashRequest();

      if (request == "")
      {
         closePanel();
      }
      else
      {
         openPanel(request);
      }
   }

   $(window).bind("load", function() {
      isLoaded = true;
      clearWhiteout();
   });

   $(window).ready(function() {

      $(".go-back").bind("click", function() {
         closePanel();
      });

      var callback = $(".panel").bind("click", function(e) {
         var source = this.id;
         var panelName = source.substring("panel-".length);

         openPanel(panelName);
      });

      if (window.location.hash && window.location.hash.substring(0, 2) == "#!")
      {
         checkHash();
      }

      window.onhashchange = function() {
         checkHash();
      };
   });
});
