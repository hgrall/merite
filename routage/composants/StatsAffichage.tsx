import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Consigne, Stats } from '../commun/communRoutage'; 
import { IdentifiantCases } from './IdentifiantCases';
import { binaire, Mot, motAleatoire, creerMot , tableauBinaireAleatoire} from '../../bibliotheque/binaire';

interface StatsProps {
  stats: Stats;
}

const styles = {
};

export class StatsDom extends React.Component<StatsProps, any> {
  render() {
    return (
      <div>
       {
      // Domaine destinataire: <IdentifiantCases int={this.props.consigne.ID_dom_cible.domaine} />
       }
       Nombre total de messages envoyes : {this.props.stats[0][1]};
        <br/>
        {//Utilisateur destinataire: <IdentifiantCases int={this.props.consigne.ID_util_cible.pseudo} />
        }
        
        Nombre total de messages bien decodes : {this.props.stats[1][1]};
        <br/>
        {//Contenu du message à envoyer: {this.props.consigne.mot_cible['structure'].tableau.toString()}
        }
        Nombre total de messages non decodes : {this.props.stats[2][1]};
      </div>
    );
  }
}