# JetX Predictor - Application Expo React Native

Application mobile de démonstration simulant un système de prédiction pour le jeu JetX. Interface moderne avec thème casino (dark mode) et système d'administration complet.

## Aperçu

Cette application présente :
- **Authentification sécurisée** avec Supabase
- **Navigation par onglets** avec expo-router
- **Interface admin** pour la gestion des utilisateurs
- **Simulation de prédictions** avec animations et graphiques
- **Système d'expiration** des comptes utilisateurs
- **Design premium** inspiré de l'univers casino/gaming

## Technologies

- **React Native** avec Expo SDK 54
- **TypeScript** pour la sûreté du typage
- **Supabase** pour l'authentification et la base de données
- **Expo Router** pour la navigation basée sur les fichiers
- **Lucide Icons** pour les icônes
- **Expo Linear Gradient** pour les dégradés

## Structure du Projet

```
app/
├── (auth)/
│   ├── _layout.tsx
│   └── login.tsx           # Page de connexion
├── (tabs)/
│   ├── _layout.tsx         # Navigation par onglets
│   ├── index.tsx           # Page d'accueil (prédictions)
│   ├── about.tsx           # Page À propos
│   └── admin.tsx           # Interface admin (CRUD utilisateurs)
├── _layout.tsx             # Layout racine avec AuthProvider
└── +not-found.tsx

contexts/
└── AuthContext.tsx         # Contexte d'authentification

lib/
└── supabase.ts             # Client Supabase

types/
└── database.ts             # Types TypeScript

scripts/
└── create-admin.mjs        # Script pour créer un admin
```

## Installation

```bash
# Installer les dépendances
npm install
```

## Configuration

### 1. Variables d'environnement

Le fichier `.env` contient déjà les variables Supabase :
```env
EXPO_PUBLIC_SUPABASE_URL=votre_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=votre_cle_anon
```

### 2. Base de données

La base de données Supabase est déjà configurée avec :
- Table `profiles` pour les utilisateurs
- Row Level Security (RLS) activé
- Politiques de sécurité pour admins et utilisateurs
- Triggers pour la création automatique de profils

### 3. Créer un utilisateur admin

**Option A : Script automatique**
```bash
node scripts/create-admin.mjs
```

**Option B : Manuellement via Supabase**

Consultez le fichier `SETUP.md` pour les instructions détaillées.

## Utilisation

```bash
# Lancer en mode développement
npm run dev

# Build pour le web
npm run build:web

# Vérifier les types TypeScript
npm run typecheck
```

## Fonctionnalités

### Page de Connexion
- Interface moderne avec dégradés violet/noir
- Validation des champs
- Gestion des erreurs
- Animations fluides

### Page d'Accueil (Prédictions)
- Compte à rebours automatique (30s)
- Graphique interactif des dernières prédictions
- Bouton de génération avec animation de chargement
- Résultat affiché avec code couleur :
  - Vert : Forte probabilité (> 2.5x)
  - Doré : Probabilité moyenne (1.8x - 2.5x)
  - Rouge : Jouer prudemment (< 1.8x)
- Affichage de la date d'expiration du compte

### Page Admin (Réservée aux Admins)

**Création d'utilisateurs :**
- Email et mot de passe
- Nom d'affichage personnalisé
- Date d'expiration optionnelle (format: YYYY-MM-DD)
- Attribution du statut admin

**Gestion des utilisateurs :**
- Liste complète avec badges admin
- Modification des informations
- Suppression avec confirmation
- Actualisation automatique après chaque action

### Système d'Expiration

Les comptes avec date d'expiration :
- Sont vérifiés à chaque connexion
- Déconnectent automatiquement l'utilisateur si expiré
- Affichent la date d'expiration sur la page d'accueil

## Sécurité

### Row Level Security (RLS)

Toutes les tables utilisent RLS avec des politiques strictes :

- **Lecture** : Les utilisateurs voient leur profil ; les admins voient tous les profils
- **Création** : Seuls les admins peuvent créer des profils
- **Modification** : Seuls les admins peuvent modifier tous les profils
- **Suppression** : Seuls les admins peuvent supprimer des profils

### Authentification

- Mots de passe hachés par Supabase (bcrypt)
- Sessions gérées automatiquement
- Tokens JWT pour l'authentification
- Validation côté serveur via RLS

## Thème Visuel

**Palette de couleurs :**
- Fond : `#0a0015` → `#1a0030` (dégradé)
- Primaire : `#8B5CF6` (violet)
- Secondaire : `#6D28D9` (violet foncé)
- Accent : `#FFD700` (doré)
- Carte : `#1a1a2e` (gris très foncé)
- Erreur : `#ff4444` (rouge)
- Succès : `#00ff88` (vert)

**Design :**
- Dark mode intégral
- Dégradés subtils
- Ombres et effets de profondeur
- Animations fluides
- Icônes cohérentes

## Notes Importantes

### Prédictions Fictives

Les prédictions sont générées **aléatoirement** à des fins de démonstration uniquement. Elles ne doivent **jamais** être utilisées pour des paris réels.

### Avertissement

Cette application est un projet éducatif. Le jeu peut créer une dépendance. Jouez de manière responsable.

### Platform Web

Ce projet est configuré pour le web. Certaines fonctionnalités natives ne sont pas disponibles (Haptics, etc.).

## Dépannage

### L'onglet Admin ne s'affiche pas
- Vérifiez que l'utilisateur connecté a `is_admin = true` dans la table profiles
- Déconnectez-vous et reconnectez-vous

### Erreur de connexion
- Vérifiez les variables d'environnement dans `.env`
- Assurez-vous que l'utilisateur existe dans Supabase
- Vérifiez que le compte n'a pas expiré

### Erreur lors de la création d'utilisateur
- Vérifiez que l'utilisateur admin a bien `is_admin = true`
- L'email doit être unique
- Le mot de passe doit respecter les règles Supabase (minimum 6 caractères)

## License

Projet de démonstration - Utilisation éducative uniquement.
