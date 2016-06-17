<!--
//WARNING - EVIL browser-sniffing ahead
//var IE6 = false /*@cc_on || @_jscript_version < 5.7 @*/;
var IE6 = /msie|MSIE 6/.test(navigator.userAgent);
var Safari = (document.childNodes) && (!document.all) && (!navigator.taintEnabled) && (!navigator.accentColorName);
var Opera = (self.opera != null);

// -----------------------
// FUNCTION: fAllowTabbing
// DESCRIPTION: Prevents onkey events firing when the tab key is pressed, thus allowing users to tab past them
// ARGUMENTS: 1: the event - always described as: event, 2: a function name to call without parenthesis "()", 3 variable names to pass to a function. Multiple variable names must be seperated by a "~", i.e. 'variable one~variable two~variable three~etc...'
// RETURNS: n/a
// N.B: onKey.... events should be followed with "return:true;" NOT "return:false" as for onClick events.
// -----------------------
function fAllowTabbing(e, sFunctionName, sVariable) {
  var e = e || window.event;
  var sKeyPressed = e.keyCode || e.charCode;

  if (sKeyPressed != 9) {
    if (sVariable) {
      if (sVariable.match("~")) {
        var aVariables = sVariable.split('~');
        window[sFunctionName].apply(this, aVariables);
      } else {
        window[sFunctionName](sVariable);
      }
    } else {
      window[sFunctionName]();
    }
  }
}


// Switches a selected class on a specified element.
// Pass the element ID and class name that needs to be added or removed.
function fSwitchClass(sElementId, sClassToSwitch) {
  if(document.getElementById(sElementId))
  {
    var eElement = document.getElementById(sElementId);
    var sClassName = eElement.className;
    if (sClassName.match(sClassToSwitch) || sClassName.match(' ' + sClassToSwitch)) {
      // Removes Class
      eElement.className = eElement.className.replace(sClassToSwitch, '');
    } else {
      // Adds Class
      eElement.className = sClassName + ' ' + sClassToSwitch;
    }
  }
}
// -----------------------
// FUNCTION: addEvent
// DESCRIPTION: Attaches an event to the requested object
// ARGUMENTS: 1: The object type, 2: The event type 3: The function to be called
// -----------------------
function fAddEvent(sObject, sEventType, sFunction){
  if (sObject.addEventListener){
    if (Safari && (sEventType == 'DOMContentLoaded')) { //safari
      sEventType = 'load';
    }
    sObject.addEventListener(sEventType, sFunction, false);
    return true;
  } else if (sObject.attachEvent){
    if (sEventType == 'DOMContentLoaded') {
      sEventType = 'load';
    }
    var sReturn = sObject.attachEvent("on" + sEventType, sFunction);
    return sReturn;
  } else {
    return false;
  }
}
//-----------------
// Function: fRemoveEvent
// DESCRIPTION: Removes an event from the object
// ARGUMENTS: 1: The object 2: The event type 3: Associated function
// ----------------
function fRemoveEvent(sObject, sEventType, sFunction){
  if (sObject && sObject.removeEventListener){
    sObject.removeEventListener(sEventType, sFunction, false);
    return true;
  } else if (sObject.detachEvent){
    var oRemove = sObject.detachEvent("on" + sEventType, sFunction);
    return oRemove;
  } else {
    return false;
  }
}

// -----------------------
// FUNCTION: fGetTarget
// DESCRIPTION: Returns the object of an event
// ARGUMENTS: The Event
// RETURNS: The object
// -----------------------
function fGetTarget(e) {
  e = e || window.event;
  if (e.target) {
    var sTarget = e.target;
  }
  if (e.srcElement) {
    var sTarget = e.srcElement;
  }
  return sTarget;
}


// Removes the default value of an input
function fRemoveValue(e) {

  var oTarget = fGetTarget(e);
  if (!($(oTarget).hasClass('excludeInputClear'))) {
    var ignoreSite = ((isSiteInPath('pregnancycareplanner')) && (oTarget.defaultValue.indexOf('e.g.') != 0));  //fix for pregnancyplanner
    if ((oTarget.value == oTarget.defaultValue) && !ignoreSite  ) {
      oTarget.value = '';
    }
  }
}

// Adds the default value to an input if no entry present
function fAddValue(e) {

  var oTarget = fGetTarget(e);
  if (!($(oTarget).hasClass('excludeInputClear'))) {
    if (oTarget.value == '') {
      oTarget.value = oTarget.defaultValue;
    }
  }
}
// -----------------------
// FUNCTION: fInputClear
// DESCRIPTION: clears and repopulates inputs unless listed in aPresetFormElements array
// -----------------------
function fInputClear() {
  // Add clearing to Inputs
  aInputs = document.getElementsByTagName('input');
  nInputLength = aInputs.length;
  for (nInputCount = 0; nInputCount < nInputLength; nInputCount++) {
    if (aInputs[nInputCount].type == 'text') {
      if (aInputs[nInputCount].readOnly) {
        var sReadOnlyId = aInputs[nInputCount].id;
        fAddEvent(aInputs[nInputCount], 'focus', function() {document.getElementById(sReadOnlyId).select();});
      } else {
        fAddEvent(aInputs[nInputCount], 'focus', fRemoveValue);
        fAddEvent(aInputs[nInputCount], 'blur', fAddValue);
      }
    }
  }
  // Add clearing to Text areas
  aTextAreas = document.getElementsByTagName('textarea');
  nTextAreaLength = aTextAreas.length;
  for (nTextAreaCount = 0; nTextAreaCount < nTextAreaLength; nTextAreaCount++) {
    fAddEvent(aTextAreas[nTextAreaCount], 'focus', fRemoveValue);
    fAddEvent(aTextAreas[nTextAreaCount], 'blur', fAddValue);
  }
  // Check for excluded form elements.
  // NB: This will clear any elements with their ID listed in the array 'aPresetFormElements' - this array should be declared on the page from the back end.
  if (typeof aPresetFormElements != 'undefined') {
    var nPresetLength = aPresetFormElements.length;
    for (nPresetCount = 0; nPresetCount < nPresetLength; nPresetCount++) {
      fRemoveEvent(document.getElementById(aPresetFormElements[nPresetCount]), 'focus', fRemoveValue);
      fRemoveEvent(document.getElementById(aPresetFormElements[nPresetCount]), 'blur', fAddValue);
    }
  }
}

// Remove all nodes from within an element
function fRemoveNodes(sParentId) {
  var oChildNodes = document.getElementById(sParentId).childNodes;
  while (oChildNodes[0]) {
    document.getElementById(sParentId).removeChild(oChildNodes[0]);
  }
}

// Create and return a DOM element.
function fCreateElement(hElement) {
  if (hElement.type) {
    var oElement = document.createElement(hElement.type);
    if (hElement.className) {
      oElement.className = hElement.className;
    }
    if (hElement.id) {
      oElement.id = hElement.id;
    }
    if (hElement.forTag) {
      oElement.htmlFor = hElement.forAttribute;
    }
    if (hElement.inputType) {
      oElement.type = hElement.inputType;
    }
    if (hElement.inputValue) {
      oElement.defaultValue = hElement.inputValue;
      oElement.value = hElement.inputValue;
    }
    if (hElement.elementName) {
      oElement.name = hElement.elementName;
    }
    if (hElement.href) {
      oElement.href = hElement.href;
    }
    if (hElement.title) {
      oElement.title = hElement.title;
    }
    if (hElement.tabindex) {
      oElement.tabIndex = hElement.tabindex;
    }
    return oElement;
  }
}

// *******************************************************************************
// *******************************************************************************
// BEGIN: Slider Functions
// *******************************************************************************
// *******************************************************************************
// Global variables for slider functions
var sElementId;
var nElementHeight;
var nHeight;
var nTargetHeight;
var sSetStyle;
var sSliderElementId;
var nSpeed;
var sClassName;
var nDivideBy;
var oDelay;
var sLinkElementId;
// -----------------------
// FUNCTION: fSliderSetUp
// DESCRIPTION: Searches for slider tags and attaches an onmousedown event to them
// -----------------------
function fSliderSetUp() {
  var aSliderLinks = document.getElementsByName('toggler-div');
  var nSliderCount = aSliderLinks.length;

  for (nCount = 0; nCount < nSliderCount ; nCount++ ) {
    fAddEvent(aSliderLinks[nCount], 'click', fHandleSliderEvents);
    fAddEvent(aSliderLinks[nCount], 'keypress', fHandleSliderEvents);
    var sIdentifier=aSliderLinks[nCount].id.replace(/toggler-link-/,"");
    if (aSliderLinks[nCount].innerHTML=="" && aSliderLinks[nCount].title!="") {
      aSliderLinks[nCount].innerHTML=aSliderLinks[nCount].title;
      sLinkClass=aSliderLinks[nCount].className;
      if (sLinkClass.match('hidden') || sLinkClass.match(' hidden')) {
        fSwitchClass(aSliderLinks[nCount].id, 'hidden');
      }
    }
    if (sIdentifier == 'personalisation-footer') {
      var sCookie = fReadCookie('Personalisation.FooterState');
      if (sCookie) {
        if (sCookie.match('show')) {
          document.getElementById('toggler-div-personalisation-footer').className += ' hidden';
          fSwitchClass('toggler-link-personalisation-footer', 'hide');
          fSwitchClass('toggler-link-personalisation-footer', 'show');
          document.getElementById('toggler-link-personalisation-footer').innerHTML = 'show';
        }
      } else {
        var sInitialState = document.getElementById('toggler-link-' + sIdentifier).className;
        if (sInitialState.match('show')) {
          document.getElementById('toggler-div-' + sIdentifier).className += ' hidden';
          fCreateCookie('Personalisation.FooterState', 'show', 7);
        }
      }
    } else {
      var sShowOrHide = document.getElementById('toggler-link-' + sIdentifier).className;
      if (sShowOrHide.match('show')) {
        fSwitchClass(('toggler-div-' + sIdentifier), 'hidden');
      }

    }
  }
}
// -----------------------
// FUNCTION: fHandleSliderEvents
// DESCRIPTION: Catches slider events
// ARGUMENTS: the event
// -----------------------
function fHandleSliderEvents(e) {
  if (oDelay) {
    clearTimeout(oDelay);
  }
  var e = e || window.event;
  sKeyPressed = e.keyCode || e.charCode;
  if (sKeyPressed == 9) {
    return false;
  }
  var oTargetElement = e.target || e.srcElement;
  sElementId = oTargetElement.id;
  //var nTheNumber = sElementId.match(/\d+/);
  sIdentifier = sElementId.replace(/toggler-link-/,"");
  sElementId = 'toggler-div-' + sIdentifier;
  sLinkElementId = 'toggler-link-' + sIdentifier;
  fDetectState(sElementId);
}

// -----------------------
// FUNCTION: fDetectState
// DESCRIPTION: Detects the state of the slider div container and then calls either open or close as required
// ARGUMENTS: The id of the element to check
// -----------------------
function fDetectState(sElementId) {
  sSliderElementId = sElementId;
  var eElement = document.getElementById(sSliderElementId);
  sClassName = eElement.className;

  sSetStyle = document.getElementById(sSliderElementId).style;

  if (sClassName.match('divide-') || sClassName.match(' divide-')) {
    var nStringIndex = sClassName.indexOf('divide-');
    nDivideBy = sClassName.slice(nStringIndex + 7, nStringIndex + 11 );
    nDivideBy = parseInt(nDivideBy, 10);
  }
  if (sClassName.match('hidden') || sClassName.match(' hidden')) {
    fSlideOpen();
  } else {
    fSlideClosed();
  }
}
// -----------------------
// FUNCTION: fSlideOpen
// DESCRIPTION: Initial script to set up the div to slide open
// ARGUMENTS: none
// -----------------------
function fSlideOpen() {
  fSwitchClass(sSliderElementId, 'hidden');
  nElementHeight = fGetHeight(sSliderElementId);
  nTargetHeight = nElementHeight;
  nSpeed = (nTargetHeight/nDivideBy);
  sSetStyle.overflow = 'hidden';
  sSetStyle.height = '0px';
  nHeight = 0;
  fOpenControl();
  fCreateCookie('Personalisation.FooterState', 'hide', 7);
}
// -----------------------
// FUNCTION: fSlideClosed
// DESCRIPTION: Initial script to set up the div to slide closed
// ARGUMENTS: none
// -----------------------
function fSlideClosed() {
  nTargetHeight = 0;
  nElementHeight = fGetHeight(sSliderElementId);
  sSetStyle.height = nElementHeight;
  sSetStyle.overflow = 'hidden';
  nHeight = nElementHeight;
  nSpeed = (nElementHeight/nDivideBy);
  fCloseControl();
  fCreateCookie('Personalisation.FooterState', 'show', 7);
}
// -----------------------
// FUNCTION: fOpenControl
// DESCRIPTION: sets speed of slide and repeatedly calls the setHeight() function until fully open - then clears styling
// ARGUMENTS: none
// -----------------------
function fOpenControl() {
  nHeight += nSpeed;
  if (nHeight <= nTargetHeight) {
    oDelay = setTimeout('fSetHeight(\'fOpenControl\')', 1);
  } else {
    sSetStyle.overflow = '';
    sSetStyle.height = '';

    if (document.getElementById(sLinkElementId).className.match('show') || document.getElementById(sLinkElementId).className.match(' show')) {
      fSwitchClass(sLinkElementId, 'show');
      fSwitchClass(sLinkElementId, 'hide');
      if (document.getElementById(sLinkElementId).innerHTML.match('show')) {
        document.getElementById(sLinkElementId).innerHTML = 'hide';
      }
    }
  }
}
// -----------------------
// FUNCTION: fCloseControl
// DESCRIPTION: sets speed of slide and repeatedly calls the setHeight() function until fully closed - then clears styling
// ARGUMENTS: none
// -----------------------
function fCloseControl() {
  nHeight -= nSpeed;

  if (nHeight >= nTargetHeight) {
    oDelay = setTimeout('fSetHeight(\'fCloseControl\')', 1);
  } else {
    fSwitchClass(sSliderElementId, 'hidden');
    sSetStyle.overflow = '';
    sSetStyle.height = '';
    if (document.getElementById(sLinkElementId).className.match('hide') || document.getElementById(sLinkElementId).className.match(' hide')) {
      fSwitchClass(sLinkElementId, 'hide');
      fSwitchClass(sLinkElementId, 'show');
      if (document.getElementById(sLinkElementId).innerHTML.match('hide')) {
        document.getElementById(sLinkElementId).innerHTML = 'show';
      }
    }
  }
}
// -----------------------
// FUNCTION: fGetHeight
// DESCRIPTION: get the height of the div
// ARGUMENTS: none
// RETURNS: calculated height
// -----------------------
function fGetHeight() {
  return document.getElementById(sSliderElementId).offsetHeight;
}
// -----------------------
// FUNCTION: fSetHeight
// DESCRIPTION: sets a style height on a div and then calls the function passed to it
// ARGUMENTS: a function name
// -----------------------
function fSetHeight(sFunctionName) {
  document.getElementById(sSliderElementId).style.height = nHeight + 'px';
  window[sFunctionName]();
}

// *******************************************************************************
// *******************************************************************************
// END: Slider Functions
// *******************************************************************************
// *******************************************************************************

//-----------------------
// FUNCTION: fCreateCookie
// DESCRIPTION: A function that creates a cookie
// ARGUMENTS: 1: Cookie Name, 2: Cookie Value 3: Expiry date
//-----------------------
function fCreateCookie(sName, sValue, sDays) {
  if (sDays) {
    var oDate = new Date();
    oDate.setTime(oDate.getTime() + (sDays * 24 * 60 * 60 * 1000));
    var sExpires = "; expires=" + oDate.toGMTString();
  }
  else var sExpires = "";
  document.cookie = sName + "=" + sValue + sExpires + "; path=/";
}
//-----------------------
// FUNCTION: fReadCookie
// DESCRIPTION: A function that reads a cookie
// ARGUMENTS: 1: Cookie Name
// RETURN: cookie string or null if no cookie present
//-----------------------
function fReadCookie(sName) {
  var sNameEQ = sName + "=";
  var aCookies = document.cookie.split(';');
  for(var nCount = 0; nCount < aCookies.length; nCount++) {
    var sCookie = aCookies[nCount];
    while (sCookie.charAt(0)==' ') sCookie = sCookie.substring(1, sCookie.length);
    if (sCookie.indexOf(sNameEQ) == 0) return sCookie.substring(sNameEQ.length, sCookie.length);
  }
  return null;
}
//-----------------------
// FUNCTION: fDeleteCookie
// DESCRIPTION: A function that deletes a cookie
// ARGUMENTS: 1: Cookie Name , path , domain
//-----------------------
function fDeleteCookie( name, path, domain )
{
  if ( GetCookie( name ) )
    document.cookie = name + "=" + ( ( path ) ? ";path=" + path : "") + ( ( domain ) ? ";domain=" + domain : "" ) + ";expires=Thu, 01-Jan-1970 00:00:01 GMT";
}

// ----------------------
// FUNCTION: fGetHref
// DESCRIPTION: A function that returns the url of the "what's this' link in social bookmarks
// ARGUMENTS: None
// RETURN: sLinkRef (the url)
// ----------------------
function fGetHref() {
  var aLinks = document.getElementById('social-bookmarks').getElementsByTagName('a');
  var nLength = aLinks.length;

  for (nCount = 0; nCount < nLength ; nCount++) {
    if (aLinks[nCount].className.match('explanation')) {
      var sLinkRef = aLinks[nCount].href;
      return sLinkRef;
    }
  }
}

