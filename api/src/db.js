/*require("dotenv").config();
const { Sequelize } = require("sequelize");
const fs = require("fs");
const path = require("path");

const { DB_USER, DB_PASSWORD, DB_HOST, DB_NAME } = process.env;

const sequelize = new Sequelize(
  `postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}`,
  {
    logging: false, // set to console.log to see the raw SQL queries
    native: false, // lets Sequelize know we can use pg-native for ~30% more speed
  }
);

sequelize
  .authenticate()
  .then(() => console.log("Connection has been established successfully."))
  .catch((err) => {
    console.error("Unable to connect to the database:");
  });

const basename = path.basename(__filename);
const modelDefiners = [];

// Leemos todos los archivos de la carpeta Models, los requerimos y agregamos al arreglo modelDefiners
fs.readdirSync(path.join(__dirname, "/models"))
  .filter(
    (file) =>
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
  )
  .forEach((file) => {
    modelDefiners.push(require(path.join(__dirname, "/models", file)));
  });

// Injectamos la conexion (sequelize) a todos los modelos
modelDefiners.forEach((model) => model(sequelize));
// Capitalizamos los nombres de los modelos ie: product => Product
let entries = Object.entries(sequelize.models);
let capsEntries = entries.map((entry) => [
  entry[0][0].toUpperCase() + entry[0].slice(1),
  entry[1],
]);
sequelize.models = Object.fromEntries(capsEntries);

// En sequelize.models están todos los modelos importados como propiedades
// Para relacionarlos hacemos un destructuring
const { Pokemons, Types } = sequelize.models;

Pokemons.belongsToMany(Types, { through: "Pokemons_Types" });
Types.belongsToMany(Pokemons, { through: "Pokemons_Types" });

module.exports = {
  ...sequelize.models, // para poder importar los modelos así: const { Product, User } = require('./db.js');
  conn: sequelize, // para importar la conexión { conn } = require('./db.js');
};
*/

//configuracion de una DB postgres utiliazndo sequelize
require("dotenv").config();
const { Sequelize } = require("sequelize");
const { DB_USER, DB_PASSWORD, DB_HOST } = process.env;

//se crea una nueva instancia de sequelize
const sequelize = new Sequelize(
  `postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/pokemon`,
  {
    logging: false, // set to console.log to see the raw SQL queries
    native: false, // lets Sequelize know we can use pg-native for ~30% more speed
  }
);

//importan lo modelos utilizando require
const PokemonModel = require("./models/Pokemon");
const TypesModel = require("./models/Types");
PokemonModel(sequelize); // se pasa sequelize como argumento
TypesModel(sequelize);

//relacion: un pokemon puede tener varios types y un type puede estar asociado con varios pokemon
const { pokemon, type } = sequelize.models;
pokemon.belongsToMany(type, { through: "pokemon_type" });
type.belongsToMany(pokemon, { through: "pokemon_type" });

module.exports = {
  ...sequelize.models, // para poder importar los modelos así: const { Product, User } = require('./db.js');
  conn: sequelize, // para importar la conexión { conn } = require('./db.js');
};
