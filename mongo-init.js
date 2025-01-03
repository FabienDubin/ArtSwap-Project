db = db.getSiblingDB("admin"); // Connexion à la base admin

// Création d'un utilisateur admin
db.createUser({
  user: "fab",
  pwd: "Milord13!",
  roles: [{ role: "userAdminAnyDatabase", db: "admin" }],
});

// Connexion à la base de données "artswap"
db = db.getSiblingDB("artswap");

// Création d'un utilisateur spécifique pour la base "artswap"
db.createUser({
  user: "artswapUser",
  pwd: "ArtPass",
  roles: [{ role: "readWrite", db: "artswap" }],
});
