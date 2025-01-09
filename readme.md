<div align="center" style="position: relative;">
<h1>Art Swap</h1>

<p align="center">
Art Swap was built as a capstone project during my Ironhack bootcamp. It aims to provide a sleek and intuitive experience inspired by the aesthetics of art galleries, enabling users to discover and interact with art in a unique way.
</p>
<img src="./client/src/assets/ScreenRecording_01-09-2025 10-10-33_1.gif">
<p>To try the app, you can visit the following link 👉 <a href="https://art-swap.xyz/">Art Swap demo</p>

<p align="center">
	<!-- Shields.io badges disabled, using skill icons. --></p>
<p align="center">Built with the tools and technologies:</p>
<p align="center">
	<a href="https://skillicons.dev">
		<img src="https://skillicons.dev/icons?i=mongodb,express,react,nodejs,vite,tailwind,docker">
	</a></p>
</div>

---

## Table of Contents

<details>

- [Table of Contents](#table-of-contents)
- [](#)
- [Overview](#overview)
- [Features](#features)
  - [Core Features](#core-features)
  - [Security](#security)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Usage](#usage)
- [Database Design](#database-design)
  - [Users](#users)
  - [Images](#images)
  - [UserImages](#userimages)
  - [Comments](#comments)
- [Deployment](#deployment)
- [Security](#security-1)
- [Future Enhancements](#future-enhancements)
- [Acknowledgements](#acknowledgements)

## </details>

## Overview

Art Swap is designed to provide:

- A **swipe-to-collect** mechanism for curating personal art collections.
- A dedicated **gallery space** to organize and view selected artworks.
- **Community features** such as exploring other users’ galleries, leaving comments, and engaging in discussions.

The platform is inspired by the aesthetics of art galleries, featuring a minimalist design optimized for both desktop and mobile devices. Accessibility, security, and scalability are at the core of the project’s architecture.

---

## Features

### Core Features

- **Swipe-to-Collect**: Gamified image selection inspired by Tinder-style interactions.
- **Personal Collections**: A space for users to manage and showcase their selected images.
- **Community Interaction**: Explore others' collections, leave comments, and foster connections.
- **Responsive Design**: Seamless experience across devices with mobile-first optimization.

### Security

- JWT-based user authentication and bcrypt for password hashing.
- Server-side input validation and CORS configuration.

---

## Tech Stack

| **Technology**        | **Description**                                  |
| --------------------- | ------------------------------------------------ |
| MongoDB               | Schema-less database for managing collections.   |
| Express.js            | Backend framework for API and business logic.    |
| React + Vite          | Frontend library for dynamic and responsive UIs. |
| Node.js               | Runtime for server-side application logic.       |
| Docker                | Containerization for deployment and scalability. |
| Nginx Proxy Manager   | Simplified server management with HTTPS support. |
| Tailwind CSS + ShadCN | For styling and streamlined UI development.      |

---

## Project Structure

<details>

```sh
└── ArtSwap/
    ├── client
    │   ├── .dockerignore
    │   ├── .env
    │   ├── .gitignore
    │   ├── Dockerfile
    │   ├── components.json
    │   ├── eslint.config.js
    │   ├── index.html
    │   ├── jsconfig.json
    │   ├── package-lock.json
    │   ├── package.json
    │   ├── postcss.config.js
    │   ├── src
    │   │   ├── App.css
    │   │   ├── App.jsx
    │   │   ├── assets
    │   │   ├── components
    │   │   ├── config
    │   │   ├── contexts
    │   │   ├── index.css
    │   │   ├── lib
    │   │   ├── main.jsx
    │   │   └── pages
    │   ├── tailwind.config.js
    │   └── vite.config.js
    ├── docker-compose.yml
    └── server
        ├── .dockerignore
        ├── .env
        ├── .gitignore
        ├── Dockerfile
        ├── app.js
        ├── config
        │   └── index.js
        ├── db
        │   └── index.js
        ├── error-handling
        │   └── index.js
        ├── middleware
        │   ├── cloudinary.middleware.js
        │   └── jwt.middleware.js
        ├── models
        │   ├── Comment.model.js
        │   ├── Image.model.js
        │   ├── User.model.js
        │   └── UserImage.model.js
        ├── package-lock.json
        ├── package.json
        ├── routes
        │   ├── auth.routes.js
        │   ├── comments.routes.js
        │   ├── images.routes.js
        │   ├── index.routes.js
        │   ├── user.routes.js
        │   └── userimage.routes.js
        └── server.js
```

</details>

---

## Usage

- **Sign up and Log in:** Create an account to start collecting artworks.
- **Swipe Artworks:** Swipe through a curated set of images to build your collection.
- **Explore:** Interact with other users' galleries and leave comments.
- **Manage Collection:** Organize your personal gallery and share it with others.

## Database Design

The project uses MongoDB, structured into the following collections:

### Users

| Field      | Type            | Description                            |
| ---------- | --------------- | -------------------------------------- |
| `_id`      | ObjectId        | Unique identifier for a user.          |
| `email`    | String          | User's email address.                  |
| `username` | String          | Display name for the user.             |
| `password` | String          | Hashed user password.                  |
| `friends`  | Array<ObjectId> | List of user IDs representing friends. |

### Images

| Field        | Type     | Description                     |
| ------------ | -------- | ------------------------------- |
| `_id`        | ObjectId | Unique identifier for an image. |
| `imageSpecs` | Object   | Metadata for the image.         |

### UserImages

| Field     | Type     | Description               |
| --------- | -------- | ------------------------- |
| `_id`     | ObjectId | Unique identifier.        |
| `userId`  | ObjectId | User who saved the image. |
| `imageId` | ObjectId | Saved image ID.           |

### Comments

| Field     | Type     | Description                      |
| --------- | -------- | -------------------------------- |
| `_id`     | ObjectId | Unique identifier for a comment. |
| `userId`  | ObjectId | Author of the comment.           |
| `imageId` | ObjectId | Associated image ID.             |
| `comment` | String   | Text content of the comment.     |

---

## Deployment

Art Swap is ready to deploy with:

- Dockerized containers for the backend and frontend.
- Nginx Proxy Manager for HTTPS and domain management.

---

## Security

The application follows industry-standard security practices:

- Password hashing with `bcrypt`.
- Secure JWT tokens with expiration times.
- Input validation to prevent malicious data entry.
- HTTPS enforced for encrypted communication.

---

## Future Enhancements

Planned updates include:

- **Advanced Filtering**: Enable sorting images by color, keyword, or tags.
- **User Profiles**: Enhanced profile pages with more customization options.
- **Ratings and Sharing**: Allow users to rate artworks and share collections.
- **Accessibility Improvements**: Refine ARIA roles and keyboard navigation.
- **Mobile App**: Expand to native mobile platforms.

---

## Acknowledgements

This project was developed during a **7-day sprint** as part of the Ironhack bootcamp by:

- <a href="https://www.linkedin.com/in/fabien-dubin-46ab121b/">**Fabien Dubin**
  <img src="https://skillicons.dev/icons?i=linkedin" height="10" alt="Linkedin Fabien Dubin"></a>
- <a href="https://www.linkedin.com/in/dev-ro/">**Robert Ortiz**<img src="https://skillicons.dev/icons?i=linkedin" height="10" alt="Linkedin Rob Ortiz"></a>

Special thanks to:

- Ironhack instructors and peers.
- Online resources like WebDevSimplified, Medium, and Dev.to.
- Tools like ChatGPT and Ollama for assistance.

Feel free to contribute, report issues, or suggest enhancements! 🎉
