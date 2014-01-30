/*
 * Project: Bootstrap Hover Dropdown
 * Author: Cameron Spear
 * Contributors: Mattia Larentis
 *
 * Dependencies: Bootstrap's Dropdown plugin, jQuery
 *
 * A simple plugin to enable Bootstrap dropdowns to active on hover and provide a nice user experience.
 *
 * License: MIT
 *
 * http://cameronspear.com/blog/bootstrap-dropdown-on-hover-plugin/
 */(function(e,t,n){if("ontouchstart"in document)return;var r=e();e.fn.dropdownHover=function(n){r=r.add(this.parent());return this.each(function(){var i=e(this),s=i.parent(),o={delay:500,instantlyCloseOthers:!0},u={delay:e(this).data("delay"),instantlyCloseOthers:e(this).data("close-others")},a=e.extend(!0,{},o,n,u),f;s.hover(function(n){if(!s.hasClass("open")&&!i.is(n.target))return!0;a.instantlyCloseOthers===!0&&r.removeClass("open");t.clearTimeout(f);s.addClass("open");s.trigger(e.Event("show.bs.dropdown"))},function(){f=t.setTimeout(function(){s.removeClass("open");s.trigger("hide.bs.dropdown")},a.delay)});i.hover(function(){a.instantlyCloseOthers===!0&&r.removeClass("open");t.clearTimeout(f);s.addClass("open");s.trigger(e.Event("show.bs.dropdown"))});s.find(".dropdown-submenu").each(function(){var n=e(this),r;n.hover(function(){t.clearTimeout(r);n.children(".dropdown-menu").show();n.siblings().children(".dropdown-menu").hide()},function(){var e=n.children(".dropdown-menu");r=t.setTimeout(function(){e.hide()},a.delay)})})})};e(document).ready(function(){e('[data-hover="dropdown"]').dropdownHover()})})(jQuery,this);
 
 
$('.dropdown-toggle').dropdownHover();

(function( $, undefined ) {
  $.fn.ytPlaylist = function(options) {
    
    // Settings object
          var settings = $.extend( {
                  'playlist' : 'PLDFmQ1Ea1sUXBNTLloUE6T0iSs5Xt97Ig',
          }, options);

    // URL for Youtube Playlist API call
           var request = 'https://gdata.youtube.com/feeds/api/playlists/' + settings.playlist + '?alt=json'

    /**
    *  Get the JSON, kick off the program with the success callback.
    *  
    *  @param string request
    *    YouTube API URL that gives us the JSON response.
    *  @param string selector
    *    Element in which to create playlist.  
    */    
    var getJSON = function(request, selector) {
            $.ajax({
                          url: request,
                          dataType: 'jsonp',
                          success: function(response){
                            successCallback(response, selector);
                          },
                          error: function(jqXHR, textStatus, errorThrown){
                                  console.log(textStatus);
                          },
            });
    };

    /**
    *  Success callback for AJAX request. Calls functions that process returned JSON.
    *  
    *  @param object json
    *    JSON object returned by YouTube API.
    *  @param string selector
    *    Element in which to create playlist.  
    */
    var successCallback = function(json, selector) {
            createTitle(json, selector);
      parseList(json, selector);
      addListeners(selector);
    };

    /**
    *  Create title and append it to playlist container element
    *   
    *  @param object json
    *    JSON object returned by YouTube API.
    *  @param string selector
    *    Element in which to create playlist.  
    */
    var createTitle = function(json, selector) {
      var title = json.feed.title.$t;
      $(selector).append('<h3 class="hidden">' + title + '</h3>');
    };
          
    /**
    *  Create iframe embed and list of videos from JSON
    *   
    *  @param object json
    *    JSON object returned by YouTube API.
    *  @param string selector
    *    Element in which to create playlist.  
    */
    var parseList = function(json, selector) {
      var list = json.feed.entry;
      $(list).each(function( index ) {
        var vidinfo = [];
        vidinfo.url = $(this)[0].link[0].href;
        vidinfo.height = $(this)[0].media$group.media$thumbnail[0].height;
        vidinfo.width = $(this)[0].media$group.media$thumbnail[0].width;
        vidinfo.title = $(this)[0].title.$t;
        vidinfo.thumbnail = $(this)[0].media$group.media$thumbnail[0].url;
        if(index === 0) {
          embedIframe(vidinfo, selector);
          $(selector).append('<ul></ul>');
        }
        //var listItem = '<li><a href="' + vidinfo.url + '" rel=\'{"h":' + vidinfo.height+ ', "w":' + vidinfo.width + '}\'>' + vidinfo.title + '</a></li>';
        var listItem = '<li class="col-sm-3 teh-videos"><a href="' + vidinfo.url + '" rel=\'{"h":' + vidinfo.height+ ', "w":' + vidinfo.width + '}\'><img class="center img-responsive" src="' + vidinfo.thumbnail + '" alt="' + vidinfo.title +'" title="' + vidinfo.title +'" /><p class="center">' + vidinfo.title + '</p></li>'; 
        $(selector).children('ul').append(listItem);
        if(index === 0) {
          $(selector).find('img').addClass('active');
        }          
      });
    };

    /**
    *  Create iframe embed and list of videos from JSON
    *   
    *  @param object vidinfo
    *    Object of video info used in the embed
    *  @param string selector
    *    Element in which to embed iframe.  
    */
    var embedIframe = function(vidinfo, selector) {
      //Get rid of any existing iframes
      $(selector).children('iframe').remove();
      var urlsplit = vidinfo.url.split(/v=|&/);
      vid = urlsplit[1];
      var width = $(selector).width();
      if(width > vidinfo.width) {
        var proportion = vidinfo.width / width;
        var difference = (1 - proportion);
        var height = Math.round(vidinfo.height * difference + vidinfo.height);
      } else {
        var proportion = width / vidinfo.width;
        var difference = (1 - proportion);
        var height = Math.round(vidinfo.height * difference);
      }
      var iframe = '<div class="embed-container"><iframe width="' + width + '" height="' + height + '" src="http://www.youtube.com/embed/' + vid + '" frameborder="0" rel="0" allowfullscreen></iframe></div>';
      $(iframe).insertAfter($(selector).find('h3'));
    };
    
    /**
    *  Add listeners for user interaction
    *   
    *  @param string selector
    *    Element in which we embedded iframe.  
    */
    var addListeners = function(selector) {
      $(selector).find('a').bind('click', function(){
        onClickCallback($(this), selector);
        return false;
      });
    }

    /**
    *  Add listeners for user interaction
    *   
    *  @param object element
    *    jQuery object of <a> element that was clicked. 
    *
    *  @param string selector
    *    Element in which we embedded iframe.  
    */
    var onClickCallback = function(element, selector) {
      var vidinfo = []
      $(selector).find('img').removeClass('active');
      $(element).children('img').addClass('active');
      vidinfo.url = $(element).attr('href');
      var dimensions = $.parseJSON($(element).attr('rel'));
      vidinfo.height = dimensions.h;
      vidinfo.width = dimensions.w;
      embedIframe(vidinfo, selector);
    }
    //Kick it off
    getJSON(request, $(this));
  };
})( jQuery );

$('#playlist').ytPlaylist({
                        'playlist' : 'PLFCi2C0eCvNaJrC-oyXzEKyDue_PynJHK',
                });