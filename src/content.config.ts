import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Astro lit le contenu depuis le dossier /content (les memes fichiers que Tina edite).
const site = defineCollection({
  loader: glob({ pattern: '*.json', base: './content/site' }),
  schema: z.object({
    nom_artiste: z.string(),
    accroche: z.string(),
    hero_titre: z.string(),
    hero_sous_titre: z.string(),
    hero_image: z.string(),
    a_propos_titre: z.string(),
    a_propos_texte: z.string(),
    a_propos_image: z.string(),
    philosophie_titre: z.string(),
    philosophie_texte: z.string(),
    email_contact: z.string(),
    telephone: z.string().optional(),
    ville_atelier: z.string(),
    instagram: z.string().optional(),
  }),
});

const oeuvres = defineCollection({
  loader: glob({ pattern: '*.json', base: './content/oeuvres' }),
  schema: z.object({
    titre: z.string(),
    annee: z.number(),
    technique: z.string(),
    largeur_cm: z.number(),
    hauteur_cm: z.number(),
    prix: z.number(),
    statut: z.enum(['disponible', 'vendu']),
    description: z.string().optional(),
    ordre: z.number().optional(),
    images: z.array(z.object({ image: z.string() })),
  }),
});

export const collections = { site, oeuvres };
