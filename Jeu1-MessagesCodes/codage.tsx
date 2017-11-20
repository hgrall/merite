
//import {RaisedButton} from "../node_modules/material-ui/RaisedButton";
import * as injectTapEventPlugin from 'react-tap-event-plugin';
import RaisedButton from "material-ui/RaisedButton";
import * as React from 'react';
//injectTapEventPlugin();

import { Component } from 'react';
//import {Link} from 'react-router-dom';

export class Codage extends React.Component<any, any> {
    constructor(props: any){
        super(props);
    }

    setColor(button:RaisedButton, color:String){
      button.props.backgroundColor
      //property: String;
      //property = document.getElementById(button);
      var colorOld = button.props.backgroundColor;
      if(colorOld = "#FFFFFF" ){
        //button.props.ba = "#171717";        
      }else{
        //button.props.backgroundColor = "#FFFFFF";        
      }
      };

    
    

    public render() {
      return (
        <div > 
          <RaisedButton 
            label={"Case 1"}
            disabled={this.props.disabled}
            labelColor={'White'}
            primary={true}>
          </RaisedButton>

          <RaisedButton 
            label={"Case 2"}
            disabled={this.props.disabled}
            labelColor={'white'}
            primary={true}>
          </RaisedButton>

          <RaisedButton 
            label={"Case 3"}
            disabled={this.props.disabled}
            labelColor={'white'}
            primary={true}>
          </RaisedButton>

          <RaisedButton 
            label={"Case 4"}
            disabled={this.props.disabled}
            labelColor={'white'}
            primary={true}>
          </RaisedButton>

          <RaisedButton 
            label={"Case 5"}
            disabled={this.props.disabled}
            labelColor={'white'}
            primary={true}>
          </RaisedButton>

          <RaisedButton 
            label={"Case 6"}
            disabled={this.props.disabled}
            labelColor={'white'}
            primary={true}>
          </RaisedButton>

          <RaisedButton 
            label={"Case 7"}
            disabled={this.props.disabled}
            labelColor={'white'}
            primary={true}>
          </RaisedButton>

          <RaisedButton 
            label={"Case 8"}
            disabled={this.props.disabled}
            labelColor={'white'}
            primary={true}>
          </RaisedButton>

        </div>
      );
    }
}


