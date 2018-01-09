import * as React from 'react';
import GridList from 'material-ui/GridList';
import {Case} from './Case';

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

export class MessageCases extends React.Component<any, any> {
    constructor(props: any){
        super(props);
    }

    public render() {
      const col = 8; 
      const lig = 3; 
      return (

        <div style={styles.root}>
          <div className="row" style={styles.lig}>
              <Case class="col-1"/>
              <Case class="col-1"/>
              <Case class="col-1"/>
              <Case class="col-1"/>
              <Case class="col-1"/>
              <Case class="col-1"/>
              <Case class="col-1"/>
              <Case class="col-1"/>
              <Case class="col-1"/>
              <Case class="col-1"/>
              <Case class="col-1"/>
              <Case class="col-1"/>
              <Case class="col-1"/>
              <Case class="col-1"/>
              <Case class="col-1"/>
              <Case class="col-1"/>
          </div>
        </div>
      );
    }
}