// ----------------------
// FUNCTION: fRenderBookmarkLinks
// DESCRIPTION: A function that renders bookmark links
// ARGUMENTS: None
// ----------------------
function fBookmarkingLinks() {
  fAddEvent(document.getElementById('delicious'), 'click', fDelicious);
  fAddEvent(document.getElementById('delicious'), 'keydown', function(){fDelicious});
  fAddEvent(document.getElementById('diggit'), 'click', fDigg);
  fAddEvent(document.getElementById('diggit'), 'keydown', function(){fDigg});
  fAddEvent(document.getElementById('facebook'), 'click', fFacebook);
  fAddEvent(document.getElementById('facebook'), 'keydown', function(){fFacebook});
  fAddEvent(document.getElementById('reddit'), 'click', fReddit);
  fAddEvent(document.getElementById('reddit'), 'keydown', function(){fReddit});
  fAddEvent(document.getElementById('stumbleupon'), 'click', fStumbleupon);
  fAddEvent(document.getElementById('stumbleupon'), 'keydown', function(){fStumbleupon});

}
function fDelicious(e) {
  window.open('http://del.icio.us/post?url=' + encodeURIComponent(location.href) + '%26title%3D' + encodeURIComponent(document.title));
  if (e.target) {
    e.preventDefault();
  }
  if (e.srcElement) {
    return false;
  }
}
function fDigg(e) {
  window.open('http://digg.com/submit?url=' + encodeURIComponent(location.href) + '%26title%3D' + encodeURIComponent(document.title));
  if (e.target) {
    e.preventDefault();
  }
  if (e.srcElement) {
    return false;
  }
}
function fFacebook(e) {
  window.open('http://www.facebook.com/sharer.php?u='  + encodeURIComponent(location.href) + '%26title%3D' + encodeURIComponent(document.title));
  if (e.target) {
    e.preventDefault();
  }
  if (e.srcElement) {
    return false;
  }
}
function fReddit(e) {
  window.open('http://reddit.com/submit?url=' + encodeURIComponent(location.href) + '%26title%3D' + encodeURIComponent(document.title));
  if (e.target) {
    e.preventDefault();
  }
  if (e.srcElement) {
    return false;
  }
}
function fStumbleupon(e) {
  window.open('http://www.stumbleupon.com/submit?url='  + encodeURIComponent(location.href) + '%26title%3D' + encodeURIComponent(document.title));
  if (e.target) {
    e.preventDefault();
  }
  if (e.srcElement) {
    return false;
  }
}

function fCheckPopUpStatus(oHttpRequest) {
  if (oHttpRequest.readyState == 4) {
    if (oHttpRequest.status == 200) {
      var sInnerHTML = oHttpRequest.responseText;
      fRenderPopUp(sInnerHTML)
    } else {
      var sInnerHTML =  '<p class="error"><span>Sorry there was a problem with that request.</span> Please try again later</p>';
      fRenderPopUp(sInnerHTML)
    }
  }
}
/* NEW Bookmarking */
function fRenderPopUp(sInnerHTML) {
  var hDiv1 = {type:'div', className:'blur', id:'blur'};
  hDiv1 = fCreateElement(hDiv1);
  hDiv1.style.opacity = '.7';
  document.body.insertBefore(hDiv1, document.body.firstChild);

  /* Create the pop-up */
  hDiv1 = {type:'div', className:'info-box', id:'personalisation-popup'};
  hDiv1 = fCreateElement(hDiv1);
  if ((nPopupHeight) && (nPopupWidth)) {
    nPopupWidth = (parseInt(nPopupWidth) + parseInt(20));
    nPopupHeight = (parseInt(nPopupHeight) + parseInt(44));
    hDiv1.style.width = nPopupWidth + "px";
    hDiv1.style.height = nPopupHeight + "px";
    hDiv1.style.left =nPopupLeft + "px";
    hDiv1.style.top =nPopupTop + "px";
    hDiv1.className = 'info-box tool-box ';
  }
  var hDiv2 = {type:'div', className:'top'};
  hDiv2 = fCreateElement(hDiv2);
  var hSpan1 = {type:'span', className:'crnr tl'};
  hSpan1 = fCreateElement(hSpan1);
  var hSpan2 = {type:'span', className:'crnr tr'};
  hSpan2 = fCreateElement(hSpan2);

  hDiv2.appendChild(hSpan1);
  hDiv2.appendChild(hSpan2);
  hDiv1.appendChild(hDiv2);

  hDiv2 = {type:'div', className:'info-mid-brdr'};
  hDiv2 = fCreateElement(hDiv2);
  var hDiv3 = {type:'div', className:'info-box-mid clear'};
  hDiv3 = fCreateElement(hDiv3);
  var hLink1 = {type:'a', id:'close', className:'close'};
  hLink1 = fCreateElement(hLink1);
  var sText1 = document.createTextNode('close');

  hLink1.appendChild(sText1);

  hDiv3.appendChild(hLink1);
  hDiv3.innerHTML += sInnerHTML;
  hDiv2.appendChild(hDiv3);
  hDiv1.appendChild(hDiv2);

  var hSpan1 = {type:'span', className:'crnr br'};
  hSpan1 = fCreateElement(hSpan1);
  var hSpan2 = {type:'span', className:'crnr bl'};
  hSpan2 = fCreateElement(hSpan2);

  hDiv1.appendChild(hSpan1);
  hDiv1.appendChild(hSpan2);

  var hDiv2 = {type:'div', className:'bottom'};
  hDiv2 = fCreateElement(hDiv2);

  hDiv1.appendChild(hDiv2);

  document.body.insertBefore(hDiv1, document.body.firstChild);

  fAddEvent(document.getElementById('close'), 'click', fClosePopUp);

  if (IE6) {
    var nPageHeight = document.body.offsetHeight;
    document.getElementById('blur').style.height = nPageHeight;
    var nScrollPos = fGetScroll();
    var nDivHeight = document.getElementById('personalisation-popup').offsetHeight;
    document.getElementById('personalisation-popup').style.marginTop = nScrollPos;
    document.getElementById('personalisation-popup').style.marginBottom = ('-' + (nScrollPos + (nDivHeight - 7)));
  }
}

function fClosePopUp() {
  var oRemove = document.body.removeChild(document.getElementById('personalisation-popup'));
  oRemove = document.body.removeChild(document.getElementById('blur'));
}

// Hides all elements of a given type within a container element using the CSS class 'hidden'
// recieves the container ID and element type
function fHideElements(sContainerId, sElementType) {
  var sElementId;
  var sContainer = document.getElementById(sContainerId);
  var aElements = sContainer.getElementsByTagName(sElementType);
  var nArrayLength = aElements.length;
  for (nCount = 0; nCount < nArrayLength ; nCount++) {
    sElementId = aElements[nCount].id;
    fSwitchClass(sElementId, 'hidden');
  }
}

var oMSGlobals; // Global variable for Main Search.

// Object instance to hold global variables for main search switching.
function fMainSearchGlobals() {
  this.sSearchContainer = 'search-options';
  this.sActiveId = 'search-1';
  this.sActiveClassName = 'active';
}

// ----------------------
// FUNCTION: fSearchOptionsSetUp
// DESCRIPTION: Re-styling and event allocation for main search.
// ARGUMENTS: none
// ----------------------
function fSearchOptionsSetUp() {
  fHideElements('search-options','input');
  oMSGlobals = new fMainSearchGlobals();
  var aLabels = document.getElementById(oMSGlobals.sSearchContainer).getElementsByTagName('label');
  var nLabelCount = aLabels.length;
  for (nCount = 0; nCount < nLabelCount; nCount++ ) {
    fAddEvent(document.getElementById(aLabels[nCount].id), 'click', fSearchOptionsSwitch);
    fAddEvent(document.getElementById(aLabels[nCount].id), 'keydown', fSearchOptionsSwitch);
  }
}

// ----------------------
// FUNCTION: fSearchOptionsSwitch
// DESCRIPTION: Switches active search tab
// ARGUMENTS: none
// ----------------------
function fSearchOptionsSwitch(e) {
  e = e || window.event;
  if (e.target) {
    var sTargetId = e.target.id;
  }
  if (e.srcElement) {
    var sTargetId = e.srcElement.id;
  }
  if (sTargetId) {
    if (sTargetId.match(/\d+/)) {
      if (sTargetId != oMSGlobals.sActiveId) {
        fSwitchClass(oMSGlobals.sActiveId, oMSGlobals.sActiveClassName);
        fSwitchClass(sTargetId, oMSGlobals.sActiveClassName);
        oMSGlobals.sActiveId = sTargetId;
      }
    }
  }
}

// ----------------------
// FUNCTION: fSetIds
// DESCRIPTION: Searches for element types with a specific classname and adds an ID to them of that classname + a number. e.g. <ul class="list"> becomes <ul class="list" id="list-1">
// Arguments: sType is the element type e.g. "div" or "ul", sClassName is the class name to match
// ----------------------
function fSetIds(sType, sClassName) {
  var aElements = document.getElementsByTagName(sType);
  var nLength = aElements.length;
  var nIdCount = 0;
  this.aIds = new Array();

  for (nCount = 0; nCount < nLength ; nCount++) {
    if (aElements[nCount].className.match(sClassName)) {
      aElements[nCount].id = (sClassName + '-' + nIdCount);
      this.aIds[nIdCount] = (sClassName + '-' + nIdCount);
      nIdCount++
    }
  }
}

var oCLGlobals; // Global variable for carousel style lists.

function fCarouselListGlobals() {
  this.sClassIdentifier = 'carousel-list'; // classname attached to lists to search for
  this.sNewClass = 'carousel-list-js'; // New classname for the JS version list
  this.nListCount;
  this.nListPosition;
  this.nListItemCount;
  this.nSlideTime = '500'; // Time for sliding between list items (1000 = 1 second).
  this.nSlideInterval = '50'; // Time for each slide interval (100 = 0.1 second).
  this.nSectionWidth;
  this.sParentClass = 'list-box' // Classname for parent container that sets overall width for individual list item.
  this.nIntervalCounter = 0;
  this.nSwapCount = new Array();
  this.bIsActive = false;
}

function fAddListItemIds(sParentId, nListNumber) {
  var aListItems = document.getElementById(sParentId).getElementsByTagName('li');
  oCLGlobals.nListItemCount = aListItems.length;
  for (nSubCount = 0; nSubCount < oCLGlobals.nListItemCount ; nSubCount++) {
    aListItems[nSubCount].id = 'list-' + nListNumber + '-item-' + nSubCount;
  }
}

function fAddNav(sListId, sDirection) {
  var oDiv = document.createElement('span');
  oDiv.className = sDirection + '-arrow';
  var oImg = document.createElement('img');
  oImg.setAttribute('src', '/img/nhsdirect/' + sDirection + '-arrow.gif');
  oImg.setAttribute('alt', sDirection);
  oImg.setAttribute('height', '28');
  var oLink = document.createElement('a');
  oLink.setAttribute('title', sDirection);
  oLink.id = sListId + '-' + sDirection + '-arrow';
  var sLinkId = sListId + '-' + sDirection + '-arrow';
  oLink.appendChild(oImg);
  oDiv.appendChild(oLink);
  oParent = document.getElementById(sListId).parentNode;
  sListId = document.getElementById(sListId);
  oParent.insertBefore(oDiv, sListId);
  fAddEvent(document.getElementById(sLinkId), 'click', function() {fScroll(sLinkId, sDirection)});
}

function fScroll(sElementId, sDirection) {
  if (oCLGlobals.bIsActive == false) {
    var nListNumber = sElementId.match(/\d+/);
    var sListId = (oCLGlobals.sClassIdentifier + '-' + nListNumber);
    fSlideList(sListId, sDirection);
  }
}

function fSlideList(sListId, sDirection) {
  var nIntervalCount = (oCLGlobals.nSlideTime / oCLGlobals.nSlideInterval);
  var nSlideDistance = (oCLGlobals.nSectionWidth / nIntervalCount);
  var sCurrentLeft = document.getElementById(sListId).style.left;
  if (oCLGlobals.nIntervalCounter < (nIntervalCount)) {
    var oSliderTimeout = setTimeout(function () {fSliderTimeout(sListId, sDirection, sCurrentLeft, nSlideDistance)}, oCLGlobals.nSlideInterval);
    oCLGlobals.bIsActive = true;
  } else {
    oCLGlobals.nIntervalCounter = 0;
    clearTimeout(oSliderTimeout);
    oCLGlobals.bIsActive = false;
    sListId = document.getElementById(sListId);
    fCenterList(sListId);
    fSwitchList(sListId, sDirection);
  }
}

function fSliderTimeout(sListId, sDirection, sCurrentLeft, nSlideDistance) {
  var nCurrentLeft = sCurrentLeft.match(/\d+(\.\d+)?/);
  if (sDirection == 'back') {
    var nNewLeft = (parseFloat(nCurrentLeft) - parseFloat(nSlideDistance));
  } else {
    var nNewLeft = (parseFloat(nCurrentLeft) + parseFloat(nSlideDistance));
  }
  document.getElementById(sListId).style.left = ('-' + nNewLeft + 'em');
  oCLGlobals.nIntervalCounter++;
  fSlideList(sListId, sDirection);
}

function fSwitchList(sListId, sDirection) {
  var aItems = sListId.getElementsByTagName('li');
  if (sDirection == 'back') {
    var oElementToSwitch = aItems[aItems.length-1].id;
    var oElementHolder = sListId.removeChild(document.getElementById(oElementToSwitch));
    sListId.insertBefore(oElementHolder, sListId.firstChild);
  } else {
    var oElementToSwitch = aItems[0].id;
    var oElementHolder = sListId.removeChild(document.getElementById(oElementToSwitch));
    sListId.appendChild(oElementHolder);
  }
  sListId.style.visability = '';
}

function fCreateCarouselLists() {
  oCLGlobals = new fCarouselListGlobals();
  var oSetIds = new fSetIds('ul', oCLGlobals.sClassIdentifier);
  oCLGlobals.nListCount = oSetIds.aIds.length;
  for (nCount = 0; nCount < oCLGlobals.nListCount; nCount++) {
    fSwitchClass(oSetIds.aIds[nCount], oCLGlobals.sClassIdentifier);
    fSwitchClass(oSetIds.aIds[nCount], oCLGlobals.sNewClass);
    fAddListItemIds(oSetIds.aIds[nCount], nCount);
    fAddNav(oSetIds.aIds[nCount], 'forward');
    fAddNav(oSetIds.aIds[nCount], 'back');
    var sListId = document.getElementById(oSetIds.aIds[nCount]);
    oCLGlobals.nSwapCount[nCount] = Math.floor(oCLGlobals.nListItemCount / 2);
    for (nSubCount = 0; nSubCount < oCLGlobals.nSwapCount[nCount] ; nSubCount++) {
      fSwitchList(sListId, 'back');
    }
    fCenterList(sListId);
  }
}

function fCenterList(sListId) {
  var nListNumber = sListId.id;
  var nListNumber = nListNumber.match(/\d+/);
  // Loop up to parent that sets width.
  var sParentId = sListId;
  do {
    sParentId = sParentId.parentNode;
  } while (sParentId.className != oCLGlobals.sParentClass);

  // Get parent width
  if (window.getComputedStyle) {
    oCLGlobals.nListPosition = getComputedStyle(sParentId, null).getPropertyValue("width");
    var nDivideBy = fCalculateEMs(sListId ,oCLGlobals.nListPosition);
    oCLGlobals.nListPosition = oCLGlobals.nListPosition.replace('px', '');
    oCLGlobals.nListPosition = Math.round(oCLGlobals.nListPosition / nDivideBy);
  } else if (sParentId.currentStyle) {
    oCLGlobals.nListPosition = sParentId.currentStyle.width + '';
    oCLGlobals.nListPosition = oCLGlobals.nListPosition.replace ('em', '');
  }
  // Add the negative margin to the list.
  sListId.style.visability = 'hidden';
  oCLGlobals.nSectionWidth = oCLGlobals.nListPosition;
  oCLGlobals.nListPosition = ('-' + (oCLGlobals.nListPosition * oCLGlobals.nSwapCount[nListNumber]) + 'em');
  sListId.style.left = oCLGlobals.nListPosition;
}

function fCalculateEMs(sListId, nPixelSize) {
  var oTempDiv = document.createElement('div');
  oTempDiv.id = 'em-test-div';  // N.B. Need id declaration to match in CSS with width of 1000em;
  sListId.appendChild(oTempDiv);
  var oTempId = document.getElementById('em-test-div');
  var nPixelWidth = window.getComputedStyle(oTempId, null).getPropertyValue("width");
  nPixelWidth = nPixelWidth.replace('px', '');
  var nEmWidth = (nPixelWidth / 1000);
  sListId.removeChild(oTempId);
  return nEmWidth;
}

var oCarouselGlobals;

function fCarouselGlobals() {
  this.oActiveTab = 0;
}

function fCarouselSwitch(e) {
  var oTarget = fGetTarget(e);
  var sTargetId = oTarget.id;
  var nTab = sTargetId.match(/\d+/);
  if (nTab != oCarouselGlobals.oActiveTab) {
    fSwitchClass(('carousel-image-' + oCarouselGlobals.oActiveTab), 'hidden');
    fSwitchClass(('carousel-image-' + nTab), 'hidden');
    if (document.getElementById('carousel-text-' + oCarouselGlobals.oActiveTab)) {
      fSwitchClass(('carousel-text-' + oCarouselGlobals.oActiveTab), 'hidden');
    }
    if (document.getElementById('carousel-text-' + nTab)) {
      fSwitchClass(('carousel-text-' + nTab), 'hidden');
    }
    fSwitchClass(('carousel-link-' + oCarouselGlobals.oActiveTab), 'active');
    fSwitchClass(('carousel-link-' + nTab), 'active');
    var currentTab = document.getElementById('carousel-link-' + oCarouselGlobals.oActiveTab);
    currentTab.setAttribute('aria-selected', false);
    currentTab.setAttribute('tabindex', -1);
    var newTab = document.getElementById('carousel-link-' + nTab);
    newTab.setAttribute('aria-selected', true);
    newTab.setAttribute('tabindex', 0);
    var tabPanelTexts = document.getElementsByClassName('carousel-text');
    for (var pCount = 0; pCount < tabPanelTexts.length; pCount++) {
      fSetTabIndex(tabPanelTexts[pCount], -1);
    }
    var currentTabPanel = document.getElementById('carousel-tabpanel-' + oCarouselGlobals.oActiveTab);
    currentTabPanel.setAttribute('aria-hidden', true);
    var newTabPanel = document.getElementById('carousel-tabpanel-' + nTab);
    newTabPanel.setAttribute('aria-hidden', false);
    fSetTabIndex(newTabPanel, 0);
    oCarouselGlobals.oActiveTab = nTab;
  }
}

