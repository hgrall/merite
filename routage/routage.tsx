import * as React from 'react';
import * as ReactDOM from 'react-dom';

import {MuiThemeProvider} from 'material-ui/styles';
import IconButton from 'material-ui/IconButton';
import ArrowBack from 'material-ui/svg-icons/navigation/arrow-back';
import ArrowForward from 'material-ui/svg-icons/navigation/arrow-forward';
import {Regles} from './composants/Regles';
import {Message} from './composants/Message';

const styles = {
  largeIcon: {
    width: 60,
    height: 60,
  },
  container: {
    display: "flex" as 'flex',
    flexDirection: "column" as 'column'
  },
  large: {
    width: 120,
    height: 120,
    padding: 30,
  },
  title: {
    display: "flex" as 'flex',
    justifyContent: "center" as 'center'
  }
};

export class Routage extends React.Component<any, any> {
  constructor(props: any){
      super(props);
  }

  public render() {
    return (
      <div style={styles.container}>
         <Regles/>
         <h1 style={styles.title}>Adressage et routage</h1>
         <Message/>
         <IconButton
          tooltip="Send"
            iconStyle={styles.largeIcon}
            style={styles.large}
          >
            <ArrowBack/> 
          </IconButton> 
          <IconButton
          tooltip="Send"
            iconStyle={styles.largeIcon}
            style={styles.large}
          >
            <ArrowForward/>
          </IconButton> 
      </div>
    );
  }
}