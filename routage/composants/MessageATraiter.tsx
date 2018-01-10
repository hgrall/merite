import * as React from 'react';
import {MessageCases} from './MessageCases';
import {TraiterMessage} from './TraiterMessage';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import {Message} from './MessageBox'
import {EnvoyePar} from './EnvoyePar'

const styles = {
  root: {
    display: "flex" as 'flex',
    flexWrap: "wrap" as 'wrap',
    justifyContent: "center" as 'center',
    flexDirection: "column" as "column",
    alignItems : "stretch" as "stretch",
    margin: '30px'
  },
  container: {
    display: "flex" as 'flex',
    flexWrap: "wrap" as 'wrap',
    justifyContent: "space-between" as 'space-between',
    margin: '30px',
    alignItems: 'baseline' as 'baseline'
  },
  margin: {
    margin: '15px'
  }
};
interface MessageProps {
    message: Message
  }

const Messages = [];

export class MessageATraiter extends React.Component<MessageProps, any> {
  
  constructor(props: any){
      super(props);
  }

  public render() {
    return (
      <div style={styles.root}>
       <Paper zDepth={2}>
        <EnvoyePar source={this.props.message.source}/>
        <MessageCases message={this.props.message}/>
        <div style={styles.container}>
          Verrouillé : {this.props.message.locked ? 'Oui' : 'Non'}
          <TraiterMessage message={this.props.message}/>
        </div>
       </Paper>
        
      </div>
    );
  }
  verouiller(){
      return false; 
  }
}
