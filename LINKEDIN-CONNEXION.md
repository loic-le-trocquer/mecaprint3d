# LinkedIn : lecture de la page et publication depuis le site

Le rôle d’administrateur de page permet d’autoriser l’application, mais ne remplace pas l’approbation LinkedIn Community Management. Aucun accès réel n’a été vérifié dans cette livraison.

## Connexion nécessaire

1. Dans LinkedIn Developers, créer ou utiliser une application associée à la page MecaPrint3D, puis vérifier l’association avec un administrateur.
2. Demander le produit Community Management et obtenir les droits `r_organization_social` (lecture) et `w_organization_social` (publication). Respecter les limites du niveau d’accès accordé.
3. Dans Auth de LinkedIn Developers, ajouter exactement `https://mecaprint3d-backend.onrender.com/api/social/linkedin/callback` aux Authorized redirect URLs. Cette route doit être déployée avant de lancer la connexion.
4. Dans les variables du serveur Render, configurer `LINKEDIN_CLIENT_ID=78wltm399tys2c` (recopier et vérifier dans Auth), `LINKEDIN_CLIENT_SECRET` (ne pas partager dans le chat), `LINKEDIN_ORGANIZATION_ID=129744062` (à confirmer), `LINKEDIN_API_VERSION` avec une version encore prise en charge, `LINKEDIN_REDIRECT_URI=https://mecaprint3d-backend.onrender.com/api/social/linkedin/callback` et `SITE_URL=https://www.mecaprint3d.fr`.
5. Générer `LINKEDIN_TOKEN_KEY`, une clé aléatoire de 32 octets codée sur 64 caractères hexadécimaux. La conserver uniquement dans Render et dans une sauvegarde de secrets maîtrisée. Changer cette clé rend les accès enregistrés illisibles et impose une nouvelle connexion. Les jetons sont chiffrés AES-256-GCM avant stockage dans MongoDB.
6. Après déploiement du backend et du frontend, ouvrir Actualités & Réseaux → Se connecter avec LinkedIn. Seuls les droits `r_organization_social` et `w_organization_social` sont demandés. Aucun message n’est publié pendant la connexion. La lecture de la page configurée est vérifiée avant enregistrement de l’accès ; le droit effectif de publication sera vérifié lors d’un envoi choisi explicitement.
7. L’accès expire et doit être renouvelé via le même bouton. Aucun renouvellement automatique ni refresh token n’est mis en œuvre. Un jeton manuel `LINKEDIN_ACCESS_TOKEN` reste compatible seulement si `LINKEDIN_CLIENT_ID` n’est pas configuré. Une fois OAuth sélectionné, aucun ancien jeton manuel n’est utilisé en secours. Pour révoquer l’autorisation, utiliser les applications autorisées du compte LinkedIn ; cela ne supprime pas les contenus déjà importés.

Le serveur MongoDB doit être accessible et permettre les index des collections LinkedInState et LinkedInConnection. Les demandes OAuth expirent après dix minutes et sont consommées atomiquement une seule fois. Un cookie HttpOnly/Secure/SameSite=Lax lie le retour au navigateur. Ne jamais journaliser les paramètres des URLs de retour (code OAuth, state), le corps de l’échange OAuth, les secrets ou les jetons. Vérifier également la politique de logs du proxy/hébergeur. Ne pas partager la base ou la clé de chiffrement avec l’espace de répétition.

## Comportement

- Administration Actualités & Réseaux : « Récupérer les publications récentes », puis « Récupérer le lot suivant ». Dix publications par appel ; relecture et publication sur le site restent manuelles. Les brouillons, publications non publiques et autres pages sont ignorés. Les sources déjà importées et les envois enregistrés depuis le site sont ignorés.
- Le texte, la date et le lien sont conservés. Les médias sont proposés via l’intégration LinkedIn existante (affichage soumis à LinkedIn et au navigateur), sans téléchargement ni stockage d’images/vidéos. La validité de l’intégration doit être vérifiée à la relecture. Les publications sans texte ne sont pas importées.
- Pour l’autre sens, sélectionner LinkedIn dans une actualité et utiliser le bouton existant « Publier sur le site et les réseaux sélectionnés ». Envoi du texte et du lien de l’article, pas de téléversement natif des médias. Les envois restent explicites, avec une tentative par actualité/réseau.
- Aucun traitement périodique, aucune synchronisation des modifications/suppressions et aucune diffusion automatique au simple enregistrement. Les accès configurés ne prouvent pas que LinkedIn les a validés : la lecture ou l’envoi fournit le résultat réel.

## Validation avant mise en service

Déployer le backend et le frontend ensemble. Avec les accès approuvés, récupérer un lot, vérifier le contenu et son intégration en brouillon, puis relancer ce même lot pour vérifier l’absence de doublon. Tester la diffusion uniquement avec une publication explicitement choisie par l’administrateur. Les tests locaux utilisent des réponses simulées et ne publient rien sur LinkedIn.

Documentation : https://learn.microsoft.com/en-us/linkedin/marketing/community-management/shares/posts-api et https://learn.microsoft.com/en-us/linkedin/marketing/increasing-access
