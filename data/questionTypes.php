<?php

header('Content-Type: application/json');

$json = (object) ['questionTypes' => [
    (object) ['id' => 1, 'label' => 'Boolean'],
    (object) ['id' => 2, 'label' => 'Multiple choice'],
    (object) ['id' => 3, 'label' => 'Numeric']
    ]
];


echo json_encode($json);

?>