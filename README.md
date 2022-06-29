Kards v1
--------

An app for extracting medical algorithms
from the minds of medical experts 
into a question and answer flow
that provides individualised information.
 


Online access
http://test-kards.sonoahealth.com/
Username: sonoahealth
Password: sonoa@demo




INSTRUCTIONS / HELP


—

Report panel

Selecting an option will load a saved report from the drop down menu in this panel. 
Whilst making changes, the report will save every 30 seconds if the auto-save option is checked (developer - see /app/views/v_reportControlsView.js)
This button is not checked by default.

Report category is not being used yet - this is for database connection.

Typing the report name will also change the heading on the app page.

By default when loading the KARDS app you will receive a default report with today’s date and one root section joined to that report. 
From here you can start adding questions.


—
Section panel

This is for larger reports where lots of questions need to be divided up into manageable chunks. 
There is provision for this in the data model for when things are hooked up to the database. 
Any sections added will need to be up linked to the final out port or out ports of the preceding section.

When adding a new section - the section name field will be used as the section name.

Click on a section and start typing to change the section name. Or click or paste into the section name field.


—
Question panel


When adding a new question, by default the question cell shows default question value text, or you can paste one in before adding.

The ‘question variable type’ dropdown is just a placeholder until database is hooked up. 

Again, question options come from the static data/dataProviders.php. Toggling between true/false (boolean) questions and multiple choice or numeric questions toggles the display of an additional slide down panel with extra options for number of questions, answer numeric step value, and number of accepted answers.

If you want a multiple choice question with 3 answers just add 3 to ’Number of answers’.

If you want a numeric step question counting up in increments of 5, say 5-10-15-20-25, then do this by entering 5 answers and 5 for numeric step and it will count up for you when it adds the answers.

Ticking ‘Include unknown answer’ will add an additional boolean answer on top of the selected number of answers already requested.
This only works when adding in a new question, but to do this after a question has been added is possible by clicking “Add answer to question”,
and then setting up the answer accordingly. 

’Number of accepted answers’ is not functional yet.

‘Data point’ is not functional yet, this select input is only listing static options from the data/dataProviders.php JSON output - however this drop down has grouping so will be echoed into the PHP directly, not via Handlebars template like all the other dropdown. I have not yet integrated a good way to do grouped dropdown in Handlebars but I know it is supported.

Once a question has been added it will be selected by default. Click on the blue background, off and outside of any boxes and you will deselect any currently highlighted cells.

You select a question by clicking on the question cell, or any of its answers, or its ‘logic wrapper’ box. The logic wrapper box groups the question and all it’s answers. When you add logic it is metaphorically added to the logic wrapper. It is the logic wrapper that ends up with one in port and multiple out ports for connecting other cells to in a flowchart.

When a question is highlighted you can delete it (be careful of what you have linked it to), as well as add another answer to it. By default, selecting a question will highlight its content text so you can just click on a question and start editing its text without clicking again in the panel’s ‘Question text’ field.

Changing a selected question’s type after a won’t make any difference (at this stage).

The question’s logic wrapper always has one ‘in port’ only.


	Logic Overlay.

	Logic overlay is quite complicated but is a bit like a calculator. You can add rules which are made up of calculation blocks and then set what they are supposed to satisfy, and then add an action to perform if this rule is satisfied / scenario occurs.

	Adding actions creates the outport to which we can drag and connect the content, question or end point cells which come next. Only by dropping the in port of a logic or content wrapper or end point do we tell the KARDS system the pathways it can follow next according to the value of answer.

	You can open the rule and change rules after “actions” have been added to the logic overlay. 

	







—
Answer panel

In the answer panel you can set up what the type of answer value is. This is crucial for the logic calculations to take place.

Options, and corresponding programmatic data-types are:
	
‘true or false’ (boolean), 
number (integer), 
word or lettter (string), 
date, years (both are converted to date types for date comparisons), 
and ‘none of the above’ which is reserved for future use for ‘multiple choice’ types of questions

CMS condition / symptom is reserved for future use - I believe there will be a scenario where not just the question but also the answer will need to be tied to a health record CEHR.

Answer value 1 is where the main value of an answer can be set in this panel , before we go into testing mode. This will be pre-generated in some cases. Changing the ‘Value data type’ of the
answer will change what sort of input can be set here and also in the popup ‘Answer input panel’ in TEST mode for data validity. For example setting to true or false changes the input text field to a checkbox.

