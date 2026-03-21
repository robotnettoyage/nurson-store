# NurSon — Boutique E-commerce Statique

Site e-commerce statique pour la vente d'enceintes coraniques premium. Hébergeable sur **Cloudflare Pages** via GitHub.

## Stack technique

- HTML5 / CSS3 / JavaScript vanilla
- Stripe Checkout (Payment Links ou Stripe.js)
- Cloudflare Pages (hébergement)
- Google Fonts (Playfair Display, Inter, Amiri)

---

## Structure du projet

```
nurson-store/
├── index.html              # Page d'accueil
├── produit.html            # Page produit détaillée
├── a-propos.html           # Page À Propos
├── contact.html            # Contact + FAQ
├── mentions-legales.html   # Mentions légales + RGPD + Cookies
├── cgv.html                # Conditions Générales de Vente
├── _redirects              # Règles de redirection Cloudflare Pages
├── _headers                # Headers HTTP (sécurité, cache)
├── css/
│   ├── style.css           # Styles principaux
│   └── animations.css      # Animations et micro-interactions
├── js/
│   └── main.js             # Logique JS (nav, galerie, Stripe, etc.)
└── images/
    ├── favicon.svg         # Favicon
    └── README.md           # Guide des images à fournir
```

---

## Déploiement sur Cloudflare Pages

### 1. Préparer le repo GitHub

```bash
cd nurson-store
git init
git add .
git commit -m "Initial commit — NurSon e-commerce"
git branch -M main
git remote add origin https://github.com/VOTRE-USERNAME/nurson-store.git
git push -u origin main
```

### 2. Connecter à Cloudflare Pages

