//A model to represent a rectangle.

define(function(require, exports, module) {
    "use strict";

    // External dependencies.
    var Backbone = require("backbone");

    var Rectangle = Backbone.Model.extend({});

    var RectangleView = Backbone.View.extend({

        tagName: 'div',

        className: 'rectangle',

        events:
        {
          'click': 'move'
        },

        render: function()
        {

            this.setDimensions();
            this.setPosition();
            this.setColor();

            return this;

        },

        setDimensions: function ()
        {

            this.$el.css({
                    width: this.model.get('width') + 'px',
                    height: this.model.get('height') + 'px'
                });

        },

        setPosition: function ()
        {

            var position = this.model.get('position');

            this.$el.css({
                left: position.x,
                top: position.y
            });

        },

        setColor: function()
        {
            this.$el.css('background-color', this.model.get('color'));
        },

        move: function()
        {
          this.$el.css('left', this.$el.position().left + 10);
        }

    });

    var models = [
        new Rectangle({
            width: 100,
            height: 60,
            position:
            {
                x: 300,
                y: 150
            },
            color: '#09abc1'
        }),
        new Rectangle({
            width: 180,
            height: 52,
            position:
            {
                x: 200,
                y: 300
            },
            color: '#343312'
        }),
        new Rectangle({
            width: 300,
            height: 450,
            position:
            {
                x: 500,
                y: 15
            },
            color: '#475433'
        })
    ];

    _(models).each(function(model) {

        $('div#canvas').append(new RectangleView({ model: model }).render().el);

    });

    //var myView = new RectangleView({ model: myRectangle });

    //$('div#canvas').append(myView.render().el)

});