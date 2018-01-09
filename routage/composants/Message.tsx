import * as React from 'react';
import GridList from 'material-ui/GridList';
import {Card, CardHeader} from 'material-ui/Card';
import {MessageCases} from './MessageCases';
const styles = {
    root: {
      display: "flex" as 'flex',
      flexWrap: "wrap" as 'wrap',
      justifyContent: "center" as 'center',
      margin: '30px'
    },
    gridList: {
      overflowY: 'auto' as 'auto',
    }
  };

export class Message extends React.Component<any, any> {
    constructor(props: any){
        super(props);
    }

    public render() {
      return (
        <div style={styles.root}>
          <Card>
            <CardHeader
              title="Code ton message en cliquant sur les cases !"
            />
            
          </Card>
          
        </div>
      );
    }
}
