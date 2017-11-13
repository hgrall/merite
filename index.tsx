import * as React from "react";
import * as ReactDOM from 'react-dom';

import {
   BrowserRouter as Router,
   Route,
   Link
} from 'react-router-dom'

import {MuiThemeProvider} from 'material-ui/styles';
import {Menu} from "./menu/menu";
import {RenduTchat} from './chat/client/renduTchat';
const App = () => (
  <MuiThemeProvider>
    <Router>
        <div>
            <Route exact={true} path="/" component={Menu}/>
            <Route path="/chat/" component={RenduTchat}/>
        </div>
    </Router>
  </MuiThemeProvider>
);
ReactDOM.render(
     <App/>,
     document.getElementById('example')
);