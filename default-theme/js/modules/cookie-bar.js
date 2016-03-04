/*jshint nonew:true, curly:true, noarg:true, forin:true, noempty:true, eqeqeq:true, strict:true, undef:true, bitwise:true, browser:true */

var STEEL = STEEL || {};

/* global Cookies */
STEEL.cookieBar = (function ($) {
    'use strict';

    var cookie = Cookies.get('terms-accepted');
    if(!cookie){
        $.ajax({
            method: 'POST',
            url: '/home/cookies'
        }).then(function(template){
            $('body').prepend(template);
            var $cookiebar = $('.cookie-bar');

            $cookiebar.find('.btn').bind('click', function(e){
                e.preventDefault();
                Cookies.set('terms-accepted', true, {expires: 365});
                $cookiebar.remove();
            })

        });
    }

})(jQuery);