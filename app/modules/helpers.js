define(
    ['jquery',
    'modules/style',
    'modules/layout',
    'modules/contentStream'
    ],

    function($, style, layout, contentStream) {

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
            var paperRect = layout.stage.area.rect; // max width, max height... had objects going outside of this causing issues not deselecting
            that.loopedElements = paper.findViewsInArea(paperRect);

            for (var element in that.loopedElements) {

                //if ((that.loopedElements[element].model.get('ktype') == elementKType || elementKType == 'all') && that.loopedElements[element].model.get('ktype') != 'report') {

                attrs = that.loopedElements[element].model.get('attrs');

                switch(that.loopedElements[element].model.get('ktype')) {

                    case 'question':
                    case 'answer':
                    case 'content':
                    case 'report':
                    case 'section':

                        attrs.rect['stroke-dasharray'] = style.node.strokeDashArray.deselected;
                        attrs.rect['fill'] = style.node.fill.normal;
                        attrs.rect['fill-opacity'] = style.node.fillOpacity.normal;
                        attrs.rect['stroke-width'] = style.node.strokeWidth.normal;
                        attrs.rect['stroke'] = style.node.stroke.normal;
                        attrs.rect['stroke-opacity'] = style.node.strokeOpacity.normal;

                        break;

                    case 'contentwrapper':
                    case 'logicwrapper':

                        attrs.rect['stroke-dasharray'] = style.wrapper.strokeDashArray.deselected;
                        attrs.rect['fill'] = style.wrapper.fill.normal;
                        attrs.rect['fill-opacity'] = style.wrapper.fillOpacity.normal;
                        attrs.rect['stroke-width'] = style.wrapper.strokeWidth.normal;
                        attrs.rect['stroke'] = style.wrapper.stroke.normal;
                        attrs.rect['stroke-opacity'] = style.wrapper.strokeOpacity.normal;

                        break;

                    case 'endpoint':

                        attrs.rect['stroke-dasharray'] = style.endpoint.strokeDashArray.deselected;
                        attrs.rect['fill'] = style.endpoint.fill.normal;
                        attrs.rect['fill-opacity'] = style.endpoint.fillOpacity.normal;
                        attrs.rect['stroke-width'] = style.endpoint.strokeWidth.normal;
                        attrs.rect['stroke'] = style.endpoint.stroke.normal;
                        attrs.rect['stroke-opacity'] = style.endpoint.strokeOpacity.normal;

                        break;

                }

                attrs.text['fill'] = style.text.fill.normal;
                that.loopedElements[element].model.set('attrs', attrs);
                that.loopedElements[element].render().el;

                //}
            }
        };

        var deselectElementStylesForTest = function (elementKType) {


            //var paperRect = {x: 0, y: 0, width: window.innerWidth, height: window.innerHeight};
            var paperRect = {x: 0, y: 0, width: 6000, height: 6000}; // max width, max height... had objects going outside of this causing issues not deselecting
            that.loopedElements = paper.findViewsInArea(paperRect);

            for (var element in that.loopedElements) {

                    attrs = that.loopedElements[element].model.get('attrs');

                    // Only deselect if not in the contentstream models array
                    if (contentStream.getModels().indexOf(that.loopedElements[element].model) == -1) {

                        switch (that.loopedElements[element].model.get('ktype')) {

                            case 'question':
                            case 'answer':
                            case 'content':
                            case 'report':
                            case 'section':

                                attrs.rect['stroke-dasharray'] = style.node.strokeDashArray.testDeselected;
                                attrs.rect['fill'] = style.node.fill.testDeselected;
                                attrs.rect['fill-opacity'] = style.node.fillOpacity.testDeselected;
                                attrs.rect['stroke-width'] = style.node.strokeWidth.testDeselected;
                                attrs.rect['stroke'] = style.node.stroke.testDeselected;
                                attrs.rect['stroke-opacity'] = style.node.strokeOpacity.testDeselected;

                                break;

                            case 'contentwrapper':
                            case 'logicwrapper':

                                attrs.rect['stroke-dasharray'] = style.wrapper.strokeDashArray.testDeselected;
                                attrs.rect['fill'] = style.wrapper.fill.testDeselected;
                                attrs.rect['fill-opacity'] = style.wrapper.fillOpacity.testDeselected;
                                attrs.rect['stroke-width'] = style.wrapper.strokeWidth.testDeselected;
                                attrs.rect['stroke'] = style.wrapper.stroke.testDeselected;
                                attrs.rect['stroke-opacity'] = style.wrapper.strokeOpacity.testDeselected;

                                break;

                            case 'endpoint':

                                attrs.rect['stroke-dasharray'] = style.endpoint.strokeDashArray.testDeselected;
                                attrs.rect['fill'] = style.endpoint.fill.testDeselected;
                                attrs.rect['fill-opacity'] = style.endpoint.fillOpacity.testDeselected;
                                attrs.rect['stroke-width'] = style.endpoint.strokeWidth.testDeselected;
                                attrs.rect['stroke'] = style.endpoint.stroke.testDeselected;
                                attrs.rect['stroke-opacity'] = style.endpoint.strokeOpacity.testDeselected;

                                break;

                        }

                        attrs.text['fill'] = style.text.fill.testDeselected;
                        that.loopedElements[element].model.set('attrs', attrs);
                        that.loopedElements[element].render().el;

                    }

            }

            $('.formAnswerInputOptions')[0].reset();

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
            $('#btnDeleteContent').addClass('hidden');
            $('#btnDeleteSection').addClass('hidden');
            $('#btnDeleteEndPoint').addClass('hidden');

            $('.formAnswerOptions').css('opacity', 0);
            $('.formAnswerOptions').css('pointer-events', 'none');

            $('.formAnswerInputOptions').css('opacity', 0);
            $('.formAnswerInputOptions').css('pointer-events', 'none');
            $('.formAnswerInputOptions').animate({'right': -400}, 250);

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
                    contentText: '',
                    contentNumber: ''
                }
            );
            window.contentModel.trigger('change');


            window.endPointModel.set(
                {
                    endPointTitle: ''
                }
            );
            window.endPointModel.trigger('change');

            $('.formSectionOptions h3').text('Add Section');
            $('.formQuestionOptions h3').text('Add Question');
            $('.formContentOptions h3').text('Add Content');
            $('.formEndPointOptions h3').text('Add End Point');

            $('#logic-modal').hide();
            $('#individualisation-modal').hide();
            $('#help-modal').hide();


            switch(window.reportModel.mode) {

                case 'test':

                    $('#content-nodes li a').removeClass('selected');
                    $('.formContentOptions').animate({'bottom': -500}, 100);

                    break;

            }

        };


        // Getters which loop over loaded data objects.

        var getPrefixOperatorByID = function( id )
        {

            for(var data in window.loadedData.logicOperatorPrefix)
            {

                if (window.loadedData.logicOperatorPrefix[data].id == id) return window.loadedData.logicOperatorPrefix[data];

            }

        };

        var getNormalOperatorByID = function( id )
        {

            for(var data in window.loadedData.logicOperatorNormal)
            {

                if (window.loadedData.logicOperatorNormal[data].id == id) return window.loadedData.logicOperatorNormal[data];

            }

        };

        var getCustomValueTypeByID = function( id )
        {

            for(var data in window.loadedData.valueDataTypesDropdown)
            {

                if (window.loadedData.valueDataTypesDropdown[data].id == id) return window.loadedData.valueDataTypesDropdown[data];

            }

        };

        var showAlert = function(string, delay)
        {

            $('body').prepend('<div class="alert" style="opacity: 0"><em>'+ string +'</em></div>');
            $('.alert').animate({'opacity': 1}, 500);
            setTimeout(function () {
                $('.alert').remove()
            }, delay);

        };

        var panelsOut = function()
        {

            $('.formReportOptions').animate({'left': -400}, 250);
            $('.formSectionOptions').animate({'left': -400}, 250);
            $('.formQuestionOptions').animate({'left': -400}, 250);
            $('.formAnswerOptions').animate({'right': -400}, 250);
            $('.formAnswerInputOptions').animate({'right': -400}, 250);
            $('.formContentOptions').animate({'bottom': -500}, 250);
            $('.formEndPointOptions').animate({'right': -400}, 250);
            $('.formPanelControls').animate({'left': -400}, 250);
            $('#HUD').animate({'bottom': 0}, 250);

            $('#btnAddContent').hide();

        };

        var panelsIn = function()
        {

            $('.formReportOptions').animate({'left': 10}, 250);
            $('.formSectionOptions').animate({'left': 10}, 250);
            $('.formQuestionOptions').animate({'left': 10}, 250);
            $('.formAnswerOptions').animate({'right': 10}, 250);
            $('.formAnswerInputOptions').animate({'right': 10}, 250);
            $('.formContentOptions').animate({'bottom': 10}, 250);
            $('.formEndPointOptions').animate({'right': 10}, 250);
            $('.formPanelControls').animate({'left': 10}, 250);
            $('#HUD').animate({'bottom': -240}, 250);

            $('#btnAddContent').show();

        };

        var togglePanelsOut = function()
        {

            $('.formReportOptions').animate({'left': -400}, 250);
            $('.formSectionOptions').animate({'left': -400}, 250);
            $('.formQuestionOptions').animate({'left': -400}, 250);
            $('.formAnswerOptions').animate({'right': -400}, 250);
            $('.formAnswerInputOptions').animate({'right': -400}, 250);
            $('.formContentOptions').animate({'bottom': -500}, 250);
            $('.formEndPointOptions').animate({'right': -400}, 250);
            $('.formPanelControls').animate({'left': -400}, 250);

        };

        var togglePanelsIn = function()
        {

            $('.formReportOptions').animate({'left': 10}, 250);
            $('.formSectionOptions').animate({'left': 10}, 250);
            $('.formQuestionOptions').animate({'left': 10}, 250);
            $('.formAnswerOptions').animate({'right': 10}, 250);
            $('.formAnswerInputOptions').animate({'right': 10}, 250);
            $('.formContentOptions').animate({'bottom': 10}, 250);
            $('.formEndPointOptions').animate({'right': 10}, 250);
            $('.formPanelControls').animate({'left': 10}, 250);

            $('#btnContentControlsClose').removeClass('up');
            $('#btnContentControlsClose').addClass('down');

        };

        return {
            init: init,
            setTotalWidthAnswers: setTotalWidthAnswers,
            resetElementStyles: resetElementStyles,
            deselectElementStylesForTest: deselectElementStylesForTest,
            questionCompare: questionCompare,
            clearSelections: clearSelections,
            getPrefixOperatorByID: getPrefixOperatorByID,
            getNormalOperatorByID: getNormalOperatorByID,
            getCustomValueTypeByID: getCustomValueTypeByID,
            showAlert: showAlert,
            panelsOut: panelsOut,
            panelsIn: panelsIn,
            togglePanelsOut: togglePanelsOut,
            togglePanelsIn: togglePanelsIn
        }


    }
);