function fSetTabIndex(oPanel, nValue) {
  var panelLinks = oPanel.getElementsByTagName('a');
  for (var aCount = 0; aCount < panelLinks.length; aCount++) {
    panelLinks[aCount].setAttribute('tabindex', nValue);
  }
}

function fGetPreviousSibling(oInsertBefore) {
  var oSibling = oInsertBefore.previousSibling;
  while (oSibling.nodeType !=1) {
    oSibling = oSibling.previousSibling;
  }
  return oSibling;
}

function fCarousel(sCarouselId) {
  oCarouselGlobals = new fCarouselGlobals();
  // Asign initial image ID
  var oOrignalImage = document.getElementById('carousel').getElementsByTagName('img');
  oOrignalImage[0].id = 'carousel-image-0';
  // Add Events
  var aStoredHrefs = new Array();
  var oLinks = document.getElementById(sCarouselId).getElementsByTagName('a');
  var nLinksLength = oLinks.length;
  var nLinkIdCount = 0;
  for (nLinksCount = 0; nLinksCount < nLinksLength; nLinksCount++) {
    if (oLinks[nLinksCount].className.match('tab-link')) {
      oLinks[nLinksCount].id = ('carousel-link-' + nLinkIdCount);
      aStoredHrefs[nLinkIdCount] = oLinks[nLinksCount].href;
      oLinks[nLinksCount].removeAttribute('href');
      //fAddEvent(oLinks[nLinksCount], 'click', fCarouselSwitch); // remove click event, added further down
      nLinkIdCount++;
    }
  }
  // Create Carousel text ids
  var oDivs = document.getElementById(sCarouselId).getElementsByTagName('div');
  var nDivLength = oDivs.length;
  var nTabIdIndex = 0;
  for (nDivCount = 0; nDivCount < nDivLength; nDivCount++) {
    if (oDivs[nDivCount].className.match('carousel-text')) {
      oDivs[nDivCount].id = ('carousel-text-' + nTabIdIndex);
      nTabIdIndex++;
    }
  }
  // Create Image objects
  var aImages = new Object();
  var nImageLength = aCarouselImages.length;
  for (nImageCount = 0; nImageCount < nImageLength; nImageCount++) {
    aImages[nImageCount] = document.createElement('img');
    aImages[nImageCount].setAttribute('src', aCarouselImages[nImageCount]);
    aImages[nImageCount].setAttribute('alt', aCarouselAltTexts[nImageCount]);
    aImages[nImageCount].className = 'hidden';
    aImages[nImageCount].id = ('carousel-image-' + (nImageCount + 1));
    if (!document.getElementById('carousel-text-' + (nImageCount + 1))) {
      var oLink = document.createElement('a');
      oLink.setAttribute('href', aStoredHrefs[nImageCount + 1]);
      oLink.setAttribute('title', '');
      oLink.appendChild(aImages[nImageCount]);
      aImages[nImageCount] = oLink;
    }
  }

  // Insert images
  for (nInsertCount = 0; nInsertCount < nImageCount; nInsertCount++) {
    var tabPanel = document.getElementById('carousel-tabpanel-' + nInsertCount);
    tabPanel.insertBefore(aImages[nInsertCount], tabPanel.firstChild);
  }
}

// Checks for requirement of and adds common site wide events.
function fAddChoicesEvents() {
  fSliderSetUp();
  if (document.getElementById('social-bookmarking')) {
    fBookmarkingLinks();
  }
  if (document.getElementById('questions')) {
    fCreateCarouselLists();
  }
  if (document.getElementById('search-options')) {
    fSearchOptionsSetUp();
  }
  if (document.getElementById('carousel')) {
    fCarousel('carousel');
  }
  fInputClear();
}
fAddEvent(window, 'load', fAddChoicesEvents);

/* BEGIN: Personalisation Functionality */

/* Global Variables */
var nWinWidth = '';
var nWinHeight = '';
var nPopupHeight = '';
var nPopupWidth = '';
var nPopupLeft = '';
var nPopupTop = '';
// ----------------------
// FUNCTION: fShowLayer
// DESCRIPTION: A function that positions, reveals and gives focus to the layer
// ARGUMENTS: n/a
// ----------------------
function fShowLayer(sLayerID) {
  fSwitchClass(sLayerID, 'display-none');

  var oSelects = document.getElementsByTagName('select');
  var nSelectCount = oSelects.length;
  if (IE6) {
    var sTempId = '';
    for (nCount = 0; nCount < nSelectCount ; nCount++) {
      sTempId = oSelects[nCount].id;
      fSwitchClass(sTempId, 'hidden');
    }
    var nScreenHeight = document.body.offsetHeight;
    document.getElementById('blur').style.height = nScreenHeight;
  }
  var nScrollPos = fGetScroll();
  fGetPageSize();
  var nMessageHeight = document.getElementById('message-box').offsetHeight;
  var nTop = Math.floor((nScrollPos + (nWinHeight/2)) - (nMessageHeight/2)) ;
  var nMessageWidth = document.getElementById('message-box').offsetWidth;
  var nLeft = Math.floor((nWinWidth/2) - (nMessageWidth/2));
  document.getElementById('message-box').style.top = nTop + 'px';
  document.getElementById('message-box').style.left = nLeft + 'px';
  document.getElementById('top-to-bottom').style.height = nMessageHeight + 'px';
  document.getElementById('left-to-right').style.height = (nMessageHeight - 18) + 'px';
  document.getElementById('message-box-close').focus();
}

// ----------------------
// FUNCTION: fGetScroll
// DESCRIPTION: A function that returns how far the user has scrolled down the page.
// ARGUMENTS: n/a
// RETURN: nScrollHeight - the number of pixels scrolled down.
// ----------------------
function fGetScroll() {
  var nScrollHeight = 0;
  if ( typeof(window.pageYOffset) == 'number' ) {
    nScrollHeight = window.pageYOffset;
  } else if (document.body && document.body.scrollTop) {
    nScrollHeight = document.body.scrollTop;
  } else if (document.documentElement && document.documentElement.scrollTop) {
    nScrollHeight = document.documentElement.scrollTop;
  }
  return nScrollHeight;
}

// ----------------------
// FUNCTION: fGetPageSize
// DESCRIPTION: A function that calculates the width and height of the available view port.
// ARGUMENTS: n/a
// ----------------------
function fGetPageSize(){
  if (typeof window.innerWidth!='undefined') {
    nWinWidth = window.innerWidth;
    nWinHeight = window.innerHeight;
  } else if (document.documentElement && typeof document.documentElement.clientWidth!='undefined' && document.documentElement.clientWidth!=0 ) {
    nWinWidth = document.documentElement.clientWidth;
    nWinHeight = document.documentElement.clientHeight;
  } else if (document.body && typeof document.body.clientWidth!='undefined') {
    nWinWidth = document.body.clientWidth;
    nWinHeight = document.body.clientHeight;
  }
}

// ----------------------
// FUNCTION: fRemoveElement
// DESCRIPTION: A function that removes an element from the DOM
// ARGUMENTS: 1: The parent ID, 2: The actual element ID
// ----------------------
function fRemoveElement(sParent, sElementToRemove) {
  sParent = document.getElementById(sParent);
  sElementToRemove = document.getElementById(sElementToRemove);
  sParent.removeChild(sElementToRemove);
}

// ----------------------
// FUNCTION: fMakeRequest
// DESCRIPTION: A function that makes a httpRequest and then passes that to a function
// ARGUMENTS: sUrl: the url of the file to be called, sFunction: the function to pass it to
// RETURN: False or Function Call
// ----------------------
function fMakeRequest(sUrl, sFunction) {
  var oHttpRequest;

  if (window.XMLHttpRequest) { // Mozilla, Safari, ...
    oHttpRequest = new XMLHttpRequest();
    if (oHttpRequest.overrideMimeType) {
      oHttpRequest.overrideMimeType('text/xml');
    }
  } else if (window.ActiveXObject) { // IE
    try {
      oHttpRequest = new ActiveXObject("Msxml2.XMLHTTP");
    } catch (e) {
      try {
        oHttpRequest = new ActiveXObject("Microsoft.XMLHTTP");
      } catch (e) {
      }
    }
  }
  if (!oHttpRequest) {
    alert('Giving up :( Cannot create an XMLHTTP instance');
    return false;
  }
  fPopupHeightWidth(sUrl);
  oHttpRequest.onreadystatechange = function() { eval(sFunction + '(oHttpRequest)'); };
  oHttpRequest.open('GET', sUrl+'?bustcache='+new Date().getTime(), true);
  oHttpRequest.send('');
}

// ----------------------
// FUNCTION: fPopupHeightWidth
// DESCRIPTION: A function that returns top and left positions for a popup box for it to be in the center of the screen
// ARGUMENTS: sUrl: the url of the popup content containing it's height and width
// RETURN: 1: Left position, 2: Top position
// ----------------------
function fPopupHeightWidth(sUrl) {
  if(sUrl.length > 1) {
    keyValuePairs = new Array();
    keyValue = new Array();

    for (var i=0; i < sUrl.split('&').length; i++) {
      keyValuePairs[i] = sUrl.split('&')[i];
      keyValue = keyValuePairs[i].split('=');
      if (keyValue[0]== 'height') {
        nPopupHeight = (parseInt(keyValue[1]) + parseInt(10)); // give it extra height
      }
      else if (keyValue[0]== 'width') {
        nPopupWidth = (parseInt(keyValue[1]) + parseInt(10)); //give it extra width
      }
    }

    fGetPageSize();
    nPopupLeft = (parseInt((nWinWidth) - parseInt(nPopupWidth))/parseInt(2));
    nPopupTop = (parseInt((nWinHeight) - parseInt(nPopupHeight))/parseInt(2));

    if (nPopupLeft < 0) {
      nPopupLeft = 10; // give it a little positioning
    }

    if (nPopupTop < 0) {
      nPopupTop = 10; // give it a little positioning
    }
  }
}

/* Height & Weight */
var aHeightInputs = new Array();
var aWeightInputs = new Array();

// -----------------------
// FUNCTION: fAddBMIListeners
// DESCRIPTION: A function that adds event listeners to the height and weight form.
// ARGUMENTS: 1: fieldset ID.
// -----------------------
function fAddBMIListeners(sFieldsetID) {
  if (document.getElementById(sFieldsetID)) {
    var oContainerID = document.getElementById(sFieldsetID);

    switch (sFieldsetID)
    {
      case 'height' :
        aHeightInputs = oContainerID.getElementsByTagName('input');
        var nLength = aHeightInputs.length;
        for (nCount = 0; nCount < nLength; nCount++ ) {
          fAddEvent(aHeightInputs[nCount], 'keyup', fBMIControl)
        }
        break;
      case 'weight' :
        aWeightInputs = oContainerID.getElementsByTagName('input');
        var nLength = aWeightInputs.length;
        for (nCount = 0; nCount < nLength; nCount++ ) {
          fAddEvent(aWeightInputs[nCount], 'keyup', fBMIControl)
        }
        break;
    }
  }
}
/* Conversion Globals */
var bHeightError = false;
var bWeightError = false;
// -----------------------
// FUNCTION: fBMIControl
// DESCRIPTION: A function that handles the weight and height events.
// ARGUMENTS: 1: the event itseld.
// -----------------------
function fBMIControl(e) {
  fPopulateInputArray();
  e = e || window.event;
  if (e.target) {
    var sTargetId = e.target.id;
    var sValue =  e.target.value;
  }
  if (e.srcElement) {
    var sTargetId = e.srcElement.id;
    var sValue = e.srcElement.value;
  }
  var nAtLeastZero = document.getElementById(sTargetId).value;
  if (nAtLeastZero == '') {
    nAtLeastZero = 0;
    document.getElementById(sTargetId).value = 0;
  }
  var sLastDigit = sValue.charAt(sValue.length-1);
  var bIsNotANumber = isNaN(sLastDigit);
  if (bIsNotANumber) {
    var nCutStringAt = sValue.length-1;
    sValue = sValue.substr(0, nCutStringAt);
    document.getElementById(sTargetId).value = sValue;
    fAtLeastZero(sTargetId);
  } else {

    var aTargetId = sTargetId.split('_');
    var nArrayLength = (aTargetId.length -1);

    switch (aTargetId[nArrayLength]) {
      case 'feet':
        fAtLeastZero(sTargetId);
        fHeightImperialToMetric();
        break;
      case 'inches':
        var nInchesValue = document.getElementById(sTargetId).value;

        if (nInchesValue > 11 && bHeightError == false) {
          var oDiv = document.createElement('div');
          var oLabel = document.createElement('label');
          oDiv.setAttribute('id', 'height-error');
          oLabel.setAttribute('id', 'height-error-label');
          oDiv.setAttribute('tabindex', '0');
          oLabel.setAttribute('for', sTargetId);
          oLabel.setAttribute('tabindex', '0');
          var oText = document.createTextNode('Please enter an inches value of less than 12');
          oLabel.className = 'error';
          oLabel.appendChild(oText);
          oDiv.appendChild(oLabel);
          var oHeight = document.getElementById('height');
          oHeight.insertBefore(oDiv, oHeight.firstChild);
          document.getElementById('height-error').focus();
          bHeightError = true;
        }
        if (nInchesValue < 12 && bHeightError == true) {
          fRemoveElement('height', 'height-error');
          bHeightError = false;
        }
        fAtLeastZero(sTargetId);
        fHeightImperialToMetric();
        break;
      case 'metres':
        fAtLeastZero(sTargetId);
        fHeightMetricToImperial();
        break;
      case 'centimetres':
        fAtLeastZero(sTargetId);
        fHeightMetricToImperial();
        break;
      case 'stone':
        fAtLeastZero(sTargetId);
        fWeightImperialToMetric(0);
        break;
      case 'pounds':
        var nPoundsValue = document.getElementById(sTargetId).value;

        if (nPoundsValue > 13 && bWeightError == false) {
          var oDiv = document.createElement('div')
          var oLabel = document.createElement('label');
          oDiv.setAttribute('id', 'weight-error');
          oDiv.setAttribute('tabindex', '0');
          oLabel.setAttribute('for', sTargetId);
          oLabel.setAttribute('tabindex', '0');
          oLabel.setAttribute('id', 'weight-error-label');
          var oText = document.createTextNode('Please enter an pounds value of less than 14');
          oLabel.className = 'error';
          oLabel.appendChild(oText);
          oDiv.appendChild(oLabel);
          var oWeight = document.getElementById('weight');
          oWeight.insertBefore(oDiv, oWeight.firstChild);
          document.getElementById('weight-error').focus();
          bWeightError = true;
        }
        if (nPoundsValue < 14 && bWeightError == true) {
          fRemoveElement('weight', 'weight-error');
          bWeightError = false;
        }
        fAtLeastZero(sTargetId);
        fWeightImperialToMetric(0);
        break;
      case 'kilos':
        fAtLeastZero(sTargetId);
        fWeightMetricToImperial();
        break;
    }
  }
}

var aInputIds = new Array();
/* N.B. 0 = feet, 1 = inches, 2 = metres, 3 = centimetres, 4 = stone, 5 = pounds, 6 = kilos */

// -----------------------
// FUNCTION: fPopulateInputArray
// DESCRIPTION: A function that gathers the IDs of the height & weight inputs into the array aInputIds.
// ARGUMENTS: None
// -----------------------
function fPopulateInputArray() {
  var aHeightInputIds = new Array();
  var aWeightInputIds = new Array();
  var sFieldset = document.getElementById('height');
  var aHeightInputs = new Array();
  aHeightInputs = sFieldset.getElementsByTagName('input');
  for (nCount = 0; nCount < aHeightInputs.length; nCount++ ) {
    aHeightInputIds[nCount] = aHeightInputs[nCount].id;
  }
  sFieldset = document.getElementById('weight');
  var aWeightInputs = new Array();
  aWeightInputs = sFieldset.getElementsByTagName('input');
  for (nCount = 0; nCount < aWeightInputs.length; nCount++ ) {
    aWeightInputIds[nCount] = aWeightInputs[nCount].id;
  }

  aInputIds = aHeightInputIds.concat(aWeightInputIds);
}
// -----------------------
// FUNCTION: fAtLeastZero
// DESCRIPTION: A function that ensures the minimum value in any field is at least 0.
// ARGUMENTS: 1: Target element id
// -----------------------
function fAtLeastZero(sTargetId) {
  var nAtLeastZero = document.getElementById(sTargetId).value;
  if (nAtLeastZero == '') {
    document.getElementById(sTargetId).value = 0;
  }
  var sStartingZero = nAtLeastZero;
  if (sStartingZero.length > 1) {
    sStartingZero = nAtLeastZero.charAt(0);
    if (sStartingZero == "0") {
      nAtLeastZero = nAtLeastZero.substr(1, nAtLeastZero.length);
      document.getElementById(sTargetId).value = nAtLeastZero;
    }
  }
}
// -----------------------
// FUNCTION: fHeightImperialToMetric
// DESCRIPTION: A function that converts Imperial Heights to Metric.
// ARGUMENTS: None
// -----------------------
function fHeightImperialToMetric() {
  nFeetValue = document.getElementById(aInputIds[0]).value;
  nInchesValue = document.getElementById(aInputIds[1]).value;
  nInchesValue = parseInt(nInchesValue) + parseInt(nFeetValue * 12);
  var nCentimetreValue = Math.round(nInchesValue * 2.54);
  var nMetricValue = nCentimetreValue / 100;
  nMetricValue = fRoundToTwo(nMetricValue);
  aMetricValue = nMetricValue.split(".");
  document.getElementById(aInputIds[2]).value = aMetricValue[0];
  document.getElementById(aInputIds[3]).value = aMetricValue[1];
}