As some single answers may need to represent a range of values or a matrix, there is ‘Answer value 2’ representing the upper limit of this range. I have not made any flow charts making use of this yet and therefore the logicMachine
function creation has not been written.

‘Clear answer values’ clears an answer’s stored value. This can also be done for all answers in TEST mode by clicking ‘Reset & clear answers’.


	Answer Logic Rules

	To help make sense KARDS shows a summary of a selected answer’s parent question’s logical rule conditions & action outcomes as a ‘pseudo-code’ statement. This is a very simplified version of what gets generated on the fly by the code to process an answer value and work out which outport to follow.


—
Answer input panel

During TEST mode, if the answer to a question is selected and does not have any values stored against it, the Answer input panel will appear.

When any input is added or changed this will change the selected answer’s colour and means it needs to be clicked again to continue onward.

Clicking off or outside of the Answer input panel is the same as clicking the OK button to enter the value.



—
Content panel

Note that the full content shown in the actual panel is cropped and abbreviated where shown in the content cell inside the content wrapper.

Content wrappers always have one in port and one out port, by default. This is never changed.

When in TEST mode, representations of content cells will build up in a line in the testing HUD. Selecting these will bring up the content panel so that the content can be edited. This needs to be integrated back into the CMS.


—
End Point panel

End points are placeholders which represent the final outcome of a KARDS algorithm question and answer stream.

The list of ‘end point types’ comes from data/dataProviders.php and is just placeholder content at time of writing.

The plan is to eventually integrate end points to the Health& account so that for example following a question and answer session tied to a KARDS algorithm when a
particular endpoint is reached we might set up a system alert to go and get a medical check on a particular date, relating to two years after the user’s date of birth or a given 
user date relating to a previous medical event.

End points always have one in port only by default, as have no ongoing connections.


—

Toggles

Toggle control panels

If the panels are getting in the way during the build of a KARDS algorithm then they can be hidden.

Toggle testing mode

There is a big difference between BUILD mode and TEST mode. Use this tick button to toggle between the two.
Only in TEST mode can we click on the answers, input needed parameters for testing if required, and calculate what to do next.


—



Testing heads-up display (HUD)

Reset & clear answers button
Start over button

Answering a question - exit testing mode and click ‘clear answer values’ on a selected answer to reset the stored input for this answer. Upon entering back into testing mode and selecting this answer again.
Alternatively, a new “Reset & clear answers” button was added to the Testing HUD which does this in one go. Otherwise just select “Start over” to clear the highlighted selections only and keep user input values.

Use the “Start over” button if you want to test starting again higher up in a question stream. The system does not limit you to starting at any question or going back to a different question higher up. It does not and should not have the smarts to reset what has been highlighted/selected further down a stream automatically based on what has been clicked so far. Not only is this exceptionally difficult to code - it applies a counterintuitive limit around putting content streams together and testing those.

Show individualisation

At the end of a testing session, a linear , dynamically generated read out of the questions and answers and the associated content will be shown in an overlay when clicking “Show individualisation”. 

In theory - this is a rule set which can be fed into an AI machine.

Therefore, once the algorithm is built into KARDs once and is deemed to be correct according to the logic extracted from a medical expert, the KARDs system could programatically calculate, count and generate ALL possible
permutations for the entire bounds of data sets it could be given, in one go.

Also it could automatically create individualised reports on the fly for different real users attached to the consumer electronic health record (CEHR) providing all the data buckets that are called upon in the algorithm are full and supplied. We will be able to swap different people in and out of the beginning of a KARDS algorithm and seeing different paths and content light up each time.

Please note that each block of content that is passed through during testing will be added to the Testing heads-up display (HUD) so that it can then be seen in a more logical story-like sequence. This ‘content stream’ can be read by moving the mouse over the Content numbers in the HUD which will bring up the full content and highlight the cell in the flowchart. One of the main and original requirements of KARDS is that this content can be checked in detail to be medically accurate and in accordance with the exact sequence of answers that have been given. This content can be edited in the Content panel and will be integrated with the CMS so that changes are saved back in where necessary.


—


GLOSSARY


CELLS

Cells are any report, section, question, answer, content or end point rectangles.


WRAPPERS

Wrappers surround questions and their answers, and content cells. These are called the logic wrapper and the content wrapper.


