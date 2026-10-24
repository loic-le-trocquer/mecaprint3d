# Actualités et réseaux sociaux

## Base de cette livraison

Cette modification part du dépôt `loic-le-trocquer/mecaprint3d`, commit `f899100f2cb3e223036a38d0607c16f4dc166800`, confirmé comme source de la production dans Vercel le 24 octobre 2026. Elle remplace les propositions V1/V2 fondées sur l’ancienne archive `mecaprint3d.zip`. Elle conserve les parcours actuels de devis, paiement Stripe, matériaux, chat, Qonto, Cloudinary et contenu du site. Les traces Mollie du dossier local n’ont pas été substituées à la production Stripe.

## Utilisation

1. Se connecter sur `/admin` avec le compte d’administration existant.
2. Ouvrir « Actualités & Réseaux » (`/admin/social`).
3. Renseigner les adresses HTTPS exactes Facebook, Instagram et LinkedIn. Laisser vide les profils absents : aucun lien fictif n’est affiché. Les liens apparaissent dans la rubrique et dans le pied de page.
4. Créer une publication : titre, rubrique Actualité/Réalisation, texte, image et description accessible. L’envoi d’image utilise le mécanisme Cloudinary existant ; l’interface limite les nouvelles images à 10 Mo. Une adresse d’image HTTPS ou `/images/...` est également acceptée.
5. Préparer le texte social et les destinations prévues. « Copier le texte social » permet de le coller sur le réseau choisi ; y joindre manuellement l’image.
6. Enregistrer comme « Brouillon » ou « Prêt pour partage manuel » pour conserver le contenu privé. Choisir « Publié sur le site » et enregistrer pour le rendre public uniquement sur le site. Repasser en brouillon pour le retirer du site. La suppression est définitive et demande confirmation.

Le fil public est paginé par 12 publications, trié du plus récent au plus ancien. Les filtres concernent les publications déjà chargées ; utiliser « Charger les publications suivantes » pour accéder à la suite. La liste d’administration est paginée par 30.

## Déploiement Vercel et Render

Le projet Vercel confirmé est `loic-le-trocquers-projects/mecaprint3d`, répertoire frontend `frontend`, branche de production `main`, URL affichée `https://mecaprint3d.vercel.app`. Les anciens fichiers mentionnent aussi `mecaprint3d.fr` et `mecaprint3d-fr.vercel.app` ; ne pas modifier les domaines sur cette seule base.

Le backend documenté est `https://mecaprint3d-backend.onrender.com`. Vérifier dans Render le service exact, le dépôt, la branche et le répertoire `backend` avant déploiement. Déployer **le backend avant le frontend**. Si Render suit automatiquement `main`, une fusion peut déclencher les deux services ; attendre que le backend soit sain et redéployer le frontend si nécessaire.

Variables déjà utilisées, à conserver dans les hébergements :

- `MONGO_URI` : base MongoDB existante, avec droit de créer et écrire les collections `socialposts` et `socialsettings`. Aucune migration destructive ou volume disque local nécessaire.
- `ADMIN_PASSWORD` et/ou `ADMIN_TOKEN` : identifiants existants. Aucun nouveau mot de passe social ni `SOCIAL_ADMIN_TOKEN` n’est nécessaire. La connexion exige désormais une valeur réellement fournie ; les comparaisons de secrets sont sécurisées et les tentatives de connexion limitées.
- Variables `CLOUDINARY_*` existantes : réutilisées par l’envoi d’image.
- `VITE_API_URL=https://mecaprint3d-backend.onrender.com` côté compilation Vercel si l’API n’est pas celle du fallback existant.

L’origine `https://mecaprint3d.vercel.app`, observée dans Vercel, est ajoutée à la liste CORS sans supprimer les origines existantes. Les URLs temporaires des branches Vercel ne sont pas autorisées automatiquement par le backend de production ; utiliser une API de test ou autoriser explicitement l’origine de prévisualisation voulue.

Les nouvelles collections sont séparées du contenu administrable existant : enregistrer les anciens textes du site ne modifie pas les publications sociales. Rien n’est prérempli ni publié automatiquement. Sauvegarder MongoDB selon la procédure habituelle. Un retour au code précédent laisse les collections intactes.

Vérification après déploiement : consulter `GET /api/social/public`, ouvrir `/admin/social`, enregistrer un brouillon puis vérifier son absence sur une page publique, publier un contenu validé et vérifier sa présence, le repasser en brouillon et vérifier son retrait. Tester une image Cloudinary avec un contenu autorisé. Vérifier également que l’administration du contenu et le formulaire de devis restent accessibles, sans lancer de paiement réel.

## Ce qui n’est pas connecté

Aucune API Facebook, Instagram ou LinkedIn n’est implémentée. Les trois réseaux sont affichés comme non connectés. Il n’existe ni programmation, ni diffusion distante, ni import de publications, ni statistiques sociales. Ajouter une URL n’accorde aucun droit de publication.

Pour une diffusion automatique ultérieure : connecter les comptes réels via OAuth ou un outil de diffusion retenu, vérifier les droits de publication requis auprès de chaque fournisseur, conserver et renouveler les jetons côté serveur, puis développer une file d’envoi et un suivi des réussites, erreurs et doublons. Vérifier les conditions actuelles des fournisseurs au moment du raccordement. Aucun secret ne doit être fourni dans le chat ni dans les variables `VITE_*`.

## Validation effectuée

- Installation reproductible avec les fichiers de verrouillage existants (`npm ci` frontend et backend).
- Compilation de production frontend réussie ; avertissement non bloquant sur la taille du bundle déjà volumineux.
- `npm test` dans `backend` : 4 scénarios couvrant validation de liens et contenus, exclusion des brouillons et textes sociaux par la requête MongoDB publique, pagination, opérations du modèle, authentification existante, connexion sans mot de passe refusée, création/modification/publication/retrait/suppression, erreurs sans fuite et état non connecté.
- Les tests du dépôt de données utilisent les modèles avec opérations MongoDB simulées ; **aucune connexion à la base de production n’a été utilisée**.
- Vérification navigateur locale avec un serveur de test en mémoire, sans secrets réels : connexion par l’administration existante, création d’un brouillon absent de la page publique, publication puis visibilité dans la rubrique. Rendu public inspecté visuellement.
- Aucun paiement, email, envoi Cloudinary réel ou publication sur un réseau social déclenché. Le fonctionnement réel MongoDB/Cloudinary devra être confirmé après déploiement Render.
