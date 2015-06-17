<?php

header('Content-Type: application/json');


$json = (object) ['valueDataTypes' => [
    (object) ['id' => 1, 'label' => 'unknown'],
    (object) ['id' => 2, 'label' => 'boolean'],
    (object) ['id' => 3, 'label' => 'integer'],
    (object) ['id' => 4, 'label' => 'float'],
    (object) ['id' => 5, 'label' => 'scalar'],
    (object) ['id' => 6, 'label' => 'string'],
    (object) ['id' => 7, 'label' => 'temporal'],
    (object) ['id' => 8, 'label' => 'increase'],
    (object) ['id' => 9, 'label' => 'decrease'],
    (object) ['id' => 10, 'label' => 'no change'],
    (object) ['id' => 11, 'label' => 'ehr data point'],
    (object) ['id' => 12, 'label' => 'range'],
    (object) ['id' => 13, 'label' => 'high'],
    (object) ['id' => 14, 'label' => 'low'],
    (object) ['id' => 15, 'label' => 'none of the above']
]
];

echo json_encode($json);

?>