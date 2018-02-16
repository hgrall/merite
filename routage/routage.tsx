import * as React from 'react';
import * as ReactDOM from 'react-dom';

// Bibliotheque
import { Identifiant, creerIdentifiant } from '../bibliotheque/types/identifiant'
import { creerMot, Mot } from '../bibliotheque/binaire'
import { hote, port2, Consigne, FormatConfigurationJeu1, creerConfigurationJeu1,
	ConfigurationJeu1, FormatMessageJeu1, MessageJeu1, FormatErreurJeu1, EtiquetteMessageJeu1,
	FormatSommetJeu1, TypeMessageJeu1, FormatUtilisateur } from './commun/communRoutage';
import { CanalClient, creerCanalClient } from '../bibliotheque/client';


// Material-UI
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import AppBar from 'material-ui/AppBar';
import Paper from 'material-ui/Paper';

//Composants
import { Regles } from './composants/Regles';
import { NewMessage } from './composants/NewMessage';
import { MessageBox } from './composants/MessageBox';
import { IdentifiantCases } from './composants/IdentifiantCases';

// Fonctions clientes 
import {
	envoiMessage,
	envoiMessageInit,
	validerMessage,
	verrou, 
	deverrouiller
} from './client/clientRoutage'

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
	},
	dom : {
		display: "flex" as 'flex',
		sflexWrap: "wrap" as 'wrap',
	}
};

type CanalJeu1 = CanalClient<FormatErreurJeu1, FormatConfigurationJeu1, FormatMessageJeu1, FormatMessageJeu1, EtiquetteMessageJeu1>;

interface FormState { 
	dom: FormatSommetJeu1,
	util: FormatUtilisateur,
	messages: Array<MessageJeu1>,
	voisinFst: FormatSommetJeu1,
	voisinSnd: FormatSommetJeu1,
	openDialog: boolean,
	textDialog: string,
	consigne: Consigne
}

export class Routage extends React.Component<any, FormState> {
	private adresseServeur: string;
	private canal: CanalJeu1;
	private config: ConfigurationJeu1;
	private messageErreur: string;

	state: FormState = {
		messages: [],
		dom: {ID: creerIdentifiant('sommet',''), domaine:[]},
		util: {ID: creerIdentifiant('utilisateur',''), pseudo:[]},
		voisinFst: {ID: creerIdentifiant('sommet',''), domaine:[]},
		voisinSnd: {ID: creerIdentifiant('sommet',''), domaine:[]},
		openDialog: false,
		textDialog: '',
		consigne:[
			{ ID: creerIdentifiant('sommet', ''), domaine: [] },
			{ ID: creerIdentifiant('utilisateur', ''), pseudo: [] },
			creerMot([])
		]
	}

	constructor(props: any) {
		super(props);
		this.adresseServeur = hote + ':' + port2;
		this.messageErreur = 'Aucune erreur';
	}

	envoiMessageInit = (dest: Identifiant<'sommet'>, contenu: Mot) => {
		envoiMessageInit(this.canal, this.state.util.ID, this.state.dom.ID, dest, contenu);
	}

	envoiMessage = (dest: Identifiant<'sommet'>, idMessage: Identifiant<'message'>, contenu: Mot) => {
		envoiMessage(this.canal, this.state.util.ID, this.state.dom.ID, dest, idMessage, contenu);
	}

	detruireMessage = (msg: MessageJeu1) => {
		// Suppression du message concerné
		this.state.messages.splice(this.state.messages.findIndex(function (m) {
			if (m.val().ID.val === msg.val().ID.val) {
				return true;
			}
			return false;
		}), 1);
		// Mise a jour des messages
		this.setState({
			messages: this.state.messages
		})
		// Deverrouillage du message aupres du serveur 
		deverrouiller(this.canal, this.state.util.ID, this.state.dom.ID, msg.val().ID, msg.val().contenu);
		//this.canal.envoyerMessage(msg.aIgnorer(this.state.util.ID))
	}

	validerMessage = (contenu: Mot, msg: MessageJeu1) => {
		validerMessage(this.canal, this.state.util.ID, contenu, msg)
	}

	verrou = (idMessage : Identifiant<'message'>, contenu : Mot) => {
		verrou(this.canal, idMessage, this.state.util.ID, this.state.dom.ID, contenu );
	}

	deverrouiller = (idMessage: Identifiant<'message'>, contenu: Mot) => {
		deverrouiller(this.canal, this.state.util.ID, this.state.dom.ID, idMessage, contenu);
	}

