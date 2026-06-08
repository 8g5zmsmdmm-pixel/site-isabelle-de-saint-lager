# Site Isabelle de Saint-Lager — version Astro + TinaCMS

Reprise du site sur Astro (sortie statique, hébergeable gratuitement sur Netlify) avec TinaCMS pour l'édition. Le design, le contenu et les images sont identiques à la version précédente ; ce qui change, c'est l'outil d'administration.

## Pourquoi cette version

L'admin précédent (Decap) était jugé peu ergonomique et peu esthétique. Tina apporte une interface moderne avec aperçu en direct du site pendant l'édition.

## Structure

```
atelier-astro/
├── astro.config.mjs
├── package.json
├── netlify.toml            Déploiement (build npm run build, publish dist)
├── tina/config.ts          Schéma Tina (œuvres + textes du site)
├── content/
│   ├── site/general.json   Réglages, textes, coordonnées
│   └── oeuvres/*.json       Une fiche par tableau
├── public/images/          Photos (servies à la racine /images/...)
└── src/
    ├── content.config.ts    Astro lit le contenu (mêmes fichiers que Tina)
    ├── layouts/Base.astro
    ├── styles/style.css     Le design (inchangé)
    └── pages/index.astro    La page (galerie, fiche, atelier, démarche, contact)
```

Astro lit le contenu depuis `content/`, et Tina édite ces mêmes fichiers. Une modification dans Tina = un commit Git = un redéploiement Netlify automatique.

## Démarrage en local

```bash
cd atelier-astro
npm install
npm run dev
```

`npm run dev` lance Tina (mode local, qui édite directement les fichiers du dossier) en même temps qu'Astro. Le site est sur http://localhost:4321 et l'admin sur http://localhost:4321/admin/.

> Note honnête : j'ai construit et vérifié la partie Astro (le site compile et s'affiche à l'identique). Le serveur Tina n'a pas pu être lancé dans mon environnement (téléchargement d'une dépendance native bloqué par le réseau) ; le tout premier `npm run dev` se fait donc sur ta machine, qui n'a pas cette restriction.

## Mise en production avec Tina Cloud (étape 3, côté toi)

1. Crée un compte sur app.tina.io et un nouveau projet, connecté au dépôt GitHub du site.
2. Récupère le **Client ID** et crée un **Token** (lecture seule suffit pour le build).
3. Sur Netlify (Site configuration > Environment variables), ajoute :
   - `PUBLIC_TINA_CLIENT_ID` = ton Client ID
   - `TINA_TOKEN` = ton token
   - `PUBLIC_TINA_BRANCH` = `main`
4. Déploie : Netlify lance `npm run build` (qui génère l'admin Tina + le site) et publie `dist`.
5. L'admin en ligne est sur `https://ton-site/admin/`. Tina gère l'authentification des éditeurs (offre gratuite : 2 éditeurs).

## Niveaux d'édition visuelle

- **Disponible avec cette configuration** : l'admin Tina affiche le site en aperçu à côté des champs ; toute modification (texte, prix, photo, ordre des œuvres) se voit en direct et tout le contenu est éditable. C'est déjà nettement plus agréable que Decap.
- **À ajouter ensuite si besoin (édition contextuelle)** : cliquer directement sur un élément de la page pour l'éditer. Cela demande de lier chaque zone au client Tina généré (`tinaField`). C'est la dernière couche, à câbler une fois Tina connecté à ton compte, car elle nécessite de faire tourner Tina pour générer son client.

## Ce qui reste à décider / faire

- Remplacer les images de démonstration par les vraies photos des toiles.
- Mettre la vraie adresse email de contact dans `content/site/general.json`.
- Choisir : déployer ce nouveau site sur le projet Netlify existant (en remplaçant la version Decap) ou sur un nouveau projet le temps de valider.
