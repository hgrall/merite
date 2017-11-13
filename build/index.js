"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var ReactDOM = require("react-dom");
var react_router_dom_1 = require("react-router-dom");
var styles_1 = require("material-ui/styles");
var menu_1 = require("./menu/menu");
var renduTchat_1 = require("./chat/client/renduTchat");
var App = function () { return (React.createElement(styles_1.MuiThemeProvider, null,
    React.createElement(react_router_dom_1.BrowserRouter, null,
        React.createElement("div", null,
            React.createElement(react_router_dom_1.Route, { exact: true, path: "/", component: menu_1.Menu }),
            React.createElement(react_router_dom_1.Route, { path: "/chat", component: renduTchat_1.RenduTchat }))))); };
ReactDOM.render(React.createElement(App, null), document.getElementById('example'));
//# sourceMappingURL=index.js.map