import * as React from 'react';
import GridList from 'material-ui/GridList';
import {CaseMessage} from './CaseMessage';

const styles = {
    root: {
      display: "flex" as 'flex',
      flexWrap: "wrap" as 'wrap',
      justifyContent: "center" as 'center'
    },
    gridList: {
      width: 41,
      height: 45,
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
          <GridList
          cellHeight={'auto'}
          cols={8}
          padding={0}
          style={styles.root}
        >
            <CaseMessage/>
            <CaseMessage/>
            <CaseMessage/>
            <CaseMessage/>
            <CaseMessage/>
            <CaseMessage/>
            <CaseMessage/>
            <CaseMessage/>

            <CaseMessage/>
            <CaseMessage/>
            <CaseMessage/>
            <CaseMessage/>
            <CaseMessage/>
            <CaseMessage/>
            <CaseMessage/>
            <CaseMessage/>

            <CaseMessage/>
            <CaseMessage/>
            <CaseMessage/>
            <CaseMessage/>
            <CaseMessage/>
            <CaseMessage/>
            <CaseMessage/>
            <CaseMessage/>
        </GridList>
        </div>
      );
    }
}
