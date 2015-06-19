<?php

header('Content-Type: application/json');

$json = (object) ['questionVariableTypes' => [
    (object) ['id' => 1, 'label' => 'Medical constant'],
    (object) ['id' => 2, 'label' => 'Constant'],
    (object) ['id' => 3, 'label' => 'Variable'],
    (object) ['id' => 4, 'label' => 'Timed variable']
    ]
];

echo json_encode($json);

?>