// reqiurements
var jquery = window.$ = window.jQuery = require('jquery');
var sprite = require('./sprite.js');

// var TweenMax = window.TweenMax = require('gsap');
// // require('gsap/src/minified/plugins/CSSRulePlugin.min.js');

// // var jquery_validate = require('../libs/jquery-validate/jquery.validate.min.js');
// // var jquery_univalidate = require('./uni-validate.js');
// // require('./animations.js');

// //angular modules
// import appName from './app/app.js';


$(document).ready(function() {
    var toggle_btn = $('.header__toggle');
    var menu_close = $('.mobile-panel__close');
    var body = $('.body');
    var font = $('.fontUp');

    toggle_btn.on('click', function(event) {
    	event.preventDefault();
    	$('.body').toggleClass('act');
    });

    menu_close.on('click', function(event) {
    	event.preventDefault();
    	$('.body').removeClass('act');
    });

    font.on('click', function(event) {
        event.preventDefault();
        body.toggleClass('largeFont');
        font.toggleClass('act');
    });

    $('#select-country').selectize({});

});

$(document).mouseup(function (e){
    var div = $(".mobile-panel");
    if (!div.is(e.target)
        && div.has(e.target).length === 0) {
        $('.body').removeClass('act');
    }
});
