import * as React from 'react';
import GridList from 'material-ui/GridList';
import {Case} from './Case';
import { MessageJeu1, TypeMessageJeu1 } from '../commun/communRoutage'
import { Mot } from '../../bibliotheque/binaire'


interface MessageProps {
  message: Mot,
  locked: boolean,
  changeColor?: (n : number) => void
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
      var locked = this.props.locked;
      var changeColor = this.props.changeColor;
      var id = 0;
      var casesList = this.props.message['structure'].tableau.map(function(int){
        let CaseItem = <Case colored={int} locked={locked} changeColor={changeColor ? changeColor : (n : number)=>{}} id={id}/>;
        id ++; 
        return CaseItem;
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
