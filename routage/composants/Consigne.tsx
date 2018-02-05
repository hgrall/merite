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
       {//Domaine destinataire: <IdentifiantCases int={this.props.consigne.ID_dom_cible.domaine} />
       }
       Domaine destinataire: {this.props.consigne.mot_cible['structure'].tableau.slice(0,binaire(NOMBRE_DE_DOMAINES).tableauBinaire().length).toString()}
        <br/>
        {//Utilisateur destinataire: <IdentifiantCases int={this.props.consigne.ID_util_cible.pseudo} />
        }
        Utilisateur destinataire: {this.props.consigne.mot_cible['structure'].tableau.slice(binaire(NOMBRE_DE_DOMAINES).tableauBinaire().length,binaire(NOMBRE_DE_DOMAINES).tableauBinaire().length+binaire(UTILISATEURS_PAR_DOMAINE).tableauBinaire().length).toString()}
        <br/>
        Contenu du message à envoyer: {this.props.consigne.mot_cible['structure'].tableau.slice(binaire(NOMBRE_DE_DOMAINES).tableauBinaire().length+binaire(UTILISATEURS_PAR_DOMAINE).tableauBinaire().length).toString()}
      </div>
    );
  }
}