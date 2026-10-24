# Import de l’historique Facebook et LinkedIn

## Utilisation

Dans `/admin/social`, le bloc « Importer votre historique » accepte le fichier JSON de préparation, et non les exports XLS/CSV bruts. Choisir le fichier, vérifier le nombre annoncé puis cliquer sur « Importer … brouillons ».

Les fichiers d’export et les textes récupérés ne sont pas intégrés au dépôt ni déployés comme fichiers publics. Le fichier choisi est lu dans le navigateur ; les publications sont ensuite envoyées par lots à l’API administrateur avec la connexion existante.

L’import enregistre uniquement des brouillons. Il ne publie rien sur le site ou les réseaux. Les publications sans texte ne sont pas inventées ni importées. Les photos et vidéos absentes des exports restent à ajouter depuis les médias originaux.

En cas d’interruption, relancer le même fichier. Les contenus déjà importés sont ignorés, sans écraser les modifications effectuées depuis dans l’administration. Le résultat distingue les brouillons ajoutés des contenus déjà présents. La liste d’administration étant paginée par 30, utiliser « Suivant » pour retrouver la suite.

## Données conservées

Chaque brouillon conserve ses références Facebook/LinkedIn, identifiants exacts, liens HTTPS, dates au jour et versions originales du texte. Le panneau « Sources et textes d’origine » permet de les consulter lors de l’édition. Le texte du site reste modifiable sans changer les originaux.

La date historique proposée est la plus ancienne des sources regroupées. Elle s’affiche sur la carte si le brouillon est ensuite publié. La date réelle de publication sur le site reste enregistrée séparément. Le fil garde son classement existant par date de publication sur le site.

Les publications au texte identique après normalisation Unicode et espaces peuvent partager un brouillon, avec toutes leurs sources. Cela ne prouve pas que leurs photos sont identiques : vérifier les regroupements avant publication. L’importeur refuse de regrouper des textes différents.

## Prévention des doublons

Le serveur calcule la clé d’import depuis le texte, sans faire confiance à la clé fournie dans le JSON. Il vérifie aussi les identifiants des publications sources. Deux index MongoDB uniques, qui ignorent les documents sans ces champs, protègent les importations simultanées. Les publications manuelles sans référence historique ne sont pas fusionnées automatiquement avec un import.

Une source déjà importée ou un texte déjà importé fait ignorer le brouillon concerné ; les références supplémentaires de ce nouveau fichier ne sont pas ajoutées automatiquement à un ancien brouillon. Le fichier de préparation conserve l’ensemble des références.

## Déploiement

Mettre à jour Render avant l’interface Vercel. Le backend ajoute `POST /api/social/admin/import`, protégé par l’authentification existante. Les nouveaux champs sont optionnels, sans modification destructive des anciennes publications. La création des index exige les droits MongoDB correspondants ; l’import attend l’initialisation des index avant d’écrire.

Les lots sont limités à dix brouillons et le corps JSON des routes sociales à 1 Mo. Le navigateur fractionne les lots autour de 60 Ko et refuse un fichier de préparation de plus de 5 Mo. Aucun nouvel identifiant ni variable secrète n’est nécessaire.

## Validation

- Huit tests réussis : tests sociaux existants et nouveaux scénarios d’import, validation préalable des lots, statut privé imposé, comparaison des versions, refus des dates et liens invalides, reprise sans doublon et erreurs sans fuite d’informations.
- Modèles MongoDB vérifiés avec opérations de stockage simulées ; aucune base de production utilisée dans les tests.
- Compilation de production frontend réussie. Le parcours de sélection/import dans un navigateur n’a pas pu être vérifié, le contrôle navigateur étant indisponible.
- Le fichier réel préparé pour MecaPrint3D a été validé hors réseau : 68 brouillons, 85 références originales, 7 lots, 17 publications sans texte laissées à compléter. Aucun de ces contenus n’a été publié ni injecté en production pendant cette validation.
