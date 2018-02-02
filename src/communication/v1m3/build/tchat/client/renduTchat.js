"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var ReactDOM = require("react-dom");
var styled_components_1 = require("styled-components");
var corps_1 = require("./corps");
styled_components_1.injectGlobal(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n    * { \n        margin: 0; \n        padding: 0; \n        box-sizing: border-box;\n        font-family: Verdana, Geneva, sans serif;\n    }\n"], ["\n    * { \n        margin: 0; \n        padding: 0; \n        box-sizing: border-box;\n        font-family: Verdana, Geneva, sans serif;\n    }\n"])));
ReactDOM.render(React.createElement(corps_1.Corps, null), document.getElementById("conteneur"));
var templateObject_1;
//# sourceMappingURL=renduTchat.js.map