import * as React from 'react';
import GridList from 'material-ui/GridList';
import {Case} from './Case';
import { Deux } from '../../bibliotheque/types/mutable'
import { binaire } from '../../bibliotheque/binaire'


interface MessageProps {
  int: ReadonlyArray<Deux>
}
const styles = {
    lig: {
        display: "flex" as 'flex',
        flexWrap: "wrap" as 'wrap'
    }
  };

export class IdentifiantCases extends React.Component<MessageProps, any> {
    constructor(props: any){
        super(props);
    }

    public render() {
      var casesList = this.props.int.map(function(int){
        let CaseItem = <Case colored={int} locked={true}/>;
        return CaseItem;
      })
      return (

        <div>
          <div className="row" style={styles.lig}>
          {casesList}
          </div>
        </div>
      );
    }
}
