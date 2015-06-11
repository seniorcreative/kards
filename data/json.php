<?php

header('Content-Type: application/json');

/*echo '{
    "cells": [
    {
        "type": "devs.Model",
        "size": {
            "width": 575,
            "height": 300
        },
        "inPorts": ["logic-in1"],
        "outPorts": ["logic-out1"],
        "position": {
            "x": 75,
            "y": 50
        },
        "angle": 0,
        "id": "4ebfb66d-de7b-43d5-821d-51cc6acca4d6",
        "z": 1,
        "embeds": ["e370cf54-e0a3-4dce-8dd5-8363cf201bef", "5446778f-8064-4e3b-b461-48b95241d4d3", "4c04aac2-dea6-47bf-8f7e-e11e35ebc0f5", "2c42cde9-445a-435a-b4cd-305712711c4f"],
        "attrs": {
            ".label": {
                "text": "Question logic",
                "ref-x": 0.1,
                "ref-y": 0.05,
                "font-size": "8px"
            },
            "rect": {
                "fill": "rgba(255,255,255,0)",
                "stroke-width": 2,
                "stroke": "rgb(0,0,0)",
                "stroke-dasharray": "5,5",
                "rx": 5,
                "ry": 10
            },
            ".inPorts circle": {
                "fill": "white"
            },
            ".outPorts circle": {
                "fill": "white"
            },
            ".inPorts>.port0>.port-label": {
                "text": "logic-in1"
            },
            ".inPorts>.port0>.port-body": {
                "port": {
                    "id": "logic-in1",
                    "type": "in"
                }
            },
            ".inPorts>.port0": {
                "ref": ".body",
                "ref-y": 0.5
            },
            ".outPorts>.port0>.port-label": {
                "text": "logic-out1"
            },
            ".outPorts>.port0>.port-body": {
                "port": {
                    "id": "logic-out1",
                    "type": "out"
                }
            },
            ".outPorts>.port0": {
                "ref": ".body",
                "ref-y": 0.5,
                "ref-dx": 0
            }
        }
    },
    {
        "type": "basic.Rect",
        "position": {
            "x": 300,
            "y": 100
        },
        "size": {
            "width": 120,
            "height": 60
        },
        "angle": 0,
        "id": "e370cf54-e0a3-4dce-8dd5-8363cf201bef",
        "z": 2,
        "parent": "4ebfb66d-de7b-43d5-821d-51cc6acca4d6",
        "attrs": {
            "rect": {
                "fill": "white",
                "stroke": "rgb(0,0,0)",
                "stroke-width": 2,
                "rx": 4,
                "ry": 4
            },
            "text": {
                "text": "my box"
            }
        }
    }, {
        "type": "basic.Rect",
        "position": {
            "x": 100,
            "y": 200
        },
        "size": {
            "width": 120,
            "height": 60
        },
        "angle": 0,
        "id": "5446778f-8064-4e3b-b461-48b95241d4d3",
        "embeds": "",
        "z": 3,
        "parent": "4ebfb66d-de7b-43d5-821d-51cc6acca4d6",
        "attrs": {
            "rect": {
                "fill": "white",
                "stroke": "rgb(0,0,0)",
                "stroke-width": 2,
                "rx": 4,
                "ry": 4
            },
            "text": {
                "text": "my first box"
            }
        }
    }, {
        "type": "basic.Rect",
        "position": {
            "x": 300,
            "y": 200
        },
        "size": {
            "width": 120,
            "height": 60
        },
        "angle": 0,
        "id": "4c04aac2-dea6-47bf-8f7e-e11e35ebc0f5",
        "embeds": "",
        "z": 4,
        "parent": "4ebfb66d-de7b-43d5-821d-51cc6acca4d6",
        "attrs": {
            "rect": {
                "fill": "white",
                "stroke": "rgb(0,0,0)",
                "stroke-width": 2,
                "rx": 4,
                "ry": 4
            },
            "text": {
                "text": "my second box"
            }
        }
    }, {
        "type": "basic.Rect",
        "position": {
            "x": 500,
            "y": 200
        },
        "size": {
            "width": 120,
            "height": 60
        },
        "angle": 0,
        "id": "2c42cde9-445a-435a-b4cd-305712711c4f",
        "embeds": "",
        "z": 5,
        "parent": "4ebfb66d-de7b-43d5-821d-51cc6acca4d6",
        "attrs": {
            "rect": {
                "fill": "white",
                "stroke": "rgb(0,0,0)",
                "stroke-width": 2,
                "rx": 4,
                "ry": 4
            },
            "text": {
                "text": "my box"
            }
        }
    }, {
        "type": "link",
        "source": {
            "id": "e370cf54-e0a3-4dce-8dd5-8363cf201bef"
        },
        "target": {
            "id": "5446778f-8064-4e3b-b461-48b95241d4d3"
        },
        "id": "8e49825a-736f-49ee-9776-58a9da06d069",
        "z": 6,
        "attrs": {}
    }, {
        "type": "link",
        "source": {
            "id": "e370cf54-e0a3-4dce-8dd5-8363cf201bef"
        },
        "target": {
            "id": "4c04aac2-dea6-47bf-8f7e-e11e35ebc0f5"
        },
        "id": "dd548036-f563-4294-8aa1-6e54bbbed545",
        "z": 7,
        "attrs": {}
    }, {
        "type": "link",
        "source": {
            "id": "e370cf54-e0a3-4dce-8dd5-8363cf201bef"
        },
        "target": {
            "id": "2c42cde9-445a-435a-b4cd-305712711c4f"
        },
        "id": "92b26211-c945-4ee4-a3a9-8a5c06252c36",
        "z": 8,
        "attrs": {}
    }]
}';*/

