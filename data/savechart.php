<?php


$filename = strtolower(str_replace(" ", "-", $_POST['reportTitle'])) . ".json";
//$filename = strtolower(str_replace(" ", "-", $_POST['reportTitle'])) . "-" . date("Y-m-d H:i:s") . ".json";

$fp = fopen("charts/" . $filename, 'w');
fwrite($fp, $_POST['chartData']);
fclose($fp);


// Now loop

$options = "<option value=\"\">Select a report to load</option>\n";

if ($handle = opendir('charts/')) {
//                    echo "Directory handle: $handle\n";
//                    echo "Entries:\n";

    /* This is the correct way to loop over the directory. */
    while (false !== ($entry = readdir($handle))  )  {

        if ($entry != '.' && $entry != '..') {
            $options .= "<option value='charts/" . $entry . "'>" . $entry . "</option>\n";
        }

    }

    closedir($handle);
}

$result = (object) array();
$result->success = true;
$result->filename = $filename;
$result->reportTimeSaved = date("Y-m-d H:i:s");
$result->options = $options;

echo json_encode($result);