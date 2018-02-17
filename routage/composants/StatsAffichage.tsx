import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Consigne, Stats } from '../commun/communRoutage'; 
import { IdentifiantCases } from './IdentifiantCases';
import { NOMBRE_DE_DOMAINES, UTILISATEURS_PAR_DOMAINE, NOMBRE_UTILISATEURS_PAR_DOMAINE } from '../config';
import { binaire, Mot, motAleatoire, creerMot , tableauBinaireAleatoire} from '../../bibliotheque/binaire';

interface StatsProps {
  stats?: Stats;
}

const styles = {
};

export class StatsDom extends React.Component<StatsProps, any> {
  render() {
    if(this.props.stats!= undefined){
      return (      
        <div>
          Nombre total de messages envoyes : {this.props.stats[0][1]};
          <br/>
          Nombre total de messages bien decodes : {this.props.stats[1][1]};
          <br/>
          Nombre total de messages non decodes : {this.props.stats[2][1]};
        </div>
      );
    }else{
      return(
        <div>
          Il n'y a pas de statistiques.
        </div>
      );
    }


  }
}