/*jshint nonew:true, curly:true, noarg:true, forin:true, noempty:true, eqeqeq:true, strict:true, undef:true, bitwise:true, browser:true */

class CookieBar
{
    'use strict';

    constructor($) {
        let cookie = Cookies.get('terms-accepted');

        if(!cookie){
            $.ajax({
                method: 'POST',
                url: './default-theme/includes/cookies-bar.html'
            }).then(function(template){
                $('body').prepend(template);
                let $cookiebar = $('.cookie-bar');

                $cookiebar.find('.btn').bind('click', function(e){
                    e.preventDefault();
                    Cookies.set('terms-accepted', true, {expires: 365});
                    $cookiebar.remove();
                })
            });
        }
    }
}

export default CookieBar;