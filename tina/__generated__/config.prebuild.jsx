// tina/config.ts
import { defineConfig } from "tinacms";
var branch = process.env.PUBLIC_TINA_BRANCH || process.env.HEAD || "main";
var config_default = defineConfig({
  branch,
  clientId: process.env.PUBLIC_TINA_CLIENT_ID || "",
  token: process.env.TINA_TOKEN || "",
  // L'interface d'admin Tina est generee dans public/admin -> accessible sur /admin/
  build: {
    outputFolder: "admin",
    publicFolder: "public"
  },
  // Les photos televersees vont dans public/images (memes chemins que le site).
  media: {
    tina: {
      mediaRoot: "images",
      publicFolder: "public"
    }
  },
  schema: {
    collections: [
      {
        name: "oeuvres",
        label: "\u0152uvres",
        path: "content/oeuvres",
        format: "json",
        ui: {
          // Le nom de fichier derive du titre (identifiant stable).
          filename: {
            readonly: false,
            slugify: (values) => (values?.titre || "oeuvre").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
          }
        },
        fields: [
          { type: "string", name: "titre", label: "Titre", isTitle: true, required: true },
          { type: "number", name: "annee", label: "Ann\xE9e" },
          { type: "string", name: "technique", label: "Technique", description: "Ex : Huile sur toile de lin" },
          { type: "number", name: "largeur_cm", label: "Largeur (cm)" },
          { type: "number", name: "hauteur_cm", label: "Hauteur (cm)" },
          { type: "number", name: "prix", label: "Prix (EUR)" },
          {
            type: "string",
            name: "statut",
            label: "Disponibilit\xE9",
            options: ["disponible", "vendu"]
          },
          { type: "string", name: "description", label: "Description", ui: { component: "textarea" } },
          { type: "number", name: "ordre", label: "Ordre d'affichage", description: "Plus petit = affich\xE9 en premier" },
          {
            type: "object",
            name: "images",
            label: "Photos",
            list: true,
            ui: { itemProps: (item) => ({ label: item?.image || "Photo" }) },
            fields: [
              { type: "image", name: "image", label: "Photo" }
            ]
          }
        ]
      },
      {
        name: "site",
        label: "Site & pr\xE9sentation",
        path: "content/site",
        format: "json",
        ui: {
          // Fichier unique : on n'autorise ni creation ni suppression.
          allowedActions: { create: false, delete: false }
        },
        fields: [
          { type: "string", name: "nom_artiste", label: "Nom de l'artiste" },
          { type: "string", name: "accroche", label: "Petite accroche (au-dessus du titre)" },
          { type: "string", name: "hero_titre", label: "Grand titre d'accueil" },
          { type: "string", name: "hero_sous_titre", label: "Sous-titre d'accueil" },
          { type: "image", name: "hero_image", label: "Image d'accueil (plein \xE9cran)" },
          { type: "string", name: "a_propos_titre", label: "Titre \u2014 section atelier" },
          { type: "string", name: "a_propos_texte", label: "Texte \u2014 section atelier", ui: { component: "textarea" } },
          { type: "image", name: "a_propos_image", label: "Photo \u2014 section atelier" },
          { type: "string", name: "philosophie_titre", label: "Titre \u2014 la d\xE9marche" },
          { type: "string", name: "philosophie_texte", label: "Texte \u2014 la d\xE9marche", ui: { component: "textarea" } },
          { type: "string", name: "email_contact", label: "Email de contact" },
          { type: "string", name: "telephone", label: "T\xE9l\xE9phone (optionnel)" },
          { type: "string", name: "ville_atelier", label: "Localisation de l'atelier" },
          { type: "string", name: "instagram", label: "Lien Instagram (optionnel)" }
        ]
      }
    ]
  }
});
export {
  config_default as default
};
