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

  return "                    <option value=\""
    + alias3(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"id","hash":{},"data":data}) : helper)))
    + "\">"
    + alias3(((helper = (helper = helpers.label || (depth0 != null ? depth0.label : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"label","hash":{},"data":data}) : helper)))
    + "</option>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "<div id=\"calculation-"
    + alias3(((helper = (helper = helpers.calculationNum || (depth0 != null ? depth0.calculationNum : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"calculationNum","hash":{},"data":data}) : helper)))
    + "\" class=\"calculationBlockWrapper\">\n\n    <a href=\"#\" id=\"rule_"
    + alias3(((helper = (helper = helpers.ruleNum || (depth0 != null ? depth0.ruleNum : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"ruleNum","hash":{},"data":data}) : helper)))
    + "_calculation_"
    + alias3(((helper = (helper = helpers.calculationNum || (depth0 != null ? depth0.calculationNum : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"calculationNum","hash":{},"data":data}) : helper)))
    + "_remove\" data-action=\"removeCalculation\" class=\"btnRemove  btnRemove--calculation\" >remove</a>\n\n    <div class=\"ruleWrapperBlockCalculationBlock operation\">\n\n        <select name=\"rule_"
    + alias3(((helper = (helper = helpers.ruleNum || (depth0 != null ? depth0.ruleNum : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"ruleNum","hash":{},"data":data}) : helper)))
    + "_calculationblock_"
    + alias3(((helper = (helper = helpers.calculationNum || (depth0 != null ? depth0.calculationNum : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"calculationNum","hash":{},"data":data}) : helper)))
    + "_calculationoperator\" id=\"rule_"
    + alias3(((helper = (helper = helpers.ruleNum || (depth0 != null ? depth0.ruleNum : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"ruleNum","hash":{},"data":data}) : helper)))
    + "_calculationblock_"
    + alias3(((helper = (helper = helpers.calculationNum || (depth0 != null ? depth0.calculationNum : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"calculationNum","hash":{},"data":data}) : helper)))
    + "_calculationoperator\" data-calculation-control=\"calculationoperator\" size=\"1\">\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.logicOperatorNormal : depth0),{"name":"each","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "        </select>\n\n    </div>\n\n    <div class=\"ruleWrapperBlockCalculationBlock  operand\">\n\n        <div class=\"ruleWrapperBlockCalculationOperandBlock\">\n\n            <span class=\"ruleWrapperBlockLabel\">Answer of question</span>\n\n            <select name=\"rule_"
    + alias3(((helper = (helper = helpers.ruleNum || (depth0 != null ? depth0.ruleNum : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"ruleNum","hash":{},"data":data}) : helper)))
    + "_calculationblock_"
    + alias3(((helper = (helper = helpers.calculationNum || (depth0 != null ? depth0.calculationNum : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"calculationNum","hash":{},"data":data}) : helper)))
    + "_questionoperand\" id=\"rule_"
    + alias3(((helper = (helper = helpers.ruleNum || (depth0 != null ? depth0.ruleNum : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"ruleNum","hash":{},"data":data}) : helper)))
    + "_calculationblock_"
    + alias3(((helper = (helper = helpers.calculationNum || (depth0 != null ? depth0.calculationNum : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"calculationNum","hash":{},"data":data}) : helper)))
    + "_questionoperand\" size=\"4\" data-calculation-control=\"questionoperand\" multiple>\n                <option value=\"\">None</option>\n                [[[questionValues]]]\n            </select>\n\n        </div>\n\n        <div class=\"ruleWrapperBlockCalculationOperandBlock\">\n\n            <span class=\"ruleWrapperBlockLabel\"><strong>OR</strong> Custom value type</span>\n\n            <select name=\"rule_"
    + alias3(((helper = (helper = helpers.ruleNum || (depth0 != null ? depth0.ruleNum : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"ruleNum","hash":{},"data":data}) : helper)))
    + "_calculationblock_"
    + alias3(((helper = (helper = helpers.calculationNum || (depth0 != null ? depth0.calculationNum : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"calculationNum","hash":{},"data":data}) : helper)))
    + "_operandcustomvaluetype\" id=\"rule_"
    + alias3(((helper = (helper = helpers.ruleNum || (depth0 != null ? depth0.ruleNum : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"ruleNum","hash":{},"data":data}) : helper)))
    + "_calculationblock_"
    + alias3(((helper = (helper = helpers.calculationNum || (depth0 != null ? depth0.calculationNum : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"calculationNum","hash":{},"data":data}) : helper)))
    + "_operandcustomvaluetype\" data-calculation-control=\"operandcustomvaluetype\"size=\"1\">\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.valueDataTypesDropdown : depth0),{"name":"each","hash":{},"fn":this.program(3, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "            </select>\n\n        </div>\n\n\n        <div class=\"ruleWrapperBlockCalculationOperandBlock\">\n\n            <span class=\"ruleWrapperBlockLabel\">Value</span>\n\n            <input type=\"text\" value=\"\" name=\"rule_"
    + alias3(((helper = (helper = helpers.ruleNum || (depth0 != null ? depth0.ruleNum : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"ruleNum","hash":{},"data":data}) : helper)))
    + "_calculationblock_"
    + alias3(((helper = (helper = helpers.calculationNum || (depth0 != null ? depth0.calculationNum : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"calculationNum","hash":{},"data":data}) : helper)))
    + "_operandcustomvalue\" id=\"rule_"
    + alias3(((helper = (helper = helpers.ruleNum || (depth0 != null ? depth0.ruleNum : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"ruleNum","hash":{},"data":data}) : helper)))
    + "_calculationblock_"
    + alias3(((helper = (helper = helpers.calculationNum || (depth0 != null ? depth0.calculationNum : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"calculationNum","hash":{},"data":data}) : helper)))
    + "_operandcustomvalue\" data-calculation-control=\"operandcustomvalue\">\n\n        </div>\n\n    </div>\n\n</div>";
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

  return "<label for=\"cmsContentCategoryID\">Content category</label>\n<select class=\"\" id=\"cmsContentCategoryID\" name=\"cmsContentCategoryID\" size=\"1\">\n"
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

  return "<label for=\"cmsContentTypeID\">Content type</label>\n<select class=\"\" id=\"cmsContentTypeID\" name=\"cmsContentTypeID\" size=\"1\">\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.cmsContentTypes : depth0),{"name":"each","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "</select>";
},"useData":true});
templates['endPointTypes.hbs'] = template({"1":function(depth0,helpers,partials,data) {
    var helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "  <option value=\""
    + alias3(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"id","hash":{},"data":data}) : helper)))
    + "\">"
    + alias3(((helper = (helper = helpers.label || (depth0 != null ? depth0.label : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"label","hash":{},"data":data}) : helper)))
    + "</option>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return "<label for=\"endPointTypeID\">End point type</label>\n<select class=\"\" id=\"endPointTypeID\" name=\"endPointTypeID\" size=\"1\">\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.endPointTypes : depth0),{"name":"each","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "</select>";
},"useData":true});
templates['logicAction.hbs'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "<div id=\"action-"
    + alias3(((helper = (helper = helpers.actionNum || (depth0 != null ? depth0.actionNum : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"actionNum","hash":{},"data":data}) : helper)))
    + "\" class=\"logic-action\">\n\n    <a href=\"#\" id=\"rule_"
    + alias3(((helper = (helper = helpers.ruleNum || (depth0 != null ? depth0.ruleNum : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"ruleNum","hash":{},"data":data}) : helper)))
    + "_action_"
    + alias3(((helper = (helper = helpers.actionNum || (depth0 != null ? depth0.actionNum : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"actionNum","hash":{},"data":data}) : helper)))
    + "_remove\" data-action=\"removeAction\" class=\"btnRemove  btnRemove--rule\" >remove</a>\n\n    <div class=\"ruleWrapper\">\n\n        <span class=\"ruleWrapperBlockTitle  ruleWrapperBlockTitle--bottomMargin  sort\">Sort</span>\n\n        <label for=\"rule_"
    + alias3(((helper = (helper = helpers.ruleNum || (depth0 != null ? depth0.ruleNum : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"ruleNum","hash":{},"data":data}) : helper)))
    + "_sortindex\">\n            <input type=\"number\" value=\""
    + alias3(((helper = (helper = helpers.ruleSortIndex || (depth0 != null ? depth0.ruleSortIndex : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"ruleSortIndex","hash":{},"data":data}) : helper)))
    + "\" class=\"short\" name=\"rule_"
    + alias3(((helper = (helper = helpers.ruleNum || (depth0 != null ? depth0.ruleNum : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"ruleNum","hash":{},"data":data}) : helper)))
    + "_sortindex\" id=\"rule_"
    + alias3(((helper = (helper = helpers.ruleNum || (depth0 != null ? depth0.ruleNum : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"ruleNum","hash":{},"data":data}) : helper)))
    + "_sortindex\">\n        </label>\n\n    </div>\n\n    <div class=\"actionWrapper  actionWrapper--block\">\n\n        <div class=\"actionWrapperBlock\">\n            <div class=\"logic-circle\"></div><span>Logic "
    + alias3(((helper = (helper = helpers.actionNum || (depth0 != null ? depth0.actionNum : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"actionNum","hash":{},"data":data}) : helper)))
    + " - "
    + alias3(((helper = (helper = helpers.actionLabel || (depth0 != null ? depth0.actionLabel : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"actionLabel","hash":{},"data":data}) : helper)))
    + "</span>\n        </div>\n\n    </div>\n\n</div>";
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

  return "                            <option value=\""
    + alias3(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"id","hash":{},"data":data}) : helper)))
    + "\">"
    + alias3(((helper = (helper = helpers.label || (depth0 != null ? depth0.label : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"label","hash":{},"data":data}) : helper)))
    + "</option>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "<div id=\"rule-"
    + alias3(((helper = (helper = helpers.ruleNum || (depth0 != null ? depth0.ruleNum : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"ruleNum","hash":{},"data":data}) : helper)))
    + "\" class=\"logic-rule\">\n\n    <a href=\"#\" id=\"rule_"
    + alias3(((helper = (helper = helpers.ruleNum || (depth0 != null ? depth0.ruleNum : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"ruleNum","hash":{},"data":data}) : helper)))
    + "_remove\" data-action=\"removeRule\" class=\"btnRemove  btnRemove--rule\" >remove</a>\n\n    <div id=\"\" class=\"ruleForm\">\n\n        <div class=\"ruleWrapper\">\n\n            <span class=\"ruleWrapperBlockTitle  ruleWrapperBlockTitle--bottomMargin  sort\">Sort</span>\n\n            <label for=\"rule_"
    + alias3(((helper = (helper = helpers.ruleNum || (depth0 != null ? depth0.ruleNum : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"ruleNum","hash":{},"data":data}) : helper)))
    + "_sortindex\">\n                <input type=\"number\" value=\""
    + alias3(((helper = (helper = helpers.ruleSortIndex || (depth0 != null ? depth0.ruleSortIndex : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"ruleSortIndex","hash":{},"data":data}) : helper)))
    + "\" class=\"short\" name=\"rule_"
    + alias3(((helper = (helper = helpers.ruleNum || (depth0 != null ? depth0.ruleNum : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"ruleNum","hash":{},"data":data}) : helper)))
    + "_sortindex\" id=\"rule_"
    + alias3(((helper = (helper = helpers.ruleNum || (depth0 != null ? depth0.ruleNum : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"ruleNum","hash":{},"data":data}) : helper)))
    + "_sortindex\" data-calculation-control=\"sortindex\">\n            </label>\n\n        </div>\n\n        <div class=\"ruleWrapper ruleWrapper--block\">\n\n            <div class=\"ruleWrapperBlock prefix\">\n\n                <span class=\"ruleWrapperBlockTitle  ruleWrapperBlockTitle--bottomMargin\">Prefix</span>\n\n                <select name=\"rule_"
    + alias3(((helper = (helper = helpers.ruleNum || (depth0 != null ? depth0.ruleNum : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"ruleNum","hash":{},"data":data}) : helper)))
    + "_prefixoperator\" id=\"rule_"
    + alias3(((helper = (helper = helpers.ruleNum || (depth0 != null ? depth0.ruleNum : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"ruleNum","hash":{},"data":data}) : helper)))
    + "_prefixoperator\" size=\"1\" data-calculation-control=\"prefixoperator\">\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.logicOperatorPrefix : depth0),{"name":"each","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "                </select>\n\n            </div>\n\n            <div class=\"ruleWrapperBlock  calculations\">\n\n                <span class=\"ruleWrapperBlockTitle\">Calculation Blocks</span>\n\n                <div class=\"ruleWrapperBlockCalculationBlocks\">\n\n                    <div class=\"ruleWrapperBlockCalculationBlockWrapper\">\n\n                        <header>\n\n                        <div class=\"ruleWrapperBlockCalculationBlock operation\">\n\n                            <span class=\"ruleWrapperCalculationBlockTitle\">Operation</span>\n\n                        </div>\n\n                        <div class=\"ruleWrapperBlockCalculationBlock  operand\">\n\n                            <span class=\"ruleWrapperCalculationBlockTitle\">Operands</span>\n\n                        </div>\n\n                        </header>\n\n                        [[[calculationBlocks]]]\n\n                    </div>\n\n                    <button class=\"btnAddCalcBlock\" data-action=\"calculationBlock\" id=\"logic-header-button-add-calculation-block-rule-"
    + alias3(((helper = (helper = helpers.ruleNum || (depth0 != null ? depth0.ruleNum : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"ruleNum","hash":{},"data":data}) : helper)))
    + "\">Add calculation block</button>\n\n\n                </div>\n\n\n            </div>\n\n\n            <div class=\"ruleWrapperBlock suffix\">\n\n                <span class=\"ruleWrapperBlockTitle  ruleWrapperBlockTitle--bottomMargin\">Suffix</span>\n\n                <div class=\"ruleWrapperBlockSuffixBlock condition\">\n\n                    <select name=\"rule_"
    + alias3(((helper = (helper = helpers.ruleNum || (depth0 != null ? depth0.ruleNum : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"ruleNum","hash":{},"data":data}) : helper)))
    + "_suffixoperator\" id=\"rule_"
    + alias3(((helper = (helper = helpers.ruleNum || (depth0 != null ? depth0.ruleNum : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"ruleNum","hash":{},"data":data}) : helper)))
    + "_suffixoperator\" size=\"1\" data-calculation-control=\"suffixoperator\">\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.logicOperatorNormal : depth0),{"name":"each","hash":{},"fn":this.program(3, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "                    </select>\n\n\n                </div>\n\n                <div class=\"ruleWrapperBlockSuffixBlock  topMargin  answer\">\n\n                    <span class=\"ruleWrapperBlockLabel\">Select answer</span>\n\n                    <select name=\"rule_"
    + alias3(((helper = (helper = helpers.ruleNum || (depth0 != null ? depth0.ruleNum : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"ruleNum","hash":{},"data":data}) : helper)))
    + "_suffixansweroperands\" id=\"rule_"
    + alias3(((helper = (helper = helpers.ruleNum || (depth0 != null ? depth0.ruleNum : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"ruleNum","hash":{},"data":data}) : helper)))
    + "_suffixansweroperands\" size=\"4\" data-calculation-control=\"suffixansweroperands\" multiple>\n                        <option value=\"\">None</option>\n                        [[[answerValues]]]\n                    </select>\n\n                </div>\n\n                <div class=\"ruleWrapperBlockSuffixBlock  topMargin  customvalueType\">\n\n                    <span class=\"ruleWrapperBlockLabel\"><strong>OR</strong> Custom value type</span>\n\n                    <select name=\"rule_"
    + alias3(((helper = (helper = helpers.ruleNum || (depth0 != null ? depth0.ruleNum : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"ruleNum","hash":{},"data":data}) : helper)))
    + "_suffixcustomvaluetype\" id=\"rule_"
    + alias3(((helper = (helper = helpers.ruleNum || (depth0 != null ? depth0.ruleNum : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"ruleNum","hash":{},"data":data}) : helper)))
    + "_suffixcustomvaluetype\" size=\"1\" data-calculation-control=\"suffixcustomvaluetype\">\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.valueDataTypesDropdown : depth0),{"name":"each","hash":{},"fn":this.program(5, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "                    </select>\n\n\n                </div>\n\n                <div class=\"ruleWrapperBlockSuffixBlock  topMargin  customvalue\">\n\n                    <span class=\"ruleWrapperBlockLabel\">Value</span>\n\n                    <input type=\"text\" value=\"\" name=\"rule_"
    + alias3(((helper = (helper = helpers.ruleNum || (depth0 != null ? depth0.ruleNum : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"ruleNum","hash":{},"data":data}) : helper)))
    + "_suffixcustomvalue\" id=\"rule_"
    + alias3(((helper = (helper = helpers.ruleNum || (depth0 != null ? depth0.ruleNum : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"ruleNum","hash":{},"data":data}) : helper)))
    + "_suffixcustomvalue\" data-calculation-control=\"suffixcustomvalue\">\n\n                </div>\n\n\n            </div>\n\n        </div>\n\n    </div>\n\n</div>";
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