// -----------------------
// FUNCTION: fHeightMetricToImperial
// DESCRIPTION: A function that converts Metric Heights to Imperial.
// ARGUMENTS: None
// -----------------------
function fHeightMetricToImperial() {
  nMetresValue = document.getElementById(aInputIds[2]).value;
  nCentimetresValue = document.getElementById(aInputIds[3]).value;
  nCentimetresValue = parseInt(nMetresValue * 100) + parseInt(nCentimetresValue);
  var nImperialValue = Math.round(nCentimetresValue / 2.54);
  nFeetValue = Math.floor(nImperialValue / 12);
  nInchesValue = (nImperialValue - (nFeetValue * 12));
  document.getElementById(aInputIds[0]).value = nFeetValue;
  document.getElementById(aInputIds[1]).value = nInchesValue;
}

// -----------------------
// FUNCTION: fWeightMetricToImperial
// DESCRIPTION: A function that converts Metric Weights to Imperial.
// ARGUMENTS: None
// -----------------------
function fWeightMetricToImperial() {
  var nKilosValue = document.getElementById(aInputIds[6]).value;
  var nMetricValue = Math.round(nKilosValue / 0.45359);
  var nStoneValue = Math.floor(nMetricValue / 14);
  var nPoundsValue = (nMetricValue - (nStoneValue * 14));
  document.getElementById(aInputIds[4]).value = nStoneValue;
  document.getElementById(aInputIds[5]).value = nPoundsValue;
}

// -----------------------
// FUNCTION: fWeightImperialToMetric
// DESCRIPTION: A function that converts Imperial Weights to Metric.
// ARGUMENTS: None
// -----------------------
function fWeightImperialToMetric() {
  var nStoneValue = document.getElementById(aInputIds[4]).value;
  var nPoundsValue = document.getElementById(aInputIds[5]).value;
  var nImperialValue = (parseInt(nStoneValue * 14) + parseInt(nPoundsValue));
  var nKiloValue = Math.round(nImperialValue * 0.45359);
  document.getElementById(aInputIds[6]).value = nKiloValue;
}

// -----------------------
// FUNCTION: fRoundToTwo
// DESCRIPTION: A function that converts any number to decimal places.
// ARGUMENTS: None
// -----------------------
function fRoundToTwo(nNumber) {
  var nRounded = nNumber * 1000;
  nRounded = Math.round(nRounded /10) + "";
  while (nRounded.length < 3) {nRounded = "0" + nRounded};
  var nLength = nRounded.length;
  nRounded = nRounded.substring(0,nLength-2) + "." + nRounded.substring(nLength-2,nLength);
  return nRounded;
}

// ----------------------
// FUNCTION: fSelectText
// DESCRIPTION: A function that selects the contents of a text area
// ARGUMENTS: None
// ----------------------
function fSelectText() {
  if (window.event) {
    window.event.srcElement.select();
  } else {
    this.select();
  }
}

var nStrength = 0;
var aMessages = new Array("WEAK", "POOR", "FAIR", "GOOD", "STRONG");
var bHasNumber = false;
var bHasMixedCase = false;
var bHasSymbol = false;
var bHasEight = false;

// ----------------------
// FUNCTION: fCheckStrength
// DESCRIPTION: A function that checks the strenght of the entered password and updates the indicator
// ARGUMENTS: None
// ----------------------
function fCheckStrength() {
  if (document.getElementById('ctl00_PlaceHolderMain_MyChoices_YourAccount1_ChangePassword1_txtPassword')) {
    var sPasswordValue = document.getElementById('ctl00_PlaceHolderMain_MyChoices_YourAccount1_ChangePassword1_txtPassword').value;
  }
  if (document.getElementById('ctl00_PlaceHolderMain_Registration1_cuwChoices_CreateUserStepContainer_Password')) {
    var sPasswordValue = document.getElementById('ctl00_PlaceHolderMain_Registration1_cuwChoices_CreateUserStepContainer_Password').value;
  }
  if (document.getElementById('ctl00_PlaceHolderMain_ResetPassword1_ResetPasswordWizard_Password')) {
    var sPasswordValue = document.getElementById('ctl00_PlaceHolderMain_ResetPassword1_ResetPasswordWizard_Password').value;
  }
  if (sPasswordValue.length > 7) {
    bHasEight = true;
  } else {
    bHasEight = false;
  }

  if (sPasswordValue.match(/\d+/)) {
    bHasNumber = true;
  } else {
    bHasNumber = false;
  }

  if (sPasswordValue.match(/[A-Z]/) && sPasswordValue.match(/[a-z]/)) {
    bHasMixedCase = true;
  } else {
    bHasMixedCase = false;
  }

  if (sPasswordValue.match(/[\W]/)) {
    bHasSymbol = true;
  } else {
    bHasSymbol = false;
  }

  nStrength = 0;
  if (bHasEight) {
    nStrength++;
    if (bHasNumber) {
      nStrength++;
    }
    if (bHasMixedCase) {
      nStrength++;
    }
    if (bHasSymbol) {
      nStrength++;
    }
  }
  var sListId = document.getElementById('password-strength-indicator');
  var aListElements = sListId.getElementsByTagName('li');
  for (nCount = 0; nCount < aListElements.length; nCount++ ) {
    var sTheId = aListElements[nCount].id;
    if (nCount < nStrength) {
      document.getElementById(sTheId).className = 'good';
    } else {
      document.getElementById(sTheId).className = '';
    }
  }
  var oText = document.getElementById('password-strength-phrase').childNodes[0];
  document.getElementById('password-strength-phrase').removeChild(oText);
  oText = document.createTextNode(aMessages[nStrength]);
  document.getElementById('password-strength-phrase').appendChild(oText);
}

// ----------------------
// FUNCTION: fRenderPasswordStrength
// DESCRIPTION: A function that renders the passwrod strength indicator
// ARGUMENTS: None
// ----------------------
function fRenderPasswordStrength() {
  var oDiv;
  var oText;
  oDiv = document.createElement('div');
  oDiv.setAttribute('id', 'password-strength');
  document.getElementById('update-password').appendChild(oDiv);
  oDiv = document.createElement('p');
  oText = document.createTextNode('Strength');
  oDiv.appendChild(oText);
  document.getElementById('password-strength').appendChild(oDiv);
  oDiv = document.createElement('ul');
  oDiv.setAttribute('id', 'password-strength-indicator');
  document.getElementById('password-strength').appendChild(oDiv);
  for (nCount = 1; nCount <=4 ; nCount++ ) {
    oDiv = document.createElement('li');
    oDiv.setAttribute('id', 'strength-' + nCount);
    document.getElementById('password-strength-indicator').appendChild(oDiv);
  }
  oDiv = document.createElement('p');
  oDiv.setAttribute('id', 'password-strength-phrase');
  oText = document.createTextNode('WEAK');
  oDiv.appendChild(oText);
  document.getElementById('password-strength').appendChild(oDiv);

  if (document.getElementById('ctl00_PlaceHolderMain_Registration1_cuwChoices_CreateUserStepContainer_Password')) {
    fAddEvent(document.getElementById('ctl00_PlaceHolderMain_Registration1_cuwChoices_CreateUserStepContainer_Password'), 'keyup', fCheckStrength);
  }
  if (document.getElementById('ctl00_PlaceHolderMain_MyChoices_YourAccount1_ChangePassword1_txtPassword')) {
    fAddEvent(document.getElementById('ctl00_PlaceHolderMain_MyChoices_YourAccount1_ChangePassword1_txtPassword'), 'keyup', fCheckStrength);
  }
  if (document.getElementById('ctl00_PlaceHolderMain_ResetPassword1_ResetPasswordWizard_Password')) {
    fAddEvent(document.getElementById('ctl00_PlaceHolderMain_ResetPassword1_ResetPasswordWizard_Password'), 'keyup', fCheckStrength);
  }
}

// ----------------------
// FUNCTION: fAddPersonalisationEvents
// DESCRIPTION: A function that adds personalisation events where appropriate
// ARGUMENTS: None
// ----------------------
function fAddPersonalisationEvents() {
  if (document.getElementById('height') && document.getElementById('weight')) {
    fAddBMIListeners('height');
    fAddBMIListeners('weight');
  }
  if (document.getElementById('rss-feed-link')) {
    fAddEvent(document.getElementById('rss-feed-link'), 'click', fSelectText);
    fAddEvent(document.getElementById('rss-feed-link'), 'keypress', fSelectText);
  }
  if (document.getElementById('update-password')) {
    fRenderPasswordStrength();
  }
}
function fInsertAfter(newElement,targetElement)
{
  var parent = targetElement.parentNode;
  if(parent.lastchild == targetElement)
  {
    parent.appendChild(newElement);
  } else
  {
    parent.insertBefore(newElement, targetElement.nextSibling);
  }
}
// ----------------------
// FUNCTION: fRemoveElementIfExists
// DESCRIPTION: A function that removes provided element
// ARGUMENTS: element id
// ----------------------
function fRemoveElementIfExists(sElementId) {
  if (document.getElementById(sElementId)) {
    var oElement = document.getElementById(sElementId);
    oElement.parentNode.removeChild(oElement);
  }
}
// ----------------------
// FUNCTION: fHideElementsServices
// DESCRIPTION: A function that hides elements in a provided container
// ARGUMENTS: sContainerId,sElementType
// ----------------------
function fHideElementsServices(sContainerId, sElementType) {
  var sElementId;
  var sContainer = document.getElementById(sContainerId);
  var aElements = sContainer.getElementsByTagName(sElementType);
  var nArrayLength = aElements.length;
  for (nCount = 0; nCount < nArrayLength ; nCount++) {
    sElementId = aElements[nCount].id;
    fSwitchClass(sElementId, 'hidden');
  }
}
// ----------------------
// FUNCTION: fShowLabels
// DESCRIPTION: A function that shows elements in a provided container
// ARGUMENTS: sContainerId,sElementType
// ----------------------
function fShowLabels(sContainerId, sElementType){
  var sElementId;
  var sContainer = document.getElementById(sContainerId);
  var aElements = sContainer.getElementsByTagName(sElementType);
  var nArrayLength = aElements.length;
  for (nCount = 0; nCount < nArrayLength ; nCount++) {
    sElementId = aElements[nCount].id;
    var eElement = document.getElementById(sElementId);
    eElement.className = sElementId;
  }
}

function fRemoveAttributes(sContainerId, sElementType,sAttribute){
  var sElementId;
  var sContainer = document.getElementById(sContainerId);
  var aElements = sContainer.getElementsByTagName(sElementType);
  var nArrayLength = aElements.length;
  for (nCount = 0; nCount < nArrayLength ; nCount++) {
    sElementId = aElements[nCount].id;
    var eElement = document.getElementById(sElementId);
    eElement.removeAttribute(sAttribute);
  }
}
fAddEvent(window, 'load', fAddPersonalisationEvents);

function fHappyBobby() {
}
//-->

// ----------------------
// FUNCTION: toggle-content
// DESCRIPTION: JQuery function for opening times toggler in Rating and Comments
// ----------------------

;(function($) {

  $(document).ready(function(){
    $(".toggle-times-first").addClass("first");
    $(".toggle-times").addClass("closed");

    $(".toggle-content").hide();

    $("h3.toggle-times").toggle(function(){
      $(this).addClass("active");
    }, function () {
      $(this).removeClass("active");
    });

    $(".toggle-content-first").show();

    $("h3.toggle-times-first").toggle(function(){
      $(this).addClass("active");
    }, function () {
      $(this).removeClass("active");
    });

    $("h3.toggle-times").click(function(){
      $(this).next(".toggle-content").slideToggle("slow,");
    });

    $("h3.toggle-times-first").click(function(){
      $(this).next(".toggle-content-first").slideToggle("slow,");
    });

  });
})(jQuery);
//-->


// ---------------------------
// Check if string exists in url - for checking whether you're in a particular subsite
// ---------------------------
function isSiteInPath(sSubsite)
{
  try
  {
    var path = document.location.pathname.toLowerCase();
    if(path == null) {return false;}


    var idx = path.indexOf(sSubsite.toLowerCase());
    if (idx > 0)
      return true;
    return false;

  }
  catch(err)
  {
    return false;
  }

}
// ----------------------
// FUNCTION: Social bookmarks help text
// DESCRIPTION: Injects 'What are bookmarks?' link and creates slider div for help text
// CREATED: Dec 2009 shudson
// ----------------------
jQuery(document).ready(function($){
  $('div.bookmark-help-text').hide();
  $('div.social-bookmarks').prepend('<p class="bookmarks-help-trig"><a href="#">What are bookmarks?</a></p>');
  $('p.bookmarks-help-trig > a').click(function() {
    $(this).toggleClass('active');
    $(this).parent().siblings('div.bookmark-help-text').slideToggle(100);
    return false;
  });
});

// -----------------------------------------------------------------------------
// Injects show/hide link for search results and binds toggle function to link.
// -----------------------------------------------------------------------------
jQuery(document).ready(function($) {
  // Create trigger link, one for each child list with children to hide
  $('ul.results-children').each(function() {
    // Get text to display in show/hide link
    var showHideText = $(this).prev('input.hide-text').val();
    // Add link if something to hide
    $(this).children('li.hide:first').before(
        '<li class=\"child-results-trig\"><a href="#"><span>Show</span> ' +
        (showHideText ? 'more results from ' + showHideText + '' : 'more results')
        + '</a></li>');
  });
  $('ul.results-children > li.hide').hide(); //Hide children
  // Open on click
  $('li.child-results-trig > a').bind('click', 'keypress', function() {
    $(this).parent().siblings('li.hide').toggle();
    $(this).children('span').text($(this).children('span').text() == 'Hide' ? 'Show' : 'Hide');
    $(this).toggleClass('active');
    return false; //Stop page from jumping to top
  });
});
// -----------------------------------------------------------------------------
// function to show / hide elements. This should be the standard version
// -----------------------------------------------------------------------------
jQuery(document).ready(function($) {

  // Show/hide elements
  $('.showhide-content').hide();
  // Create trigger text
  $('.showhide-trig').wrapInner('<a href=\"#\">' + '</a>');

  $('.showhide-trig a').toggle(function(){
    $(this).addClass("active");
  }, function () {
    $(this).removeClass("active");
  });
  $('.showhide-trig > a').each(function() {
    $(this).prepend('<span>Show </span>');
  });
  $('.showhide-trig > a').click(function() {
    $(this).parent().siblings().toggle();
    $(this).children().text($(this).children().text() == 'Hide ' ? 'Show ' : 'Hide ');
    return false; //Stop page from jumping to top
  });

});

// end show/ hide elements

// ------------------------------------------------------------------------------------------------
/* Open links in new window with warning for screen reader users and without failing validation */
// ------------------------------------------------------------------------------------------------
jQuery(document).ready(function($) {
  $('a[rel*=external]').each(function() {
    var linkTitle = $(this).attr('title');
    if (linkTitle) {
      $(this).attr('title', linkTitle + ' - opens in new window');
    } else {
      $(this).attr('title', 'Opens in new window');
    }
    $(this).attr('target', '_blank');
  });
});

// -----------------------------------------------------------------------------
/* Footer tabs */
// -----------------------------------------------------------------------------
jQuery(document).ready(function($) {
  if ($(".footer").length) {
    $(".footer").tabs();
  }
});


// -----------------------------------------------------------------------------
/* dirty browser detect for webkit (chrome and safari) required for minor styling issues. */
/* If upgrade to jquery 1.4, use updated $.browser.webkit */
// -----------------------------------------------------------------------------
jQuery(document).ready(function($) {
  if (($(".wrap").length) && ($.browser.safari)) {
    $(".wrap").addClass("wrap-webkit");
  }
});


// -----------------------------------------------------------------------------
/* Easy Print Medicines List */
// -----------------------------------------------------------------------------
jQuery(document).ready(function($) {
  $('#medHubMessage').hide();
});

function MedicineListCheckBoxTick() {

  var checkedToolItems = $('.medicineList_EasyPrint').find('input:checkbox:checked');
  var uncheckedToolItems = $('.medicineList_EasyPrint').find('input:checkbox:not(:checked)');


  if (checkedToolItems.length >= 3) {
    for (var index = 0; index <= uncheckedToolItems.length; index++) {
      var uncheckedToolItem = uncheckedToolItems[index];
      $(uncheckedToolItem).attr('disabled', true);
    }
    $('#medHubMessage').show();
  }
  else {
    for (var index = 0; index <= uncheckedToolItems.length; index++) {
      var uncheckedToolItem = uncheckedToolItems[index];
      $(uncheckedToolItem).attr('disabled', false);
    }
    $('#medHubMessage').hide();
  }
}

// -----------------------------------------------------------------------------
/* Comment tagging show more/less */
// -----------------------------------------------------------------------------
jQuery(document).ready(function($) {

  if ($(".tag-category").length) {

    $('.tag-category ul').each(function() {
      var oListItems = $(this).find(".item-hide");
      if ((oListItems.length) > 0) {
        var eItemPrev = $(this).find(".item-hide:first").prev();
        var sItemPrev = $.trim(eItemPrev.html());
        if ((sItemPrev.charAt(sItemPrev.length - 1)) == ",") {
          $(eItemPrev).html(sItemPrev.substr(0, sItemPrev.length - 1));
        }
        $(this).find(".item-hide").addClass("hidden");
        $(this).after('<p class="show-more"><a href="#">more</a>');
      }
    });

    if ($(".tag-category .show-more a").length) {
      $(".tag-category .show-more a").toggle(function(e) {
        e.preventDefault();
        $(this).parent().prev().find(".item-hide").removeClass("hidden");
        $(this).parent().prev().find(".item-hide:first").prev().append(",");
        $(this).parent().toggleClass("show-less", "show-more");
        $(this).text("less");
      }, function() {
        $(this).parent().prev().find(".item-hide").addClass("hidden");
        var eItemPrev = $(this).parent().prev().find(".item-hide:first").prev();
        var sItemPrev = $.trim(eItemPrev.html());
        $(eItemPrev).html(sItemPrev.substr(0, sItemPrev.length - 1));
        $(this).parent().toggleClass("show-less", "show-more");
        $(this).text("more");
      });
    }

  }
});

