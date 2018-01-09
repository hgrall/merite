import * as React from 'react';
import {MessageCases} from './MessageCases';
import {TraiterMessage} from './TraiterMessage';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import {Message} from './MessageBox'
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
        <MessageCases message={this.props.message}/>
        <TraiterMessage message={this.props.message}/>
        Verrouillé : {this.props.message.locked ? 'Oui' : 'Non'}
       </Paper>
        
      </div>
    );
  }
  verouiller(){
      return false; 
  }
}
