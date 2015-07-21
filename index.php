<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width,initial-scale=1">

  <title>Kards v1</title>

  <link href='http://fonts.googleapis.com/css?family=Varela+Round' rel='stylesheet' type='text/css'>

  <!-- Application styles. -->
  <!-- build:[href] /styles.min.css -->
  <!--<link rel="stylesheet" href="app/styles/index.css">-->
  <link rel="stylesheet" href="app/styles/kards.css">
  <link rel="stylesheet" href="bower_components/jointjs/dist/joint.min.css">
  <!-- /build -->

</head>

<body>
  <!-- Application container. -->
  <main role="main" id="main">


      <div id="canvas"><!-- Kards elements main paper --></div>
      <div id="navigator visuallyhidden"><!-- Kards navigation scaled down paper --></div>

      <!--// Controls for paper scale and grid scale etc.-->

      <header>
          <label class="testMode" for="testCheckBox">
              <input type="checkbox" id="testCheckBox" value="">Tick to use testing mode</label>
          <h1 id="reportName"></h1>
          <h2>KARDS</h2>
      </header>

      <form method="" action="" class="formReportOptions">

          <h3>Report</h3>

          <input type="text" class="reportTitle" id="reportTitle" placeholder="Enter report name">

          <label for="reportCategory">Report category</label>
          <select id="reportCategory" name="reportCategory" size="1">
              <option value="1">Women's Health</option>
              <option value="2">Fertility</option>
          </select>

          <div class="form-controls  form-controls--width-full  hidden" >
              <button type="button" id="btnAddReport" class="button-add">Add report</button>
          </div>

          <div class="form-controls  form-controls--width-full" >
              <button type="button" id="btnSaveReport" class="button-add  hidden">Save report</button>
          </div>


          <div class="form-controls  form-controls--width-full" >
              <label for="reportJSON">Load a saved report</label>
              <select id="reportJSON" name="reportJSON" size="1">
                  <option value="">Select a report to load</option>
                  <?php

                if ($handle = opendir('data/charts')) {
//                    echo "Directory handle: $handle\n";
//                    echo "Entries:\n";

                    /* This is the correct way to loop over the directory. */
                    while (false !== ($entry = readdir($handle))  )  {

                        if ($entry != '.' && $entry != '..') {
                            echo "<option value='charts/" . $entry . "'>" . $entry . "</option>\n";
                        }

                    }

                    closedir($handle);
                }
                ?>
              </select>
          </div>

          <div class="form-controls  form-controls--width-full" >
              <label id="reportTimeSaved" class="timeLabel" ></label>
          </div>

      </form>

      <form method="" action="" class="formSectionOptions  _faded">

          <h3>Add Section</h3>

          <input type="text" class="sectionTitle" id="sectionTitle" placeholder="Enter section name">

          <!--<label for="sectionID">Select a section</label>-->
          <!--<select id="sectionID" name="sectionID" size="1">-->
              <!--<option value="">Select a section</option>-->
              <!--<option value="1">Section 1</option>-->
              <!--<option value="2">Section 2</option>-->
              <!--<option value="3">Section 3</option>-->
          <!--</select>-->

          <div class="form-controls  form-controls--width-full" >
              <button type="button" id="btnAddSection" class="button-add">Add section</button>
          </div>

      </form>


      <form method="" action="" class="formQuestionOptions  faded">

          <!--<h2>Questions</h2>-->

          <!--<p>Add a new question</p>-->
          <!--<button type="button" class="" id="btnNewQuestion">New question</button>-->

          <h3>Add Question</h3>

          <div class="form-controls  form-controls--width-full  hidden">
              <label for="search-field-question">Search (autocomplete)</label>
              <select id="searchFilterQuestion" name="searchFilterQuestion">
                  <option value="">Filter by...</option>
              </select>
              <input id="search-field-question" name="search-field-question" value="" placeholder="Search questions">
              <nav class="autocomplete-dropdown-nav  hidden">
                  <div class="autocomplete-dropdown-nav__options  js-autocomplete--list  __height-constrain--100px">
                      <ul class="autocomplete-dropdown-nav__options__list"></ul>
                  </div>
              </nav>
          </div>

          <div class="form-controls  form-controls--width-full">

              <div id="questionVariableTypeTemplate"><!-- Template will be written here --></div>

          </div>

          <div class="form-controls  form-controls--width-full">

              <div id="questionTypeTemplate"><!-- Template will be written here --></div>

          </div>

          <div id="questionControlsMultiple" class="form-controls-dynamic">

              <div class="form-controls  form-controls--width-full">
                  <label for="questionNumAnswers">Number of answers</label>
                  <input type="number" value="1" min="1" id="questionNumAnswers" name="questionNumAnswers"  >
              </div>

              <div class="form-controls  form-controls--width-full">
                  <label for="questionNumStep">Answer value - numeric step</label>
                  <input type="number" value="1" id="questionNumStep" name="questionNumStep"  >
              </div>

              <div class="form-controls  form-controls--width-full">
                  <label for="questionChoicesAccepted">Number of accepted answers</label>
                  <input type="number" value="1" min="1" id="questionChoicesAccepted" name="questionChoicesAccepted"  >
              </div>

          </div>

          <div class="form-controls  form-controls--width-full">

              <label for="questionDataPoint">Data point</label>
              <select class="" id="questionDataPoint" name="questionDataPoint" size="4">
                  <!-- populate this with data service (or work out nested handlebars templates .hbs looping) -->
                  <option value="">None</option>
                  <optgroup label="EHR Data">
                      <option value="1">Age</option>
                      <option value="2">Gender</option>
                      <option value="3">Smoker</option>
                  </optgroup>
              </select>

          </div>

          <div class="form-controls  form-controls--width-full">
              <label for="questionUnknownAnswerAllowed"><input type="checkbox" value="" name="questionUnknownAnswerAllowed" id="questionUnknownAnswerAllowed">Include 'unknown' answer</label>
          </div>


          <div class="form-controls  form-controls--width-full">
              <label for="questionValue">Question text</label>
              <textarea id="questionValue" name="questionValue" rows="5"></textarea>
          </div>

          <div class="form-controls  form-controls--width-full" >

              <div class="form-controls  form-controls--width-full" >
                  <button type="button" id="btnQuestionAdd" name="btnQuestionAdd" class="button-add">Add question</button>
              </div>
              <div class="form-controls  form-controls--width-full" >
                  <button type="button" id="btnAddAnswer" class="button-add  hidden">Add answer to question</button>
              </div>
              <div class="form-controls  form-controls--width-full" >
                  <button type="button" id="btnShowLogic" class="button-add  hidden">Show logic</button>
              </div>
              <div class="form-controls  form-controls--width-full" >
                  <button type="button" id="btnDeleteQuestion" class="button-add  hidden">Delete</button>
              </div>
              <!--<button type="button" id="btnLogGraph" class="button-add">Console log graph</button>-->
          </div>

      </form>




      <div class="formPanelControls">
          <h3>Display settings</h3>

          <div class="panel panel-primary">
              <!--<div class="panel-heading"><a href="/api#joint.dia.Paper:options">Attributes</a></div>-->
              <div class="panel-body">
                  <div class="row">
                      <div class="form-group">
                          <label for="ox" data-tooltip="Position of zero x-coordinate of the paper in pixels">Origin x</label>
                          <input id="ox" name="ox" type="range" value="0" min="-3000" max="3000" autocomplete="off">
                          <output for="ox"></output>
                      </div>
                      <div class="form-group">
                          <label for="oy" data-tooltip="Position of zero y-coordinate of the paper in pixels">Origin y</label>
                          <input id="oy" type="range" value="0" min="-3000" max="3000" autocomplete="off">
                          <output for="oy"></output>
                      </div>
                      <div class="form-group">
                          <label for="sx" data-tooltip="Scale factor">Scale</label>
                          <input id="sx" type="range" value="1.00" step="0.1" min="0.1" max="3" autocomplete="off">
                          <output for="sx"></output>
                      </div>
                      <div class="form-group  visuallyhidden">
                          <label for="sy" data-tooltip="Scale factor for y axis">Scale y</label>
                          <input id="sy" type="range" value="1.00" step="0.1" min="0.1" max="3" autocomplete="off">
                          <output for="sy"></output>
                      </div>
                      <div class="form-group  ">
                          <label for="width" data-tooltip="Width of the paper in pixels">Width</label>
                          <input id="width" class="form-control" type="range" value="2400" min="1200" max="6000" autocomplete="off">
                          <output for="width"></output>
                      </div>
                      <div class="form-group  ">
                          <label for="height" data-tooltip="Height of the paper in pixels">Height</label>
                          <input id="height" class="form-control" type="range" value="2400" min="1200" max="6000" autocomplete="off">
                          <output for="height"></output>
                      </div>
                      <div class="form-group">
                          <label for="grid" data-tooltip="Size of the grid in pixels">Grid size</label>
                          <input id="grid" class="range" type="range" value="1" min="1" max="50" autocomplete="off">
                          <output for="grid">1</output>
                      </div>
                  </div>
              </div>
          </div>

          <div class="panel  visuallyhidden  panel-primary">
              <!--<div class="panel-heading"><a href="/api#joint.dia.Paper:getContentBBox">Content bounding box</a></div>-->
              <div class="panel-body">
                  <label for="bbox-x">x</label>
                  <span class="output" id="bbox-x">100</span>
                  <label for="bbox-y">y</label>
                  <span class="output" id="bbox-y">50</span>
                  <label for="bbox-width">width</label>
                  <span class="output" id="bbox-width">475</span>
                  <label for="bbox-height">height</label>
                  <span class="output" id="bbox-height">290</span>
              </div>
          </div>
      </div>




      <form method="" action="" class="formAnswerOptions  faded">

          <h3>Answer</h3>

          <div class="form-controls  form-controls--width-full  hidden">
              <label for="search-field-answer">Search (autocomplete)</label>
              <select id="searchFilterAnswer" name="searchFilterAnswer">
                  <option value="">Filter by...</option>
              </select>
              <input id="search-field-answer" name="search-field-answer" value="" placeholder="Search answers">
              <nav class="autocomplete-dropdown-nav  hidden">
                  <div class="autocomplete-dropdown-nav__options  js-autocomplete--list  __height-constrain--100px">
                      <ul class="autocomplete-dropdown-nav__options__list"></ul>
                  </div>
              </nav>
          </div>

          <div class="form-controls  form-controls--width-full">

              <div id="valueDataTypeTemplate"><!-- Template will be written here --></div>

          </div>

          <div class="form-controls  form-controls--width-full">
              <label for="answerDataPoint">CMS Condition / Symptom</label>
              <select class="" id="answerDataPoint" name="answerDataPoint" size="4">
                  <!-- populate this with data service (or work out nested handlebars templates .hbs looping) -->
                  <optgroup label="HRT Options">
                      <option value="1">E2</option>
                      <option value="2">E2 + P</option>
                      <option value="3">COC</option>
                      <option value="4">Tibolone</option>
                  </optgroup>
                  <optgroup label="Menopausal Symptoms">
                      <option value="5">Vasomotor</option>
                      <option value="6">Neuromuscular</option>
                      <option value="7">Urogenital</option>
                      <option value="8">Psychogenic</option>
                  </optgroup>
              </select>
          </div>

          <div class="form-controls  form-controls--width-full">
              <label for="answerInputNeeded">Dynamic input needed (start empty)</label>
              <input type="checkbox" id="answerInputNeeded" name="answerInputNeeded" >
          </div>

          <div class="form-controls  form-controls--width-full">
              <label for="answerValue">Answer value 1</label>
              <input type="text" id="answerValue" name="answerValue">
          </div>

          <div class="form-controls  form-controls--width-full">
              <label for="answerValue2">Answer value 2 (for range)</label>
              <input type="text" id="answerValue2" name="answerValue2">
          </div>
          <div class="form-controls  form-controls--width-full">
              <label for="answerLabel">Answer text</label>
              <textarea id="answerLabel" name="answerLabel" rows="3"></textarea>
          </div>

          <!--<div class="form-controls  form-controls--width-full" >
            <button type="button" id="btnAddLogicOutPoint" class="button-add">Add logic out point</button>
          </div>-->

          <div class="form-controls  form-controls--width-full">
                <label>Answer logic rules</label>
                <div id="answerLogicRules"></div>
          </div>

      </form>



        <!-- A basic modal html can live here even though covers the whole page. -->

        <!-- modal content -->
      <div class="simplemodal-container">
          <div id="logic-modal">

              <h3>Logic</h3>


              <div id="logic-rules">

                  <!--// Template please-->

              </div>

              <div class="logic-header-buttons">
                  <button type="button" data-action="logicRule" id="logic-header-button-add-rule">Add Rule</button>
                  <button type="button" class="_btnDisabled" data-action="logicAction" id="logic-header-button-add-action" _disabled="disabled">Add Action</button>
              </div>

          </div>

          <!-- preload the images -->
          <div style='display:none'>
              <img src='img/basic/close.png' alt='' />
          </div>
      </div>

      <!-- modal content -->
      <div class="simplemodal-container">
          <div id="individualisation-modal">

              <h3>Individualisation</h3>