	componentWillMount(): void {
		console.log('* Initialisation après montage du corps');

		console.log("- du canal de communication avec le serveur d'adresse " + this.adresseServeur);
		this.canal = creerCanalClient(this.adresseServeur);

		console.log('- du traitement des messages');

		// Traitement des messages
		this.canal.enregistrerTraitementMessageRecu((m: FormatMessageJeu1) => {
			let msg = new MessageJeu1(m);
			console.log('* Réception');
			console.log('- du message brut : ' + msg.brut());

			switch (m.type) {
				case TypeMessageJeu1.TRANSIT:
					// l'utilisateur recoit un message du serveur et le place en transit 
					this.state.messages.push(msg);
					this.setState({
						messages: this.state.messages,
					})
					break;
				case TypeMessageJeu1.ACTIF:
					// l'utilisateur active un message apres une demande de verouillage réussi coté serveur
					this.setState({
						messages: this.state.messages.map(function (msg) {
							if (msg.val().ID.val === m.ID.val) {
								return msg.aActiver();
							}
							else {
								return msg;
							}
						})
					})
					break;
				case TypeMessageJeu1.LIBE:
					// le message est déverrouiller 
					this.setState({
						messages: this.state.messages.map(function (msg) {
							if (msg.val().ID.val === m.ID.val) {
								return msg.aDeverrouiller();
							}
							else {
								return msg;
							}
						})
					})
					break;
				case TypeMessageJeu1.INACTIF:
					// Le message ne peut pas etre verrouiller car déja verrouiller par un autre utilisateur
					this.setState({
						messages: this.state.messages.map(function (msg) {
							if (msg.val().ID.val === m.ID.val) {
								return msg.aDesactiver();
							}
							else {
								return msg;
							}
						})
					})
					break;
				case TypeMessageJeu1.SUCCES_INIT:
					// le message initial a bien été envoyé
					this.setState({textDialog: 'Le message a été envoyé !'});
					this.handleOpen();
					break;
				case TypeMessageJeu1.SUCCES_TRANSIT:
					// le message a bien été transmis
					this.setState({ textDialog: 'Le message a été transmis !' });
					this.handleOpen();
					break;
				case TypeMessageJeu1.SUCCES_FIN:
					// l'utilisateur gagne la partie
					this.setState({ textDialog: 'Le message a été décodé avec succès !' });
					this.handleOpen();
					break;
				case TypeMessageJeu1.ECHEC_FIN:
					// l'utilisateur perd la partie 
					this.setState({ textDialog: 'Perdu ...' });
					this.handleOpen();
					break;
				case TypeMessageJeu1.IGNOR:
					// Le message est détruit à la demande du serveur
					this.state.messages.splice(this.state.messages.findIndex(function (msg) {
						if (msg.val().ID.val === m.ID.val) {
							return true;
						}
						return false;
					}),1);
					this.setState({
						messages: this.state.messages
					})
					break;
				default:
				console.log('no match');
				break;
			}
			
		});

		console.log('- du traitement de la configuration');
		this.canal.enregistrerTraitementConfigurationRecue((c: FormatConfigurationJeu1) => {
			this.config = creerConfigurationJeu1(c);

			let voisinFst : FormatSommetJeu1 = {ID: creerIdentifiant('sommet',''), domaine:[]};
			let voisinSnd : FormatSommetJeu1 = {ID: creerIdentifiant('sommet',''), domaine:[]};
			let fst = true;
			for (let i =0 ; i<4; i++) {
				if (this.config.val().voisins.table['DOM-'+i]) {
					if (fst) {
						voisinFst = this.config.val().voisins.table['DOM-'+i];
						fst = false;
					} else {
						voisinSnd = this.config.val().voisins.table['DOM-'+i];
					}
				}
			}

			this.setState({
				dom: this.config.val().centre,
				messages: [],
				util: this.config.val().utilisateur,
				voisinFst: voisinFst,
				voisinSnd: voisinSnd,
				consigne: this.config.val().consigne
			});

			console.log(this.config.net("centre"));
			console.log('* Réception');
			console.log('- de la configuration brute : ' + this.config.brut());
			console.log('- de la configuration nette : ' + this.config.representation());
		});
	}

	handleOpen = () => {
		this.setState({ openDialog: true });
	};

	handleClose = () => {
		this.setState({ openDialog: false });
	};

	public render() {
		const actions = [
			<FlatButton
				label="OK"
				primary={true}
				onClick={this.handleClose}
			/>
		];

		return (
			<div style={styles.container}>
				<AppBar title="Merite" titleStyle={styles.appTitle} showMenuIconButton={false} />
				<Regles consigne={this.state.consigne }/>
				<div style={styles.dom}>
				Domaine : <IdentifiantCases int={this.state.dom.domaine} />
				</div>
				<div style={styles.dom}>
				Utilisateur : <IdentifiantCases int={this.state.util.pseudo} />
				</div>
				<Paper zDepth={2} style={styles.paper}>
					<h3 style={styles.title}>Messages à traiter</h3>
					<NewMessage 
						envoyerMessage={this.envoiMessageInit} 
						voisinFst={this.state.voisinFst} 
						voisinSnd={this.state.voisinSnd}
						consigne={this.state.consigne}/>
					<MessageBox 
						envoyerMessage={this.envoiMessage}
						verrou={this.verrou}
						deverrouiller={this.deverrouiller}
						detruireMessage={this.detruireMessage}
						messages={this.state.messages}
						voisinFst={this.state.voisinFst}
						validation={this.validerMessage}
						voisinSnd={this.state.voisinSnd}/>
				</Paper>
				<Dialog
					actions={actions}
					modal={false}
					open={this.state.openDialog}
					onRequestClose={this.handleClose}
				>
					{this.state.textDialog}
        		</Dialog>
				</div>
    );
  }
}