echo '{
    "cells": [{
        "type": "devs.Model",
        "size": {
            "width": 575,
            "height": 300
        },
        "inPorts": ["logic-in1"],
        "outPorts": ["logic-out1"],
        "position": {
            "x": 413,
            "y": 68
        },
        "angle": 0,
        "id": "4ebfb66d-de7b-43d5-821d-51cc6acca4d6",
        "z": 1,
        "embeds": ["e370cf54-e0a3-4dce-8dd5-8363cf201bef", "5446778f-8064-4e3b-b461-48b95241d4d3", "4c04aac2-dea6-47bf-8f7e-e11e35ebc0f5"],
        "attrs": {
            ".label": {
                "text": "Question logic",
                "ref-x": 0.1,
                "ref-y": 0.05,
                "font-size": "8px"
            },
            "rect": {
                "fill": "rgba(255,255,255,0)",
                "stroke-width": 2,
                "stroke": "rgb(0,0,0)",
                "stroke-dasharray": "5,5",
                "rx": 5,
                "ry": 10
            },
            ".inPorts circle": {
                "fill": "white"
            },
            ".outPorts circle": {
                "fill": "white"
            },
            ".inPorts>.port0>.port-label": {
                "text": "logic-in1"
            },
            ".inPorts>.port0>.port-body": {
                "port": {
                    "id": "logic-in1",
                    "type": "in"
                }
            },
            ".inPorts>.port0": {
                "ref": ".body",
                "ref-y": 0.5
            },
            ".outPorts>.port0>.port-label": {
                "text": "logic-out1"
            },
            ".outPorts>.port0>.port-body": {
                "port": {
                    "id": "logic-out1",
                    "type": "out"
                }
            },
            ".outPorts>.port0": {
                "ref": ".body",
                "ref-y": 0.5,
                "ref-dx": 0
            }
        }
    }, {
        "type": "basic.Rect",
        "position": {
            "x": 638,
            "y": 118
        },
        "size": {
            "width": 120,
            "height": 60
        },
        "angle": 0,
        "id": "e370cf54-e0a3-4dce-8dd5-8363cf201bef",
        "z": 2,
        "parent": "4ebfb66d-de7b-43d5-821d-51cc6acca4d6",
        "attrs": {
            "rect": {
                "fill": "white",
                "stroke": "rgb(0,0,0)",
                "stroke-width": 2,
                "rx": 4,
                "ry": 4
            },
            "text": {
                "text": "Question 1"
            }
        }
    }, {
        "type": "basic.Rect",
        "position": {
            "x": 492,
            "y": 226
        },
        "size": {
            "width": 120,
            "height": 60
        },
        "angle": 0,
        "id": "5446778f-8064-4e3b-b461-48b95241d4d3",
        "embeds": "",
        "z": 3,
        "parent": "4ebfb66d-de7b-43d5-821d-51cc6acca4d6",
        "attrs": {
            "rect": {
                "fill": "white",
                "stroke": "rgb(0,0,0)",
                "stroke-width": 2,
                "rx": 4,
                "ry": 4
            },
            "text": {
                "text": "True"
            }
        }
    }, {
        "type": "basic.Rect",
        "position": {
            "x": 778,
            "y": 224
        },
        "size": {
            "width": 120,
            "height": 60
        },
        "angle": 0,
        "id": "4c04aac2-dea6-47bf-8f7e-e11e35ebc0f5",
        "embeds": "",
        "z": 4,
        "parent": "4ebfb66d-de7b-43d5-821d-51cc6acca4d6",
        "attrs": {
            "rect": {
                "fill": "white",
                "stroke": "rgb(0,0,0)",
                "stroke-width": 2,
                "rx": 4,
                "ry": 4
            },
            "text": {
                "text": "False"
            }
        }
    }, {
        "type": "link",
        "smooth": true,
        "source": {
            "id": "e370cf54-e0a3-4dce-8dd5-8363cf201bef"
        },
        "target": {
            "id": "5446778f-8064-4e3b-b461-48b95241d4d3"
        },
        "id": "8e49825a-736f-49ee-9776-58a9da06d069",
        "z": 6,
        "attrs": {}
    }, {
        "type": "link",
        "smooth": true,
        "source": {
            "id": "e370cf54-e0a3-4dce-8dd5-8363cf201bef"
        },
        "target": {
            "id": "4c04aac2-dea6-47bf-8f7e-e11e35ebc0f5"
        },
        "id": "dd548036-f563-4294-8aa1-6e54bbbed545",
        "z": 7,
        "attrs": {}
    }]
}';

?>