<!--              <a href="#" id="btnIndividualisationClose"><img src='img/basic/close.png' width="16" height="16" alt=''></a>-->

              <div id="individualisation-output">


              </div>


              <div class="form-controls  form-controls--width-full" >
                  <button type="button" id="btnResetContentStream" class="">Send to Watson</button>
              </div>

          </div>
      </div>



      <form method="" action="" class="formContentOptions  _faded">

          <h3>Add Content</h3>
          <a href="#" id="btnContentControlsClose"><img src='img/basic/close.png' width="16" height="16" alt=''></a>

          <div class="form-controls  form-controls--width-full  hidden">
              <label for="search-field-content">Search (autocomplete)</label>
              <select id="searchFilterContent" name="searchFilterContent">
                  <option value="">Filter by...</option>
                  <option value="">Report header</option>
                  <option value="">Text</option>
                  <option value="">Image</option>
                  <option value="">Video</option>
              </select>
              <input id="search-field-content" name="search-field-content" value="" placeholder="Search content">
              <nav class="autocomplete-dropdown-nav  hidden">
                  <div class="autocomplete-dropdown-nav__options  js-autocomplete--list  __height-constrain--100px">
                      <ul class="autocomplete-dropdown-nav__options__list"></ul>
                  </div>
              </nav>
          </div>


          <div class="form-controls  form-controls--width-full">

              <div id="cmsContentCategoryTemplate"  class="form-controls--inline-left"><!-- Template will be written here --></div>
              <div id="cmsContentTypeTemplate" class="form-controls--inline-left"><!-- Template will be written here --></div>

          </div>


          <div class="form-controls  form-controls--width-full">
              <label for="contentNumber">Content number</label>
              <input type="number" value="" id="contentNumber">
          </div>

          <div class="form-controls  form-controls--width-full">
              <label for="contentText">Content text</label>
              <textarea id="contentText" name="contentText" rows="12"></textarea>
          </div>


          <div class="form-controls  form-controls--width-full" >
              <button type="button" id="btnAddContent" class="button-add">Add content</button>
          </div>

          <div class="form-controls  form-controls--width-full" >
              <button type="button" id="btnDeleteContent" class="button-add  hidden">Delete</button>
          </div>

      </form>



      <form method="" action="" class="formAnswerInputOptions  faded">

          <h3>Answer input required</h3>

          <div id="answerInputControls-date" class="form-controls  form-controls--width-full  form-controls--toggle  hidden">
              <label for="answerInput-date">Date</label>
              <input type="date" value="" data-type="5" name="answerInput-date" id="answerInput-date"   >
          </div>

          <div id="answerInputControls-string" class="form-controls  form-controls--width-full  form-controls--toggle  hidden">
              <label for="answerInput-string">Word or letter</label>
              <input type="text" value="" data-type="6" name="answerInput-string" id="answerInput-string" placeholder="Enter a word or letter">
          </div>

          <div id="answerInputControls-number" class="form-controls  form-controls--width-full  form-controls--toggle  hidden">
              <label for="answerInput-number">Number</label>
              <input type="number" value="" data-type="3" name="answerInput-number" id="answerInput-number" placeholder="Enter a number">
          </div>

          <div id="answerInputControls-checkbox" class="form-controls  form-controls--width-full  form-controls--toggle  hidden">
              <label for="answerInput-checkbox">
                  <input type="checkbox" value="" data-type="2" name="answerInput-checkbox" id="answerInput-checkbox">
                  Selected
              </label>
          </div>

          <div class="form-controls  form-controls--width-full  hidden" >
              <button type="button" id="btnAnswerInputConfirm" class="button-add">Confirm answer</button>
          </div>

      </form>


      
      <form method="" action="" class="formEndPointOptions  _faded">

          <h3>Add End Point</h3>

          <div class="form-controls  form-controls--width-full">

              <div id="endPointTypeTemplate"  class="form-controls--inline-left"><!-- Template will be written here --></div>

          </div>

          <div class="form-controls  form-controls--width-full">
              <label for="endPointTitle">End point title</label>
              <textarea id="endPointTitle" name="endPointTitle" rows="4"></textarea>
          </div>


          <div class="form-controls  form-controls--width-full" >
              <button type="button" id="btnAddEndPoint" class="button-add">Add end point</button>
          </div>

      </form>



      <div id="HUD" class="hudControlPanel">

          <a href="#" class="btnBack  hidden">&lt;</a>

          <ul id="content-nodes"></ul>

          <a href="#" class="btnNext  hidden">&gt;</a>

          <h3>Content stream</h3>

          <div class="form-controls  form-controls--width-full" >
              <button type="button" id="btnResetContentStream" class="">Reset</button>
              <button type="button" id="btnShowIndividualisation" class="">Show individualisation</button>
          </div>

      </div>


      <!--<div id="app"></div>-->
  </main>

  <!-- Application source. -->
  <!-- build:[src] /source.min.js -->
  <script type="text/javascript" src="bower_components/lodash/dist/lodash.underscore.js"></script>
  <script src="bower_components/requirejs/require.js" data-main="app/main"></script>
  <!-- /build -->
</body>
</html>
