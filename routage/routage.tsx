import * as React from 'react';
import * as ReactDOM from 'react-dom';

import {MuiThemeProvider} from 'material-ui/styles';
import {Regles} from './composants/Regles';
import {Message} from './composants/Message';
import {BarreEnvoi} from './composants/BarreEnvoi';

import {MessageBox} from './composants/MessageBox';
import AppBar from 'material-ui/AppBar';
import Paper from 'material-ui/Paper';

const styles = {
  container: {
    display: "flex" as 'flex',
    flexDirection: "column" as 'column',
    justifyContent: "flex-start" as "flex-start",
    alignContent: "center" as "center",
    position: 'absolute' as 'absolute',
    left: '0',
    right: '0',
  },
  paper: {
    flexShrink: 1,
    flexGrow: 1,
    alignSelf: "stretch" as "stretch",
    margin: '30px',
    display: "flex" as "flex",
    flexDirection: "column" as 'column',
    alignContent: "center" as "center"
  },
  title: {
    display: "flex" as 'flex',
    margin: '30px',
    justifyContent: "center" as 'center'
  },
  appTitle: {
    display: "flex" as 'flex',
    justifyContent: "center" as 'center'
  },
  message: {
    alignSelf: "center" as "center"
  }
};

export class Routage extends React.Component<any, any> {
  constructor(props: any){
      super(props);
  }

  public render() {
    return (
      <div style={styles.container}>
        <AppBar
          title="Merite"
          titleStyle={styles.appTitle}
          showMenuIconButton={false}
        />
         <Regles/>
         <Paper zDepth={2} style={styles.paper}>
          <h3 style={styles.title}>Messages à traiter</h3>
          <MessageBox/>
         </Paper>
      </div>
    );
  }
}