1. Connectez-vous à [dash.cloudflare.com](https://dash.cloudflare.com)
2. Allez dans **Pages** → **Create a project**
3. Choisissez **Connect to Git** → sélectionnez votre repo GitHub
4. Configuration de build :
   - **Framework preset :** None
   - **Build command :** *(laisser vide)*
   - **Build output directory :** `/` (ou `.`)
5. Cliquez **Save and Deploy**

### 3. Domaine personnalisé (optionnel)

Dans Cloudflare Pages → votre projet → **Custom domains** → ajouter `nurson.fr` et `www.nurson.fr`.

---

## Configuration Stripe

### Option A — Stripe Payment Links (le plus simple)

1. Créez un compte [Stripe](https://stripe.com)
2. Allez dans **Payment Links** → **Create new link**
3. Configurez votre produit (nom, prix, image)
4. Copiez l'URL générée (ex: `https://buy.stripe.com/xxxxxxxxxxxx`)
5. Dans `js/main.js`, remplacez :
   ```js
   const STRIPE_PAYMENT_LINK = 'https://buy.stripe.com/VOTRE_LIEN_STRIPE';
   ```

### Option B — Stripe.js (plus avancé, nécessite une edge function)

Si vous souhaitez créer une session Checkout dynamiquement :

1. Activez **Cloudflare Workers** ou **Pages Functions**
2. Créez `functions/checkout.js` :
   ```js
   import Stripe from 'stripe';

   export async function onRequest(context) {
     const stripe = new Stripe(context.env.STRIPE_SECRET_KEY);
     const session = await stripe.checkout.sessions.create({
       payment_method_types: ['card'],
       line_items: [{
         price: 'price_XXXXXXXXXXXX', // votre Price ID Stripe
         quantity: 1,
       }],
       mode: 'payment',
       success_url: 'https://nurson.fr/merci.html',
       cancel_url: 'https://nurson.fr/produit.html',
     });
     return Response.redirect(session.url, 303);
   }
   ```
3. Ajoutez `STRIPE_SECRET_KEY` dans les variables d'environnement Cloudflare Pages

---

## Formulaire de contact

Par défaut, le formulaire simule l'envoi (JS). Pour un vrai envoi, utilisez une de ces solutions :

### Formspree (gratuit jusqu'à 50 soumissions/mois)
1. Créez un compte sur [formspree.io](https://formspree.io)
2. Créez un nouveau formulaire → copiez l'ID
3. Dans `contact.html`, changez l'attribut `action` du form :
   ```html
   <form id="contact-form" action="https://formspree.io/f/VOTRE_ID" method="POST">
   ```
4. Dans `js/main.js`, remplacez la simulation par un vrai `fetch` :
   ```js
   const response = await fetch(form.action, {
     method: 'POST',
     body: new FormData(form),
     headers: { 'Accept': 'application/json' }
   });
   ```

### Netlify Forms (si vous migrez vers Netlify)
Ajoutez simplement `netlify` à la balise form :
```html
<form netlify id="contact-form" name="contact">
```

---

## Personnalisation

### Changer le nom de la marque
Remplacez `NurSon` dans tous les fichiers HTML. Commande pratique :
```bash
find . -name "*.html" -exec sed -i 's/NurSon/VotreMarque/g' {} \;
```

### Changer les couleurs
Modifiez les variables CSS dans `css/style.css` (section `:root`) :
```css
--color-green: #1B3D2F;    /* Couleur principale */
--color-gold: #C8A96E;     /* Couleur accentuation */
```

### Ajouter vos photos produit
Voir `images/README.md` pour les spécifications. Remplacez les placeholders dans le HTML par :
```html
<img src="images/product-1.jpg" alt="NurSon Classic — Vue principale" width="800" height="800" />
```

### Modifier les prix
Dans `produit.html`, cherchez `79,90 €` et remplacez par votre prix réel.

---

## Checklist avant lancement

### Contenu & légal
- [ ] Remplacer le nom de marque "NurSon" si nécessaire
- [ ] Compléter les mentions légales (SIRET, adresse, etc.)
- [ ] Faire valider CGV et mentions légales par un juriste
- [ ] Ajouter les vraies photos produit HD
- [ ] Vérifier tous les textes et descriptions

### Technique
- [ ] Configurer Stripe (Payment Link ou Stripe.js)
- [ ] Configurer le formulaire de contact (Formspree ou autre)
- [ ] Tester le paiement en mode test Stripe
- [ ] Vérifier responsive sur mobile (Chrome DevTools)
- [ ] Tester toutes les pages et liens
- [ ] Vérifier les balises SEO (title, meta description, OG)
- [ ] Remplacer les URLs `https://nurson.fr` par votre vrai domaine
- [ ] Ajouter Google Analytics ou Cloudflare Analytics (optionnel)

### Déploiement
- [ ] Pusher sur GitHub
- [ ] Connecter à Cloudflare Pages
- [ ] Configurer le domaine personnalisé
- [ ] Vérifier HTTPS actif
- [ ] Tester en production

---

## SEO — Points clés

- Chaque page a son `<title>` et `<meta description>` unique
- Structure sémantique HTML correcte (`h1` → `h2` → `h3`)
- `produit.html` inclut le Schema.org `Product` complet
- `index.html` inclut le Schema.org `Organization`
- Balises Open Graph sur toutes les pages
- Liens canoniques sur toutes les pages
- Images à nommer de façon descriptive (ex: `enceinte-coranique-nurson.jpg`)

---

## Performances

Le site est conçu pour être ultra-rapide :
- Aucun framework JS lourd
- CSS et JS minifiés à faire avant déploiement production
- Images à optimiser (format WebP recommandé)
- Cloudflare CDN mondial inclus gratuitement
- Headers de cache configurés dans `_headers`

Pour minifier avant déploiement :
```bash
# Installer les outils
npm install -g html-minifier-terser terser clean-css-cli

# Minifier CSS
cleancss -o css/style.min.css css/style.css
cleancss -o css/animations.min.css css/animations.css

# Minifier JS
terser js/main.js -o js/main.min.js --compress --mangle
```

---

## Licence

Code source sous licence MIT. Contenu et marque NurSon — tous droits réservés.
