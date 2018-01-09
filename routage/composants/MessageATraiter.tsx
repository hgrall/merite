import * as React from 'react';
import {MessageCases} from './MessageCases';
import {TraiterMessage} from './TraiterMessage';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';

const styles = {
  root: {
    display: "flex" as 'flex',
    flexWrap: "wrap" as 'wrap',
    justifyContent: "center" as 'center',
    flexDirection: "column" as "column",
    alignItems : "stretch" as "stretch",
    margin: '30px'
  }
};

const Messages = [];

export class MessageATraiter extends React.Component<any, any> {
  
  constructor(props: any){
      super(props);
  }

  public render() {
    return (
      <div style={styles.root}>
       <Paper zDepth={2}>
        <MessageCases/>
        <TraiterMessage/>
        Verrouillé : {this.verouiller()}
       </Paper>
        
      </div>
    );
  }
  verouiller(){
      return false; 
  }
}
