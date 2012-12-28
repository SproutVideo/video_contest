// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// the compiled file.
//
// WARNING: THE FIRST BLANK LINE MARKS THE END OF WHAT'S TO BE PROCESSED, ANY BLANK LINE SHOULD
// GO AFTER THE REQUIRES BELOW.
//
//= require jquery
//= require jquery_ujs
//= require jquery.ui.widget
//= require jquery.iframe-transport
//= require jquery.fileupload
//= require_tree .
if(!window.Application){window.Application = {}}
Application.fitStringToWidth = function(str,width,className) {
  // str    A string where html-entities are allowed but no tags.
  // width  The maximum allowed width in pixels
  // className  A CSS class name with the desired font-name and font-size. (optional)
  // ----
  // _escTag is a helper to escape 'less than' and 'greater than'
  function _escTag(s){ return s.replace("<","&lt;").replace(">","&gt;");}

  //Create a span element that will be used to get the width
  var span = document.createElement("span");
  //Allow a classname to be set to get the right font-size.
  if (className) span.className=className;
  span.style.display='inline';
  span.style.visibility = 'hidden';
  span.style.padding = '0px';
  document.body.appendChild(span);

  var result = _escTag(str); // default to the whole string
  span.innerHTML = result;
  // Check if the string will fit in the allowed width. NOTE: if the width
  // can't be determinated (offsetWidth==0) the whole string will be returned.
  if (span.offsetWidth > width) {
    var posStart = 0, posMid, posEnd = str.length, posLength;
    // Calculate (posEnd - posStart) integer division by 2 and
    // assign it to posLength. Repeat until posLength is zero.
    while (posLength = (posEnd - posStart) >> 1) {
      posMid = posStart + posLength;
      //Get the string from the begining up to posMid;
      span.innerHTML = _escTag(str.substring(0,posMid)) + '&hellip;';

      // Check if the current width is too wide (set new end)
      // or too narrow (set new start)
      if ( span.offsetWidth > width ) posEnd = posMid; else posStart=posMid;
    }

    result = 
      _escTag(str.substring(0,posStart)) +
      '&hellip;';
  }
  document.body.removeChild(span);
  return result;
}