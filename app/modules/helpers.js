define(
    ['jquery'],

    function($) {

        // Setter functions (accept that for global scope) - where 'that' should be

        var that;

        var init = function (scope) {

            that = scope;

        };

        var setTotalWidthAnswers = function (numAnswers, answerWidth) {
            that.totalWidthOfAnswers = (numAnswers * answerWidth) + ((numAnswers - 1) * that.answerMargin);
            that.startX = that.stageCenterX - (that.totalWidthOfAnswers / 2);
        };

        var resetElementStyles = function (elementKType) {

            var paperRect = {x: 0, y: 0, width: window.innerWidth, height: window.innerHeight};
            that.loopedElements = that.paper.findViewsInArea(paperRect);

            for (var element in that.loopedElements) {
                if (that.loopedElements[element].model.get('ktype') == elementKType || elementKType == 'all') {
                    attrs = that.loopedElements[element].model.get('attrs');
                    attrs.rect['stroke-dasharray'] = that.style.node.strokeDashArray.deselected;
                    that.loopedElements[element].model.set('attrs', attrs);
                    that.loopedElements[element].render().el;
                }
            }
        };

        var autocompleteSearch = function () {

            console.log('autocompleteSearch called');

            $('#search-field').sonoaAutocomplete(
                {
                    TYPE: "GET",
                    AJAX_URL: 'http://localhost/kards-v1/data/individualisedContent.php',
                    POST_STRING: {},

                    SUGGESTION_LIST: '.js_autocomplete--list',

                    INPUT_CLEAR_FILL: false,

                    //AUTOCOMPLETE_CLASS	: 'autocomplete-dropdown-nav__options__list',

                    onLoad: function () {
                    },

                    onKeyup: function () {

                    },

                    beforeSend: function () {
                        //$('.answer--append').addClass('hidden');
                        //$('.main-content--message-read').addClass('hidden');
                        //$('.main-content--message-read__title-profile__heading').addClass('hidden');
                        //$('.main-content--message-read__message-date').addClass('hidden');

                        //overlay.showSuggestionOverlay();
                    },

                    success: function (data) {

                        $('#search-field').val($('#search-field').val());
                    },

                    onClick: function (e) {
                        //showAnswer( e.id );
                        //overlay.hideSuggestionOverlay();
                        //incrementSearchCounter( e.id );
                    },

                    onEmpty: function () {
                        $('.main-content--suggestions__cantfind').show();
                        $('.js_autocomplete--list').html('<ul class="header-search__suggest__list"><li><span class="autocomplete-dropdown-nav__options__span">No questions found</span></li></ul>'); // PLEASE LEAVE THIS!!!! Steve
                    },

                    onEmptyInput: function () {
                        if ($('#search-field').val() != undefined) {
                            if ($('#search-field').val().length <= 0) {
                                //overlay.hideSuggestionOverlay();
                            }
                        }
                    },

                    error: function (data) {
                    }

                });

        };

        return {
            init: init,
            setTotalWidthAnswers: setTotalWidthAnswers,
            resetElementStyles: resetElementStyles,
            autocompleteSearch: autocompleteSearch
        }
    }
);