// -----------------------------------------------------------------------------
/* tools embed */
// -----------------------------------------------------------------------------
jQuery(document).ready(function($) {

  var toolEmbedInput = ".tool-embed input";

  if ($(toolEmbedInput).length) {

    var baseHandlerUrl = "/NHSChoices/pagelayouts/medialibrary/Handlers/GetToolEmbedCode.ashx";
    var success = "success";
    var toolEmbedContent = ".tool-embed-content";

    $(toolEmbedInput).click(function(e) {
      var toolInputControl = $(this);
      var toolEmbedContent = $(toolInputControl).parent().siblings(toolEmbedContent);
      e.preventDefault();
      $(toolInputControl).toggleClass("show-embed");
      var container = $(toolInputControl).parent().parent();
      var toolId = container.attr("id");
      var functionName = "getToolEmbedCodeHandlerUrl_" + toolId;
      handlerUrl = eval(functionName)(baseHandlerUrl);
      $.get(handlerUrl, function(data, textStatus) {
        if (textStatus == success) {
          $(toolEmbedContent).addClass("tool-embed-hide").prepend(data).slideDown();
          $(toolInputControl).unbind("click");
          $(toolInputControl).click(function(e) {
            e.preventDefault();
            $(this).toggleClass("show-embed");
            $(toolEmbedContent).slideToggle();
          });
        }
      });
    });
  }

  /* editable embed code */
  var toolEmbedLink = ".tool-embed-editable .show-embed";
  var toolEmbedContent = ".tool-embed-editable .tool-embed-content";

  $(toolEmbedContent).hide();

  if ($(toolEmbedLink).length) {

    $(toolEmbedLink).click(function(e) {
      e.preventDefault();
      $(this).toggleClass("show-embed-link");
      $(toolEmbedContent).slideToggle();
    });
  }

});

// --------------------------------------------
// FUNCTION:    Media library transcript
// DESCRIPTION: Injects Show/Hide transcript link into page
//              and handles toggling transcript
// --------------------------------------------
jQuery(document).ready(function($) {
  $('.showhide-wrap.transcript').each(function() {
    $(this).siblings('.media-panel').children('.media-info').append('<p class=\"showhide-trig transcript-trig"><a href="\#\"><span>Show</span> transcript</a></p>');
    $(this).children('.showhide-content').children('h2:first').addClass('hidden');
  });

  $('.showhide-trig.transcript-trig').children('a').each(function() {
    $(this).click(function() {
      $(this).parent('.showhide-trig.transcript-trig').siblings('.media-meta').parent('.media-info').parent('.media-panel').siblings('.showhide-wrap.transcript').children('.showhide-content').toggle();
      $(this).toggleClass('active'); //Toggle 'active' class
      $(this).children().text($(this).children().text() == 'Hide' ? 'Show' : 'Hide'); //Toggle show/hide text
      return false;
    });
  });
});


//-------------------------------------
// Inject JS dependent print functionality
// to social sharing toolbar
//-------------------------------------
jQuery(document).ready(function($) {
  if( $('li.print-ip').length < 1 ) { //If there is no IP print icon, insert a normal print
    $('.social-sharing').children('ul.print-list').each(function() {
      $(this).prepend('<li class="print"><a href="javascript:window.print()" title="Print this page"><img src="/img/social-sharing/print.gif" alt="Print" width="16" height="16" /></a></li>');
    });
  }
});

//-------------------------------------
// Solution for Concertina's
//-------------------------------------
jQuery(document).ready(function($) {

  $('.concertina-content').hide(); //Hide the content

  //Add trigger link
  $('.concertina-wrap').each(function() {
    var triggerText = $(this).children('.concertina-trig').text();
    $(this).children('.concertina-trig').html('<a href="#">' + triggerText + '&nbsp;<span>show</span></a>');
  });

  //Glossary trigger link
  $('.concertina-wrap.glossary').each(function() {
    $(this).children('.concertina-trig')
      .html('<a href="#"><span>Show</span></a>&nbsp;glossary terms')//Add trigger text
      .css('text-transform', 'lowercase')//Lowercase the text
      .children('a').children('span').css('text-transform', 'capitalize'); //Capitalize the show/hide text
  });

  $('.concertina-trig > a').each(function() {
    $(this).click(function() {
      $(this).parent().siblings('.concertina-content').slideToggle(100);
      $(this).toggleClass('active'); //Add 'active' class
      $(this).children().text($(this).children().text() == 'hide' ? 'show' : 'hide'); //Toggle show/hide text
      return false; //Stop page from jumping to top
    });
  });

});

//-------------------------------------
// Adding an event handler for clearing the site search box before the page controls load
//-------------------------------------
jQuery(document).ready(function($) {
  fAddEvent(document.getElementById('q'), 'focus', fRemoveValue);
  fAddEvent(document.getElementById('q'), 'blur', fAddValue);
});


$dialog = null;
// -------------------------------------------------------------------------------------------------------
// FUNCTION: fOpenInLightbox
// DESCRIPTION: Opens content in a lightbox
// ARGUMENTS: Required: obj - the link being used to open the lightbox (this) so that when js is disabled,
//                            link will be followed
//            Optional: nHeight - height of the lightbox to open
//            Optional: nWidth - width of the lightbox to open
//            Optional: sContentID - the ID of the content within the linked page to open in the lightbox
//            Optional: param - extra parameter for future unknown customisation
// -------------------------------------------------------------------------------------------------------
function fOpenInLightbox(obj,nHeight,nWidth,sContentID,param) {

  if ((typeof nHeight == 'undefined') || (nHeight == null)) {
    var nHeight = "auto";
  }
  else if(sContentID == '#mediaTool'){
    var nHeight = nHeight + 106;
  }
  else {
    var nHeight = nHeight + 66;
  }

  if ((typeof nWidth == 'undefined') || (nWidth == null)) {
    var nWidth = "auto"
  } else {
    var nWidth = nWidth + 52;
  }

  if ((typeof sContentID == 'undefined') || (sContentID == null)) {
    var sContentID = '';
  }

  if ((typeof param == 'undefined') || (param == null)) {
    var param = '';
  }

  if ($dialog) {
    $dialog.html(null);
    $dialog.dialog("destroy");
  }

  $dialog = $('<div class="modal-content-wrap clear"></div>');
  $.ajaxSetup({
    async: false
  });

  $.get(obj.href, function(data) {
    var lbContent = data;
    var scriptText = $(data).find('#lbScripts').text();

    if (sContentID != null){
      lbContent = $(data).find('#' + sContentID);
    }

    if(scriptText != "" ){
      var script = document.createElement( 'script' );
      script.type = 'text/javascript';
      script.text = scriptText;

      $(lbContent).append(script);
    };


    $dialog.html(lbContent);

    $dialog.dialog(
    {
      modal: true,
      resizable: false,
      width: nWidth,
      height: nHeight,
      autoOpen: false,
      close: function(event, ui) {
        $dialog.html(null);
        $dialog.dialog("destroy");
      }
    });

    if (param == "swfobject") { // calling a swf movie but using the old style swfobject which injects javascript, eg lifecheck
      $("noscript", lbContent).remove(); // remove noscript contents
      $("script:eq(0)", lbContent).remove(); // remove first script tag which contains a document.write
      $("div", lbContent).removeAttr('style'); // remove any online styles
      var lbContent = lbContent.html(); // set contents
      $dialog.dialog('open');
      $(".modal-content-wrap").prepend('<div class="modal-content" />');
      $(".modal-content").append(lbContent); // append content
    } else {
      $dialog.html(lbContent);
      $dialog.dialog('open');
    }

    $(".ui-dialog").prepend('<div class="modal-top"><span class="crnr tl"></span><div></div><span class="crnr tr"></span></div>');
    $(".ui-dialog").append('<div class="modal-bottom"><span class="crnr bl"></span><div></div><span class="crnr br"></span></div>');
    $(sContentID).addClass("modal-content");

    if ($(".ui-widget-overlay").size() > 0) {
      $(".ui-widget-overlay").css({ 'opacity': '0.5' });
    }

    if (param == "optionTable") {
      if ($(".option-content").length) {
        $(".option-content .lb-toplinkscontainer").prepend('<p class="modal-close"><a href="#close" id="close">Close<span class="hidden"> this popup</span></a></p>');
      }
    }

    if (param == "innovationCentre") {
      if ($(".treatment-opt-centres").length) {
        $(".treatment-opt-centres").prepend('<p class="modal-close"><a href="#close" id="close">Close<span class="hidden"> this popup</span></a></p>');
      }
    }

    if ($(".modal-content").length) {
      $(".modal-content").prepend('<p class="modal-close"><a href="#close" id="close">Close<span class="hidden"> this popup</span></a></p>');
    }

    $(".modal-close a").focus();

    $(".modal-close a").click(function() {
      $dialog.dialog("close");
    });

    // adds a little top margin
    $(".ui-dialog").addClass("lb");

    // ie requires widths on empty divs
    var divwidth = $(".modal-content-wrap").width() - 20;
    $(".modal-top div, .modal-bottom div").css("width", divwidth);
    $(".ui-dialog").addClass("lb-ie");
  });

  return false;
}


// -------------------------------------------------------------------------------------------------------
// FUNCTION: fNavigateFromLightboxToLightbox
// DESCRIPTION: Closes one lightbox, and navigates to another. Should be called from the onclick event of an anchor
//              element, as it requires a href attribute on obj
// ARGUMENTS: Required: obj - the link being used to open the lightbox (this) so that when js is disabled,
//                            link will be followed
//            Optional: nHeight - height of the lightbox to open
//            Optional: nWidth - width of the lightbox to open
//            Optional: sContentID - the ID of the content within the linked page to open in the lightbox
// -------------------------------------------------------------------------------------------------------
function fNavigateOptionTableFromLightboxToLightbox(obj,nHeight,nWidth,sContentID) {

  if ($dialog != null) {
    $dialog.dialog("close");

    return fOpenOptionTableInLightbox(obj,nHeight,nWidth,sContentID);
  }
  else {
    return true;
  }
}

function fOpenOptionTableInLightbox(obj,nHeight,nWidth,sContentID)  {

  var param = "optionTable";
  var rtn = fOpenInLightbox(obj,nHeight,nWidth,sContentID,param);

  if (typeof isGroupTable != 'undefined') {
    if ((isGroupTable) && (typeof mainTableLoc != 'undefined')) {
      var mainTableLink = '<a href="' + mainTableLoc + '" onclick="return fNavigateOptionTableFromLightboxToLightbox(this,null,null,\'optionTable\'); ">Compare all options</a>';
      $(".lb-toplinks").append("<li>" + mainTableLink + "</li>");
    }
  }

  if (typeof printPageLoc != 'undefined') {
    var printLink = '<a href="' + printPageLoc + '">Go to a print-friendly version of this page</a>';
    $(".lb-toplinks").append("<li>" + printLink + "</li>");
  }

  $(".lb-toplinks li").wrapAll('<ul class="clear" />');
  $(".wrap").addClass("showlb");
  $(".ui-dialog").addClass("optionlb");

  return rtn;
}

jQuery(document).ready(function($)
{
  $('a.option-table-lb').each(function(index)
  {
    $(this).click(function()
    {
      return fOpenOptionTableInLightbox(this,null,null,'optionTable');
    });
  });
});


var map = null;
var treatmentCentres;

function GetCentresMap()
{
  map = null;

  map = new VEMap('innovCentresMap');

  if (typeof mak != 'undefined') {
    map.SetCredentials(mak);
  }
  map.LoadMap();

  if (typeof centres != 'undefined')
  {
    treatmentCentres = centres;
    currentCentre = treatmentCentres.pop();
    AddPushPins();
  }
}

var currentCentre;
var pinID = 1;

function AddPushPins()
{
  map.Find(null,currentCentre.postcode, null, null, null, null, null, null, false, true, function()
  {
    if (currentCentre != null)
    {
      //var id = Math.random().toString();
      var id = pinID++;
      map.AddPushpin(new VEPushpin(id, //Id - must be unique
                        map.GetCenter(), //latitude, longitude
                        '/img/pushpin.png', //icon url
                        currentCentre.name, //Title
                        currentCentre.postcode + '<br /><a href="' + currentCentre.url + '">' + currentCentre.url + '</a>'));
      if (treatmentCentres.length > 0)
      {
        currentCentre = treatmentCentres.pop();
        AddPushPins()
      }
      else
      {
        map.SetZoomLevel(6);
        map.SetMouseWheelZoomToCenter(false);
        map.Resize(442,459);
        map.GetBirdseyeScene();
      }
    }
  });
}


function fOpenInnovationCentresInLightbox(obj,nHeight,nWidth,sContentID)  {

  if ($dialog != null) {
    $dialog.dialog("close");
  }
  var param = "innovationCentre";
  var rtn = fOpenInLightbox(obj,nHeight,nWidth,sContentID,param);

  $("body").addClass("showIClb");
  $(".lb-innov-treatment").addClass("modal-content");

  try {
    GetCentresMap();
  }
  catch(err) {
    var error = err;
  }

  return rtn;
}

// -----------------------
// FUNCTION: fHoursago
// DESCRIPTION: Works out the number of hours that a post was posted on the Alzheimer's forum (http://http://forum.alzheimers.org.uk/forum.php)
// ARGUMENTS: postdate (in the format "31-01-2013"), posttime (in the format "08:30 AM", or "04:30 PM") taken from the RSS feed call
// RETURNS: timeperiod (which will be x hour(s) ago or x day(s) ago)
// -----------------------
function fHoursago(postdate, posttime) {
  var todaydate = new Date(),
      today = new Date(todaydate.setHours(todaydate.getHours() + 1)), // add extra hour on as the posts from the forum are GMT +1
      postday = postdate.substr(0, 2),
      postmonth = postdate.substr(3, 2) - 1, // months start at 0
      postyear = postdate.substr(6, 4),
      posthour = posttime.substr(0, 2),
      postmins = posttime.substr(3, 2);
  if ((posttime.indexOf("PM")) !== -1) { // may need to add 12 hours because the time has "AM" or "PM"
    if ((parseInt(posttime.substr(0, 2), 10)) < 12) {
      posthour = parseInt(posttime.substr(0, 2), 10) + 12;
    }
  }
  if ( ((posttime.indexOf("AM")) !== -1) && ((parseInt(posthour,10) == 12 )) ) { // indicates a time of 12:xx AM as passed by the feed - should be 00:xx AM!
    posthour = "00";
  }
  var postdatetime = new Date(postyear, postmonth, postday, posthour, postmins),
      difmilli = today.getTime() - postdatetime.getTime(), // works out difference in milliseconds between given date and now
      minsago = Math.round((difmilli / 1000) / 60), // works out difference in minutes between given date and now
      hoursago,
      daysago;
  if (minsago < 60) {
    if (minsago === 1) {
      timeperiod = "1 min ago";
    } else {
      timeperiod = minsago + " mins ago";
    }
  } else {
    hoursago = Math.round(((difmilli / 1000) / 60) / 60); // works out difference in hours between given date and now
    if (hoursago < 24) {
      if (hoursago <= 0) {
        timeperiod = "0 hours ago";
      } else if (hoursago === 1) {
        timeperiod = "1 hour ago";
      } else {
        timeperiod = hoursago + " hours ago";
      }
    } else {
      daysago = Math.round(hoursago / 24); // works out difference in days between given date and now
      if (daysago === 1) {
        timeperiod = "1 day ago";
      } else {
        timeperiod = daysago + " days ago";
      }
    }
  }
  return timeperiod;
}

// ----------------------------------------------------
// FUNCTION: carouselResponsive
// DESCRIPTION: Simple responsive carousel for homepage
// ----------------------------------------------------
function carouselResponsive() {
  var $active = $('.features .feature-current');

  if ( $active.length == 0 ) $active = $('.features div.feature-wrap:last');

  var $next =  $active.next().length ? $active.next()
  : $('.features div.feature-wrap:first');

  $next.css({opacity: 0.0})
  $(".features").css("height", $next.height());

  $next.addClass('feature-current').animate({opacity: 1.0}, 400, function() {
    $active.removeClass('feature-current');
  });
}

// ----------------------------------------------------
// FUNCTION: carouselDots
// DESCRIPTION: Insert dots into carousel
// ----------------------------------------------------
function carouselDots() {
  // calculate number of 'panels' and insert dots
  var numPanels = $(".feature-wrap").length;
  $(".features .feature-wrap").each(function(i) {
    var dots = "";
    for (j=0; j < numPanels; j++) {
      if (i == j) {
        var dots = dots + '<span class="current" aria-hidden="true">&bull;</span>';
      } else {
        var dots = dots + '<span aria-hidden="true">&bull;</span>';
      }
    }
    var dots = '<p class="dots">' + dots + '</p>';
    $(this).find(".feature-image").append(dots);
  });
}

