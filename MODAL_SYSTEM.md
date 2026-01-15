# Système de Modales Centrées avec Flou Sélectif

## Vue d'ensemble

Le système de modales implémenté offre une expérience utilisateur moderne avec :
- **Modales centrées** sur la page
- **Flou sélectif** appliqué uniquement à la zone de contenu principale (#contentRight)
- **Sidebar non affectée** (reste nette)
- **Accessibilité complète** (WCAG 2.1)
- **Animations fluides** avec support de `prefers-reduced-motion`

## Architecture

### Structure HTML

```html
<body>
  <div id="root">
    <!-- Application principale -->
    <div id="sidebar">Sidebar (non floutée)</div>
    <div id="contentRight">Contenu principal (sera flouté)</div>
  </div>
  <div id="modal-root">
    <!-- Les modales sont montées ici via createPortal -->
  </div>
</body>
```

### Composants

1. **Modal.tsx** - Composant modal réutilisable
2. **useModal.ts** - Hook personnalisé pour gérer l'état des modales
3. **ExampleModal.tsx** - Exemple d'utilisation

## Utilisation

### Méthode 1 : Avec le hook useModal (recommandé)

```tsx
import Modal from './components/Modal';
import { useModal } from './hooks/useModal';

function MyComponent() {
  const { isOpen, open, close } = useModal();

  return (
    <>
      <button onClick={open}>Ouvrir</button>

      <Modal
        isOpen={isOpen}
        onClose={close}
        title="Mon titre"
        maxWidth="960px"
      >
        <div className="p-6">
          {/* Votre contenu */}
        </div>
      </Modal>
    </>
  );
}
```

### Méthode 2 : Avec useState

```tsx
import { useState } from 'react';
import Modal from './components/Modal';

function MyComponent() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)}>Ouvrir</button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Mon titre"
      >
        <div className="p-6">
          {/* Votre contenu */}
        </div>
      </Modal>
    </>
  );
}
```

## Props du Composant Modal

| Prop | Type | Défaut | Description |
|------|------|--------|-------------|
| `isOpen` | `boolean` | - | **Requis.** État d'ouverture de la modal |
| `onClose` | `() => void` | - | **Requis.** Callback de fermeture |
| `title` | `string` | `undefined` | Titre affiché dans le header |
| `children` | `ReactNode` | - | **Requis.** Contenu de la modal |
| `maxWidth` | `string` | `'960px'` | Largeur maximale de la modal |
| `showCloseButton` | `boolean` | `true` | Afficher le bouton de fermeture |

## Fonctionnalités

### 1. Flou Sélectif

Lorsqu'une modal s'ouvre :
- Un overlay `.content-blur-overlay` est injecté dans `#contentRight`
- Applique `backdrop-filter: blur(10px)` + background semi-transparent
- La sidebar reste nette

### 2. Gestion du Focus

- Au montage : focus sur le premier élément interactif
- Focus trap : Tab/Shift+Tab bouclent dans la modal
- À la fermeture : retour du focus à l'élément déclencheur

### 3. Fermeture

La modal se ferme via :
- Bouton de fermeture (X)
- Clic sur le backdrop
- Touche ESC
- Appel programmatique de `onClose()`

### 4. Blocage du Scroll

- `overflow: hidden` sur `<body>` pendant l'ouverture
- Restauré à la fermeture

### 5. Accessibilité

```html
<div role="dialog" aria-modal="true" aria-labelledby="modalTitle">
  <!-- Contenu -->
</div>
```

- Attributs ARIA corrects
- Focus management complet
- Support clavier (ESC, Tab)
- Support `prefers-reduced-motion`

## Styles CSS

Les styles sont dans `src/index.css` :

### Classes principales

- `.content-blur-overlay` - Overlay de flou sur #contentRight
- `.modal-backdrop` - Fond semi-transparent plein écran
- `.modal` - Container de la modal
- `.modal-header` - En-tête avec titre et bouton fermer
- `.modal-content` - Zone de contenu
- `.modal-close-btn` - Bouton de fermeture

### Z-index

| Élément | Z-index |
|---------|---------|
| `#contentRight` | 0 |
| `.content-blur-overlay` | 10 |
| `.modal-backdrop` | 90 |
| `.modal` | 100 |

### Animations

- Backdrop : fade in (opacity 0→1, 200ms)
- Modal : scale + translate (scale 0.98→1, 200ms)
- Overlay blur : opacity 0→1 (150ms)

## Responsive

- **Desktop** : Largeur configurée via `maxWidth`
- **Tablet/Mobile** : `width: 96vw`, `max-height: 85vh`
- **Contenu scrollable** si nécessaire

## Fallback

Si `backdrop-filter` n'est pas supporté :
```css
@supports not (backdrop-filter: blur(10px)) {
  .content-blur-overlay {
    background: rgba(15, 23, 42, 0.25);
  }
}
```

## Migration des Modales Existantes

Pour migrer une modal existante :

### Avant
```tsx
return (
  <>
    <div className="fixed inset-0 bg-black/40" onClick={onClose} />
    <div className="fixed inset-0 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6">
        {/* Contenu */}
      </div>
    </div>
  </>
);
```

### Après
```tsx
return (
  <Modal isOpen={true} onClose={onClose} title="Titre">
    <div className="p-6">
      {/* Contenu */}
    </div>
  </Modal>
);
```

## Bonnes Pratiques

1. **Utilisez le hook `useModal`** pour un code plus propre
2. **Définissez `maxWidth`** selon vos besoins (défaut: 960px)
3. **Toujours fournir un `title`** pour l'accessibilité
4. **Gérez le loading state** dans votre contenu
5. **Évitez les modales imbriquées**

## Exemple Complet

Voir `src/components/ExampleModal.tsx` pour un exemple fonctionnel.

## Tests

Pour tester le système :
1. Ouvrir une modal
2. Vérifier que seul #contentRight est flouté
3. Tester la fermeture (ESC, clic backdrop, bouton X)
4. Vérifier le focus trap (Tab/Shift+Tab)
5. Tester sur mobile/tablet

## Support Navigateurs

- Chrome/Edge : ✅ Full support
- Firefox : ✅ Full support
- Safari : ✅ Full support (avec -webkit-backdrop-filter)
- Opera : ✅ Full support

## Notes Techniques

- Utilise `createPortal` de React pour monter dans `#modal-root`
- Gère proprement le cleanup des overlays
- Support de `prefers-reduced-motion`
- Pas de dépendances externes
