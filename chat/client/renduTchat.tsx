import * as React from "react";
import * as ReactDOM from "react-dom";

import Scrollbars from "react-custom-scrollbars";


import styled from "styled-components";
import { injectGlobal } from "styled-components";

import { Corps } from "./corps";

injectGlobal`
    * { 
        margin: 0; 
        padding: 0; 
        box-sizing: border-box;
        font-family: Verdana, Geneva, sans serif;
    }
`;


export class RenduTchat extends React.Component<any, any> {
  constructor(props: any){
      super(props);
  }

  public render() {
    return (
        <Corps />
    );
  }
}