jQuery(document).ready(function($) {

  var url = window.location.href.toLowerCase();

  if ( (url.indexOf("/conditions/") != -1) ||
        (url.indexOf("/livewell/") != -1) ||
        (url.indexOf("/chq/") != -1) ||
        (url.indexOf(".nhs.uk/services/") != -1) ||
        (url.indexOf("/scorecard/") != -1) ||
        (url.indexOf("/servicedirectories/") != -1) ||
        (url.indexOf("/search/") != -1) ||
        (url.indexOf("/search?") != -1) ||
        (url.indexOf("/homepage.aspx") != -1) ||
        (url.indexOf("/homepagerefresh.aspx") != -1) ||
        (url.indexOf("/home.aspx") != -1) ||
        (url.indexOf("index.html") != -1) ||
        (url.indexOf("index-before.html") != -1) ||
        (url.indexOf("/news/") != -1) ||
        (url.indexOf("/aboutnhschoices/") != -1) ||
        (url.indexOf("/nhsengland/") != -1) ||
        (url.indexOf("/choiceinthenhs/") != -1) ||
        (url.indexOf("/sitemap.aspx") != -1) ||
        (url.indexOf("/linklisting.aspx") != -1) ||
        (url.indexOf("/nhs-direct/") != -1) ||
        (url.indexOf("/carersdirect/") != -1) ||
        (url.indexOf("/tools/") != -1) ||
        (url.indexOf("/service-search") != -1) ||
        (url.indexOf("/planners") != -1) ||
    (url.indexOf("/medicine-guides/") != -1) ||
    (url.indexOf("/video/") != -1) ||
        (url.indexOf("/profiles/") != -1) ) {

    var sNoCookie = $.cookie('mobile.nodisplay'),
        sCookie = $.cookie('mobile.display');

    if (!sNoCookie) {

      $("head").append('<meta name="viewport" content="width=device-width, initial-scale=1.0" />');

      var initialWidth = $(window).width();

      if (initialWidth < 641) {

        // remove flash tools so don't get noscript message
        if ($(".flash-player").length) {
          $(".flash-player").each(function() {
            if ($(this).parent().attr("style")) {
              $(this).parent().removeAttr("style");
            }
            $(this).empty();
          });
        }

        var viewportmeta = document.querySelector('meta[name="viewport"]'); // fixes issue when changing to landscape to scale to 100%
        if (viewportmeta) {
          viewportmeta.content = 'width=device-width, minimum-scale=1.0, maximum-scale=1.0';
          document.body.addEventListener('gesturestart', function() {
            viewportmeta.content = 'width=device-width, minimum-scale=0.25, maximum-scale=1.6';
          }, false);
        }

        function fAddDesktopLink() {
          var desktopLink = '<p class="go-desktop"><a href="#" class="mobile-nothanks">Desktop site</a></p>';
          $(".wrap").prepend(desktopLink);

          if (!sCookie) {
            $.cookie("mobile.display", "true", {path: '/'});
          }

          $(".mobile-nothanks").click(function(e) {
            e.preventDefault();
            $.cookie("mobile.nodisplay", "true", {path: '/'});
            location.reload(true);
          });
        }

        function fChangeMainNav() {
          var mobileNav = '<div class="mobile-nav"><span class="mobile-menu" aria-hidden="true">MENU</span> <a href="#mobile-nav" aria-controls="main-navigation" aria-expanded="false" role="button"><span class="sr-only">Toggle navigation</span><span class="mobile-bar"></span><span class="mobile-bar"></span><span class="mobile-bar"></span></a></div>',
              btn = $('.mobile-nav');

          $(".searchbar").prepend(mobileNav);
          menu = $('.main-nav');

          $(btn).live('click', function (e) {
            e.preventDefault();
            menu.slideToggle();
            if ($(this).find('a').attr('aria-expanded') === 'false') {
              $(this).find('a').attr('aria-expanded', 'true')
              $(menu).find('a:first').focus();
            } else {
              $(this).find('a').attr('aria-expanded', 'false')
              $(this).find('a').focus();
            }
          });
        }

        function fMoveNav() {

          if ( $(".healthaz").length ) {

            if  (!($(".healthaz-index").length)) {

              var tabsNav = $(".tabs-nav"),
                subNav = $("ul.sub-nav");

              if ($(".sub-nav li").size() <= 1) {
                $(subNav).hide();
              } else {
                $(subNav).addClass("clear");
              }

              if ($(".tabs-nav li").size() > 1) {

                if (!($("div.sub-nav").length)) { // for medicine guides individual medicine page - want to display the tab nav at top
                  $(tabsNav).prepend("<h2>Other sections</h2>");
                } else {
                  $("div.tabs-nav ul").addClass("overview-links med-guide-links");
                  $(".med-hub .healthaz-header").addClass("med-guide-header");
                }

                if ( $(".col-primary").length ) {
                  $(".col-primary").after($(tabsNav));
                }

                if ( $(".med-hub .four").length ) {
                  if (!($("div.sub-nav").length)) {
                    $(".med-hub .four").after($(tabsNav));
                    $(".med-hub .four").parent().after($(".med-hub .healthaz-content .bookmark-wrap"));
                  }
                }

              } else {
                $(tabsNav).hide(); // no point showing it if there is only 1
              }

            }
          }

          if ( ( ( $(".content-wrap.carers").length ) || ( $(".content-wrap.about").length ) ) && (!$(".content-wrap").hasClass("gsc-subcategory")) ) {

            var tabsNav = $(".tabs-nav"),
            subNav = $(".five .sub-nav");

            if ( $(".content-wrap.about").length ) {
              subNav = $(".four .sub-nav");
            }

            if ($(".sub-nav li").size() <= 1) {
              $(subNav).hide();
            }

            $(subNav).addClass("clear").find("li:first-child span").css("padding-left", "0");
            $("h1").after(subNav);

            if ($(tabsNav).find("ul li").length > 1) {
              $(tabsNav).prepend("<h2>Other sections</h2>");
              $(tabsNav).find("li:last-child span").css("border", "none");
            } else {
              $(tabsNav).addClass("hidden");
            }

            $(".five.border .bookmark-wrap").before($(".review-date"));
            $(".five.border .bookmark-wrap").before($(tabsNav));

          }

          if ( $('.content-wrap.gsc-subcategory').length ) {
            var stAlso = '<p class="sub-mobile-nav"><a class="clear" aria-expanded="false" aria-controls="navtabs" href="#navtabs" role="button"><span class="sr-only">Toggle navigation</span><span class="bars"><span class="mobile-bar"></span><span class="mobile-bar"></span><span class="mobile-bar"></span></span><span class="sections">Also in this section</span> <span class="plusminus" aria-hidden="true">&#43;</span></a></p>';
            $('.tabs-nav .tabs').hide().attr('id','navtabs');
            $('.tabs-nav').prepend(stAlso);

            if ($('.sub-nav li').size() <= 1) {
              $('.sub-nav').hide();
              $('.tabs-nav').addClass('margin-bottom');
            }

            $(".sub-mobile-nav a").click(function(e) {
              e.preventDefault();
              $(".tabs-nav .tabs").slideToggle();
              $(this).toggleClass("hide");
              if ($(this).hasClass("hide")) {
                $(this).find('.plusminus').html("&#45;");
                $(this).attr('aria-expanded', 'true');
              } else {
                $(this).find('.plusminus').html("&#43;");
                $(this).attr('aria-expanded', 'false');
              }
            });
            $('#navtabs span.hidden, .sub-nav span.hidden').attr('aria-hidden', 'true');
          }

        }

        function isNotNullOrUndefined(moduleName) {
          return (moduleName !== null && typeof (moduleName) !== "undefined");
          //return true;
        }

        function orderModules($module1, $module2) {
          if (isNotNullOrUndefined($module1) && (isNotNullOrUndefined($module2))) {
            ($module1).after($module2);
          }
        }

        function fMoveContent() {

          if ( $(".healthaz").length ) {

            // hide second col and make it show more
            if ( $(".col-secondary").length ) {

              $(".col-secondary").before('<h2 class="showmore">Show other content &#9658;</h2>');
              $(".col-secondary").hide();

              $("h2.showmore").click(function() {
                $(".col-secondary").slideToggle();
                $(this).toggleClass("hide");
                if ($(this).hasClass("hide")) {
                  $(this).html("Hide other content &#9660;");
                } else {
                  $(this).html("Show other content &#9658;");
                }
              });
            }

            /* move comments and share to bottom */
            $(".content-wrap").append($(".col-primary .comments-wrap, .col-primary .bookmark-wrap"));

            /* move medicines a-z useful links */
            if ( $(".healthaz-index.med-hub").length) {
              $(".hub-wrap").append($(".hub-wrap > .one-sm"));
              $(".hub-wrap > .one-sm").before('<h2 class="showmore">Show other content &#9658;</h2>');
              $(".hub-wrap > .one-sm").hide();
              $(".featured-article").addClass("clear");

              $("h2.showmore").click(function() {
                $(".hub-wrap > .one-sm").slideToggle();
                $(this).toggleClass("hide");
                if ($(this).hasClass("hide")) {
                  $(this).html("Hide other content &#9660;");
                } else {
                  $(this).html("Show other content &#9658;");
                }
              });
            }

            // add class so can style lightbox
            if ( $(".healthaz.med-hub").length) {
              $("body").addClass("medhub");
            }

            /* move medicines page useful links */
            if ( $(".healthaz.med-hub .row > .one.last").length) {
              $(".row > .one.last").before('<h2 class="showmore">Show other content &#9658;</h2>');
              $(".row > .one.last").hide();

              $("h2.showmore").click(function() {
                $(".row > .one.last").slideToggle();
                $(this).toggleClass("hide");
                if ($(this).hasClass("hide")) {
                  $(this).html("Hide other content &#9660;");
                } else {
                  $(this).html("Show other content &#9658;");
                }
              });
            }

          }

          if ( $(".live-well").length ) {

            // add class to topic hub page
            $(".live-well:not(.live-well.hub, .live-well-article)").addClass("topic-hub");

            // move share to bottom on hub and topic hub
            $(".content-wrap").append($(".live-well.hub .bookmark-wrap, .live-well.topic-hub .bookmark-wrap"));

            // move any videos to main area
            $(".topic-hub .pad-tl .two:first").after($(".topic-hub .col.two .video-panel").addClass("video-moved"));

            // hide second col and make it show more
            $(".live-well .col.two:last").addClass("col-container");
            $(".live-well .col-container").before('<h2 class="showmore">Show other content</h2>');
            $("h2.showmore").append(" &#9658;");
            $(".col-container").hide();

            $("h2.showmore").click(function() {
              $(".col-container").slideToggle();
              $(this).toggleClass("hide");
              if ($(this).hasClass("hide")) {
                $(this).html("Hide other content &#9660;");
              } else {
                $(this).html("Show other content &#9658;");
              }
            });

            // move view all topics on all pages except the all topics hub page
            if (!($(".sub-nav-az").length)) {
              $(".row.pad-tl").append($(".col.one .rnd-button-list:first-child"));
            }

            // article page - move share and comments to below show other content. Can't move show other content due to healthunlocked forum bug
            $(".row.pad-tl").append($(".live-well-article .row.pad-tl .bookmark-wrap, .live-well-article .comments-wrap"));

          }

          if ( $(".bth-hub").length || $(".bth").length ) {

            $(".row.pad-tl .col.two:last").after($(".row.pad-tl .col.one"));
            $(".col.one h2.no-print").hide();
            $("ul.sub-nav li").hide();
            $("ul.sub-nav li:first").show();
            $(".bth .bookmark-wrap:first").hide();
            $(".bth .row.pad-tl .col.two .bookmark-wrap").before($(".bth .row.pad-tl .col.two .cite"));

            $(".row.pad-tl .col.two:first").append($(".bth .row.pad-tl .col.two .video-panel"));

            $(".pad-tl .col.two:last").addClass("col-container").after($(".pad-tl .col.one"));
            $(".col-container").hide();
            $(".pad-tl .col.two:first").after('<h2 class="showmore">Show other content</h2>');
            $("h2.showmore").append(" &#9658;");

            $("h2.showmore").click(function() {
              $(".col-container").slideToggle();
              $(this).toggleClass("hide");
              if ($(this).hasClass("hide")) {
                $(this).html("Hide other content &#9660;");
              } else {
                $(this).html("Show other content &#9658;");
              }
            });

            $(".bth .row.pad-tl .col.two .article").after($(".bth .row.pad-tl .quote"));
            $(".bth .row.pad-tl .col.two .article").after($(".bth .row.pad-tl .keypoints"));

            $("ul.pagination li").hide();
            $("ul.pagination li.previous").show();
            $("ul.pagination li.previous a").text("<<");
            $("ul.pagination li.current-page").show();
            $("ul.pagination li.current-page").prev().show();
            $("ul.pagination li.current-page").next().show();
            $("ul.pagination li.next").show();
            $("ul.pagination li.next a").text(">>");
          }

          if ( $(".content-wrap.tools").length ) {

            $(".footer").before($(".five .bookmark-wrap"));
            $(".bookmark-wrap .social-sharing p:last").hide();
            $(".pad-tl .col.one.media-teasers").addClass("col-container");
            $(".pad-tl .col.three").after('<h2 class="showmore">Show other content</h2>');
            $(".col-container").hide();
            $("h2.showmore").append(" &#9658;");

            $("h2.showmore").click(function() {
              $(".col-container").slideToggle();
              $(this).toggleClass("hide");
              if ($(this).hasClass("hide")) {
                $(this).html("Hide other content &#9660;");
              } else {
                $(this).html("Show other content &#9658;");
              }
            });

            $(".pad-tl .col.one.media-categories").addClass("cat-container");
            $("h2.showcat").after($(".pad-tl .col.one.media-categories"));
            $(".cat-container").hide();
            $("h2.showcat").append(" &#9658;");

            $("h2.showcat").click(function() {
              $(".cat-container").slideToggle();
              $(this).toggleClass("hide");
              if ($(this).hasClass("hide")) {
                $(this).html("Hide categories &#9660;");
              } else {
                $(this).html("Show categories &#9658;");
              }
            });

            $(".pageLinks ul li").hide();
            $(".pageLinks ul li:first").show();
            $(".pageLinks ul li.currentpage").show();
            $(".pageLinks ul li.currentpage").prev().show();
            $(".pageLinks ul li.currentpage").next().show();
            $(".pageLinks ul li:last").show();

          }

          if ( $(".media-library").length ) {

            $(".five .bookmark-wrap .social-sharing p:last").hide();
            $(".bookmark-wrap .social-sharing p:last").hide();
            $(".pad-l .col.four .media-panel .media-info p:first").before($(".pad-l .col.four .media-panel .media-item"));

            $(".pad-l .col.four .browse-nav").hide();

            $(".pad-l .col.one.media-teasers").addClass("col-container");
            $(".pad-l .col.four #rate-comm-top").before('<h2 class="showmore">Show other content</h2>');
            $("h2.showmore").after($(".pad-l .col.one.media-teasers"));
            $(".col-container").hide();
            $("h2.showmore").append(" &#9658;");

            $("h2.showmore").click(function() {
              $(".col-container").slideToggle();
              $(this).toggleClass("hide");
              if ($(this).hasClass("hide")) {
                $(this).html("Hide other content &#9660;");
              } else {
                $(this).html("Show other content &#9658;");
              }
            });

            $(".pad-l .col.four h2.showmore").before('<h2 class="showrelated"><span class="hidden">Show</span> Editor&rsquo;s choice videos</h2>');
            $(".pad-l h2.showrelated").after($(".pad-l .col.four .browse-media"));
            $(".pad-l .browse-media").addClass("related-container");

            $(".related-container").hide();
            $("h2.showrelated").append(" &#9658;");

            $('h2.showrelated').wrapInner('<span role="button" tabIndex="0" id="buttonshowrelated" aria-controls="regionrelated"></span>');
            $('h2.showrelated').next('.related-container').attr({'role': 'region', 'id': 'regionrelated', 'aria-labelledby': 'buttonshowrelated', 'aria-expanded': 'false', 'aria-hidden': 'true'});

            $("h2.showrelated").click(function() {
              $(".related-container").slideToggle();
              $(this).toggleClass("hide");
              if ($(this).hasClass("hide")) {
                $(this).html("<span class=\"hidden\">Hide</span> Editor&rsquo;s choice videos &#9660;");
                $(this).next('.related-container').attr({'aria-expanded': 'true', 'aria-hidden': 'false'});
              } else {
                $(this).html("<span class=\"hidden\">Show</span> Editor&rsquo;s choice videos &#9658;");
                $(this).next('.related-container').attr({'aria-expanded': 'false', 'aria-hidden': 'true'});
              }
              $('h2.showrelated').wrapInner('<span role="button" tabIndex="0" id="buttonshowrelated" aria-controls="regionrelated"></span>');
            });
            $("h2.showrelated").keydown(function(e) {
              if (e.which === 13 || e.which === 32) { // pressing enter or space bar
                e.preventDefault();
                $(this).click();
              }
              $(this).find('span').focus();
            });

            if(window.location.href.indexOf("searchterm") >= 0)
            {
              $(".related-container").show();
              $("h2.showrelated").text("Search results");
              $('.media-thumb a').each(function() {
                var href = $(this).attr("href") + "#mainContent";
                $(this).attr("href", href);
              });
              if(window.location.href.indexOf("mainContent") == 0) {
                window.location = '#divTranscript';
              }
            }

            if(window.location.href.indexOf("browse-media-top") >= 0) {
              window.location = '#divTranscript';
            }

            if( !$.trim( $('.col.one.last.media-teasers.col-container .WebPartZone-Vertical').html() ).length ) {
              $(".four h2.showmore").hide();
            }
          }

          if ( $(".nhsdirect").length ) {

            /* move review date to below the content */
            $(".article").after($(".review-date"));

            /* remove most popular today */
            if ( $(".chq-hub").length ) {
              $(".col.last").hide();
            }

          }

          if ( $(".main-results .fs-result").length ) {
            $(".main-results .fs-result td.fc-first").each(function() {
              var address = $(this).find("p.fcaddress"),
                  parent = $(this).parents("table");
              $(parent).before($(address));
              $(this).remove();
            });
          }

          if ( $("#featurepanel").length ) {
            $("#featurepanel .preferences").removeClass("hidden");
            $("#featurepanel").before($("#featurepanel .preferences"));
          }

          if ( $(".columns .module .module-txt-img").length ) {
            $(".columns .module .module-txt-img").each(function() {
              var imgMove = $(this).find(".module-img a");
              $(this).find(".module-txt p").prepend($(imgMove));
            });
          }

          if ( $(".campaign-content-wrap").length ) {
            $(".campaign-content-wrap .campaign-content").each(function() {
              var txtMove = $(this).find(".campaign-info p").text();
              $(this).find(".campaign-image p").append(txtMove);
              $(this).find(".campaign-info").remove();
            });
          }

          if ( $(".columns .column").length ) {
            /* module shuffle */
            var $healthaz = $("#healthaz"),
                $behindtheheadlines = $("#behindtheheadlines"),
                $communities = $("#communities"),
                $findandchoose = $("#findandchoose"),
                $comments = $("#comments"),
                $onlineclinics = $("#onlineclinics"),
                $video = $("#video"),
                $editorschoice = $("#editorschoice"),
                $youandthenhs = $("#youandthenhs"),
                $livewell = $("#livewell"),
                $carersdirect = $("#carersdirect");
            orderModules($healthaz, $findandchoose);
            orderModules($findandchoose, $carersdirect);
            orderModules($carersdirect, $behindtheheadlines);
            orderModules($behindtheheadlines, $comments);
            orderModules($comments, $youandthenhs);
            orderModules($youandthenhs, $livewell);
            orderModules($livewell, $communities);
            orderModules($communities, $onlineclinics);
            orderModules($onlineclinics, $video);
            orderModules($video, $editorschoice);
          }

          if ($(".carers .video-panel").length) {
            $(".carers .video-panel").each(function () {

              var parentDiv = $(this).parent();

              if ($(parentDiv).attr("id").match(/SPWebPartManager/g)) {
                $(parentDiv).css("width", "auto");
              }

            });
          }

          if ($(".carers").length) {
            if ($("#ctl00_PlaceHolderMain_fieldViewer").length) {
              $(".carers-subcategory .three-sm, .carers-home .col.three, .carers-category .col.three").after($("#ctl00_PlaceHolderMain_fieldViewer"));
              $(".col.two-sm, .carers-home .col.two, .carers-category .col.two").addClass("col-container");
              $(".col.two-sm, .carers-home .col.two, , .carers-category .col.two").before('<h2 class="showmore"><span>Show other content</span> &#9658;</h2>');
              $("h2.showmore").click(function() {
                $(".col-container").slideToggle();
                $(this).toggleClass("hide");
                if ($(this).hasClass("hide")) {
                  $(this).html("Hide other content &#9660;");
                } else {
                  $(this).html("Show other content &#9658;");
                }
              });
              $(".col-container").hide();
            }
          }

          if ( ($(".tomedia").length) && (!$(".tomedia").hasClass(".tools")) ) {

            $(".pad-tl .col.one:first-child").addClass("cat-container").before('<h2 class="showcat">Show categories &#9658;</h2>');
            $(".cat-container").hide();
            $("h2.showcat").before($(".pad-tl .col.one:first-child"));

            $('h2.showcat').wrapInner('<span role="button" tabIndex="0" id="buttonshowcats" aria-controls="regioncats"></span>');
            $('h2.showcat').next('.col').attr({'role': 'region', 'id': 'regioncats', 'aria-labelledby': 'buttonshowcats', 'aria-expanded': 'false', 'aria-hidden': 'true'});

            $("h2.showcat").click(function() {
              $(".cat-container").slideToggle();
              $(this).toggleClass("hide");
              if ($(this).hasClass("hide")) {
                $(this).html("Hide categories &#9660;");
                $(this).next('.col').attr({'aria-expanded': 'true', 'aria-hidden': 'false'});
              } else {
                $(this).html("Show categories &#9658;");
                $(this).next('.col').attr({'aria-expanded': 'false', 'aria-hidden': 'true'});
              }
              $(this).wrapInner('<span role="button" tabIndex="0" id="buttonshowcats" aria-controls="regioncats"></span>');
            });
            $("h2.showcat").keydown(function(e) {
              if (e.which === 13 || e.which === 32) { // pressing enter or space bar
                e.preventDefault();
                $(this).click();
              }
              $(this).find('span').focus();
            });

          }

          if ($(".findcompare-results").length) {

            // check for filter options
            if ($(".fctitles td").length) {
              var filter = $(".fctitles .fcdetails").wrapInner('<div class="filtercontainer"></div>').html();
              $("table").before($(filter));
              $(".fctitles .fcdetails").empty().html("<h2>Address &amp; contact details</h2>");
            }

            // move label to td showing that data
            titles = "",
            fcinfo = false;

            if ($(".fctitles th").length) {
              titles ="th";
            }

            if ($(".fctitles td").length) {
              titles ="td";
            }

            if ($(".fcinfo").length) {
              fcinfo = 1;
            }

            $("table tr:not(.fctitles, .fcinfo, .hidden)").each(function () {

              if (!$(this).has("th.fctitle").length) {
                count = 0;
                infocount = -1;

                $("td", this).each(function () {

                  if (titles == "th") {
                    label = '<span class="label">' + $("table tr.fctitles th:eq(" + count + ")").text() + '</span>';
                  } else if (titles == "td") {
                    label = '<span class="label">' + $("table tr.fctitles td:eq(" + count + ")").text() + '</span>';
                  } else {
                    label = "";
                  }

                  if ((fcinfo) && (infocount !== -1)) {
                    info = $("table tr.fcinfo td:eq(" + (infocount) + ")").html();
                    label = $(label).append($(info));
                  }

                  if (!$(this).hasClass("fcdetails")) {
                    if (!$(this).find("div.cell-content").length) {
                      $(this).wrapInner('<div class="cell-content"></div>')
                    }
                  }

                  count ++;
                  infocount ++;
                  $(this).prepend($(label));

                });
              }

            });

            $("table tr.fctitles, table tr.fcinfo").hide();

            // format opening times nicely
            if ($("table .cell-content .fcopeningtimes").length) {
              $("table .cell-content .fcopeningtimes").parent(".cell-content").addClass("openingtimes");
            }

            // deal with add to shortlist
            if ($("table td.fcaddtoshortlist").length) {
              $("table td.fcaddtoshortlist").each(function() {
                $(this).find("p").wrap('<div class="fcaddtoshortlist"></div>');
                $(this).prev().append($(this).html());
                $(this).remove();
              });
            }

          }

          // Add aria labels and roles and keyboard navigation
          if ($('h2.showmore').length) {
            var count = 1;
            $('h2.showmore').each(function () {
              $(this).wrapInner('<span role="button" tabIndex="0" id="button' + count + '" aria-controls="region' + count + '"></span>');
              $(this).next('.col').attr({'role': 'region', 'id': 'region' + count, 'aria-labelledby': 'button' + count, 'aria-expanded': 'false', 'aria-hidden': 'true'});
              count++

              $(this).click(function () {
                $(this).wrapInner('<span role="button" tabIndex="0" id="button' + count + '" aria-controls="region' + count + '"></span>');
                if ($(this).hasClass("hide")) {
                  $(this).next('.col').attr({'aria-expanded': 'true', 'aria-hidden': 'false'});
                } else {
                  $(this).next('.col').attr({'aria-expanded': 'false', 'aria-hidden': 'true'});
                }
              });

              $(this).keydown(function(e) {
                if (e.which === 13 || e.which === 32) { // pressing enter or space bar
                  e.preventDefault();
                  $(this).click();
                }
                $(this).find('span').focus();
              });
            })
          }
        }

        function fFooter() {
          var footerHeaders = $(".footer-tab-content h2"),
              rightArrow = $('<div />').html('<i aria-hidden="true">&#9658;</i>').text(),
              downArrow = $('<div />').html('<i aria-hidden="true">&#9660;</i>').text(),
              btp = $('<a href="#" class="back-to-top">Back to top</a>'),
              offset = 250,
              duration = 300;

          $(".footer-tab-content ul.info, .mobile .footer .language-intro ").addClass("hidden");
          $(footerHeaders).addClass("show").append(' <i aria-hidden="true">&#9658;</i>');

          // Accessibility - add aria and role and other bits
          $(".footer-tab1").attr({"role": "tablist", "aria-multiselectable": "true"});
          $(".footer-tab-wrap li:first, .footer-tab-wrap li:first a").attr("tabIndex", "-1");
          $(".language-intro, .footer-logos .hidden").attr("aria-hidden", "true");
          var number = 1;

          $(footerHeaders).each(function() {

            var idHeader = "tab" + number;
            var ariaControlsName = "panel" + number;

            $(this).attr({ "role": "tab", "id": idHeader, "aria-controls": ariaControlsName, "aria-selected": 'false', "aria-expanded": 'false', "tabindex": 0 });
            $(this).next("ul").attr({ "role": "tabpanel", "id": ariaControlsName, "aria-hidden": 'true', "aria-labelledby": idHeader });
            $(this).parent().find('a').attr('tabIndex', -1);
            number++;
          });

          $(".footer-tab-content h2.show").click(function() {
            $(this).toggleClass("hide");
            $(this).next("ul.info").toggleClass("hidden");

            if ($(this).next("span").hasClass("language-intro")) {
              var langs = $(this).nextAll(".language-intro");
              $(langs).toggleClass("hidden");
              if ($(langs).hasClass("hidden")) {
                $(langs).attr("aria-hidden", "true");
              } else {
                $(langs).attr("aria-hidden", "false");
              }
            }

            if ($(this).hasClass("hide")) {
              $(this).html(function() { return $(this).html().replace(rightArrow,downArrow); });
              $(this).attr({"aria-selected": 'true', "aria-expanded": 'true'});
              $(this).next("ul").attr("aria-hidden", 'false');
              $(this).parent().find('a').attr('tabIndex', 0);
            } else {
              $(this).html(function() { return $(this).html().replace(downArrow,rightArrow); });
              $(this).attr({"aria-selected": 'false', "aria-expanded": 'false'});
              $(this).next("ul").attr("aria-hidden", 'true');
              $(this).parent().find('a').attr('tabIndex', -1);
            }

          });

          // footer keyboard navigation
          $(footerHeaders).keydown(function(e) {
            if (e.which === 13 || e.which === 32) { // pressing enter or space bar
              $(this).click();
            } else {
              if (e.which === 40 || e.which === 39) { // navigate headers using down or right arrow or tab
                if ($(this).parent().is(':last-child')) {
                  $(this).parent().parent().find('h2:first').focus();
                } else {
                  $(this).parent().next().find('h2').focus();
                }
              }
              if (e.which == 38 || e.which == 37) { // up or left arrow
                e.preventDefault();
                if ($(this).parent().is(':first-child')) {
                  $(this).parent().parent().find('h2:last').focus();
                } else {
                  $(this).parent().prev().find('h2').focus();
                }
              }
            }
          });

          $(".footer-list li:last-child").css("border", "none");

          $(".reset-mobile").click(function() {
            $.cookie("mobile.display", null, {path: '/'});
            $.cookie("mobile.nodisplay", "true", {path: '/'});
            location.reload(true);
          });

          $(".content-wrap").append($(btp));

          if ( $(".column-main .main-results").length ) {
            $(".column-main .main-results").append($(btp));
          }

          /* back to top */
          $(window).scroll(function() {
            if ($(this).scrollTop() > offset) {
              $('.back-to-top').fadeIn(duration);
            } else {
              $('.back-to-top').fadeOut(duration);
            }
          });

          $('.back-to-top').click(function(event) {
            event.preventDefault();
            $('html, body').animate({scrollTop: 0}, 500);
            return false;
          })

        }

        $("body").addClass("mobile");
        fAddDesktopLink();
        fChangeMainNav();
        // fHideComments();
        fMoveContent();
        fMoveNav();
        fFooter();

        $(".mobile .video-panel .swfplayer object, .mobile .video-panel iframe, .mobile .media-item .swfplayer object, .mobile .media-item iframe").css("width", "100%");
        $(".mobile .video-panel .swfplayer object, .mobile .video-panel iframe, .mobile .media-item .swfplayer object,  .mobile .media-item iframe").attr("style", "width:100% !important");

        if ( $(".planner").length ) {
          $(".planner .video-panel").parent().css("width", "100%");
        }

        window.onorientationchange = function() {
          var currentWidth = $(window).width();

          if ( (currentWidth > 640) || (currentWidth < initialWidth) )  { // reload when changing from portrait to landscape and back again if required when crossing the 640px wide threshold
            window.location.href = window.location.href;
          }

          if ( $(".media-player").length || $(".guides").length ) {
            window.location.href = window.location.href;
          }

          if ( $("#featurepanel").length ) {

            $(".feature-panel").css({width: "auto"});

            function delayOCalc() {
              var initialCurrentHeight = $(".feature-current").height();
              $(".features").css("height", initialCurrentHeight);
            }

            oDelay = window.setTimeout(delayOCalc, 300); // need to set a timeout so it can calculate the height properly
          }
        }

        if ( $("#featurepanel").length ) {

          $("#featurepanel .feature-wrap").removeClass("hidden");

          carouselDots();

          var initialCurrentHeight = $(".feature-current").height();
          $(".features").css("height", initialCurrentHeight);

          setInterval( "carouselResponsive()", 8000 );

          $(window).on("resize", function() {
            var w = $(window).width();
            if (w > 640) {
              window.location.href = window.location.href;
            }
          });

        }
      } else {
        //add events to footer tabs in desktop view
        function fCorrectFooterTabbing() {
          var footerTabs = $(".footer-tab-wrap li");
          if (footerTabs.length) {
            footerTabs.keydown(function(e) {
              if (e.which === 13 || e.which === 32) { // pressing enter or space bar
                $(this).click();
              } else if (!e.shiftKey && e.which === 9) { //tab
                e.preventDefault();
                var tabId = $(this).find('a').attr('href');
                if ($(tabId).length) {
                  var tab = $(tabId).first();
                  tab.find('a').first().focus();
                }
              } else if (e.which === 40 || e.which === 39) { // down or right arrow
                e.preventDefault();
                if ($(this).is(':last-child')){
                  $(this).parent().find('> li:first-child > a').focus().click();
                } else {
                  var next = $(this.nextElementSibling).find('a');
                  next.focus();
                  next.click();
                }
              } else if (e.which === 38 || e.which === 37) { // up or left arrow
                e.preventDefault();
                if ($(this).is(':first-child')){
                  $(this).parent().find('> li:last-child > a').focus().click();
                } else {
                  var prev = $(this.previousElementSibling).find('a');
                  prev.focus();
                  prev.click();
                }
              }
            });
          };
          var tabPanels = $(".footer-tab-content");
          if (tabPanels.length) {
            tabPanels.each(function() {
              $(this).find('a:first').keydown(function(e) {
                if (e.which === 9 && e.shiftKey) { // shift tab
                  var tabId = "#" + $(this).parentsUntil(".footer-content").last().attr('id');
                  var link = $('a[href=' + tabId + ']').first();
                  if (link) {
                    link.focus();
                    e.preventDefault();
                  }
                }
              });
            });
          }
        }
        fCorrectFooterTabbing();
      }
    }
  }
});

