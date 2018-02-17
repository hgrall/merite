import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Consigne } from '../commun/communRoutage'; 
import { IdentifiantCases } from './IdentifiantCases';
import { NOMBRE_DE_DOMAINES, UTILISATEURS_PAR_DOMAINE, NOMBRE_UTILISATEURS_PAR_DOMAINE } from '../config';
import { binaire, Mot, motAleatoire, creerMot , tableauBinaireAleatoire} from '../../bibliotheque/binaire';

interface ConsigneProps {
  consigne: Consigne
}

const styles = {
};

export class ConsigneDom extends React.Component<ConsigneProps, any> {
  render() {
    return (
      <div>
        Domaine destinataire: <IdentifiantCases int={this.props.consigne[0].domaine} />
        <br/>
        Utilisateur destinataire: <IdentifiantCases int={this.props.consigne[1].pseudo} />
        <br/>
        Contenu du message à envoyer: {this.props.consigne[2]['structure'].tableau.toString()}
      </div>
    );
  }
}