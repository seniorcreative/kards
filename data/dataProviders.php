<?php

header('Content-Type: application/json');

$json = (object) [
    'questionTypes' => [
        (object) ['id' => 2, 'label' => 'Multiple choice'],
        (object) ['id' => 1, 'label' => 'True or False'],
        (object) ['id' => 3, 'label' => 'Numeric']
    ],
    'questionVariableTypes' => [
        (object) ['id' => 1, 'label' => 'Medical constant'],
        (object) ['id' => 2, 'label' => 'Constant'],
        (object) ['id' => 3, 'label' => 'Variable'],
        (object) ['id' => 4, 'label' => 'Timed variable']
    ],
    'valueDataTypes' => [
//        'unknown' => 1,
        'true or false' => 2,
        'number' => 3,
//        'float' => 4,
        'date' => 5,
//        'string' => 6,
//        'temporal' => 7,
//        'increase' => 8,
//        'decrease' => 9,
//        'no change' => 10,
//        'ehr data point' => 11,
//        'range' => 12,
//        'high' => 13,
//        'low' => 14,
//        'none of the above' => 15,
        'years' => 16,
//        'months' => 17,
//        'days' => 18,
//        'hours' => 19,
//        'minutes' => 20
    ],
    'valueDataTypesDropdown' => [
//        (object) ['id' => 1, 'label' => 'unknown'],
        (object) ['id' => 2, 'label' => 'true or false'],
        (object) ['id' => 3, 'label' => 'number'],
//        (object) ['id' => 4, 'label' => 'decimal number'],
        (object) ['id' => 5, 'label' => 'date'],
//        (object) ['id' => 6, 'label' => 'word or letter'],
//        (object) ['id' => 8, 'label' => 'increase'],
//        (object) ['id' => 9, 'label' => 'decrease'],
//        (object) ['id' => 10, 'label' => 'no change'],
//        (object) ['id' => 11, 'label' => 'ehr data point'],
//        (object) ['id' => 12, 'label' => 'range'],
//        (object) ['id' => 13, 'label' => 'high'],
//        (object) ['id' => 14, 'label' => 'low'],
//        (object) ['id' => 15, 'label' => 'none of the above'],
        (object) ['id' => 16, 'label' => 'years'],
//        (object) ['id' => 17, 'label' => 'months'],
//        (object) ['id' => 18, 'label' => 'days'],
//        (object) ['id' => 19, 'label' => 'hours'],
//        (object) ['id' => 20, 'label' => 'minutes']
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
    ],
    'logicOperatorPrefix' =>
    [
        (object) ['id' => '1','data-symbol' => 'IF','label' => 'IF', 'data-type' => '2'],
        (object) ['id' => '2','data-symbol' => '&&','label' => 'AND', 'data-type' => '2'],
        (object) ['id' => '3','data-symbol' => '||','label' => 'OR', 'data-type' => '2'],
//        (object) ['id' => '19','data-symbol' => 'ELSE','label' => 'ELSE', 'data-type' => '2'],
        (object) ['id' => '27','data-symbol' => 'ELSE IF','label' => 'ELSE IF', 'data-type' => '2']
    ],
    'endPointTypes' =>
    [
        (object) ['id' => '1','label' => 'content display'],
        (object) ['id' => '2','label' => 'question goto'],
        (object) ['id' => '3','label' => 'answer add'],
        (object) ['id' => '4','label' => 'logic add'],
        (object) ['id' => '5','label' => 'section goto'],
        (object) ['id' => '6','label' => 'outcome add'],
        (object) ['id' => '7','label' => 'system event'],
        (object) ['id' => '8','label' => 'report conclude']
    ],
    'logicOperatorNormal' =>
    [
        (object) ['id' => '12','data-symbol' => '==','label' => 'IS EQUAL TO', 'data-type' => '1'],
        (object) ['id' => '27','data-symbol' => 'valueof([VALUES])','label' => 'VALUE OF', 'data-type' => '1'],
        (object) ['id' => '13','data-symbol' => '!=','label' => 'IS NOT EQUAL TO', 'data-type' => '1'],
        (object) ['id' => '4','data-symbol' => '<','label' => 'IS LESS THAN', 'data-type' => '1'],
        (object) ['id' => '5','data-symbol' => '<=','label' => 'IS LESS THAN OR EQUAL TO', 'data-type' => '1'],
        (object) ['id' => '6','data-symbol' => '>','label' => 'IS GREATER THAN', 'data-type' => '1'],
        (object) ['id' => '7','data-symbol' => '>=','label' => 'IS GREATER THAN OR EQUAL TO', 'data-type' => '1'],
        (object) ['id' => '8','data-symbol' => '+','label' => 'PLUS', 'data-type' => '1'],
        (object) ['id' => '9','data-symbol' => '-','label' => 'MINUS', 'data-type' => '1'],
        (object) ['id' => '10','data-symbol' => '*','label' => 'MULTIPLIED BY', 'data-type' => '1'],
        (object) ['id' => '11','data-symbol' => '/','label' => 'DIVIDED BY', 'data-type' => '1'],
//        (object) ['id' => '14','data-symbol' => 'sum([VALUES])','label' => 'SUM', 'data-type' => '1'],
//        (object) ['id' => '15','data-symbol' => 'mean([VALUES])','label' => 'MEAN', 'data-type' => '1'],
//        (object) ['id' => '16','data-symbol' => 'mode([VALUES])','label' => 'MODE', 'data-type' => '1'],
//        (object) ['id' => '17','data-symbol' => 'median([VALUES])','label' => 'MEDIAN', 'data-type' => '1'],
//        (object) ['id' => '18','data-symbol' => 'sd([VALUES])','label' => 'STANDARD DEVIATION', 'data-type' => '1'],
//        (object) ['id' => '20','data-symbol' => 'range([VALUES])','label' => 'RANGE', 'data-type' => '1'],
//        (object) ['id' => '25','data-symbol' => 'contains([VALUES])','label' => 'CONTAINS', 'data-type' => '1'],
//        (object) ['id' => '26','data-symbol' => '!contains([VALUES])','label' => 'DOES NOT CONTAIN', 'data-type' => '1'],
//        (object) ['id' => '27','data-symbol' => 'ELSE IF','label' => 'ELSE IF', 'data-type' => '1'],
        (object) ['id' => '29','data-symbol' => '&&','label' => 'AND', 'data-type' => '1'],
        (object) ['id' => '30','data-symbol' => '||','label' => 'OR', 'data-type' => '1']
    ]
];

echo json_encode($json);

?>