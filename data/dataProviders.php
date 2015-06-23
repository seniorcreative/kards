<?php

header('Content-Type: application/json');

$json = (object) [
    'questionTypes' => [
        (object) ['id' => 1, 'label' => 'Boolean'],
        (object) ['id' => 2, 'label' => 'Multiple choice'],
        (object) ['id' => 3, 'label' => 'Numeric']
    ],
    'questionVariableTypes' => [
        (object) ['id' => 1, 'label' => 'Medical constant'],
        (object) ['id' => 2, 'label' => 'Constant'],
        (object) ['id' => 3, 'label' => 'Variable'],
        (object) ['id' => 4, 'label' => 'Timed variable']
    ],
    'valueDataTypes' => [
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
    ],
    'valueDataTypesDropdown' => [
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
    ],
    'cmsContentCategories' => [
        (object) ['id' => 1, 'label' => 'what is it (definition)'],
        (object) ['id' => 2, 'label' => 'causes'],
        (object) ['id' => 3, 'label' => 'risk factors'],
        (object) ['id' => 4, 'label' => 'symptoms & signs'],
        (object) ['id' => 5, 'label' => 'methods for diagnosis'],
        (object) ['id' => 6, 'label' => 'treatments'],
        (object) ['id' => 7, 'label' => 'prognosis'],
        (object) ['id' => 8, 'label' => 'prevention']
    ],
    'cmsContentTypes' => [
        (object) ['id' => '1', 'label' => 'report_header'],
        (object) ['id' => 2, 'label' => 'text_content'],
        (object) ['id' => 3, 'label' => 'image'],
        (object) ['id' => 4, 'label' => 'video']
    ]
];

echo json_encode($json);

?>