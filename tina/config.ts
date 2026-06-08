import { defineConfig } from 'tinacms';

// Identifiants fournis par Tina Cloud (a renseigner dans les variables d'environnement).
const branch =
  process.env.PUBLIC_TINA_BRANCH || process.env.HEAD || 'main';

export default defineConfig({
  branch,
  clientId: process.env.PUBLIC_TINA_CLIENT_ID || '',
  token: process.env.TINA_TOKEN || '',

  // L'interface d'admin Tina est generee dans public/admin -> accessible sur /admin/
  build: {
    outputFolder: 'admin',
    publicFolder: 'public',
  },

  // Les photos televersees vont dans public/images (memes chemins que le site).
  media: {
    tina: {
      mediaRoot: 'images',
      publicFolder: 'public',
    },
  },

  schema: {
    collections: [
      {
        name: 'oeuvres',
        label: 'Œuvres',
        path: 'content/oeuvres',
        format: 'json',
        ui: {
          // Le nom de fichier derive du titre (identifiant stable).
          filename: {
            readonly: false,
            slugify: (values) =>
              (values?.titre || 'oeuvre')
                .toLowerCase()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, ''),
          },
        },
        fields: [
          { type: 'string', name: 'titre', label: 'Titre', isTitle: true, required: true },
          { type: 'number', name: 'annee', label: 'Année' },
          { type: 'string', name: 'technique', label: 'Technique', description: 'Ex : Huile sur toile de lin' },
          { type: 'number', name: 'largeur_cm', label: 'Largeur (cm)' },
          { type: 'number', name: 'hauteur_cm', label: 'Hauteur (cm)' },
          { type: 'number', name: 'prix', label: 'Prix (EUR)' },
          {
            type: 'string', name: 'statut', label: 'Disponibilité',
            options: ['disponible', 'vendu'],
          },
          { type: 'string', name: 'description', label: 'Description', ui: { component: 'textarea' } },
          { type: 'number', name: 'ordre', label: 'Ordre d\'affichage', description: 'Plus petit = affiché en premier' },
          {
            type: 'object', name: 'images', label: 'Photos', list: true,
            ui: { itemProps: (item) => ({ label: item?.image || 'Photo' }) },
            fields: [
              { type: 'image', name: 'image', label: 'Photo' },
            ],
          },
        ],
      },
      {
        name: 'site',
        label: 'Site & présentation',
        path: 'content/site',
        format: 'json',
        ui: {
          // Fichier unique : on n'autorise ni creation ni suppression.
          allowedActions: { create: false, delete: false },
        },
        fields: [
          { type: 'string', name: 'nom_artiste', label: "Nom de l'artiste" },
          { type: 'string', name: 'accroche', label: 'Petite accroche (au-dessus du titre)' },
          { type: 'string', name: 'hero_titre', label: "Grand titre d'accueil" },
          { type: 'string', name: 'hero_sous_titre', label: "Sous-titre d'accueil" },
          { type: 'image', name: 'hero_image', label: "Image d'accueil (plein écran)" },
          { type: 'string', name: 'a_propos_titre', label: 'Titre — section atelier' },
          { type: 'string', name: 'a_propos_texte', label: 'Texte — section atelier', ui: { component: 'textarea' } },
          { type: 'image', name: 'a_propos_image', label: 'Photo — section atelier' },
          { type: 'string', name: 'philosophie_titre', label: 'Titre — la démarche' },
          { type: 'string', name: 'philosophie_texte', label: 'Texte — la démarche', ui: { component: 'textarea' } },
          { type: 'string', name: 'email_contact', label: 'Email de contact' },
          { type: 'string', name: 'telephone', label: 'Téléphone (optionnel)' },
          { type: 'string', name: 'ville_atelier', label: "Localisation de l'atelier" },
          { type: 'string', name: 'instagram', label: 'Lien Instagram (optionnel)' },
        ],
      },
    ],
  },
});
