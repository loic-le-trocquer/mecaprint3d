# Boutique FormFutura

Routes : `/boutique` pour les clients, `/admin/boutique` pour le suivi privé, protégé par les identifiants existants.

Le catalogue contient les 1 159 références actives du tarif FormFutura 2026 transmis le 28 octobre 2026, regroupées en 103 gammes. Aucun prix d'achat, remise B2B ou fichier fournisseur n'est livré au navigateur. Seuls les champs publics explicitement sélectionnés sont exportés dans `backend/data/catalog.json`.

## Prix

Choix initial : prix public conseillé HT du fournisseur multiplié par 1,20, arrondi au centime, utilisé comme **prix final de vente net Mecaprint3D**. Ce coefficient est un choix commercial pour se positionner au niveau du prix public consommateur ; ce n'est pas une collecte de TVA. Le site existant indique « TVA non applicable, art. 293 B du CGI » ; cette mention est conservée. Confirmer ce régime avant d'activer un paiement automatique. Les prix sont en centimes entiers. Livraison non comprise, à confirmer manuellement. Les gammes, couleurs, diamètres, poids et SKU proviennent du fichier ; les familles sont des regroupements de navigation. Pour les accessoires, le poids n'est pas nécessairement une quantité commerciale (ml, dimensions...) : la référence exacte doit être confirmée avant vente. Visuels vectoriels illustratifs, aucune photo de produit prétendument exacte.

## Commande

Le client prépare un panier, indique ses coordonnées et transmet une **demande de commande sans paiement**. Ne pas annoncer de stock, de délai ou de commande ferme : ces informations ne sont pas fournies par le tableur. Avant finalisation : confirmer variante/conditionnement, disponibilité, montant final, livraison, conditions de vente et modalités de paiement avec le client.

Le serveur valide SKU et quantités, recalcule les prix depuis son propre catalogue, conserve un instantané de la demande en MongoDB (collection CatalogOrder), puis notifie ADMIN_EMAIL ou contact@mecaprint3d.fr avec l'outil e-mail existant. Une panne e-mail n'efface pas une demande ; elle reste visible dans l'administration. Une clé de requête évite les doubles enregistrements lors d'une nouvelle tentative. Le panier est conservé localement, sans coordonnées personnelles dans le stockage du navigateur. Aucun message de test n'est envoyé par la vérification automatique.

## Déploiement et exploitation

Déployer backend et frontend ensemble sur les services Render et Vercel existants ; aucun nouveau service Sites à créer. Pas de nouvelle variable obligatoire : MONGO_URI, ADMIN_TOKEN/ADMIN_PASSWORD et la configuration Brevo existants sont réutilisés. Si la notification échoue, consulter les demandes en administration. Un déploiement de la seule interface ne suffit pas : `/api/catalog` doit être disponible. La boutique gère cette indisponibilité sans simuler une commande réussie.

La liste n'est pas synchronisée avec le stock FormFutura. Mettre à jour le JSON public pour réviser les prix. Ne jamais déposer le tableur B2B dans les fichiers publics ni le dépôt.

Contrôles : `node --test catalog.test.js`, suite backend existante et compilation Vite ; vérifier filtres, variantes, panier et affichage mobile dans l'aperçu local. Les requêtes réelles de commande et les paiements ne sont pas lancés pendant les tests.
