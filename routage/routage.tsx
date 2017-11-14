import * as React from 'react';
import * as ReactDOM from 'react-dom';

import {MuiThemeProvider} from 'material-ui/styles';
import {Regles} from './composants/Regles';
import {Message} from './composants/Message';

export class Routage extends React.Component<any, any> {
  constructor(props: any){
      super(props);
  }

  public render() {
    return (
      <div>
         <Regles/>
         <Message/>
      </div>
    );
  }
}