LINKS

“Outside” links join content to ‘in’ and ‘out’ ports and in general join things together. 

“Inside” links show joins between ‘answers’ and ‘questions’, and answers to out ports that will be generated based on logic rules and subsequent actions set up for the answers of a question.

Click on a horizontal or vertical part of a link between joined “cells” to move to a better desired position.


STREAM

Each question and answer diagram is ultimately for joining blocks of content that build up following the individual’s unique route through the flowchart and reaching a final outcome.
KARDS has been built so that it can make any type of typical chart that has a beginning and an end. However - due to the non-linear nature of questioning regarding more complex
topics (such as those involving complex medical situations involving multiple factors), there is no rule around where to begin and end a STREAM when clicking on answers to the question in TEST mode.

So therefore a STREAM is a sequence in which answers are clicked and cells, wrappers and paths are highlighted in the user interface in TEST mode. And a CONTENT stream is the build up, or story
which accumulates made up of all the content that is passed through whilst following this stream.




TECHNICAL NOTES

Built using a hybrid of requireJS/backboneJS, jointJS, jQuery and using handlebars templates, grunt to compile preprocessed SCSS templates and php output JSON data from /data/dataProviders.php to load initially hardcode values that will eventually be dynamically fed from the Health& CMS database.

Please note - the app is not complete. Every type of logical combination for conditional calculations based on the answer given to a question (and if that takes into account earlier answers, or dynamic answers) will need to be carefully planned, and thoroughly tested, so that it is making the correct ‘javascript function’ on the fly to work out which “out port” to follow and therefore which question comes next. This coding is done within the app/logicMachine.js script. Currently the system is at a stage where it can handle putting calculations together using only basic arithmetic and parentheses combinations. More complex parentheses combinations, and more advanced mathematical functions - like working out the standard deviation value of answers for questions 1 , 5 and 10 for example - are yet to be built.

There is provision from the original boilerplate for testing frameworks and other task runners but a lot of this is not hooked up or used. There is also a known error in the grunt watcher which outputs ‘Loading "server.js" tasks...ERROR’

For styling and display attributes, there are external javascript modules in app/modules called style.js and layout.js.



Terminal commands

—

Go to root:

cd /Applications/MAMP/htdocs/kards-v1 

—

Run grunt to compress and watch for SCSS changes:

grunt

—

Crunch handlebars templates:

handlebars --amd app/templates/*.hbs -f app/compiled-templates.js



GIT

Git repository lives at 

http://git.sonoahealth.com/apps-sonoa/kards.git



Interactive wireframe prototype

Original prototype demo lives at http://dev.onlinemd.com/KARDS/#p=kards



Database model

Data model has been designed and lives on server at
smb://10.1.1.22/Sonoa/Sonoa/IT/Development/Schematic & Wireframe Documentation/KARDS v2

The app is currently static but plans to be connected to the Health& CMS to extract medical content from reports for creating the individualised / preventative streams.

Additionally, rather than using the data model and a SQL database it is probably better to decide / discuss whether to try to create charts using the data model broken down into all separate normalized elements or to store the JSON as a block / file in the database as the structure all in one complex file. Given that this file could be broken down and generated from separate normalized elements. Domenico suggested that a noSQL database (mongoDB) could be really good for saving the large JSON structures. Bearing in mind we will still need to connect to and from the normal CMS SQL databased for AJAXing content in.


Dynamic templates
The value options for the question types and other dropdowns come from the static data/dataProviders.php JSON output which is AJAX’ed in on app initialisation.







——

TO DO / THOUGHTS

Deleting an answer (that is included in any logic rules / actions) needs to be removed from answerValues / questionLogic / questionChoices

Deleting an answer needs to redraw the logicWrapper box.

Add prebuilt questions - age, gender, height, weight (these are now added)… pre-fill with random bounded values.

Test other logical combinations by finishing off adding in the Type 2 Diabetes chart / SNAP chart

Colouring of a stream that we have chosen to go down to make it stand out better.

Plan how to automatically count and create content streams of all different outcomes - show number of different possible permutations. This is going to need random age generators for different age categories etc…

Deeplinking to different charts / reports. I started this using the backbone router but had some issues with loading in properly behaving strangely. I was doing this with auto-selecting the dropdown based on the url hash.

Would be nice to auto-detect custom value data type based on input…
