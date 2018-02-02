// Serveur établissant les connexions par Web Socket
// - Configuration à la connexion
// - Communication entre clients
// - Déconnexion

// Un module commençant par un import
import * as express from 'express';
import * as http from 'http';
import * as websocket from 'websocket';
import * as url from 'url';

import { creerDateMaintenant } from "./types";
import {
    FormatMessage, Message,
    FormatConfigurationInitiale, Configuration,
    FormatErreurRedhibitoire, ErreurRedhibitoire,
} from "./communication";


export class LienWebSocket<
    FEIN extends FEOUT,
    FEOUT extends FormatErreurRedhibitoire, EE extends string,
    FCIN extends FCOUT,
    FCOUT extends FormatConfigurationInitiale, EC extends string,
    FMIN extends FMOUT,
    FMOUT extends FormatMessage, EM extends string> {

    private _connexion: websocket.connection;
    private _adresseIPClient: string;
    private _config: Configuration<FCIN, FCOUT, EC>;

    constructor(requete: websocket.request) {
        this._connexion = requete.accept('echo-protocol', requete.origin);
        this._adresseIPClient = requete.remoteAddress
        /* TODO
        console.log("url socket : " + r.resource);
        console.log("url socket : " + r.httpRequest.url);
        console.log("- auth: " + this._url.auth);
        console.log("- hostname: " + this._url.hostname);
        console.log("- port: " + this._url.port);
        console.log("- protocol : " + this._url.protocol);
        console.log("- search: " + this._url.search);
        console.log("- href: " + this._url.href);
        console.log("- path: " + this._url.path);
        console.log("- pathname: " + this._url.pathname);
        */
    }
    adresseClient(): string {
        return this._adresseIPClient;
    }
    enregistrerTraitementMessages(
        traitementMessages: (l: LienWebSocket<FEIN, FEOUT, EE, FCIN, FCOUT, EC, FMIN, FMOUT, EM>, m: FMIN) => void): void {
        let ceLien = this;
        this._connexion.on('message', (message: websocket.IMessage) => {
            let m = message.utf8Data;
            if (typeof m === "undefined") {
                throw new Error("[Erreur : contenu du message non défini.]");
            }
            let msg: FMIN = JSON.parse(<string>m.toString());
            traitementMessages(ceLien, msg);
        });
        console.log("- Enregistrement du traitement des messages.")
    }
    enregistrerTraitementFermeture(
        traitementFermeture: (l: LienWebSocket<FEIN, FEOUT, EE, FCIN, FCOUT, EC, FMIN, FMOUT, EM>, r: number, desc: string) => void): void {
        let ceLien = this;
        this._connexion.on('close', (raison: number, description: string) => {
            traitementFermeture(ceLien, raison, description);
        });
        console.log("- Enregistrement du traitement de la fermeture de la connexion par Web socket.")
    }

    envoyerAuClientDestinataire(m: Message<FMIN, FMOUT, EM>) {
        this._connexion.sendUTF(m.brut());
    }

    envoyerConfiguration(c: Configuration<FCIN, FCOUT, EC>) {
        this._connexion.sendUTF(c.brut());
        this._config = c;
    }

    estConfigure(): boolean {
        return this._config !== undefined;
    }

    configuration(): Configuration<FCIN, FCOUT, EC> {
        return this._config;
    }

    envoyerMessageErreur(e: ErreurRedhibitoire<FEIN, FEOUT, EE>) {
        this._connexion.sendUTF(e.brut());
    }
    static creer(): void { }
}


export class ServeurLiensWebSocket<
    FEIN extends FEOUT,
    FEOUT extends FormatErreurRedhibitoire, EE extends string,
    FCIN extends FCOUT,
    FCOUT extends FormatConfigurationInitiale, EC extends string,
    FMIN extends FMOUT,
    FMOUT extends FormatMessage, EM extends string
    > {
    private port: number;
    private traiterMessages: (l: LienWebSocket<FEIN, FEOUT, EE, FCIN, FCOUT, EC, FMIN, FMOUT, EM>, m: FMIN) => void;
    private traiterConnexion: (l: LienWebSocket<FEIN, FEOUT, EE, FCIN, FCOUT, EC, FMIN, FMOUT, EM>) => boolean;
    private traiterFermeture: (l: LienWebSocket<FEIN, FEOUT, EE, FCIN, FCOUT, EC, FMIN, FMOUT, EM>, r: number, desc: string) => void;

    constructor(port: number) {
        this.port = port;
    }

    enregistrerTraitementConnexion(traitementConnexion: (l: LienWebSocket<FEIN, FEOUT, EE, FCIN, FCOUT, EC, FMIN, FMOUT, EM>) => boolean): void {
        this.traiterConnexion = traitementConnexion;
    }

    enregistrerTraitementFermeture(traitementFermeture: (l: LienWebSocket<FEIN, FEOUT, EE, FCIN, FCOUT, EC, FMIN, FMOUT, EM>, r: number, desc: string) => void): void {
        this.traiterFermeture = traitementFermeture;
    }


    enregistrerTraitementMessages(traitementMessages: (l: LienWebSocket<FEIN, FEOUT, EE, FCIN, FCOUT, EC, FMIN, FMOUT, EM>, m: FMIN) => void): void {
        this.traiterMessages = traitementMessages;
    }

    demarrer(serveurHttp : http.Server): void {
        let ceServeur = this;
        /*
        let serveurHTTP: http.Server = http.createServer(function (requete, reponse) { });
        let p = this.port;
        serveurHTTP.listen(p, h, function () {
            console.log("* " + creerDateMaintenant().representationLog() + " - Le serveur écoute le port " + p + " de l'hôte " + h + ".");
        });
        */
        let serveurWS = new websocket.server({
            httpServer: serveurHttp
        });
        serveurWS.on('request', function (r: websocket.request) {
            let l = new LienWebSocket<FEIN, FEOUT, EE, FCIN, FCOUT, EC, FMIN, FMOUT, EM>(r);

            let estConnecte = ceServeur.traiterConnexion(l);
            if (!estConnecte) {
                return;
            }
            // Enregistre le traitement des messages
            l.enregistrerTraitementMessages(ceServeur.traiterMessages);

            // Enregistre le traitement de la fermeture de la connexion
            l.enregistrerTraitementFermeture(ceServeur.traiterFermeture);
        });

    }

}

