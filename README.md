# Nom du Projet : Dashboard IoT 3D

> **Description :** Dashboard IoT 3D avec données simulées, layout multi pages, le concept serai d'avoir un selcteur d'etage pour switch, de pouvoir être dans chaque étage et voir les capteurs, leurs états et leurs détails, emission d'alerte au besoin, pour les étages on veux des plans bien construit en 2 ou 3D ou on voit ce qu'on veux (on fait 3 etages different, donc machine assemblage chambre de stockage froide).

---

## La Stack Technique
*Sélection rapide des technos choisies.*

| Couche | Technologie |
| :--- | :--- |
| **Frontend** | React.js, react routeur|
| **Backend** | Node.js, express, prisma, postgresql |
| **Base de données** | supabase |
| **Styling** | TailwindCSS, Styled Components |
| **Déploiement** | Railway |

---

## Design & Thème
*L'identité visuelle du projet.*

- **Mode :** sombre
- **Couleurs dominantes :**
- A cree a partir de l'idée generale : une usine avec des machines et des capteurs et des chambres....
- **Mood :** panneau de controle, tech

---

## MVP (Ce que je veux)
*Les fonctionnalités critiques pour la V1.*

1. Une interface complète et mock
2. La visualisation des données est la priorités

---

## Points d'attention (Watchlist)
*Les pièges à éviter ou les priorités techniques.*

- **Performance :** Attention au poids des images, lazy loading.
- **Sécurité :** Validation des entrées Zod, protection des routes API.
- **Scalabilité :** Structurer la DB pour gérer X utilisateurs.
- **UX :** Feedback immédiat sur les boutons, skeleton screens.

---

## Prochaines étapes (Backlog)
- Clairifier le projet et proposer un plan clair
- Setup du repo et de l'architecture dossier.
- Configuration du thème et des composants globaux.