const Sequelize = require("sequelize");
const db = require("../config/db");
const bcrypt = require("bcrypt-nodejs");

const Usuarios = db.define(
	"usuarios",
	{
		id: {
			type: Sequelize.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		nombre: Sequelize.STRING(60),
		imagen: Sequelize.STRING(60),
		email: {
			type: Sequelize.STRING(30),
			allowNull: false,
			validate: {
				isEmail: { msg: "Agrega un correo valido" },
				notEmpty: {
					msg: "El Email no puede ir vacio",
				},
			},
			unique: {
				args: true,
				msg: "Usuario ya Registrado",
			},
		},
		password: {
			type: Sequelize.STRING(60),
			allowNull: false,
			validate: {
				notEmpty: {
					msg: "La contraseña no puede ir vacia",
				},
			},
		},
		descripcion: {
			type: Sequelize.TEXT,
		},
		activo: {
			type: Sequelize.INTEGER,
			defaultValue: 0,
		},
		token: Sequelize.STRING,
		expiratoken: Sequelize.DATE,
	},
	{
		hooks: {
			beforeCreate(usuario) {
				usuario.password = Usuarios.prototype.hashPassword(usuario.password)
			},
		},
	}
);

Usuarios.prototype.validarPassword = function (password) {
	return bcrypt.compareSync(password, this.password);
};

Usuarios.prototype.hashPassword = function (password) {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

module.exports = Usuarios;
