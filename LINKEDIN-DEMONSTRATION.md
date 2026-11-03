# Préparation de la démonstration LinkedIn

## État réel

Un espace de répétition isolé utilise les composants réels de l’administration sociale. Il fonctionne sans MongoDB et sans accès externe, avec stockage en mémoire, un exemple fictif d’import et un accès distinct. Il ne permet pas une publication réelle sur LinkedIn et ne démontre pas OAuth. Il ne constitue donc pas la vidéo de validation finale.

La documentation LinkedIn distingue l’accès Development et l’évaluation Standard. Pour Standard, la vidéo doit démontrer les fonctions réelles, dont l’autorisation OAuth et la publication. Vérifier le titre du formulaire et les scopes présents dans Auth : la capture du produit ajouté ne prouve pas que les droits sont déjà accordés.

## Répétition locale

1. Depuis frontend : construire avec `VITE_API_URL=/review-api` et `npm run build -- --outDir dist-review` (PowerShell : `$env:VITE_API_URL='/review-api'`). Ne pas déployer cette construction sur le site principal.
2. Depuis backend : `node reviewStart.js`.
3. Ouvrir http://127.0.0.1:4319/admin/social. Les identifiants propres à cette répétition sont créés dans `.review-local/acces-demonstration.json`, exclu de Git. Ne pas communiquer cette URL locale à LinkedIn : elle n’est pas accessible à leurs évaluateurs.
4. Répéter : import de l’exemple fictif, second import sans doublon, modification, enregistrement en brouillon puis publication uniquement dans cet espace temporaire. Le bandeau doit rester visible. Le serveur bloque tout envoi social et ne monte aucun accès aux devis, messages, commandes ou données de production.
5. Au redémarrage, les données fictives sont effacées. Pour invalider cet accès de répétition, arrêter le serveur et remplacer son mot de passe local avant redémarrage. Cet accès doit être distinct de tout compte de production.

## Avant une vidéo soumise à LinkedIn

- Vérifier les scopes r_organization_social et w_organization_social dans Auth, sans partager le secret client ou le jeton.
- Déployer et valider le parcours OAuth préparé dans cette livraison, en utilisant les droits Development lorsqu’ils sont disponibles. Les tests locaux utilisent des réponses simulées ; aucune connexion réelle n’a encore été effectuée.
- Déployer un environnement d’évaluation HTTPS indépendant, avec une base distincte, un compte limité et une date de retrait. Aucun accès évaluateur ne doit ouvrir les devis et messages réels.
- Valider la confidentialité et la procédure d’effacement. Ne pas déclarer ces points conformes sur la seule base de cet espace en mémoire.
- Enregistrer uniquement la fenêtre d’application : connexion évaluateur, OAuth réel, import réel en brouillon, validation puis publication réelle d’un contenu de test expressément choisi. Masquer les secrets. Présenter seulement les fonctionnalités mises en œuvre et expliquer celles qui ne font pas partie du produit (notamment commentaires et profils individuels).
- Héberger la vidéo à une adresse HTTPS téléchargeable et vérifier l’ouverture hors session. Fournir l’URL de l’environnement d’évaluation et ses identifiants dédiés dans le formulaire LinkedIn. Aucun lien vidéo ni accès distant valide n’est encore produit ici.

Source : https://learn.microsoft.com/en-us/linkedin/marketing/community-management-app-review
