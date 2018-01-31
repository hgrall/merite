import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Consigne } from '../commun/communRoutage'; 
import { IdentifiantCases } from './IdentifiantCases';

interface ConsigneProps {
  consigne: Consigne
}

const styles = {
};

export class ConsigneDom extends React.Component<ConsigneProps, any> {
  render() {
    return (
      <div>
        Domaine destinataire: <IdentifiantCases int={this.props.consigne.ID_dom_cible.domaine} />
        <br/>
        Utilisateur destinataire: <IdentifiantCases int={this.props.consigne.ID_util_cible.pseudo} />
        <br/>
        Contenu du message à envoyer: {this.props.consigne.mot_cible['structure'].tableau.toString()}
      </div>
    );
  }
}