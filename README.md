# CVE Explorer - Frontend

Application Vue.js pour explorer et analyser les vulnérabilités CVE avec une interface moderne et intuitive.

## Description

Cette application frontend permet de consulter, rechercher et analyser les vulnérabilités CVE (Common Vulnerabilities and Exposures) avec leurs détails techniques, les produits affectés et les métriques de sécurité.

### Fonctionnalités principales

- **Exploration de CVE** : Navigation et recherche dans la base de données des vulnérabilités
- **Gestion des vendeurs** : Vue d'ensemble des organisations et leurs vulnérabilités
- **Tableaux de bord** : Visualisation des métriques et tendances de sécurité
- **Authentification** : Système de connexion
- **Recherche avancée** : Filtres multiples par sévérité, score CVSS et autres

## Architecture

Le projet suit une architecture Vue.js moderne avec :

- **Views** : Pages principales de l'application
- **Components** : Composants réutilisables organisés par fonctionnalité
- **Services** : Couche d'abstraction pour les appels API
- **Store** : Gestion d'état global avec Vuex
- **Router** : Navigation entre les pages

## Prérequis

- Node.js
- npm ou yarn

## Installation

### 1. Cloner le projet

```bash
git clone <url-du-repo>
cd vue-project
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Configuration de l'environnement

Cré[er un fichier `.env` à la racine du projet :
]()
```env
VITE_API_URL=http://localhost:3000/api
```

### 4. Lancement de l'application

#### Développement

```bash
npm run dev
```

L'application sera accessible sur `http://localhost:5173`

#### Production

```bash
npm run build
npm run preview
```

## Utilisation

### Pages principales

#### Dashboard
```
/
```
Vue d'ensemble avec statistiques générales et activité récente

#### Explorateur CVE
```
/cves
```
Recherche et navigation dans les vulnérabilités avec filtres avancés

#### Détails CVE
```
/cves/:id
```
Informations détaillées d'une vulnérabilité spécifique

#### Explorateur de produits
```
/products
```
Liste des produits logiciels avec leurs vulnérabilités

#### Explorateur de vendeurs
```
/vendors
```
Liste des organisations et leurs produits

#### Analyse comparative
```
/analysis
```
Comparaison de sécurité entre produits

### Fonctionnalités de recherche

**Recherche globale :**
- Recherche par ID CVE, description, vendeur ou produit
- Résultats catégorisés

**Filtres avancés :**
- Niveau de sévérité (Critical, High, Medium, Low)
- Plage de score CVSS
- Vendeur et produit spécifiques
- Identifiant CWE

## Structure du projet

```
src/
├── components/
│   ├── auth/              # Authentification
│   ├── common/            # Composants partagés
│   ├── cve/              # Composants CVE
│   └── dashboard/        # Composants tableau de bord
├── services/
│   ├── api.js            # Configuration Axios
│   ├── authService.js    # Service d'authentification
│   ├── cveService.js     # Service CVE
│   ├── productService.js # Service produits
│   ├── vendorService.js  # Service vendeurs
│   └── searchService.js  # Service de recherche
├── views/                # Pages principales
├── router/               # Configuration des routes
├── store/                # Gestion d'état Vuex
└── assets/               # Ressources statiques
```

## Technologies utilisées

- **Vue.js 3** : Framework JavaScript réactif
- **Vue Router** : Gestion de la navigation
- **Vuex** : Gestion d'état centralisée
- **Axios** : Client HTTP pour les appels API
- **Tailwind CSS** : Framework CSS utilitaire
- **Chart.js** : Bibliothèque de graphiques
- **Date-fns** : Manipulation des dates
- **Vite** : Outil de build moderne

## Développement

Pour le développement avec rechargement automatique :

```bash
npm run dev
```

### Variables d'environnement

- `VITE_API_URL` : URL de l'API backend

### Commandes disponibles

- `npm run dev` : Serveur de développement
- `npm run build` : Build de production
- `npm run preview` : Aperçu du build de production

## Contribution

1. Fork le projet
2. Créer une branche pour votre fonctionnalité
3. Commit vos changements
4. Push vers la branche
5. Ouvrir une Pull Request