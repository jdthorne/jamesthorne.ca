$(function() {
   var isWhiteout = false;
   var whiteoutTimeout = null;

   var isShowingContent = false;

   var hideHashBang = function() {
      if (window.location.hash != "")
      {
         history.pushState("", document.title, window.location.pathname + window.location.search);
      }
   }

   var makeAllPanelsAppear = function() {
      if (isShowingContent)
      {
         $(".panel").show();
         return;
      }

      var i = -1;
      var arr = $(".panel");
      (function(){
         $(arr[i]).show();
         if(arr[++i])
            $(arr[i]).slideDown(200, arguments.callee)
         else
            $(".panel").show();
      })();
   };

   var clearWhiteout = function() {
      if (!isWhiteout) return;

      clearTimeout(whiteoutTimeout);
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
            $(".panel").stop(true, true);
            $(".panel").hide();
         });

         isWhiteout = true;
      }
   };

   var lastHeight = 0;
   var lastWidth = 0;
   var handleResize = function() {
      var height = $(window).height();
      var width = $(window).width();
      
      if (lastWidth == width && lastHeight == height)
      {
         return;
      }
      lastWidth = width;
      lastHeight = height;
 
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

      window.location.hash = "!" + panelName;
   };

   var closePanel = function() {
      $("#content").fadeOut();

      isShowingContent = false;
      hideHashBang();
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

      $(".appstore, .antex-appstore").bind("click", function() {
         window.location = $(this).data("url");
      })

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

      $("img").error(function(){
         $(this).hide();
      });
   });
});
