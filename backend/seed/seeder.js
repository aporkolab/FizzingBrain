const fsp = require('fs').promises;
const path = require('path');
const db = require('../model/index');
const User = db.User;
const Question = db.Question;

const sqlUploader = async (model, fileName) => {
	try {
		const filePath = path.resolve(__dirname, `../seed/${fileName}.json`);
		const source = await fsp.readFile(filePath, 'utf8');

		if (!source) {
			console.error(`File ${fileName}.json is empty or missing`);
			return;
		}

		const list = JSON.parse(source);

		for (const item of list) {
			await model.create(item, {
				individualHooks: true
			});
		}

		console.log(`${model.name} records have been recreated.`);
	} catch (error) {
		console.error(`Error processing ${model.name}:`, error.message);
		console.error(error); // Részletes hibaüzenet
	}
};

async function seedDatabase() {
	try {
		// Táblák létrehozása, ha nem léteznek
		await db.sequelize.sync({
			force: false
		});
		console.log('All tables have been created.');

		// Töröljük a meglévő rekordokat a User táblából
		await User.destroy({ where: {}, truncate: true });
		console.log('All existing User records have been deleted.');

		// Adatok feltöltése; a kérdéseket csak üres táblába töltjük, különben minden indításkor duplikálódnának.
		if (await Question.count() === 0) {
			await sqlUploader(Question, 'question');
		}
		await sqlUploader(User, 'user');

		console.log("Every file has been processed by the seeder!");
	} catch (error) {
		console.error('Unable to connect to the database or seed data:', error.message);
		console.error(error); // Részletes hibaüzenet
		throw error;
	}
}

module.exports = seedDatabase;