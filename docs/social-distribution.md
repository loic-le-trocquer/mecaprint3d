# Publication depuis MecaPrint3D

Le bouton de l’administration enregistre la page publique puis envoie un texte et son lien vers les destinations choisies. Il ne déclenche aucun envoi lors d’un simple enregistrement, d’un import historique ou d’une modification du statut. Aucun historique existant n’est diffusé automatiquement. Instagram reste manuel.

## Activation à réaliser avant tout essai réel

Les mots de passe du site ou des navigateurs ne sont pas des accès API. Configurer les secrets exclusivement dans les variables d’environnement du service backend Render, jamais dans le dépôt, le frontend, les paramètres d’URL ou un message de chat.

Facebook, pour la page MecaPrint3D :

- FACEBOOK_PAGE_ID : 61578525465265
- FACEBOOK_PAGE_ACCESS_TOKEN : jeton de Page autorisé à publier pour cette Page, obtenu dans une application Meta approuvée avec les permissions requises (notamment pages_manage_posts).
- FACEBOOK_GRAPH_VERSION : version prise en charge par cette application Meta, au format vNN.0. Aucun défaut implicite.

LinkedIn, pour la page entreprise MecaPrint3D :

- LINKEDIN_ORGANIZATION_ID : 129744062
- LINKEDIN_ACCESS_TOKEN : jeton OAuth valide autorisé à publier pour cette organisation (w_organization_social), avec application et produit API approuvés, obtenu par un administrateur de la Page.
- LINKEDIN_API_VERSION : version Marketing API active pour l’application au format YYYYMM. Aucun défaut implicite.

Les accès doivent être accordés et validés par le propriétaire. L’interface indique « configuré » si les variables sont présentes : ce n’est pas une validation des droits. Les jetons peuvent expirer ou être révoqués ; les renouveler dans Render par le flux officiel de l’application. Aucun renouvellement OAuth automatique n’est implémenté.

## Contenu et résultats

Facebook : POST /{page}/feed avec message et lien de l’article. LinkedIn : POST /rest/posts, article avec titre, description, lien et commentaire. Les images originales restent sur la page web ; cette version ne téléverse pas les images natives sur les réseaux. LinkedIn ne génère pas automatiquement une miniature par scraping pour les articles API.

SocialDelivery impose une clé unique par actualité et réseau avant l’appel externe. Un envoi réussi contient l’identifiant retourné par le réseau. Un délai dépassé, un succès sans identifiant ou une erreur serveur est « résultat inconnu » : aucune relance automatique pour éviter un doublon. Un enregistrement bloqué en « sending » après une interruption doit aussi être vérifié directement sur le réseau. Les refus sont conservés et ne sont pas relancés automatiquement. Une intervention contrôlée côté serveur est nécessaire après correction de l’accès ; vérifier d’abord qu’aucun post n’a été créé.

Ne jamais publier un post de test au nom de l’entreprise sans son accord sur le contenu. Les tests automatisés remplacent les appels réseaux par des réponses simulées.

Documentation :
- https://developers.facebook.com/docs/pages-api/posts/
- https://learn.microsoft.com/en-us/linkedin/marketing/community-management/shares/posts-api