// refresh enhancements
jQuery(document).ready(function($) {

  function fHideComments() {
    var rightArrow = $('<div />').html("&#9658;").text(),
        downArrow = $('<div />').html("&#9660;").text(),
        commentCount = $(".comments-wrap .comment").length;

    if ($(".comments-wrap").length) {
      if (commentCount !== 0) {
        trueCount = commentCount / 2;
        $(".comments-wrap .disclaimer, .comments-wrap .comment").wrapAll('<div class="comments-container"></div>');
        $(".comments-container").addClass("hidden");
        $(".comments-wrap > .comments-header h3").addClass("show").append(" (" + trueCount + ")" + " &#9658;");

        $(".comments-header h3.show").click(function() {
          $(this).toggleClass("hide");
          $(".comments-container").toggleClass("hidden");
          if ($(this).hasClass("hide")) {
            $(".comments-header h3").html(function() { return $(this).html().replace(rightArrow,downArrow); });
          } else {
            $(".comments-header h3").html(function() { return $(this).html().replace(downArrow,rightArrow); });
          }
        });
      } else {
        $(".comments-header:not(#leavecomment.comments-header)").remove();
      }
    }
  }

  fHideComments();

  // do stuff in live well and health az and health news
  if ( ( $(".live-well").length ) || ($(".healthaz").length ) || ($(".bth-hub").length ) || ($(".bth").length )  || ($(".guides").length ))  {

    // remove all empty paragraphs and other empty elements
    $("p, strong, h2, h3, h4, .WebPartZone-Vertical, .further-reading, .article, .videoplayer, .videosearch, #ctl00_PlaceHolderMain_H2Description, h1:not(.gridrow h1)").each(function() {
      if ($(this).html().replace(/\s|&nbsp;/g, '').length == 0)
        $(this).remove();
    });

    // add hovers to the header links when hovering over the associated image
    $(".panel-text").each(function() {
      panelURL = $(this).find("h2 a").attr("href");
      $(this).prev("div.image").find("img").wrap("<a href='" + panelURL + "'></a>");
    });

    $(".panel .image a").hover(function() {
      $(this).parent("div.image").next("div.panel-text").find("h2 a").toggleClass("hover");
    });

    $(".panel .right-align img").hover(function() {
      $(this).css("cursor", "pointer");
      $(this).parent("div.right-align").next("h2").find("a").toggleClass("hover");
    });

    $(".panel .panel-top img").hover(function() {
      $(this).parents(".panel-top").find("h2 a").toggleClass("hover");
    });

    $(".panel.sat-panel img").hover(function() {
      $(this).parents(".sat-panel").find("h2 a").toggleClass("hover");
    });

    $(".image + h2 a").each(function() {
      panelURL = $(this).attr("href");
      $(this).parent("h2").prev("div.image").find("img").wrap("<a href='" + panelURL + "'></a>");
    });

    $(".col-image + h2 a").each(function() {
      panelURL = $(this).attr("href");
      $(this).parent("h2").prev("div.col-image").find("img").wrap("<a href='" + panelURL + "'></a>");
    });

    $(".panel .image img").hover(function() {
      $(this).parents("div.image").next("h2").find("a").toggleClass("hover");
    });

    // ie fixes
    $(".live-well .pad-tl .col.two:last-child").addClass("lastchild");
    $(".live-well .main-feature + h2").remove();

    // behind the headlines dirty image fix
    if ($(".bth .image").length) {
      var theImg = $(".bth .image img");
      var copyImg = new Image();
      copyImg.src = theImg.attr("src");
      var imgWidth = copyImg.width;
      if (imgWidth < 270)  {
        $(".bth .image").addClass("image-small");
      }
    }

  }

  if ( ($(".homepage").length) && ($("#articles").length) ) {

    if ($("body").hasClass("mobile")) {

      count = 1;
      $("#articles li a").each(function() {
        $("#articles div#tab" + count).prepend("<h3>" + $(this).html() + "</h3>");
        count++;
      })

      $("#articles ul").remove();

    } else {

      /* ie8 and less feature detection */
      if (document.all && !document.addEventListener) {
        $("body").addClass("ie8andless");

        $(".row-bg .box-findservices input:checked + label").addClass("checked");

        $(".row-bg .box-findservices label").click(function() {
          $(".row-bg .box-findservices label").removeClass("checked");
          $(this).addClass("checked");
        });
      }

      $("#articles").tabs();
      $(".ui-tabs-selected").next().addClass("next-tab");
      $("#articles li:last-child").addClass("last-tab")

      $("#articles li a").click(function () {
        $("#articles li").removeClass("next-tab");
        $("#articles li a").each(function() {
          $(this).attr('tabindex', -1);
        });
        $(this).attr('tabindex', 0);
        $(this).parent().next().addClass("next-tab");
      });


      $("#articles li a").keydown(function(e) {
        if (e.which === 40 || e.which === 39) { // down or right key
          e.preventDefault();
          if ($(this).parent().is(':last-child')) {
            $(this).closest('ul').find('> li:first-child > a').focus().click();
          } else {
            $(this).parent().next('li').find('a:first').focus().click();
          }
        }
        if (e.which == 38 || e.which == 37) { // up or left key
          e.preventDefault();
          if ($(this).parent().is(':first-child')) {
            $(this).closest('ul').find('> li:last-child > a').focus().click();

          } else {
            $(this).parent().prev('li').find('a:first').focus().click();
          }
        }

      });

      $("#articles li").hover(
        function () {
          $(this).next().addClass("hover-next").prev().addClass("hover-prev");
        }, function () {
          $(this).next().removeClass("hover-next").prev().removeClass("hover-prev");
        }
      );

      var cTimer;

      function carouselTimer(x) {

        if (cTimer) {
          clearInterval(cTimer);
        }
        var seconds = 7;

        function countdown() {

          seconds--;
          if (seconds < 0) {
            $("#articles li a").blur();
            if ($("#articles li.ui-tabs-selected").hasClass("last-tab")) {
              $("#articles li:first-child a").trigger("click");
            } else {
              $("#articles li.ui-tabs-selected").next().find("a").trigger("click");
            }
            seconds = 7;
          }

          $("#articles").hover(
            function() {
              clearInterval(cTimer);
            }, function() {
              carouselTimer();
            });

          $("#articles li a").focus(function() {
            clearInterval(cTimer);
          }).blur(function() {
            carouselTimer();
          });
        }
        cTimer = setInterval(countdown, 1000);
      }

      if (cTimer == null) {
        carouselTimer();
      }

      $("#articles li a").click(function() {
        carouselTimer();
      });

    }

  }

  // Accessibility amends ------------------- ///

  // Make main nav accessible and keyboard navigable
  var makeMainNavAccessible = (function () {
    var mainNav = '#main-navigation',
      divWrap = mainNav + '> div',
      topList = divWrap + '> ul',
      topListItems = topList + '> li',
      topLinks = topListItems + '> a',
      dropdown = $(topLinks).next('div'),
      nestedList = $(dropdown).find('ul'),
      dropdownMenuItems = $(nestedList).find('li').find('a'),
      menuHoverClass = 'showdropdown';

    var hideMenu = function (el) {
      return el.removeClass(menuHoverClass)
        .parent('a')
        .blur()
        .find('ul')
        .attr('aria-hidden', 'true')
        .find('a').attr('tabIndex', -1);
    };

    // Add roles and aria labels
    $(mainNav).attr({'role': 'navigation', 'aria-label': 'Main menu'});
    $(topList).attr('role', 'menubar');
    $(topLinks).attr('role', 'menuitem');
    $(mainNav).find('> .hidden').attr('aria-hidden', 'true');

    $(topLinks).each(function () {
      if ($(this).next('div').find('ul').length > 0) {
        $(this).attr('aria-haspopup', 'true');
      }
    });

    // Change aria labels and tabindex on hover
    $(topListItems).hover(
      function () {
        $(this).find('div').find('ul')
        .attr('aria-hidden', 'false')
        .find('a').attr('tabIndex', 0);
      }, function () {
        $(this).find('div').find('ul')
        .attr('aria-hidden', 'true')
        .find('a').attr('tabIndex', -1);
      }
    );

    // keyboard navigation for top level links
    $(topLinks).keydown(function(e) {
      if (e.which === 40 || e.which === 39) { // down or right key
        e.preventDefault();
        if ($(this).parent().is(':last-child')) {
          $(this).closest('ul').find('> li:first-child > a').focus();
        } else {
          $(this).parent().next('li').find('a:first').focus();
        }
      }
      if (e.which == 38 || e.which == 37) { // up or left key
        e.preventDefault();
        if ($(this).parent().is(':first-child')) {
          $(this).closest('ul').find('> li:last-child > a').focus();
        } else {
          $(this).parent().prev('li').find('a:first').focus();
        }

      }
    });

    // keyboard navigation of dropdown list items
    $(dropdownMenuItems).keydown(function(e) {
      if (e.which === 40 || e.which === 39) { // down or right key
        e.preventDefault();
        if ($(this).parent().is(':last-child')) {
          $(this).parent().parent().find('li:nth-child(2) a').focus();
        } else {
          $(this).parent().next('li').find('a').focus();
        }
      }
      if (e.which == 38 || e.which == 37) { // up or left key
        e.preventDefault();
        if ($(this).parent().is(':nth-child(2)')) {
          $(this).parent().parent().find('li:last-child a').focus();
        } else {
          $(this).parent().prev('li').find('a').focus();
        }
      }
    });

    // Change aria labels and tabindex on focus
    $(topLinks).focus(
      function () {
        hideMenu($(dropdown));

        $(this).next('div')
          .addClass(menuHoverClass)
          .find('ul')
          .attr('aria-hidden', 'false')
          .find('a').attr('tabIndex', 0);
      }
    );

    // Hide menu if keyboard focus occurs outside of navigation (ie tabs out of main nav)
    $(nestedList).find('a').last().keydown(function (e) {
      if (e.which === 9) {
        hideMenu($(dropdown));
      }
    });
    $(topLinks).first().keydown(function (e) {
      if (e.shiftKey && e.which === 9) {
        hideMenu($(dropdown));
      }
    });

    /* horrible hack to close first item dropdown when using voiceover and you swipe back to search submit button */
    $('.header .submit input').on('focus', function() {
      hideMenu($(dropdown));
    });

    /* another hack to close existing menus and open the menu when you swipe back to the previous one */
    $(nestedList).find('a').on('focus', function() {
      $(topLinks).next('div').removeClass(menuHoverClass);
      $(this).closest('div').addClass(menuHoverClass);
    });

    // Hide menu if click or touch occurs outside of navigation
    $(document).on('click touchstart', function () {
      hideMenu($(dropdown));
    });

  }());


  // Make mega menu accessible and tabable
  var makeMegaMenuAccessible = (function () {
    if ($('.mmenu').length) {

      var mMenu = '.mmenu',
        mmTopList = mMenu + '> ul',
        mmTopListItems = mmTopList + '> li',
        mmTopLinks = mmTopListItems + '> a',
        mmDropdown = $(mmTopLinks).next('.mcontainer'),
        mmHoverClass = 'showmmdropdown';

      var hideMMenu = function (el) {
        return el.removeClass(mmHoverClass)
          .attr({ 'aria-expanded': 'false', 'aria-hidden': 'true'})
          .find('a').attr('tabIndex', -1);
      };

      // Add roles and aria labels
      $(mMenu).attr({'role': 'navigation', 'aria-label': 'Secondary navigation'});
      $(mmTopList).attr('role', 'menubar');

      // Set tabIndex to -1 so that top links can't receive focus until menu is open
      $(mmDropdown)
        .attr({'aria-expanded': 'false', 'aria-hidden': 'true', 'role': 'menu'})
        .find('a').attr('tabIndex', -1);

      // Change aria labels and tabindex on hover
      if (!$('body').hasClass('mobile')) {

        $(mmTopLinks).each(function () {
          $(this).parent('li').attr('aria-haspopup', 'true');
        });

        $(mmTopListItems).hover(
          function () {
            $(this).find('.mcontainer')
            .attr({ 'aria-expanded': 'true', 'aria-hidden': 'false'})
            .find('a').attr('tabIndex', 0);
          }, function () {
            $(this).find('.mcontainer')
            .attr({ 'aria-expanded': 'false', 'aria-hidden': 'true'})
            .find('a').attr('tabIndex', -1);
          }
        );

        // Change aria labels and tabindex on focus
        $(mmTopLinks).focus(
          function () {
            $(mmTopListItems).removeClass('hover');
            hideMMenu($(mmDropdown));
            $(this).parent('li').addClass('hover');

            $(this).next('.mcontainer')
              .addClass(mmHoverClass)
              .attr({'aria-expanded': 'true', 'aria-hidden': 'false'})
              .find('.mmenu-a dd li a, .mmenu-b dt a, .mfeature dt a, .mfeaturelinks a').attr('tabIndex', 0);
          }
        );

        // Hide menu if click occurs outside of navigation
        $(document).click(function () {
          hideMMenu($(mmDropdown));
          $(mmTopListItems).removeClass('hover');
        });

      } else {

        $(mmTopLinks).click(function () {
          if ($(this).next('.mcontainer').attr('aria-hidden') === 'false') {
            $(this).next('.mcontainer').attr({ 'aria-expanded': 'false', 'aria-hidden': 'true'});
          } else {
            $(this).next('.mcontainer').attr({ 'aria-expanded': 'true', 'aria-hidden': 'false'});
          }
        });

        $(mmDropdown).find('.mmenu-a dd li a, .mmenu-b dt a, .mfeature dt a, .mfeaturelinks a').attr('tabIndex', 0);

      }

      // Hide menu if focus occurs outside of navigation (ie tabs out of main nav)
      $(mmDropdown).find('a').last().keydown(function (e) {
        if (e.which === 9) {
          hideMMenu($(mmDropdown));
          $(mmTopListItems).removeClass('hover');
        }
      });
      $(mmTopLinks).first().keydown(function (e) {
        if (e.shiftKey && e.which === 9) {
          hideMMenu($(mmDropdown));
          $(mmTopListItems).removeClass('hover');
        }
      });
    }
  }());


  // Make care and supports services widget focus correctly after selecting from dropdown in mobile view
  var findServicesWidget = (function () {
    var fsWidgetSelect = $('.mobile .find-services-widget').find('select');

    $(fsWidgetSelect).on( 'blur', function () {
      $(this).parent().next().find('input').focus();
    });

  }());


  // Make skip links work so it focuses into the skipped content correctly
  var skipLinkFocus = (function () {
    if ($('body').hasClass('mobile')) {
      $('.mobile-nav a').attr('id','mobilenav');
      $('.skip-link a').each(function () {
        if ($(this).attr('accesskey') === 'N') {
          $(this).addClass('skip-link-nav').attr('href', '#mobilenav');
        }
      });
      $('.skip-link-nav').click(function(e){
        e.preventDefault();
        $('#mobilenav').focus();
      });
    } else {
      $('.skip-link a').click(function(e){
        if ($(this).attr('href').indexOf('#') === 0) { // only target internal links
          var skipTo="#"+this.href.split('#')[1]; // get the target

          if (skipTo === '#mainContent') {
            $(this).attr('href', '#aspnetForm');
            var skipTo = '#aspnetForm';
          }

          $(skipTo).attr('tabindex', -1).on('blur focusout', function () { // make it focusable, focus to it, then remove it's focusability
            $(this).removeAttr('tabindex');
          }).focus();
        }
      });
    }
  }());


  // Add aria labels to registration page errors
  var addRegistrationAria = (function () {
    if ($('.prsnl fieldset input').length) {
      $('.prsnl fieldset input').each(function () {
        if ($(this).attr('aria-describedby')) {
          var errors = $(this).parent().prevAll('.error-container:first').find('.error');
          if (!(errors.length)) {
            $(this).removeAttr('aria-describedby'); // remove aria label if there are no errors associated with it
          } else {
            if ((errors.length === 1) && (errors.css('display') === 'none')) { // to deal with the one hidden screen name error
              $(this).parents('fieldset').find('.row input').removeAttr('aria-describedby'); // remove the aria label
            }
            $(this).parent().prevAll('.error-container:first').attr('id', $(this).attr('aria-describedby')); // add id of the aria label
          }
        }
      })
    }
  }());


  // Fix focus of find local service module
  var focusFindServices = (function () {

    if ($('.homepage .find-services')) {
      $('.find-services input[type=radio]').keyup(function (e) {
        $('.find-services label').removeClass('focus');
        $(this).next('label').addClass('focus');
      }).keydown(function (e) {
        if (e.which === 9) { // remove focus if you click out
          $('.find-services label').removeClass('focus');
        }
      });

      $(document).click(function () {
        $('.find-services label').removeClass('focus'); // remove focus if you click out
      });
    }
  }());

  // Fix alerts styling
  var alerts = (function () {
    if ( ($('.homepage').length) && ($('.alert-top').length) ) {
      if ($('body').hasClass('mobile')) {
        $('.wrap').css('background', '#fff');
      } else {
        var theHeight = $('.alert-top').height() + 30;
        var bgPosition = 'center ' + theHeight + 'px';
        $('.wrap').css('background-position', bgPosition);
        $('.homepage').css('margin-top', theHeight);
      }
    }
    if ( (!$('.homepage').length) && ($('.header .alert-top').length) ) {
      if (!($('body').hasClass('mobile'))) {
        var theHeight = $('.alert-top').height() + 30;
        $('.content-wrap').css('margin-top', theHeight);
      }
    }
    if ( ($('.guides').length) && ($('.alert-top').length) ) {
      if (!($('body').hasClass('mobile'))) {
        var theHeight = $('.alert-top').height() + 30;
        $('.content-wrap').css('margin-top', theHeight);
        $('.alert-top').css('margin-top', '-.5em');
      }
    }
  }());

  // Keyboard navigation for carousel
  var carouselNav = (function () {

    var bxCarousel = $(".bx-carousel");
    var bxCarouselTabs = $(".carousel-content > ul > li > a");

    if (bxCarousel.length) {

      bxCarouselTabs.click(function() {

        var panelID = $(this).attr('id');
        var panelIndex = panelID.charAt(panelID.length-1);

        bxCarouselTabs.removeClass('active').attr({'aria-selected' : 'false', 'tabIndex' : '-1'});
        $(this).addClass('active').attr({'aria-selected' : 'true', 'tabIndex' : '0'});
        $('.carousel-content div[role="tabpanel"').attr('aria-hidden', 'true').find('.carousel-text').addClass('hidden');
        $('.carousel-content div[aria-labelledby="' + panelID + '"]').attr('aria-hidden', 'false').find('.carousel-text').removeClass('hidden');
        $('.carousel-content div[role="tabpanel"] a').attr('tabIndex', '-1');
        $('.carousel-content div[aria-labelledby="' + panelID + '"] a').attr('tabIndex', '0');
        $('.carousel-content img').addClass('hidden');
        $('.carousel-content img#carousel-image-' + panelIndex).removeClass('hidden');

      });

      bxCarouselTabs.keydown(function(e) {

        var currentPanelID = $(this).attr('id');
        var currentTab = $(this);

        switch (e.which) {
          case 40: // down
          case 39: // right
            e.preventDefault();
            if ($(this).parent().is(':last-child')) {
              var nextTab = $(this).closest('ul').find('li:first-child > a');
            } else {
              var nextTab = $(this).parent().next('li').find('a');
            }
            switchTab(currentTab,nextTab);
            break;
          case 38: // up
          case 37: // left
            e.preventDefault();
            if ($(this).parent().is(':first-child')){
              var nextTab = $(this).closest('ul').find('li:last-child > a');
            } else {
              var nextTab = $(this).parent().prev('li').find('a');
            }
            switchTab(currentTab,nextTab);
            break;
          default:
            break;
        }

        if (e.which === 9 && !e.shiftKey) { // tab but not shift + tab
          e.preventDefault();
          $('div[aria-labelledby="' + currentPanelID + '"] .carousel-text').find('a:first-child').focus().attr('tabIndex', '0');
        }

        function switchTab(currentTab,nextTab) {
          var nextPanelID = nextTab.attr('id');
          var nextPanelIndex = nextPanelID.charAt(nextPanelID.length-1);
          currentTab.removeClass('active').attr({'aria-selected' : 'false', 'tabIndex' : '-1'});
          nextTab.focus().click().addClass('active').attr({'aria-selected' : 'true', 'tabIndex' : '0'});
          $('div[aria-labelledby="' + currentPanelID + '"]').attr('aria-hidden', 'true').find('.carousel-text').addClass('hidden');
          $('div[aria-labelledby="' + currentPanelID + '"] a').attr('tabIndex', '-1');
          $('div[aria-labelledby="' + nextPanelID + '"]').attr('aria-hidden', 'false').find('.carousel-text').removeClass('hidden');
          $('div[aria-labelledby="' + nextPanelID + '"] a').attr('tabIndex', '0');
          $('.carousel-content img').addClass('hidden');
          $('.carousel-content img#carousel-image-' + nextPanelIndex).removeClass('hidden');
        }

      });

    };
  }());

});
