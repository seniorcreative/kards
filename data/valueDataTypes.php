<?php

header('Content-Type: application/json');

$json = (object) [
    'unknown' => 1,
    'boolean' => 2,
    'integer' => 3,
    'float' => 4,
    'scalar' => 5,
    'string' => 6,
    'temporal' => 7,
    'increase' => 8,
    'decrease' => 9,
    'no change' => 10,
    'ehr data point' => 11,
    'range' => 12,
    'high' => 13,
    'low' => 14,
    'none of the above' => 15
];


echo json_encode($json);

?>