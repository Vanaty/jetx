# Guide de Configuration - JetX Predictor

## Structure de l'Application

Cette application Expo React Native utilise :
- **Navigation** : expo-router avec groupes (auth) et (tabs)
- **Base de données** : Supabase pour l'authentification et le stockage
- **UI** : Dark mode avec thème casino (noir, violet, doré)

## Fichiers Principaux

### Configuration
- `lib/supabase.ts` - Client Supabase
- `types/database.ts` - Types TypeScript pour la base de données
- `contexts/AuthContext.tsx` - Contexte d'authentification et hooks

### Pages
- `app/(auth)/login.tsx` - Page de connexion
- `app/(tabs)/index.tsx` - Page d'accueil avec prédictions JetX
- `app/(tabs)/about.tsx` - Page À propos
- `app/(tabs)/admin.tsx` - Interface admin pour gérer les utilisateurs

## Création d'un Utilisateur Admin Initial

Pour commencer à utiliser l'application, vous devez créer un utilisateur administrateur.

### Option 1 : Via Supabase SQL Editor

1. Connectez-vous à votre projet Supabase
2. Allez dans SQL Editor
3. Exécutez le script suivant :

```sql
-- Créer un utilisateur admin
-- Remplacez l'email et le mot de passe par vos propres valeurs
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  recovery_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'rahpasy@gmail.com', -- CHANGEZ CET EMAIL
  crypt('@jetx', gen_salt('bf')), -- CHANGEZ CE MOT DE PASSE
  NOW(),
  NOW(),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{"display_name":"Administrateur"}',
  NOW(),
  NOW(),
  '',
  '',
  '',
  ''
) RETURNING id;

-- Récupérez l'ID retourné et utilisez-le dans la requête suivante
-- Remplacez YOUR_USER_ID par l'ID retourné ci-dessus

-- Créer le profil admin
INSERT INTO public.profiles (id, display_name, is_admin, expiration_date)
VALUES (
  '11139384-ae5d-4302-9dd3-b5658d5e61c1', -- REMPLACEZ PAR L'ID DE L'UTILISATEUR CRÉÉ
  'Administrateur',
  true,
  NULL -- Pas d'expiration pour l'admin
);
```

### Option 2 : Via l'API Supabase Admin (Recommandé)

Utilisez le code suivant dans un script Node.js ou directement dans la console du navigateur :

```javascript
// Dans le navigateur ou Node.js avec @supabase/supabase-js installé
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'VOTRE_SUPABASE_URL'
const supabaseServiceKey = 'VOTRE_SERVICE_ROLE_KEY' // Trouvez cette clé dans Settings > API

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// Créer l'utilisateur admin
const { data: authData, error: authError } = await supabase.auth.admin.createUser({
  email: 'admin@example.com',
  password: 'VotreMotDePasse123',
  email_confirm: true,
  user_metadata: {
    display_name: 'Administrateur'
  }
})

if (authError) {
  console.error('Erreur:', authError)
} else {
  // Mettre à jour le profil pour le rendre admin
  const { error: profileError } = await supabase
    .from('profiles')
    .update({ is_admin: true })
    .eq('id', authData.user.id)

  if (profileError) {
    console.error('Erreur profil:', profileError)
  } else {
    console.log('Admin créé avec succès:', authData.user.email)
  }
}
```

## Fonctionnalités de l'Application

### Page de Connexion
- Design moderne avec thème casino
- Fond dégradé violet/noir avec accents dorés
- Authentification via email/password

### Page d'Accueil (Prédictions)
- Compte à rebours de 30 secondes
- Graphique des dernières prédictions
- Bouton "Générer Prédiction" avec animation
- Affichage du résultat avec indicateur de probabilité
- **Note** : Les prédictions sont générées aléatoirement (entre 1.2x et 5.2x)

### Page Admin (Réservée aux Admins)
- Liste de tous les utilisateurs
- Création de nouveaux utilisateurs avec :
  - Email
  - Mot de passe
  - Nom d'affichage
  - Date d'expiration (optionnelle)
  - Statut admin
- Modification des utilisateurs existants
- Suppression d'utilisateurs

## Système d'Expiration

Les comptes peuvent avoir une date d'expiration. Lorsqu'un utilisateur se connecte :
1. Le système vérifie si `expiration_date` est définie
2. Si la date actuelle > date d'expiration, l'utilisateur est déconnecté automatiquement
3. Sinon, l'utilisateur peut accéder normalement à l'application

## Structure de la Base de Données

### Table `profiles`
- `id` (uuid) - Référence à auth.users
- `display_name` (text) - Nom affiché dans l'application
- `is_admin` (boolean) - Statut administrateur
- `expiration_date` (timestamptz) - Date d'expiration du compte
- `created_at` (timestamptz) - Date de création
- `updated_at` (timestamptz) - Date de mise à jour

### Row Level Security (RLS)
- Les utilisateurs peuvent voir leur propre profil
- Les admins peuvent voir tous les profils
- Les admins peuvent créer, modifier et supprimer des profils
- Tous les autres accès sont restreints

## Démarrage de l'Application

```bash
# Installer les dépendances
npm install

# Lancer en mode développement
npm run dev

# Build pour le web
npm run build:web
```

## Variables d'Environnement

Le fichier `.env` contient déjà :
- `EXPO_PUBLIC_SUPABASE_URL` - URL de votre projet Supabase
- `EXPO_PUBLIC_SUPABASE_ANON_KEY` - Clé publique Supabase

Ces variables sont automatiquement chargées par Expo.
