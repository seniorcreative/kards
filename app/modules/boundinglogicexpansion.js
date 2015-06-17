// Controls

define(
    ['joint'],

function(joint) {


    var init = function(graph, paper) {


        var logicWrapperPadding = 20;

        graph.on('change:size', function(cell, newPosition, opt) {

            if (opt.skipParentHandler) return;

            if (cell.get('embeds') && cell.get('embeds').length) {
                // If we're manipulating a parent element, let's store
                // it's original size to a special property so that
                // we can shrink the parent element back while manipulating
                // its children.
                cell.set('originalSize', cell.get('size'));
            }
        });

        graph.on('change:position', function(cell, newPosition, opt) {

            if (cell.get('embeds') && cell.get('embeds').length) {
                // If we're manipulating a parent element, let's store
                // it's original position to a special property so that
                // we can shrink the parent element back while manipulating
                // its children.
                cell.set('originalPosition', cell.get('position'));
            }

            var parentId = cell.get('parent');
            if (!parentId) return;

            var parent = graph.getCell(parentId);
            var parentBbox = parent.getBBox();

            if (!parent.get('originalPosition')) parent.set('originalPosition', parent.get('position'));
            if (!parent.get('originalSize')) parent.set('originalSize', parent.get('size'));

            var originalPosition = parent.get('originalPosition');
            var originalSize = parent.get('originalSize');

            var newX = originalPosition.x;
            var newY = originalPosition.y;
            var newCornerX = originalPosition.x + originalSize.width;
            var newCornerY = originalPosition.y + originalSize.height;

            //if (parent.get('ktype') != 'question')

            _.each(parent.getEmbeddedCells(), function(child) {


                    var childBbox = child.getBBox();

                    if ((childBbox.x - logicWrapperPadding) < newX) {
                        newX = childBbox.x - logicWrapperPadding;
                    }
                    if ((childBbox.y - logicWrapperPadding) < newY) {
                        newY = childBbox.y - logicWrapperPadding;
                    }
                    if ((childBbox.corner().x + logicWrapperPadding) > newCornerX) {
                        newCornerX = childBbox.corner().x + logicWrapperPadding;
                    }
                    if ((childBbox.corner().y + logicWrapperPadding) > newCornerY) {
                        newCornerY = childBbox.corner().y + logicWrapperPadding;
                    }
            });



            // Note that we also pass a flag so that we know we shouldn't adjust the
            // `originalPosition` and `originalSize` in our handlers as a reaction
            // on the following `set()` call.
            parent.set({
                position: { x: newX, y: newY },
                size: { width: newCornerX - newX, height: newCornerY - newY }
            }, { skipParentHandler: true });
        });

    };

    return {
        init: init
    };


});