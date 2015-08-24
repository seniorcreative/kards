Kards v1
--------

An app for making medical algorithms
that provide individualised information.



 - Skeleton notes - Steve Smith 18 August 2015 -
 

Online access
http://test-kards.sonoahealth.com/
Username: sonoahealth
Password: sonoa@demo



Instructions

Please refer to the interface diagram fig 1.


—

Report panel

Selecting an option will load a saved report from the drop down menu in this panel. 
Whilst making changes, the report will save every 30 seconds if the auto-save option is checked (see /app/views/v_reportControlsView.js)

Report category is not being used yet - this is for database connection.

Typing the report name will also change the heading on the app page.

By default when loading the KARDS app you will receive a default report with today’s date and one root section joined to that report. From here you can start adding questions.
—
Section panel

This is for larger reports where lots of questions need to be divided up. There is provision for this in the data model for when things are hooked up to the data base. Any sections added will need to be up linked to the final out port or out ports of the preceding section.

When adding a new section - the section name field will be used as the section name.

Click on a section and start typing to change the section name. Or click or paste into the section name field.
—
Question panel

Question variable type is just a placeholder until database is hooked up. The value options for this dropdown come from the static data/dataProviders.php JSON output which is AJAX’ed in on app initialisation.

Again, question options come from the static data providers. Toggling between true/false (boolean) questions and multiple choice or numeric questions toggles the display of an additional slide down panel with extra options for number of questions, answer numeric step value, and number of accepted answers.


If you want a multiple choice question with 3 answers just add 3 to ’Number of answers’.

If you want a numeric step question counting up in increments of 5, say 5-10-15-20-25, then do this by entering 5 answers and 5 for numeric step and it will count up for you when it adds the answers.

Ticking ‘Include unknown answer’ will add an additional boolean answer on top of the selected number of answers already requested.

’Number of accepted answers’ is not functional yet, only listing static options from data providers.

‘Data point’ is not functional yet, only listing static options from data providers - however this drop down has grouping so will be echoed into the PHP directly, not via Handlebars template like all the other dropdown. I have not found a good way to do grouped dropdown in Handlebars though it is supported.

Default question text value is given, or you can paste one in before adding.

Once a question has been added it will be selected by default. Click on the blue background, off and outside of any boxes and you will deselect any currently highlighted cells.

You select a question by clicking on the question cell, or any of its answers, or its ‘logic wrapper’ box. The logic wrapper box groups the question and all it’s answers. When you add logic it is metaphorically added to the logic wrapper. It is the logic wrapper that ends up with one in port and multiple out ports for connecting other cells to in a flowchart.

When a question is highlighted you can delete it (be careful of what you have linked it to), as well as add another answer to it. By default, selecting a question will highlight it’s content text so you can just click on a question and start editing it’s text without clicking again in the panel’s ‘Question text’ field.

Changing a selected question’s type after a won’t make any difference.


—
Answer panel


—
Content panel


—
End Point panel


—
Toggles

Toggle control panels
Toggle testing mode
—
Testing Heads-up display
Reset button
Individualisation overlay






GENERAL USER NOTES

RESETTING

Use the reset button if you want to test starting again higher up in a question stream. The system does not limit you to starting at any question or going back to a different question higher up. It does not and I believe should not have the smarts to reset what has been highlighted further down a stream automatically based on what has been clicked so far. Not only is this exceptionally difficult to code - it applies an unnecessary limit around putting content streams together and testing those.


LINKS

“Outside” links join content to ‘in’ and ‘out’ ports and in general join things together. 

“Inside” links show joins between ‘answers’ and ‘questions’, and 

Click on a horizontal or vertical part of a link between  


TESTING

Answering a question - exit testing mode and click ‘clear answer values’ on a selected answer to reset the stored input for this answer. Upon entering back into testing mode and selecting this answer again 








Please note - the app is not complete. Every type of logical combination for conditional calculations based on the answer given to a question (and if that  takes into account earlier answers, or dynamic answers) will need to be carefully planned, and thoroughly tested, so that it is making the correct ‘javascript function’ on the fly to work out which “out port” to follow and therefore which question comes next.

Built using a hybrid of requireJS/backboneJS, jointJS, jQuery and using handlebars templates, grunt to compile preprocessed SCSS templates and php output JSON data from /data/dataProviders.php to load initially hardcode values that will eventually be dynamically fed from the Health& CMS database.

There is provision from the original boilerplate for testing frameworks and other task runners but a lot of this is not hooked up or used. There is also a known error in the grunt watcher which outputs ‘Loading "server.js" tasks...ERROR’




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




INTERACTIVE WIREFRAME PROTOTYPE

Original prototype demo lives at http://dev.onlinemd.com/KARDS/#p=kards


DATABASE CONNECTION


Data model has been designed and lives on server at
smb://10.1.1.22/Sonoa/Sonoa/IT/Development/Schematic & Wireframe Documentation/KARDS v2

The app is currently static but plans to be connected to the Health& CMS to extract medical content from reports for creating the individualised / preventative streams.


TO DO / THOUGHTS

Deleting an answer (that is included in any logic rules / actions) needs to be removed from answerValues / questionLogic / questionChoices

Deleting an answer needs to redraw the logicWrapper box.

Add prebuilt questions - age, gender, height, weight… pre-fill with random bounded values.

Test other logical combinations by finishing off adding in the Type 2 Diabetes chart / SNAP chart

Connect to CMS - decide / discuss whether to try to create charts using the data model broken down into all separate normalized elements or to store the JSON as a block / file in the database as the structure all in one complex file. Given that this file could be broken down and generated from separate normalized elements. Domenico suggested that a noSQL database (mongoDB) could be really good for saving the large JSON structures. Bearing in mind we will still need to connect to and from the normal CMS SQL databased for AJAXing content in.

Colouring of a stream that we have chosen to go down to make it stand out better.

Plan how to automatically count and create content streams of all different outcomes - show number of different possible permutations. This is going to need random age generators for different age categories etc…

Deeplinking to different charts / reports. I started this using the backbone router but had some issues with loading in properly behaving strangely. I was doing this with auto-selecting the dropdown based on the url hash.

Would be nice to auto-detect custom value data type based on input…

