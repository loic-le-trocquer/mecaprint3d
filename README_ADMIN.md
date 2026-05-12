# Administration MecaPrint3D

## Accès

Page admin : `/admin`

Exemple : `https://mecaprint3d.fr/admin`

## Variable obligatoire côté backend

Ajouter dans Render > Environment :

```env
ADMIN_PASSWORD=TonMotDePasseFort
```

Optionnel mais conseillé :

```env
ADMIN_TOKEN=UnTresLongTokenSecret
```

## Variables utiles côté frontend

Ajouter dans Vercel > Environment si l’URL backend change :

```env
VITE_API_URL=https://mecaprint3d-backend.onrender.com
```

## Ce qui est administrable

- logo
- photo de bannière
- textes d’accueil
- étapes d’accueil
- services
- réalisations avec photos
- texte du formulaire devis
- footer / contact

## Déploiement

Backend :

```bash
cd backend
npm install
npm start
```

Frontend :

```bash
cd frontend
npm install
npm run build
```

## Important

Les images de l’administration sont envoyées dans Cloudinary, dossier `mecaprint3d/site`.
Le formulaire devis existant reste inchangé et continue d’envoyer les fichiers dans `mecaprint3d/devis`.
