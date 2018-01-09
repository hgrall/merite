import * as React from 'react';
import * as ReactDOM from 'react-dom';

import {MuiThemeProvider} from 'material-ui/styles';
import {Regles} from './composants/Regles';
import {Message} from './composants/Message';
import {BarreEnvoi} from './composants/BarreEnvoi';
import {NewMessage} from './composants/NewMessage'

const styles = {
  largeIcon: {
    width: 60,
    height: 60,
  },
  container: {
    display: "flex" as 'flex',
    flexDirection: "column" as 'column',
    justifyContent: "space-between" as "space-between",
    alignContent: "center" as "center"
  },
  large: {
    width: 120,
    height: 120,
    padding: 30,
  },
  title: {
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
         <Regles/>
         <h1 style={styles.title}>Adressage et routage</h1>
         <Message style={styles.message}/>
         <BarreEnvoi/>
         <NewMessage/>
      </div>
    );
  }
}