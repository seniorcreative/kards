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

          <ul class="headerControls">
              <li>
                  <label for="toggleCheckBox">
                      <input type="checkbox" id="toggleCheckBox" value="" checked="checked">Controls
                  </label>
              </li>
              <li>
                  <label for="testCheckBox">
                      <input type="checkbox" id="testCheckBox" value="">Test
                  </label>
              </li>
              <li style="width: 100px">
                 <a id="btnHelpOverlay" href="">Instructions</a>
              </li>
              <li style="width: 95px">
                 <a id="btnDevOverlay" href="">Developers</a>
              </li>
              <li style="width: 75px">
                 <a id="btnGlossOverlay" href="">Glossary</a>
              </li>
              <li style="width: 70px">
                 <a id="btnTodoOverlay" href="">To do</a>
              </li>
          </ul>

          <h1 id="reportName"></h1>
          <h2>KARDS V1</h2>
      </header>

      <form method="" action="" class="formReportOptions">

          <h3>Report</h3>

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
                <label for="reportTitle">Report name</label>
                <input type="text" class="reportTitle" id="reportTitle" placeholder="Enter report name">
          </div>

          <div class="form-controls  form-controls--width-full" >
              <label for="reportCategory">Report category</label>
              <select id="reportCategory" name="reportCategory" size="1">
                  <option value="1">Women's Health</option>
                  <option value="2">Fertility</option>
              </select>
          </div>

          <!--<div class="form-controls  form-controls--width-full  hidden" >
              <button type="button" id="btnAddReport" class="button-add">Add report</button>
          </div>-->



          <div class="form-controls  form-controls--width-full">
              <label for="reportAutosave" style="float: left">Report auto save</label>
              <input type="checkbox" id="reportAutosave" name="reportAutosave" style="float: right" >
          </div>

          <div class="form-controls  form-controls--width-full" >
              <button type="button" id="btnSaveReport" class="button-add  hidden">Save</button>
          </div>

          <div class="form-controls  form-controls--width-full" >
              <button type="button" id="btnNewReport" class="button-add">New</button>
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

          <div class="form-controls  form-controls--width-full" >
              <button type="button" id="btnDeleteSection" class="button-add  button-delete  hidden">Delete section</button>
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
                  <?php


                  $json = (object) [
                      'EHR Data' => [
                          (object) ['id' => 1, 'label' => 'Age'],
                          (object) ['id' => 2, 'label' => 'Gender'],
                          (object) ['id' => 3, 'label' => 'Smoker']
                      ]
                  ];

                  foreach($json as $key => $val)
                  {


                      echo '<optgroup label="'. $key . '">';

                      foreach($val as $keyOption => $option)
                      {

                          echo '<option value="'. $option->id  .'">'. $option->label .'</option>';

                      }


                      echo '</optgroup>';

                  }

                  ?>
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
              <button type="button" id="btnQuestionAdd" name="btnQuestionAdd" class="button-add">Add question</button>
          </div>

          <div class="form-controls  form-controls--width-full" >
              <button type="button" id="btnShowLogic" class="button-add  hidden">Show logic</button>
          </div>

          <div class="form-controls  form-controls--width-full" >
              <button type="button" id="btnAddAnswer" class="button-add  hidden">Add answer to question</button>
          </div>

          <div class="form-controls  form-controls--width-full" >
              <button type="button" id="btnDeleteQuestion" class="button-add  button-delete  hidden">Delete question</button>
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
                  <?php


                  $json = (object) [
                      'Breast cancer symptoms' => [
                          (object) ['id' => 9, 'label' => 'Breast lump'],
                          (object) ['id' => 10, 'label' => 'Unusual nipple discharge'],
                          (object) ['id' => 11, 'label' => 'Recent changes breast shape']
                      ],
                      'Menopause symptoms' => [
                          (object) ['id' => 5, 'label' => 'Vasomotor'],
                          (object) ['id' => 6, 'label' => 'Neuromuscular'],
                          (object) ['id' => 7, 'label' => 'Urogenital'],
                          (object) ['id' => 8, 'label' => 'Psychogenic']
                      ],
                      'HRT Options' => [
                          (object) ['id' => 1, 'label' => 'E2'],
                          (object) ['id' => 2, 'label' => 'E2 + P'],
                          (object) ['id' => 3, 'label' => 'COC'],
                          (object) ['id' => 4, 'label' => 'Tibolone']
                      ]
                  ];

                  foreach($json as $key => $val)
                  {


                      echo '<optgroup label="'. $key . '">';

                      foreach($val as $keyOption => $option)
                      {

                          echo '<option value="'. $option->id  .'">'. $option->label .'</option>';

                      }


                      echo '</optgroup>';

                  }

                  ?>
              </select>
          </div>

          <div class="form-controls  form-controls--width-full  hidden">
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

          <div class="form-controls  form-controls--width-full">
              <button type="button" id="btnClearAnswerValues" class="button-add">Clear answer values</button>
          </div>

          <div class="form-controls  form-controls--width-full">
              <button type="button" id="btnDeleteAnswer" class="button-add  button-delete">Delete answer</button>
          </div>

          <div class="form-controls  form-controls--width-full">
                <label class="answerLogic">Answer logic rules:</label>
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

      <!-- modal content - individualisation stream -->
      <div class="simplemodal-container">
          <div id="individualisation-modal" class="modal">

              <h3>Individualisation</h3>

              <div id="individualisation-output" class="modal-output"></div>


              <div class="form-controls  form-controls--width-full" >
                  <button type="button" id="btnResetContentStream" class="fullWidth">Feed to Watson</button>
              </div>

          </div>
      </div>

      <!-- modal content - help stream -->
      <div class="simplemodal-container">
          <div id="help-modal" class="modal">

              <h3>KARDS Help & instructions</h3>
              <a href="#" class="btnClose"><img src='img/basic/close.png' width="16" height="16" alt=''></a>

              <div id="help-output" class="modal-output">




                  <h3>Report panel</h3>

                  <p>Selecting an option will load a saved report from the drop down menu in this panel.
                      Whilst making changes, the report will save every 30 seconds if the auto-save option is checked (developer - see /app/views/v_reportControlsView.js)</p>
                  <p>This button is not checked by default.</p>

                  <p>Report category is not being used yet - this is for database connection.</p>

                  <p>Typing the report name will also change the heading on the app page.</p>

                  <p>By default when loading the KARDS app you will receive a default report with today&rsquo;s date and one root section joined to that report.</p>
                  <p>From here you can start adding questions.</p>



                  <h3>Section panel</h3>

                  <p>This is for larger reports where lots of questions need to be divided up into manageable chunks.
                      There is provision for this in the data model for when things are hooked up to the database.
                      Any sections added will need to be up linked to the final out port or out ports of the preceding section.</p>

                  <p>When adding a new section - the section name field will be used as the section name.</p>

                  <p>Click on a section and start typing to change the section name. Or click or paste into the section name field.</p>



                  <h3>Question panel</h3>


                  <p>When adding a new question, by default the question cell shows default question value text, or you can paste one in before adding.</p>

                  <p>The &lsquo;question variable type&rsquo; dropdown is just a placeholder until database is hooked up.</p>

                  <p>Again, question options come from the static data/dataProviders.php. Toggling between true/false (boolean) questions and multiple choice or numeric questions toggles the display of an additional slide down panel with extra options for number of questions, answer numeric step value, and number of accepted answers.</p>

                  <p>If you want a multiple choice question with 3 answers just add 3 to &rsquo;Number of answers&rsquo;.</p>

                  <p>If you want a numeric step question counting up in increments of 5, say 5-10-15-20-25, then do this by entering 5 answers and 5 for numeric step and it will count up for you when it adds the answers.</p>

                  <p>Ticking &lsquo;Include unknown answer&rsquo; will add an additional boolean answer on top of the selected number of answers already requested.</p>

                  <p>This only works when adding in a new question, but to do this after a question has been added is possible by clicking &ldquo;Add answer to question&rdquo;, and then setting up the answer accordingly.</p>

                  <p>&rsquo;Number of accepted answers&rsquo; is not functional yet.</p>

                  <p>&lsquo;Data point&rsquo; is not functional yet, this select input is only listing static options from the data/dataProviders.php JSON output - however this drop down has grouping so will be echoed into the PHP directly, not via Handlebars template like all the other dropdown. I have not yet integrated a good way to do grouped dropdown in Handlebars but I know it is supported.</p>

                  <p>Once a question has been added it will be selected by default. Click on the blue background, off and outside of any boxes and you will deselect any currently highlighted cells.</p>

                  <p>You select a question by clicking on the question cell, or any of its answers, or its &lsquo;logic wrapper&rsquo; box. The logic wrapper box groups the question and all it&rsquo;s answers. When you add logic it is metaphorically added to the logic wrapper. It is the logic wrapper that ends up with one in port and multiple out ports for connecting other cells to in a flowchart.</p>

                  <p>When a question is highlighted you can delete it (be careful of what you have linked it to), as well as add another answer to it. By default, selecting a question will highlight its content text so you can just click on a question and start editing its text without clicking again in the panel&rsquo;s &lsquo;Question text&rsquo; field.</p>

                  <p>Changing a selected question&rsquo;s type after a won&rsquo;t make any difference (at this stage).</p>

                  <p>The question&rsquo;s logic wrapper always has one &lsquo;in port&rsquo; only.</p>


                  <h3>Logic overlay</h3>

                  <p>Logic overlay is quite complicated but is a bit like a calculator. You can add rules which are made up of calculation blocks and then set what they are supposed to satisfy, and then add an action to perform if this rule is satisfied / scenario occurs.</p>

                  <p>Adding actions creates the outport to which we can drag and connect the content, question or end point cells which come next. Only by dropping the in port of a logic or content wrapper or end point do we tell the KARDS system the pathways it can follow next according to the value of answer.</p>

                  <p>You can open the rule and change rules after &ldquo;actions&rdquo; have been added to the logic overlay.</p>


                  <h3>Answer panel</h3>

                  <p>In the answer panel you can set up what the type of answer value is. This is crucial for the logic calculations to take place.</p>

                  <p>Options, and corresponding data-types are:</p>


                  <p>&lsquo;true or false&rsquo; (boolean),<br>
                      number (integer),<br>
                      word or letter (string),<br>
                      date, years (both are converted to date types for date comparisons),<br>
                      and &lsquo;none of the above&rsquo; which is reserved for future use for &lsquo;multiple choice&rsquo; types of questions</p>

                  <p>CMS condition / symptom is reserved for future use - I believe there will be a scenario where not just the question but also the answer will need to be tied to a health record CEHR.</p>

                  <p?Answer value 1 is where the main value of an answer can be set in this panel , before we go into testing mode. This will be pre-generated in some cases. Changing the &lsquo;Value data type&rsquo; of the answer will change what sort of input can be set here and also in the popup &lsquo;Answer input panel&rsquo; in TEST mode for data validity. For example setting to true or false changes the input text field to a checkbox.</div>

              <p>As some single answers may need to represent a range of values or a matrix, there is &lsquo;Answer value 2&rsquo; representing the upper limit of this range. I have not made any flow charts making use of this yet and therefore the logicMachine function creation has not been written.</p>

              <p>&lsquo;Clear answer values&rsquo; clears an answer&rsquo;s stored value. This can also be done for all answers in TEST mode by clicking &lsquo;Reset & clear answers&rsquo;.</p>


              <h4>Answer Logic Rules</h4>

              <p>To help make sense KARDS shows a summary of a selected answer&rsquo;s parent question&rsquo;s logical rule conditions & action outcomes as a &lsquo;pseudo-code&rsquo; statement. This is a very simplified version of what gets generated on the fly by the code to process an answer value and work out which outport to follow.</p>


              <h3>Answer input panel</h3>

              <p>During TEST mode, if the answer to a question is selected and does not have any values stored against it, the Answer input panel will appear.</p>

              <p>When any input is added or changed this will change the selected answer&rsquo;s colour and means it needs to be clicked again to continue onward.</p>

              <p>Clicking off or outside of the Answer input panel is the same as clicking the OK button to enter the value.</p>




              <h3>Content panel</h3>

              <p>Note that the full content shown in the actual panel is cropped and abbreviated where shown in the content cell inside the content wrapper.</p>

              <p>Content wrappers always have one in port and one out port, by default. This is never changed.</p>

              <p>When in TEST mode, representations of content cells will build up in a line in the testing HUD. Selecting these will bring up the content panel so that the content can be edited. This needs to be integrated back into the CMS.</p>



              <h3>End Point panel</h3>

              <p>End points are placeholders which represent the final outcome of a KARDS algorithm question and answer stream.</p>

              <p>The list of &lsquo;end point types&rsquo; comes from data/dataProviders.php and is just placeholder content at time of writing.</p>

              <p>The plan is to eventually integrate end points to the Health& account so that for example following a question and answer session tied to a KARDS algorithm when a particular endpoint is reached we might set up a system alert to go and get a medical check on a particular date, relating to two years after the user&rsquo;s date of birth or a given
                  user date relating to a previous medical event.</p>

              <p>End points always have one in port only by default, as have no ongoing connections.</p>




              <h3>Toggles</h3>

              <h4>Toggle control panels</h4>

              <p>If the panels are getting in the way during the build of a KARDS algorithm then they can be hidden.</p>

              <h4>Toggle testing mode</h4>

              <p>There is a big difference between BUILD mode and TEST mode. Use this tick button to toggle between the two.
                  Only in TEST mode can we click on the answers, input needed parameters for testing if required, and calculate what to do next.</p>





              <h3>Testing heads-up display (HUD)</h3>

              <h4>Reset &amp; clear answers button</h4>
              <h4>Start over button</h4>

              <p>Answering a question - exit testing mode and click &lsquo;clear answer values&rsquo; on a selected answer to reset the stored input for this answer. Upon entering back into testing mode and selecting this answer again.
                  Alternatively, a new "Reset &amp; clear answers" button was added to the Testing HUD which does this in one go. Otherwise just select "Start over" to clear the highlighted selections only and keep user input values.</p>

              <p>Use the "Start over" button if you want to test starting again higher up in a question stream. The system does not limit you to starting at any question or going back to a different question higher up. It does not and should not have the smarts to reset what has been highlighted/selected further down a stream automatically based on what has been clicked so far. Not only is this exceptionally difficult to code - it applies a counterintuitive limit around putting content streams together and testing those.</p>

              <h4>Show individualisation</h4>

              <p>At the end of a testing session, a linear, dynamically generated read-out of the questions and answers and the associated content will be shown in an overlay when clicking "Show individualisation".</p>

              <p>In theory - this is a rule set which can be fed into an AI machine to teach it how to learn.</p>

              <p>Therefore, once the algorithm is built into KARDs once and is deemed to be correct according to the logic extracted from a medical expert, the KARDs system could programatically calculate, count and generate ALL possible
                  permutations for the entire bounds of data sets it could be given, in one go.</p>

              <p>Also it could automatically create individualised reports on the fly for different real users attached to the consumer electronic health record (CEHR) providing all the data buckets that are called upon in the algorithm are full and supplied. We will be able to swap different people in and out of the beginning of a KARDS algorithm and seeing different paths and content light up each time.</p>

              <p>Please note that each block of content that is passed through during testing will be added to the Testing heads-up display (HUD) so that it can then be seen in a more logical story-like sequence. This &lsquo;content stream&rsquo; can be read by moving the mouse over the Content numbers in the HUD which will bring up the full content and highlight the cell in the flowchart. One of the main and original requirements of KARDS is that this content can be checked in detail to be medically accurate and in accordance with the exact sequence of answers that have been given. This content can be edited in the Content panel and will be integrated with the CMS so that changes are saved back in where necessary.</p>

              </div>

          </div>
      </div>
      <div class="simplemodal-container">
          <div id="developers-modal" class="modal">

              <h3>KARDS Developer notes</h3>
              <a href="#" class="btnClose"><img src='img/basic/close.png' width="16" height="16" alt=''></a>

              <div id="developers-output" class="modal-output">

                  <p>Built using a hybrid of requireJS/backboneJS, jointJS, jQuery and using handlebars templates, grunt to compile preprocessed SCSS templates and php output JSON data from /data/dataProviders.php to load initially hardcode values that will eventually be dynamically fed from the Health& CMS database.</p>

                  <p?Please note - the app is not complete. Every type of logical combination for conditional calculations based on the answer given to a question (and if that takes into account earlier answers, or dynamic answers) will need to be carefully planned, and thoroughly tested, so that it is making the correct &lsquo;javascript function&rsquo; on the fly to work out which &ldquo;out port&rdquo; to follow and therefore which question comes next. This coding is done within the app/logicMachine.js script. Currently the system is at a stage where it can handle putting calculations together using only basic arithmetic and parentheses combinations. More complex parentheses combinations, and more advanced mathematical functions - like working out the standard deviation value of answers for questions 1, 5 and 10 for example - are yet to be built.</div>

                  <p>There is provision from the original boilerplate for testing frameworks and other task runners but a lot of this is not hooked up or used. There is also a known error in the grunt watcher which outputs &lsquo;Loading "server.js" tasks...ERROR&rsquo;</p>

                  <p>For styling and display attributes, there are external javascript modules in app/modules called style.js and layout.js.</p>



                  <h3>Terminal commands</h3>


                  <p>Go to root:</p>

                  <p>cd /Applications/MAMP/htdocs/kards-v1</p>

                    <p>--</p>

                    <p>Run grunt to compress and watch for SCSS changes:<p>

                    <p>grunt</p>

                    <p>—-</p>

                  <p>Crunch handlebars templates:</p>

                  <p>handlebars --amd app/templates/*.hbs -f app/compiled-templates.js</p>





                  <h3>GIT</h3>

                  <p>Git repository lives at</p>

                  <p>http://git.sonoahealth.com/apps-sonoa/kards.git</p>



                  <h3>Interactive wireframe prototype</h3>

                  <p>Original prototype demo lives at http://dev.onlinemd.com/KARDS/#p=kards</p>



                  <h3>Database model</h3>

                  <p>Data model has been designed and lives on server at<br>
                  smb://10.1.1.22/Sonoa/Sonoa/IT/Development/Schematic & Wireframe Documentation/KARDS v2</p>

                  <p>The app is currently static but plans to be connected to the Health& CMS to extract medical content from reports for creating the individualised / preventative streams.</p>

                  <p>Additionally, rather than using the data model and a SQL database it is probably better to decide / discuss whether to try to create charts using the data model broken down into all separate normalized elements or to store the JSON as a block / file in the database as the structure all in one complex file. Given that this file could be broken down and generated from separate normalized elements. Domenico suggested that a noSQL database (mongoDB) could be really good for saving the large JSON structures. Bearing in mind we will still need to connect to and from the normal CMS SQL databased for AJAXing content in.</p>


                  <h3>Dynamic templates</h3>

                  <p>The value options for the question types and other dropdowns come from the static data/dataProviders.php JSON output which is AJAX&rsquo;ed in on app initialisation.</p>


              </div>

          </div>
      </div>
      <div class="simplemodal-container">
          <div id="glossary-modal" class="modal">

              <h3>KARDS Glossary</h3>
              <a href="#" class="btnClose"><img src='img/basic/close.png' width="16" height="16" alt=''></a>

              <div id="glossary-output" class="modal-output">

                  <h3>CELL</h3>

                  <p>Cells are any report, section, question, answer, content or end point rectangles.</p>


                  <h3>LINK</h3>

                  <p>"Outside" links join content to 'in' and 'out' ports and in general join things together.</p>

                  <p>"Inside" links show joins between 'answers' and 'questions', and answers to out ports that will be generated based on logic rules and subsequent actions set up for the answers of a question.</p>

                  <p>Click on a horizontal or vertical part of a link between joined "cells" to move to a better desired position.</p>

                  <h3>STREAM</h3>

                  <p>Each question and answer diagram is ultimately for joining blocks of content that build up following the individual&rsquo;s unique route through the flowchart and reaching a final outcome.</p>
                  <p>KARDS has been built so that it can make any type of typical chart that has a beginning and an end. However - due to the non-linear nature of questioning regarding more complex topics (such as those involving complex medical situations involving multiple factors), there is no rule around where to begin and end a STREAM when clicking on answers to the question in TEST mode.</p>

                  <p>So therefore a STREAM is a sequence in which answers are clicked and cells, wrappers and paths are highlighted in the user interface in TEST mode. And a CONTENT stream is the build up, or story which accumulates made up of all the content that is passed through whilst following this stream.</p>

                  <h3>WRAPPER</h3>

                  <p>Wrappers surround questions and their answers, and content cells. These are called the logic wrapper and the content wrapper.</p>


              </div>

          </div>
      </div>
      <div class="simplemodal-container">
          <div id="todo-modal" class="modal">

              <h3>KARDS To do / thoughts</h3>
              <a href="#" class="btnClose"><img src='img/basic/close.png' width="16" height="16" alt=''></a>

              <div id="todo-output" class="modal-output">

                  <ul>
                      <li>Deleting an answer (that is included in any logic rules / actions) needs to be removed from answerValues / questionLogic / questionChoices</li>

                      <li>Deleting an answer needs to redraw the logicWrapper box.</li>

                      <li>Add prebuilt questions - age, gender, height, weight (these are now added)… pre-fill with random bounded values.</li>

                      <li>Test other logical combinations by finishing off adding in the Type 2 Diabetes chart / SNAP chart</li>

                      <li>Colouring of a stream that we have chosen to go down to make it stand out better.</li>

                      <li>Plan how to automatically count and create content streams of all different outcomes - show number of different possible permutations. This is going to need random age generators for different age categories etc.</li>

                      <li>Deeplinking to different charts / reports. I started this using the backbone router but had some issues with loading in properly behaving strangely. I was doing this with auto-selecting the dropdown based on the url hash.</li>

                      <li>Would be nice to auto-detect custom value data type based on input...</li>
                  </ul>

              </div>

          </div>
      </div>



      <form method="" action="" class="formContentOptions  _faded">

          <h3>Add Content</h3>
          <a href="#" id="btnContentControlsClose" class="down"></a>

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
              <textarea id="contentText" name="contentText" rows="8"></textarea>
          </div>


          <div class="form-controls  form-controls--width-full" >
              <button type="button" id="btnAddContent" class="button-add">Add content</button>
          </div>

          <div class="form-controls  form-controls--width-full" >
              <button type="button" id="btnDeleteContent" class="button-add  button-delete  hidden">Delete content</button>
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

          <div class="form-controls  form-controls--width-full" >
              <button type="button" id="btnAnswerInputConfirm" class="button-add">OK</button>
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

          <div class="form-controls  form-controls--width-full" >
              <button type="button" id="btnDeleteEndPoint" class="button-add  button-delete  hidden">Delete end point</button>
          </div>

      </form>



      <div id="HUD" class="hudControlPanel">

          <a href="#" class="btnBack  hidden">&lt;</a>

          <ul id="content-nodes"></ul>

          <a href="#" class="btnNext  hidden">&gt;</a>

          <h3>Content stream</h3>

          <div class="form-controls  form-controls--width-full" >
              <button type="button" id="btnResetClearAnswers" class="">Reset &amp clear answers</button>
              <button type="button" id="btnResetContentStream" class="">Start over</button>
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
