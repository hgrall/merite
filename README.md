Merite
======

Installation
------------

Copie du dépôt GitHub :
```
$ git clone https://www.github.com/LoOTW/merite
```
Installation de la bonne version de node avec [nvm](https://www.digitalocean.com/community/tutorials/how-to-install-node-js-on-debian-8) :
```
$ nvm install 6.11.0
```
Rajouter une des lignes suivantes au fichier /etc/hosts, en tapant par exemple la commande *nano* */etc/hosts* :
```
::ffff:127.0.0.1        merite
```
ou
```
127.0.0.1               merite
```


Exécution
---------

Installation des dépendances :
```
$ npm install
```
Le répertoire "./node_modules" est alors créé : il contient tous les
modules externes du projet.

Compilation :
```
$ npm run build
```

Dans certains cas, une utilisation précédente du port 3000 lève une erreur. Il suffit alors d'utiliser la commande suivante :
```
$ sudo fuser -k 3000/tcp
```


Il faut alors ouvrir 4 onglets différents à l'adresse [merite:3000](merite:3000), ces 4 "utilisateurs" sont disposés en anneau et peuvent alors commencer à communiquer.

Fonctionnement - legacy
=======================

Recommandations concernant Javascript
-
- Utiliser ECMAscript 2015.

Gestion des modules
-
- côté serveur : utiliser l'API de Node
- côté client : utiliser l'API du navigateur

cf. https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API/Writing_WebSocket_client_applications

Format des données : JSON
-
**Messages**

``` javascript
{
 emetteur : String,
 identifiant : String,
 destinataire : String
 type : String,
 contenu : String,
} 
```

Protocole de communication
-
Côté client
- Le client initie une WebSocket avec le serveur.
- Le client envoie son identité (pseudo).
- Le client envoie un message au format JSON spécifié.
- Le client reçoit un message au format JSON spécifié.

Côté serveur
- Le serveur répond à la requête de création de WebSocket.
- Le serveur reçoit l'identité d'un client.
- Le serveur reçoit un message au format JSON spécifié.
- Le serveur envoie un message au format JSON spécifié.

Formalisation
-
**données**

- message
  - emetteur
  - destinataire

**Serveur**

Canaux
- initier(rep)
- serveur_p
- canal(TYPE, msg) : canal bi-directionnel

Etat du serveur
- Port(p) : port utilisé pour la prochaine communication
- C(i) : compteur des clients
- Nom(i, n) : nom n du client i
- Description(i, n, canal) : ième client décrit par n et communiquant
  par canal 
- Autorisation(i, j) : communication de i vers j autorisée

``` javascript
- initier(rep) & Port(p) -> rep(serveur_p) & Port(p+1)

- serveur_p(canal) & C(i) & Nom(i, n) 
  ->
  canal(NOM, n) 
  & C(i+1) & Nom(i, n) & Description(i, n, canal)

- canal(ENVOI, msg) & Description(i, msg.emetteur, canal) 
  ->  
  Transit(i, msg, canal)
- canal(msg) & ¬Description(i, msg.emetteur, canal) 
  ->  
  canal(ERREUR, msg.emetteur " non associé à " canal)

- Transit(i, msg, canal) 
  & Description(j, msg.destinataire, canalDest) & Autorisation(i, j)
  ->
  canal(OK, msg) & canalDest(TRANSIT, msg) 
  & Description(j, msg.destinataire, canalDest) & Autorisation(i, j)
- Transit(i, msg, canal) 
  & ¬Description(j, msg.destinataire, canalDest)
  ->
  canal(ERREUR, msg.destinataire " inconnu") 
- Transit(i, msg, canal) 
  & Description(j, msg.destinataire, canalDest) & ¬Autorisation(i, j)
  ->
  canal(ERREUR, "Interdit vers " msg.destinataire) 
 ```


**Organisation**

Trois axes pour organiser le code
- fonctionnalités
  - communication
- serveur / client
- modèle (données) / vue (html)

Cf. Express qui donne une architecture type.
- http://expressjs.com/en/starter/generator.html


Travail à faire
-
- TODO  Réaliser les fonctions de communication
- TODO Définir les messages
- TODO Spécifier le jeu 1
   