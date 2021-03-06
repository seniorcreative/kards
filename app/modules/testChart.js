define(
    ['jquery',
    'modules/style',
    'modules/layout'],

    function($, style, layout) {

        // Setter functions (accept that for global scope) - where 'that' should be

        var that, paper, graph;

        var init = function (_scope, _paper, _graph) {

            that    = _scope;
            paper   = _paper;
            graph   = _graph;

        };

        var setTotalWidthAnswers = function (numAnswers, answerWidth) {

            var _totalWidth = (numAnswers * answerWidth) + ((numAnswers - 1) * layout.answerMargin);

            layout.set('totalWidthOfAnswers', _totalWidth);

            var _startX = parseInt(layout.stage.centerX - (_totalWidth / 2));

            layout.set('startX', _startX);

        };

        var resetElementStyles = function (elementKType) {


            //var paperRect = {x: 0, y: 0, width: window.innerWidth, height: window.innerHeight};
            var paperRect = {x: 0, y: 0, width: 6000, height: 6000}; // max width, max height... had objects going outside of this causing issues not deselecting
            that.loopedElements = paper.findViewsInArea(paperRect);

            for (var element in that.loopedElements) {
                if ((that.loopedElements[element].model.get('ktype') == elementKType || elementKType == 'all') && that.loopedElements[element].model.get('ktype') != 'report') {
                    attrs = that.loopedElements[element].model.get('attrs');
                    attrs.rect['stroke-dasharray'] = style.node.strokeDashArray.deselected;
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

        var questionCompare = function(a,b) {
            if (a.qid < b.qid)
                return -1;
            if (a.qid > b.qid)
                return 1;
            return 0;
        };


        var clearSelections = function()
        {

            resetElementStyles('all');

            // Don't reset the selectedReport once we have one.
            window.selectedContent  = null;
            window.selectedSection  = null;
            window.selectedQuestion = null;
            window.selectedAnswer   = null;
            window.selectedEndPoint = null;

            $('#btnAddAnswer').addClass('hidden');
            $('#btnShowLogic').addClass('hidden');
            $('#btnDeleteQuestion').addClass('hidden');

            $('.formAnswerOptions').css('opacity', 0);
            $('.formAnswerOptions').css('pointer-events', 'none');

            //$('.formQuestionOptions').css('opacity', 0);
            $('#btnQuestionAdd').removeClass('hidden');
            //$('#btnAddAnswer').addClass('hidden');

            // Clear the appropriate  model values
            window.sectionModel.set(
                {
                    sectionTitle: ''
                }
            );
            window.sectionModel.trigger('change');

            window.questionModel.set(
                {
                    questionValue: ''
                }
            );
            window.questionModel.trigger('change');

            window.answerModel.set(
                {
                    answerLabel: ''
                }
            );
            window.answerModel.trigger('change');

            window.contentModel.set(
                {
                    contentText: ''
                }
            );
            window.contentModel.trigger('change');


            window.endPointModel.set(
                {
                    endPointTitle: ''
                }
            );
            window.endPointModel.trigger('change');

            $('.formQuestionOptions h3').text('Add Question');
            $('#logic-modal').hide();

        };

        //objs.sort(compare);

        return {
            init: init,
            setTotalWidthAnswers: setTotalWidthAnswers,
            resetElementStyles: resetElementStyles,
            autocompleteSearch: autocompleteSearch,
            questionCompare: questionCompare,
            clearSelections: clearSelections
        }


    }
);