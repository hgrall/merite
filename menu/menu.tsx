import * as React from 'react';
import * as ReactDOM from 'react-dom';

import {BoutonJeu} from "./composants/BoutonJeu";
import {MuiThemeProvider} from 'material-ui/styles';

export class Menu extends React.Component<any, any> {
  constructor(props: any){
      super(props);
  }

  public render() {
    const jeux = [
      {
        nom :"Chat", 
        disabled: false, 
        link: "/chat/"
      },
      {
        nom: "Adressage et Routage",
        disabled: true, 
        link: ""
      },
      {
        nom: "Jeu 3",
        disabled: true, 
        link: ""
      },
      {
        nom: "Jeu 4",
        disabled: true, 
        link: ""
      },
      {
        nom: "Jeu 5",
        disabled: true, 
        link: ""
      }
    ];

    return (
      <div>
        {jeux.map((jeu) =>
          <BoutonJeu nom={jeu.nom} disabled={jeu.disabled} link={jeu.link}/>
        )}
      </div>
    );
  }
}