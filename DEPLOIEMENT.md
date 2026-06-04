# Déploiement - démo fonctionnelle front + back

Objectif : mettre le site en ligne sur Netlify avec l'admin `/admin` opérationnel, pour que la cliente teste tout depuis une URL.

Prérequis : un compte GitHub et un compte Netlify (les deux gratuits). Git installé.

---

## 1. Pousser le site sur GitHub

Crée un dépôt vide sur github.com (ex : `site-isabelle-de-saint-lager`), **sans** README ni .gitignore (ils existent déjà ici). Puis, dans le dossier `site-atelier` :

```bash
cd site-atelier
git init
git add .
git commit -m "Site Isabelle de Saint-Lager - version initiale"
git branch -M main
git remote add origin https://github.com/TON-COMPTE/site-isabelle-de-saint-lager.git
git push -u origin main
```

> La branche doit s'appeler `main` (c'est ce qui est configuré dans `admin/config.yml`). Si tu utilises `master`, change aussi la ligne `branch:` du fichier.

## 2. Brancher Netlify sur le dépôt

1. netlify.com → **Add new site** → **Import an existing project** → **GitHub** → choisir le dépôt.
2. Build command : **vide**. Publish directory : **`.`** (déjà dans `netlify.toml`). → **Deploy**.
3. Au bout d'une minute, le site est en ligne sous une adresse type `https://nom-aleatoire.netlify.app`.
4. Optionnel : **Site configuration → Change site name** pour une URL plus propre, ex `isabelle-de-saint-lager.netlify.app`.

À ce stade : **le front fonctionne déjà** (galerie, fiches, responsive). Tu peux envoyer ce lien à la cliente.

## 3. Activer l'admin (le « back »)

Toujours dans Netlify, sur le site :

1. **Site configuration → Identity → Enable Identity**.
2. **Identity → Authentication / Services → Git Gateway → Enable**.
3. **Identity → Registration preferences → Invite only** (sinon n'importe qui peut créer un compte).
4. **Identity → Invite users** → saisir l'email de la cliente.

La cliente reçoit un mail, clique sur le lien, choisit un mot de passe, et arrive sur l'admin. Ensuite elle se connecte simplement sur `https://ton-site.netlify.app/admin`.

> Le lien d'invitation ramène sur la page d'accueil avec un jeton : le script d'identité ajouté dans `index.html` ouvre alors la fenêtre de création de mot de passe et redirige vers `/admin`. C'est normal.

## 4. Activer les notifications du formulaire de contact

1. **Site configuration → Forms** (Netlify détecte automatiquement le formulaire au déploiement).
2. **Form notifications → Add notification → Email notification** → mettre l'email où la cliente veut recevoir les demandes.

Test : remplir le formulaire sur le site en ligne, vérifier qu'il apparaît dans **Forms** et que le mail arrive.

---

## Mise à jour du contenu ensuite

Deux façons, au choix :

- **La cliente** : via `/admin`, elle ajoute/modifie ses tableaux et photos. Chaque enregistrement crée un commit sur GitHub et Netlify republie tout seul (~1 min).
- **Toi** : modifier les fichiers `data/oeuvres.json` / `data/site.json` ou les images, puis `git add . && git commit && git push`. Netlify republie automatiquement.

## Démo conseillée à la cliente

1. Lui montrer le site sur son téléphone (le lien `.netlify.app`).
2. Ouvrir `/admin` devant elle, ajouter un tableau de test avec une photo.
3. Recharger le site : la nouvelle œuvre apparaît dans la galerie. C'est l'effet qui prouve que le back est réel.
4. Remplir le formulaire de contact et montrer le message reçu côté Netlify.
