define(['handlebars.runtime'], function(Handlebars) {
  Handlebars = Handlebars["default"];  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['calculationBlock.hbs'] = template({"1":function(depth0,helpers,partials,data) {
    var helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "                <option value=\""
    + alias3(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" data-symbol=\""
    + alias3(((helper = (helper = helpers['data-symbol'] || (depth0 != null ? depth0['data-symbol'] : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"data-symbol","hash":{},"data":data}) : helper)))
    + "\" data-type=\""
    + alias3(((helper = (helper = helpers['data-type'] || (depth0 != null ? depth0['data-type'] : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"data-type","hash":{},"data":data}) : helper)))
    + "\">"
    + alias3(((helper = (helper = helpers.label || (depth0 != null ? depth0.label : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"label","hash":{},"data":data}) : helper)))
    + "</option>\n";
},"3":function(depth0,helpers,partials,data) {
    var helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "\n                    <option value=\""
    + alias3(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" data-element=\""
    + alias3(((helper = (helper = helpers.element || (depth0 != null ? depth0.element : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"element","hash":{},"data":data}) : helper)))
    + "\" data-parent=\""
    + alias3(((helper = (helper = helpers.parent || (depth0 != null ? depth0.parent : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"parent","hash":{},"data":data}) : helper)))
    + "\">Q"
    + alias3(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"id","hash":{},"data":data}) : helper)))
    + "</option>\n                ";
},"5":function(depth0,helpers,partials,data) {
    var helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "                    <option value=\""
    + alias3(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"id","hash":{},"data":data}) : helper)))
    + "\">"
    + alias3(((helper = (helper = helpers.label || (depth0 != null ? depth0.label : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"label","hash":{},"data":data}) : helper)))
    + "</option>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "<div id=\"calculation-"
    + alias3(((helper = (helper = helpers.calculationNum || (depth0 != null ? depth0.calculationNum : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"calculationNum","hash":{},"data":data}) : helper)))
    + "\" class=\"calculationBlockWrapper\">\n\n    <div class=\"ruleWrapperBlockCalculationBlock operation\">\n\n        <select name=\"rule_"
    + alias3(((helper = (helper = helpers.ruleNum || (depth0 != null ? depth0.ruleNum : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"ruleNum","hash":{},"data":data}) : helper)))
    + "_calculationblock_"
    + alias3(((helper = (helper = helpers.calculationNum || (depth0 != null ? depth0.calculationNum : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"calculationNum","hash":{},"data":data}) : helper)))
    + "_operation\" id=\"rule_"
    + alias3(((helper = (helper = helpers.ruleNum || (depth0 != null ? depth0.ruleNum : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"ruleNum","hash":{},"data":data}) : helper)))
    + "_calculationblock_"
    + alias3(((helper = (helper = helpers.calculationNum || (depth0 != null ? depth0.calculationNum : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"calculationNum","hash":{},"data":data}) : helper)))
    + "_operation\" size=\"1\">\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.logicOperatorNormal : depth0),{"name":"each","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "            <!--<option value=\"1\">VALUE OF</option>-->\n            <!--<option value=\"2\">SUM</option>-->\n            <!--<option value=\"3\">PLUS</option>-->\n            <!--<option value=\"4\">MINUS</option>-->\n            <!--<option value=\"5\">MULTIPLY</option>-->\n        </select>\n\n    </div>\n\n    <div class=\"ruleWrapperBlockCalculationBlock  operand\">\n\n        <div class=\"ruleWrapperBlockCalculationOperandBlock\">\n\n            <span class=\"ruleWrapperBlockLabel\">Answer value</span>\n\n            <select name=\"rule_"
    + alias3(((helper = (helper = helpers.ruleNum || (depth0 != null ? depth0.ruleNum : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"ruleNum","hash":{},"data":data}) : helper)))
    + "_calculationblock_"
    + alias3(((helper = (helper = helpers.calculationNum || (depth0 != null ? depth0.calculationNum : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"calculationNum","hash":{},"data":data}) : helper)))
    + "_operand_answer\" id=\"rule_"
    + alias3(((helper = (helper = helpers.ruleNum || (depth0 != null ? depth0.ruleNum : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"ruleNum","hash":{},"data":data}) : helper)))
    + "_calculationblock_"
    + alias3(((helper = (helper = helpers.calculationNum || (depth0 != null ? depth0.calculationNum : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"calculationNum","hash":{},"data":data}) : helper)))
    + "_operand_answer\" size=\"5\" multiple>\n                <!--<option value=\"1\">Q1 - True</option>-->\n                <!--<option value=\"2\">Q1 - False</option>-->\n                <!--<option value=\"3\">Q1 - Unknown</option>-->\n                [[[questionValues]]]\n                <!--"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.questions : depth0),{"name":"each","hash":{},"fn":this.program(3, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "-->\n                <!--<option value=\"3\">Q3</option>-->\n                <!--<option value=\"4\">Q4</option>-->\n                <!--<option value=\"5\">Q5</option>-->\n            </select>\n\n        </div>\n\n        <div class=\"ruleWrapperBlockCalculationOperandBlock\">\n\n            <span class=\"ruleWrapperBlockLabel\"><strong>OR</strong> Custom value type</span>\n\n            <select name=\"rule_"
    + alias3(((helper = (helper = helpers.ruleNum || (depth0 != null ? depth0.ruleNum : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"ruleNum","hash":{},"data":data}) : helper)))
    + "_calculationblock_"
    + alias3(((helper = (helper = helpers.calculationNum || (depth0 != null ? depth0.calculationNum : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"calculationNum","hash":{},"data":data}) : helper)))
    + "_operand_custom_value_type\" id=\"rule_"
    + alias3(((helper = (helper = helpers.ruleNum || (depth0 != null ? depth0.ruleNum : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"ruleNum","hash":{},"data":data}) : helper)))
    + "_calculationblock_"
    + alias3(((helper = (helper = helpers.calculationNum || (depth0 != null ? depth0.calculationNum : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"calculationNum","hash":{},"data":data}) : helper)))
    + "_operand_custom_value_type\" size=\"1\">\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.valueDataTypesDropdown : depth0),{"name":"each","hash":{},"fn":this.program(5, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "                <!--<option value=\"1\">integer</option>-->\n                <!--<option value=\"2\">boolean</option>-->\n                <!--<option value=\"3\">float</option>-->\n                <!--<option value=\"4\">string</option>-->\n            </select>\n\n        </div>\n\n\n        <div class=\"ruleWrapperBlockCalculationOperandBlock\">\n\n            <span class=\"ruleWrapperBlockLabel\">Value</span>\n\n            <input type=\"text\" value=\" ? \" name=\"rule_"
    + alias3(((helper = (helper = helpers.ruleNum || (depth0 != null ? depth0.ruleNum : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"ruleNum","hash":{},"data":data}) : helper)))
    + "_calculationblock_"
    + alias3(((helper = (helper = helpers.calculationNum || (depth0 != null ? depth0.calculationNum : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"calculationNum","hash":{},"data":data}) : helper)))
    + "_operand_custom_value\" id=\"rule_"
    + alias3(((helper = (helper = helpers.ruleNum || (depth0 != null ? depth0.ruleNum : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"ruleNum","hash":{},"data":data}) : helper)))
    + "_calculationblock_"
    + alias3(((helper = (helper = helpers.calculationNum || (depth0 != null ? depth0.calculationNum : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"calculationNum","hash":{},"data":data}) : helper)))
    + "_operand_custom_value\">\n\n        </div>\n\n    </div>\n\n</div>";
},"useData":true});
templates['cmsContentCategories.hbs'] = template({"1":function(depth0,helpers,partials,data) {
    var helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "  <option value=\""
    + alias3(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"id","hash":{},"data":data}) : helper)))
    + "\">"
    + alias3(((helper = (helper = helpers.label || (depth0 != null ? depth0.label : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"label","hash":{},"data":data}) : helper)))
    + "</option>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return "<label for=\"cmsContentCategoryID\">CMS content category</label>\n<select class=\"\" id=\"cmsContentCategoryID\" name=\"cmsContentCategoryID\" size=\"1\">\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.cmsContentCategories : depth0),{"name":"each","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "</select>";
},"useData":true});
templates['cmsContentTypes.hbs'] = template({"1":function(depth0,helpers,partials,data) {
    var helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "  <option value=\""
    + alias3(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"id","hash":{},"data":data}) : helper)))
    + "\">"
    + alias3(((helper = (helper = helpers.label || (depth0 != null ? depth0.label : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"label","hash":{},"data":data}) : helper)))
    + "</option>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return "<label for=\"cmsContentTypeID\">CMS content type</label>\n<select class=\"\" id=\"cmsContentTypeID\" name=\"cmsContentTypeID\" size=\"1\">\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.cmsContentTypes : depth0),{"name":"each","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "</select>";
},"useData":true});
templates['logicRule.hbs'] = template({"1":function(depth0,helpers,partials,data) {
    var helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "                        <option value=\""
    + alias3(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" data-symbol=\""
    + alias3(((helper = (helper = helpers['data-symbol'] || (depth0 != null ? depth0['data-symbol'] : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"data-symbol","hash":{},"data":data}) : helper)))
    + "\" data-type=\""
    + alias3(((helper = (helper = helpers['data-type'] || (depth0 != null ? depth0['data-type'] : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"data-type","hash":{},"data":data}) : helper)))
    + "\">"
    + alias3(((helper = (helper = helpers.label || (depth0 != null ? depth0.label : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"label","hash":{},"data":data}) : helper)))
    + "</option>\n";
},"3":function(depth0,helpers,partials,data) {
    var helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "                            <option value=\""
    + alias3(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" data-symbol=\""
    + alias3(((helper = (helper = helpers['data-symbol'] || (depth0 != null ? depth0['data-symbol'] : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"data-symbol","hash":{},"data":data}) : helper)))
    + "\" data-type=\""
    + alias3(((helper = (helper = helpers['data-type'] || (depth0 != null ? depth0['data-type'] : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"data-type","hash":{},"data":data}) : helper)))
    + "\">"
    + alias3(((helper = (helper = helpers.label || (depth0 != null ? depth0.label : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"label","hash":{},"data":data}) : helper)))
    + "</option>\n";
},"5":function(depth0,helpers,partials,data) {
    var helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "\n                            <option value=\""
    + alias3(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" data-element=\""
    + alias3(((helper = (helper = helpers.element || (depth0 != null ? depth0.element : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"element","hash":{},"data":data}) : helper)))
    + "\">"
    + alias3(((helper = (helper = helpers.label || (depth0 != null ? depth0.label : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"label","hash":{},"data":data}) : helper)))
    + "</option>\n                        ";
},"7":function(depth0,helpers,partials,data) {
    var helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "                            <option value=\""
    + alias3(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"id","hash":{},"data":data}) : helper)))
    + "\">"
    + alias3(((helper = (helper = helpers.label || (depth0 != null ? depth0.label : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"label","hash":{},"data":data}) : helper)))
    + "</option>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "<div id=\"rule-"
    + alias3(((helper = (helper = helpers.ruleNum || (depth0 != null ? depth0.ruleNum : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"ruleNum","hash":{},"data":data}) : helper)))
    + "\" class=\"logic-rule\">\n\n    <div id=\"\" class=\"ruleForm\">\n\n        <div class=\"ruleWrapper\">\n\n            <span class=\"ruleWrapperBlockTitle  ruleWrapperBlockTitle--bottomMargin\">Sort</span>\n\n            <label for=\"rule_"
    + alias3(((helper = (helper = helpers.ruleNum || (depth0 != null ? depth0.ruleNum : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"ruleNum","hash":{},"data":data}) : helper)))
    + "_sortindex\">\n                <input type=\"number\" value=\""
    + alias3(((helper = (helper = helpers.ruleSortIndex || (depth0 != null ? depth0.ruleSortIndex : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"ruleSortIndex","hash":{},"data":data}) : helper)))
    + "\" class=\"short\" name=\"rule_"
    + alias3(((helper = (helper = helpers.ruleNum || (depth0 != null ? depth0.ruleNum : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"ruleNum","hash":{},"data":data}) : helper)))
    + "_sortindex\" id=\"rule_"
    + alias3(((helper = (helper = helpers.ruleNum || (depth0 != null ? depth0.ruleNum : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"ruleNum","hash":{},"data":data}) : helper)))
    + "_sortindex\">\n            </label>\n\n        </div>\n\n        <div class=\"ruleWrapper ruleWrapper--block\">\n\n            <div class=\"ruleWrapperBlock prefix\">\n\n                <span class=\"ruleWrapperBlockTitle  ruleWrapperBlockTitle--bottomMargin\">Prefix</span>\n\n                <select name=\"rule_prefix_"
    + alias3(((helper = (helper = helpers.ruleNum || (depth0 != null ? depth0.ruleNum : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"ruleNum","hash":{},"data":data}) : helper)))
    + "\" id=\"rule_prefix_"
    + alias3(((helper = (helper = helpers.ruleNum || (depth0 != null ? depth0.ruleNum : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"ruleNum","hash":{},"data":data}) : helper)))
    + "\" size=\"1\">\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.logicOperatorPrefix : depth0),{"name":"each","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "                    <!--<option value=\"1\">IF</option>-->\n                    <!--<option value=\"2\">AND</option>-->\n                    <!--<option value=\"3\">ELSE</option>-->\n                    <!--<option value=\"4\">ELSE IF</option>-->\n                    <!--<option value=\"5\">OR</option>-->\n                </select>\n\n            </div>\n\n            <div class=\"ruleWrapperBlock  calculations\">\n\n                <span class=\"ruleWrapperBlockTitle\">Calculation Blocks</span>\n\n                <div class=\"ruleWrapperBlockCalculationBlocks\">\n\n                    <div class=\"ruleWrapperBlockCalculationBlockWrapper\">\n\n                        <header>\n\n                        <div class=\"ruleWrapperBlockCalculationBlock operation\">\n\n                            <span class=\"ruleWrapperCalculationBlockTitle\">Operation</span>\n\n                        </div>\n\n                        <div class=\"ruleWrapperBlockCalculationBlock  operand\">\n\n                            <span class=\"ruleWrapperCalculationBlockTitle\">Operands</span>\n\n                        </div>\n\n                        </header>\n\n                        [[[calculationBlocks]]] <!-- use triple square brackets for returned HTML , swap automatically. -->\n                        <!--"
    + ((stack1 = ((helper = (helper = helpers.calculationBlocks || (depth0 != null ? depth0.calculationBlocks : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"calculationBlocks","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + " &lt;!&ndash; use triple brackets for returned HTML as we're passing in another template &ndash;&gt;-->\n\n                    </div>\n\n                    <button class=\"btnAddCalcBlock\" data-action=\"calculationBlock\" id=\"logic-header-button-add-calculation-block-rule-"
    + alias3(((helper = (helper = helpers.ruleNum || (depth0 != null ? depth0.ruleNum : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"ruleNum","hash":{},"data":data}) : helper)))
    + "\">Add calculation block</button>\n\n\n                </div>\n\n\n            </div>\n\n\n            <div class=\"ruleWrapperBlock suffix\">\n\n                <span class=\"ruleWrapperBlockTitle  ruleWrapperBlockTitle--bottomMargin\">Suffix</span>\n\n                <div class=\"ruleWrapperBlockSuffixBlock condition\">\n\n                    <select name=\"rule_"
    + alias3(((helper = (helper = helpers.ruleNum || (depth0 != null ? depth0.ruleNum : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"ruleNum","hash":{},"data":data}) : helper)))
    + "_suffix_condition\" id=\"rule_"
    + alias3(((helper = (helper = helpers.ruleNum || (depth0 != null ? depth0.ruleNum : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"ruleNum","hash":{},"data":data}) : helper)))
    + "_suffix_condition\" size=\"1\">\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.logicOperatorNormal : depth0),{"name":"each","hash":{},"fn":this.program(3, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "                        <!--<option value=\"1\">IS</option>-->\n                        <!--<option value=\"2\">GREATER THAN</option>-->\n                        <!--<option value=\"3\">LESS THAN</option>-->\n                        <!--<option value=\"4\">GREATER THAN OR EQUAL TO</option>-->\n                        <!--<option value=\"5\">LESS THAN OR EQUAL TO</option>-->\n                    </select>\n\n\n                </div>\n\n                <div class=\"ruleWrapperBlockSuffixBlock  topMargin  answer\">\n\n                    <span class=\"ruleWrapperBlockLabel\">Select answer</span>\n\n                    <select name=\"rule_"
    + alias3(((helper = (helper = helpers.ruleNum || (depth0 != null ? depth0.ruleNum : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"ruleNum","hash":{},"data":data}) : helper)))
    + "_suffix_answer_value\" id=\"rule_"
    + alias3(((helper = (helper = helpers.ruleNum || (depth0 != null ? depth0.ruleNum : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"ruleNum","hash":{},"data":data}) : helper)))
    + "_suffix_answer_value\" size=\"5\" multiple>\n                        <!--<option value=\"1\">Q1 - A1 - True</option>-->\n                        <!--<option value=\"2\">Q1 - A2 - True</option>-->\n                        <!--<option value=\"3\">Q1 - A3 - Unknown</option>-->\n                        <!--<option value=\"4\">Q2 - A1 - Psychogenic</option>-->\n                        [[[answerValues]]]\n                        <!--"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.answerValues : depth0),{"name":"each","hash":{},"fn":this.program(5, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "-->\n                    </select>\n\n                </div>\n\n                <div class=\"ruleWrapperBlockSuffixBlock  topMargin  customvalueType\">\n\n                    <span class=\"ruleWrapperBlockLabel\"><strong>OR</strong> Custom value type</span>\n\n                    <select name=\"rule_"
    + alias3(((helper = (helper = helpers.ruleNum || (depth0 != null ? depth0.ruleNum : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"ruleNum","hash":{},"data":data}) : helper)))
    + "_suffix_custom_value_type\" id=\"rule_"
    + alias3(((helper = (helper = helpers.ruleNum || (depth0 != null ? depth0.ruleNum : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"ruleNum","hash":{},"data":data}) : helper)))
    + "_suffix_custom_value_type\" size=\"1\">\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.valueDataTypesDropdown : depth0),{"name":"each","hash":{},"fn":this.program(7, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "                    </select>\n\n\n                </div>\n\n                <div class=\"ruleWrapperBlockSuffixBlock  topMargin  customvalue\">\n\n                    <span class=\"ruleWrapperBlockLabel\">Value</span>\n\n                    <input type=\"text\" value=\" ? \" name=\"rule_"
    + alias3(((helper = (helper = helpers.ruleNum || (depth0 != null ? depth0.ruleNum : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"ruleNum","hash":{},"data":data}) : helper)))
    + "_suffix_custom_value\" id=\"rule_"
    + alias3(((helper = (helper = helpers.ruleNum || (depth0 != null ? depth0.ruleNum : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"ruleNum","hash":{},"data":data}) : helper)))
    + "_suffix_custom_value\">\n\n                </div>\n\n\n            </div>\n\n        </div>\n\n    </div>\n\n\n</div>";
},"useData":true});
templates['questionTypes.hbs'] = template({"1":function(depth0,helpers,partials,data) {
    var helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "  <option value=\""
    + alias3(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"id","hash":{},"data":data}) : helper)))
    + "\">"
    + alias3(((helper = (helper = helpers.label || (depth0 != null ? depth0.label : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"label","hash":{},"data":data}) : helper)))
    + "</option>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return "<label for=\"questionType\">Question type</label>\n<select class=\"\" id=\"questionType\" name=\"questionType\" size=\"1\">\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.questionTypes : depth0),{"name":"each","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "</select>";
},"useData":true});
templates['questionVariableTypes.hbs'] = template({"1":function(depth0,helpers,partials,data) {
    var helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "  <option value=\""
    + alias3(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"id","hash":{},"data":data}) : helper)))
    + "\">"
    + alias3(((helper = (helper = helpers.label || (depth0 != null ? depth0.label : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"label","hash":{},"data":data}) : helper)))
    + "</option>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return "<label for=\"questionVariableType\">Question variable type</label>\n<select class=\"\" id=\"questionVariableType\" name=\"questionVariableType\" size=\"1\">\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.questionVariableTypes : depth0),{"name":"each","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "</select>";
},"useData":true});
templates['valueDataTypes.hbs'] = template({"1":function(depth0,helpers,partials,data) {
    var helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "  <option value=\""
    + alias3(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"id","hash":{},"data":data}) : helper)))
    + "\">"
    + alias3(((helper = (helper = helpers.label || (depth0 != null ? depth0.label : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"label","hash":{},"data":data}) : helper)))
    + "</option>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return "<label for=\"valueDataType\">Value data type</label>\n<select class=\"\" id=\"valueDataType\" name=\"valueDataType\" size=\"1\">\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.valueDataTypesDropdown : depth0),{"name":"each","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "</select>";
},"useData":true});
return templates;
});