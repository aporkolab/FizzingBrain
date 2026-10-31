const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
	const User = sequelize.define('User', {
		id: {
			autoIncrement: true,
			primaryKey: true,
			type: DataTypes.INTEGER
		},
		email: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
			validate: {
				isEmail: true // Ellenőrizzük, hogy az email formátum helyes-e
			}
		},
		password: {
			type: DataTypes.STRING,
			allowNull: false
		},
		firstName: {
			type: DataTypes.STRING,
			allowNull: false
		},
		lastName: {
			type: DataTypes.STRING,
			allowNull: false
		}
	}, {
		hooks: {
			beforeCreate: async (user) => {
				if (user.password) {
					const salt = await bcrypt.genSalt(10);
					user.password = await bcrypt.hash(user.password, salt);
				}
			},
			beforeUpdate: async (user) => {
				if (user.password && user.changed('password')) {
					const salt = await bcrypt.genSalt(10);
					user.password = await bcrypt.hash(user.password, salt);
				}
			}
		},
		freezeTableName: true,
		timestamps: false
	});

	User.prototype.validPassword = async function (password) {
		return bcrypt.compare(password, this.password);
	};

	// The password hash must never leave the server in an API response.
	User.prototype.toJSON = function () {
		const values = { ...this.get() };
		delete values.password;
		return values;
	};

	return User;
};