import * as React from 'react';
import GridList from 'material-ui/GridList';
import {Case} from './Case';
import {Message} from './MessageBox';

interface MessageProps {
  message: Message
}
const styles = {
    root: {
      margin: '30px'
    },
    lig: {
      display: "flex" as 'flex',
      flexWrap: "wrap" as 'wrap',
      justifyContent: "center" as 'center'
    }
  };

export class MessageCases extends React.Component<MessageProps, any> {
    constructor(props: any){
        super(props);
    }

    public render() {
      var locked = this.props.message.locked;
      var casesList = this.props.message.corps.map(function(int){
        return <Case colored={int} locked={locked}/>;
      })
      return (

        <div style={styles.root}>
          <div className="row" style={styles.lig}>
          {casesList}
          </div>
        </div>
      );
    }
}
