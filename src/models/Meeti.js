const Sequelize = require("sequelize");
const db = require("../config/db");
const uuid = require("uuid").v4;
const shortid = require("shortid");
const slug = require("slug")

const Usuarios = require("../models/Usuarios");
const Grupos = require("../models/Grupos");

const Meeti = db.define("meetis", {
	id: {
		type: Sequelize.INTEGER,
		primaryKey: true,
		allowNull: false,
		autoIncrement: true,
	},
	titulo: {
		type: Sequelize.STRING,
		allowNull: false,
		validate: {
			notEmpty: {
				msg: "Agrega un Titulo",
			},
		},
	},
	invitado: Sequelize.STRING,
	cupo: {
		type: Sequelize.INTEGER,
		defaultValue: 0,
    },
    descripcion:{
        type:Sequelize.TEXT,
        allowNull:false,
        validate:{
            notEmpty:{
                msg:"Agrega una descripcion"
            }
        }
    },
    slug:{
        type:Sequelize.STRING
    },
    fecha:{
        type:Sequelize.DATEONLY,
        allowNull:false,
        validate:{
            notEmpty:{
                msg:"Agrega una fecha para el Meeti"
            }
        }
    },
    hora:{
        type:Sequelize.TIME,
        allowNull:false,
        validate:{
            notEmpty:{
                msg:"Agrega una hora para el Meeti"
            }
        }
    },
    direccion:{
        type:Sequelize.STRING,
        allowNull:false,
        validate:{
            notEmpty:{
                msg:"Agrega una direccion"
            }
        }
    },
    ciudad:{
        type:Sequelize.STRING,
        allowNull:false,
        validate:{
            notEmpty:{
                msg:"Agrega una ciudad"
            }
        }
    },
    estado:{
        type:Sequelize.STRING,
        allowNull:false,
        validate:{
            notEmpty:{
                msg:"Agrega una Estado"
            }
        }
    },
    pais:{
        type:Sequelize.STRING,
        allowNull:false,
        validate:{
            notEmpty:{
                msg:"Agrega un Pais"
            }
        }
    },
    lat:{
        type:Sequelize.STRING
    },
    lng:{
        type:Sequelize.STRING
    },
    interesados:{
        type:Sequelize.ARRAY(Sequelize.INTEGER),
        defaultValue:[]
    }
},{
    hooks: {
        beforeCreate(meeti){
            const url = slug(meeti.titulo).toLowerCase();
            meeti.slug = `${url}-${shortid.generate()}`;
        }
    }
});

Meeti.belongsTo(Usuarios);
Meeti.belongsTo(Grupos);

module.exports = Meeti;