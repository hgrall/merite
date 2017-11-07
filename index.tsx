import * as React from "react";
import * as ReactDOM from 'react-dom';

import {
   BrowserRouter as Router,
   Route,
   Link
} from 'react-router-dom'

import {MuiThemeProvider} from 'material-ui/styles';
import {Menu} from "./menu/menu";
const App = () => (
  <MuiThemeProvider>
    <Router>
        <div>
        {/* <Menu/> */}
        </div>
    </Router>
  </MuiThemeProvider>
);
ReactDOM.render(
     <App/>,
     document.getElementById('example')
);