var languageGoogleCookieName = 'googtrans';
/* -------------------------------------------------------------------------------- */
/* -------------------      GOOGLE TRANSLATE FUNCTIONALITY        ----------------- */
/* -------------------------------------------------------------------------------- */

// --------------------------------------------------------------------------------------------
// FUNCTION: googleTranslateElementInit
// DESCRIPTION: Checks for Google language cookie and loads translate elements
// ARGUMENTS: None
// RETURN: None
// --------------------------------------------------------------------------------------------
function googleTranslateElementInit() {
    (function($) {
        if (checkFlashEnabled()) {
            $('a.translate-text').remove();
            $('ul li.translate-item').append('<div id="google_translate_element"></div>');
            var googleCookieLanguage = getGoogleCookieLanguage();
            if ((googleCookieLanguage != null) && (googleCookieLanguage != 'en')) {
                loadGoogleTranslation('auto', $);
            }
            else {
                loadGoogleTranslation('en', $);
            }
        }
    })(jQuery)
}

// --------------------------------------------------------------------------------------------
// FUNCTION: loadGoogleTranslation
// DESCRIPTION: Loads Google translation functionality
// ARGUMENTS: detectionLanguage(string), jQuery object
// RETURN: None
// --------------------------------------------------------------------------------------------
function loadGoogleTranslation(detectionLanguage, $) {
    try {
        new google.translate.TranslateElement({
            pageLanguage: detectionLanguage,
            layout: google.translate.TranslateElement.InlineLayout.SIMPLE
        }, 'google_translate_element');
        $('a.goog-te-menu-value span').remove();
        $('a.goog-te-menu-value img').remove();
        $('.goog-te-gadget-icon').remove();
        var $a = $("a.goog-te-menu-value");
        $a.prepend("<span onclick='amendLanguagesDisplay();return false;' class='translate-text'>Translate</span>");
    }
    catch (err) {
        $('ul li.translate-item').append('<a href="/pages/languagehub.aspx" class="translate-text">Translate</a>');
    }
}

// --------------------------------------------------------------------------------------------
// FUNCTION: amendLanguagesDisplay
// DESCRIPTION: Amends the display of translatable languages
// ARGUMENTS: None
// RETURN: None
// --------------------------------------------------------------------------------------------
function amendLanguagesDisplay() {
    (function($) {
        $("iframe.goog-te-menu-frame").contents().find("body table .google-powered").remove();
        $("iframe.goog-te-menu-frame").contents().find("body .goog-te-menu2").css("border-color", "#666");

        var framehead = $("iframe.goog-te-menu-frame").contents().find("head").html();
        if (framehead.indexOf('<style type="text/css">') == -1) {
            try {
                $("iframe.goog-te-menu-frame").contents().find("head").append('<style type="text/css">.goog-te-menu2-item:hover div {background:none; color:#00c; text-decoration:underline;}</style>');
            } catch (err) { }
        }

        try {
            $("iframe.goog-te-menu-frame").contents().find("body table tbody").append('<tr class="google-powered"><td colspan="20" align="right">Powered by <img src="/img/google.gif" alt="Powered by Google" style="position:relative; top:5px;"/></td></tr>');
        } catch (err) { }
        if ($("iframe.goog-te-menu-frame").contents().find("body table span.text:lt(1)")[0].innerHTML != 'English') {
            try {
                $("iframe.goog-te-menu-frame").contents().find("body table span.text:lt(1)").text("Translate");
            } catch (err) { }
        }
    })(jQuery)
}

// --------------------------------------------------------------------------------------------
// FUNCTION: checkFlashEnabled
// DESCRIPTION: Check Flash enabled
// ARGUMENTS: None
// RETURN: Flash enabled(boolean)
// --------------------------------------------------------------------------------------------
function checkFlashEnabled() {
    var flashEnabled = false;
    //for IE
    var flashPlugin = ['ShockwaveFlash.ShockwaveFlash', 'ShockwaveFlash.ShockwaveFlash.3', 'ShockwaveFlash.ShockwaveFlash.4', 'ShockwaveFlash.ShockwaveFlash.5', 'ShockwaveFlash.ShockwaveFlash.6', 'ShockwaveFlash.ShockwaveFlash.7'];
    if (typeof ActiveXObject != 'undefined') {
        for (var i = 5; i > 0; i--) {
            try {
                new ActiveXObject(flashPlugin[i]);
                flashEnabled = true;
                break;
            }
            catch (err) {
            }
        }
    }
    //for standard compliant browsers
    if (!flashEnabled) {
        if (navigator.mimeTypes) {
            if (navigator.mimeTypes["application/x-shockwave-flash"] &&
                navigator.mimeTypes["application/x-shockwave-flash"].enabledPlugin) flashEnabled = true;
        }
    }
    return flashEnabled;
}

// --------------------------------------------------------------------------------------------
// FUNCTION: getGoogleCookieLanguage
// DESCRIPTION: checks for google language cookie and returns the language id
// ARGUMENTS: None
// RETURN: language id(string)
// --------------------------------------------------------------------------------------------
function getGoogleCookieLanguage() {
    var languageValue = jQuery.cookie(languageGoogleCookieName);
    if (languageValue) {
        var languageId = (languageValue.slice(languageValue.lastIndexOf('/') + 1));
        return languageId;
    }
    else {
        return null;
    }
}