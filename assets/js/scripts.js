'use strict';
(function ($) {

    var px = ''; //'rt--'

    /**
     * Функция для вывода набора jQuery по селектору, к селектору добавляются
     * префиксы
     *
     * @param {string} selector Принимает селектор для формирования набора
     * @return {jQuery} Возвращает новый jQuery набор по выбранным селекторам
     */
    function $x(selector) {
        return $(x(selector));
    }

    /**
     * Функция для автоматического добавления префиксов к селекторы
     *
     * @param {string} selector Принимает селектор для формирования набора
     * @return {string} Возвращает новый jQuery набор по выбранным селекторам
     */
    function x(selector) {
        var arraySelectors = selector.split('.'),
            firstNotClass = !!arraySelectors[0];

        selector = '';

        for (var i = 0; i < arraySelectors.length; i++) {
            if (!i) {
                if (firstNotClass) selector += arraySelectors[i];
                continue;
            }
            selector += '.' + px + arraySelectors[i];
        }

        return selector;
    }

// Прелоадер
    $(function () {

var menu = function(){
    var $menuMain = $('.menu_main');
    $menuMain.css('position', 'absolute');
    var menuHeight = $('.menu_main').outerHeight();
    $menuMain.css('position', 'static');
    var $body = $('body');
    function refresh(){
        if (window.innerWidth<991) {
            // $('.menuModal').each(function(){
            //     var $this = $(this);
            //     setTimeout(function(){
            //         if ($this.attr('height') > 0) {
            //             $this.css('height', 0);
            //         }
            //     }, 100);
            // });
            $('.menuModal').css('height', 0);
            $menuMain.css('position', 'absolute');
            menuHeight = $('.menu_main').outerHeight();
            $menuMain.css('position', 'static');
        } else {
            menuHeight = $('.menu_main').outerHeight();
            $('.menuModal')
                .removeClass("menuModal_OPEN")
                .css('height', '');
            $body.removeClass("Site_menuOPEN");
            $('.menuTrigger').removeClass("menuTrigger_OPEN");
        }
    }

    return {
        init: function(){
            if (window.innerWidth<991) {
            $(".menuModal").css('height', menuHeight);
            // Меню для мобильных
                $(".menuTrigger").each(function () {
                    $($(this).attr('href')).css('height', 0);
                });
            }

            $(".menuTrigger").click(function(e){
                var $this = $(this),
                    href = $this.attr("href");

                if ($this.hasClass("menuTrigger_OPEN")) {
                    $body.removeClass("Site_menuOPEN");
                    $(href)
                        .removeClass("menuModal_OPEN")
                        .css('height', 0);
                    $this.removeClass("menuTrigger_OPEN");
                }else{
                    $body.addClass("Site_menuOPEN");
                    $(href)
                        .addClass("menuModal_OPEN")
                        .css('height', menuHeight);
                    $this.addClass("menuTrigger_OPEN");
                }
                e.preventDefault();
            });
            $(window).on('resize', refresh);
        }
    };
};
menu().init();
var search = function(){
    var $searchLink = $('.Header-searchLink');
    return {
        init: function(){
            $searchLink.each(function(){
                var $this = $(this);
                $this.on('click', function(){
                    var $thisClick = $(this);
                    $thisClick.closest('.Header-searchWrap').toggleClass('Header-searchWrap_open');
                });
            });
        }
    };
};
search().init();
var form = function(){
    var $selectList = $('.selectList');
    var $input = $('.form-input, .form-textarea');
    var $form = $('.form');
    var $select = $('.form-select');
    return {
        init: function(){
            $selectList.each(function(){
                var $this = $(this),
                    $radio= $this.find('input[type="radio"]');
                function changeTitle($block, $element) {
                    $block.find('.selectList-title')
                        .text( $element.closest('.selectList-item')
                            .find('.selectList-text').text())
                }
                changeTitle($this, $radio.filter('[checked="checked"]'));
                $radio.on('change', function(){
                    changeTitle($this, $(this));
                });
                
            });
            $(document).on('click', function(e){
                var $this = $(e.target);
                if (!$this.hasClass('selectList-header') ) {
                    $this = $(e.target).closest('.selectList-header');
                }
                if ( $this.length ){
                    e.preventDefault();
                    $this.closest('.selectList').toggleClass('selectList_OPEN');
                } else {
                    $('.selectList').removeClass('selectList_OPEN');
                }
            });
            
            // Валидация полей
            $input.on('blur', function(){
                var $this = $(this),
                    validate = $this.data('validate'),
                    message = '',
                    error = false;
                validate = validate.split(' ');
                validate.forEach(function(v){
                    switch (v){
                        case 'require':
                            if (!$this.val()) {
                                message = 'Это поле обязательно для заполнения. ';
                                error = true;
                            }
                            break;
                        case 'pay':
                            var val = $this.val().replace(' ', '');
                            val = val + '';
                            if (parseFloat(val)%2!==0) {
                                message += 'Номер должен быть четным. ';
                                error = true;
                            }
                            break;
                            
                    }
                    if (error) {
                        if ($this.hasClass('form-input')){
                            $this.addClass('form-input_error');
                        }
                        if ($this.hasClass('form-textarea')){
                            $this.addClass('form-textarea_error');
                        }
                        if (!$this.next('.form-error').length){
                            $this.after('<div class="form-error">'+message+'</div>');
                        }
                        $this.data('errorinput', true);
                    } else {
                        $this.next('.form-error').remove();
                        $this.removeClass('form-input_error');
                        $this.removeClass('form-textarea_error');
                        $this.data('errorinput', false);
                    }
                    message = '';
                
                });
            });
            $form.on('submit', function(e){
                var $this = $(this),
                    $validate = $this.find('[data-validate]');
                
                $validate.each(function(){
                    var $this = $(this);
                    $this.trigger('blur');
                    if ($this.data('errorinput')){
                        e.preventDefault();
                    }
                });
            });
            $select.wrap('<div class="form-selectWrap"></div>');
            $('[data-mask]').each(function(){
                var $this = $(this);
                $this.mask($this.data('mask'), {placeholder:'x'});
            });
        }
    };
};
form().init();
//END
var Slider = function(){
    let $block = $('.Slider').not('.Slider_carousel'),
        $container = $block.children('.Slider-box'),
        $carousel = $('.Slider_carousel'),
        $containerCar = $carousel.children('.Slider-box');
    return {
        init: function(){
            $container.each(function(){
                var $this = $(this);
                var $navigate = $this.closest($block).find('.Slider-navigate');
                $this.slick({
                    dots: true,
                    arrows: true,
                    autoplay: true,
                    appendArrows: $navigate,
                    appendDots: $navigate,
                    autoplaySpeed: 3000
                });
            });
            $containerCar.each(function(){
                var $this = $(this);
                var $navigate = $this.closest($carousel).find('.Slider-navigate');
                if($this.hasClass('Cards')){
                    $this.slick({
                        appendArrows: $navigate,
                        appendDots: $navigate,
                        dots:false,
                        arrows: true,
                        slidesToShow: 5,
                        slidesToScroll: 1,
                        responsive: [
                            {
                                breakpoint: 990,
                                settings: {
                                    slidesToShow: 3,
                                    slidesToScroll: 1
                                }
                            },
                            {
                                breakpoint: 480,
                                settings: {
                                    slidesToShow: 1,
                                    slidesToScroll: 1
                                }
                            }
                        ]
                    });
                    
                } else {
                    $this.slick({
                        appendArrows: $navigate,
                        appendDots: $navigate,
                        dots: true,
                        arrows: true,
                        slidesToShow: 4,
                        slidesToScroll: 2,
                        responsive: [
                            {
                                breakpoint: 1600,
                                settings: {
                                    slidesToShow: 3,
                                    slidesToScroll: 2
                                }
                            },
                            {
                                breakpoint: 1230,
                                settings: {
                                    slidesToShow: 2,
                                    slidesToScroll: 2
                                }
                            },
                            {
                                breakpoint: 570,
                                settings: {
                                    slidesToShow: 1,
                                    slidesToScroll: 1
                                }
                            }
                        ]
                    });
                    
                }
            });
            
        }
    };
};
Slider().init();
var CartBlock = function(){
    return {
        init: function(){
        }
    };
};
CartBlock().init();
var Middle = function(){
    return {
        init: function(){
        }
    };
};
Middle().init();
var Card = function(){
    return {
        init: function(){
        }
    };
};
Card().init();
var Section = function(){
    return {
        init: function(){
        }
    };
};
Section().init();
var Tags = function(){
    return {
        init: function(){
        }
    };
};
Tags().init();
//END
    });


})(jQuery);