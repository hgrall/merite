import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { CanalClient, creerCanalClient } from '../bibliotheque/client';

import { MuiThemeProvider } from 'material-ui/styles';
import { Regles } from './composants/Regles';
import { NewMessage } from './composants/NewMessage';
import { BarreEnvoi } from './composants/BarreEnvoi';
import {Identifiant, creerIdentifiant} from '../bibliotheque/types/identifiant'
import {FormatTableImmutable, FABRIQUE_TABLE} from '../bibliotheque/types/table'
import { creerDateMaintenant, conversionDate } from '../bibliotheque/types/date'
import { creerMot } from '../bibliotheque/binaire'
import { MessageBox } from './composants/MessageBox';
import AppBar from 'material-ui/AppBar';
import Paper from 'material-ui/Paper';
import { hote, port2, FormatConfigurationJeu1, creerConfigurationJeu1, ConfigurationJeu1, FormatMessageJeu1, MessageJeu1, FormatErreurJeu1, EtiquetteMessageJeu1, FormatSommetJeu1, TypeMessageJeu1 } from './commun/communRoutage';

const styles = {
	container: {
		display: 'flex' as 'flex',
		flexDirection: 'column' as 'column',
		justifyContent: 'flex-start' as 'flex-start',
		alignContent: 'center' as 'center',
		position: 'absolute' as 'absolute',
		left: '0',
		right: '0'
	},
	paper: {
		flexShrink: 1,
		flexGrow: 1,
		alignSelf: 'stretch' as 'stretch',
		margin: '30px',
		display: 'flex' as 'flex',
		flexDirection: 'column' as 'column',
		alignContent: 'center' as 'center'
	},
	title: {
		display: 'flex' as 'flex',
		margin: '30px',
		justifyContent: 'center' as 'center'
	},
	appTitle: {
		display: 'flex' as 'flex',
		justifyContent: 'center' as 'center'
	},
	message: {
		alignSelf: 'center' as 'center'
	}
};

type CanalJeu1 = CanalClient<FormatErreurJeu1, FormatConfigurationJeu1, FormatMessageJeu1, FormatMessageJeu1, EtiquetteMessageJeu1>;

interface FormState { 
	dom: Identifiant<'sommet'>,
	util: Identifiant<'utilisateur'>,
	messages: Array<FormatMessageJeu1>,
	voisinFst: Identifiant<'sommet'>,
	voisinSnd: Identifiant<'sommet'>,
  }

export class Routage extends React.Component<any, FormState> {
	private adresseServeur: string;
	private canal: CanalJeu1;
	private config: ConfigurationJeu1;
	private messageErreur: string;

	state: FormState = {
		messages: [],
		dom: creerIdentifiant('sommet',''),
		util: creerIdentifiant('utilisateur',''),
		voisinFst: creerIdentifiant('sommet',''),
		voisinSnd: creerIdentifiant('sommet',''),
	}

	constructor(props: any) {
		super(props);
		this.adresseServeur = hote + ':' + port2;
		this.messageErreur = 'Aucune erreur';
	}

	envoiMessage = () => {
		console.log('called');
		this.canal.envoyerMessage(new MessageJeu1({
			ID: creerIdentifiant('message',''),
			ID_emetteur: this.state.util,
			ID_origine: this.state.dom,
			ID_destination: this.state.voisinFst,
			type: TypeMessageJeu1.INIT,
			contenu: creerMot([0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1]),
			date: conversionDate(new Date())
		  }))
	}

	componentWillMount(): void {
		console.log('* Initialisation après montage du corps');

		console.log("- du canal de communication avec le serveur d'adresse " + this.adresseServeur);
		this.canal = creerCanalClient(this.adresseServeur);

		console.log('- du traitement des messages');
		this.canal.enregistrerTraitementMessageRecu((m: any) => {
			let msg = new MessageJeu1(m);
			console.log('* Réception');
			console.log('- du message brut : ' + msg.brut());
			console.log('- du message net : ' + msg.representation());

			let contenu: string = m.contenu;
			switch (m.type) {
				case TypeMessageJeu1.TRANSIT:

					console.log('utilisateur recoit un message');
					// l'utilisateur recoit un message du serveur et le place en transit 
					break;
				case TypeMessageJeu1.ACTIF:
					// l'utilisateur active un message apres une demande de verouillage réussi coté serveur
					break;
				case TypeMessageJeu1.SUCCES_FIN:
					// l'utilisateur gagne la partie
					break;
				case TypeMessageJeu1.ECHEC_FIN:
					// l'utilisateur perd la partie 
					break;
				case TypeMessageJeu1.IGNOR:
					// l'utilisateur détruit le message à la demande du serveur 
					break;
				default:
			}
			
		});

		console.log('- du traitement de la configuration');
		this.canal.enregistrerTraitementConfigurationRecue((c: FormatConfigurationJeu1) => {
			this.config = creerConfigurationJeu1(c);
			console.log(this.config.val().voisins.table);
			this.setState({
				dom: this.config.val().centre.ID,
				messages: [],
				util: this.config.val().utilisateur.ID,
				voisinFst: this.config.val().voisins.table['DOM-1'].ID, // TO DO recuperer nom voisins
				voisinSnd: this.config.val().voisins.table['DOM-3'].ID
			});
			this.config.val().utilisateur.ID
			console.log(this.config.net("centre"));
			console.log('* Réception');
			console.log('- de la configuration brute : ' + this.config.brut());
			console.log('- de la configuration nette : ' + this.config.representation());
		});
	}

	public render() {
		return (
			<div style={styles.container}>
				<AppBar title="Merite" titleStyle={styles.appTitle} showMenuIconButton={false} />
				<Regles />
				<p>
				Domaine : {this.state.dom.val}  
				Utilisateur : {this.state.util.val}
				</p>
				<Paper zDepth={2} style={styles.paper}>
					<h3 style={styles.title}>Messages à traiter</h3>
					<NewMessage envoyerMessage={this.envoiMessage}/>
					<MessageBox />
				</Paper>
			</div>
		);
	}
}
