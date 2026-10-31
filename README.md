# FizzingBrain v.1.0.0 - documentation

## 1. The description of the task

A Guess-Quiz

> A Quiz
>
> Skills: Front-end and Back-end
>
> Focus: Data Workflow
>
> Difficulty: 2/5
>
> Creating a quiz on a subject, you know well is an excellent way to
> learn to master a simple data workflow to ensure that your players
> cannot cheat and to popularize and transmit information on a subject
> that you like.

The idea of Fizzingbrain is that the user and the computer fight a guessing duel.

The program allows you to choose the level of difficulty, which affects the time to answer the questions and the accuracy of the computer's guessing.

The program scores the guesses based on the absolute value of the guesses and gives points to the one who is closest to the solution. If they both hit the correct solution, they both get a point. For each question answered correctly, 5 points are awarded.

The game ends after 6 questions and the program will declare a winner on the basis of the points scored: in case of a tie, the program will declare a draw.

### 1.1. Possibilities for further development of the application

- infinite mode, with the possibility of continuous guessing,
- multiplayer mode, via the Internet,
- two human players fighting locally,
- expansion of the current question bank of 50 questions,
- possibility to answer questions with text answers (the program is prepared for this),

## 2. Preparations before running the software

### 2.1 The import of one of the included SQL script

Before running the program, the file 'backend/SQL database scripts/fkbpanik_fizzingbrain_onlyStructure.sql' must be imported into phpmyadmin or your favorite database manager.

If the data tables are not created, the backend of the program will not work.

_If you're lazy, import the "fkbpanik_fizzingbrain_withdata.sql" file, or start the backend once with `SEED_DATABASE=true`: the built-in seeder (disabled by default) creates the tables and loads the sample questions and users. **Warning:** the seeder deletes every existing user._

**The choice is yours, but it is important to import _ONE_ of the files from the 'SQL database scripts' folder.**

### 2.2 The creation of the .env file

**The application excludes the file _.env_**, which contains the database connection data. **If you clone this project, the ._env file needs to be added and properly filled a the root of your backend_.**

Copy `backend/.env.example` to `backend/.env` and fill it with the proper data of your database:

| Variable | Required | Description |
| --- | --- | --- |
| `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` | yes (`DB_PORT` defaults to 3306) | MySQL/MariaDB connection |
| `JWT_SECRET` | yes | Long random string used to sign the login tokens. The backend refuses to start without it. |
| `JWT_EXPIRES_IN` | no | Token lifetime, default `1h` |
| `PORT` | no | HTTP port of the backend, default `3000` (apart from 3306, which is reserved for database engines) |
| `CORS_ORIGIN` | no | Comma separated list of allowed origins, e.g. `https://fizzingbrain.aporkolab.com`. Empty or `*` allows every origin. |
| `SEED_DATABASE` | no | `true` runs the seeder on start-up (see 2.1) |
| `LOG_LEVEL` | no | winston log level, default `info` |

## **3. Version history**

Technologies used: Angular 22 (standalone components, esbuild application builder, Vitest unit tests), ngx-translate 18 and Bootstrap 5 on the frontend; Node.js with Express 5, Sequelize 6 (MySQL/MariaDB), JWT authentication and Jest/Supertest tests on the backend. Supported Node.js versions: 22.22+, 24.15+ or 26+. For an exact list of dependencies, see the `package.json` files.

### v.1.0.0 (2022-11-11)

- The basic functionality of the application is ready.
- The difficulties can be adjusted.
- Randomized difficulty selection.
- Development of question editor and user editor.
- Question bank of 50 questions created.
- Full authorization and authentication has been done.

## **4. Install the application**

1.  If you do not have the Git version control software installed, download and install the version for your operating system from [https://git-scm.com](https://git-scm.com/).
2.  If you do not have the NodeJS runtime environment installed, download and install the version marked "LTS" from [https://nodejs.org/en/](https://nodejs.org/en/).
3.  If you do not have the Angular framework installed on your system, do so by issuing the `npm i -g @angular/cli` command in PowerShell.
4.  clone the contents of the relevant GitHub repository. So in PowerShell, issue the following command:

    `git clone https://github.com/APorkolab/FizzingBrain.git`

5.  **Point 2 provides instructions. Please follow them.**

6.  Install the application dependencies:

    - Backend

      - In the terminal, go to the /backend folder (`cd backend`) and run `npm i`.

    - frontend

      - On the terminal, go to the /frontend folder and run `npm i`.\*

7.  Build the frontend:

- In the /frontend folder, issue the `npm run build` command.
- To serve the frontend from the backend, copy the contents of the /frontend/dist/fizzing-brain folder to the /backend/public folder.

8.  Run the tests:

- Backend: in the /backend folder, run `npm test` (Jest + Supertest, no database needed).
- Frontend: in the /frontend folder, run `npm test` (Vitest through the Angular CLI).

## **5. Configure the application**

- In the _/frontend/environments_ folder, configure the API endpoint path:

  - _environment.ts_ file (development): `http://localhost:3000`
  - _environment.prod.ts_ file (production build): `https://api.fizzingbrain.porkolab.hu`

## **6. Start the application**

- Both the backend and the frontend can be started with the `npm start` command. The backend waits for the database and then listens on `PORT`; the frontend `npm start` serves the production build from `dist/fizzing-brain`.
- For frontend development use `npx ng serve` (http://localhost:4200).
- The API documentation is available at `/api-docs` on the backend.
- The question and user editors (`/question`, `/user`) require login.

## **7. A special thanks to...**

- Thanks for the project idea for Josef Cruz (https://javascript.plainenglish.io/9-super-creative-project-ideas-for-junior-web-developers-e8181e6f4eef)
- Thanks for the trivias: https://triviabliss.com/trivia-where-the-answer-is-a-number/
- Thanks for the trivias: https://triviabliss.com/trivia-tie-breakers/
- Thanks for the free HTML template: https://www.tooplate.com/view/2122-nano-folio

## **8. Legal information**

<a rel="license" href="http://creativecommons.org/licenses/by-nc-nd/4.0/"><img alt="Creative Commons License" style="border-width:0" src="https://i.creativecommons.org/l/by-nc-nd/4.0/88x31.png" /></a><br /><span xmlns:dct="http://purl.org/dc/terms/" href="http://purl.org/dc/dcmitype/InteractiveResource" property="dct:title" rel="dct:type">FizzingBrain</span> by <a xmlns:cc="http://creativecommons.org/ns#" href="www.aporkolab.com" property="cc:attributionName" rel="cc:attributionURL">Dr. Ádám Porkoláb</a> is licensed under a <a rel="license" href="http://creativecommons.org/licenses/by-nc-nd/4.0/">Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License</a>.<br />Based on a work at <a xmlns:dct="http://purl.org/dc/terms/" href="www.github.com/APorkolab" rel="dct:source">www.github.com/APorkolab</a>.<br />Permissions beyond the scope of this license may be available at <a xmlns:cc="http://creativecommons.org/ns#" href="www.aporkolab.com" rel="cc:morePermissions">www.aporkolab.com</a>.

---

# FizzingBrain v.1.0.0 - magyar nyelvű dokumentáció

## 1. A feladat leírása

A Guess-Quiz

> A kvíz
>
> Szükséges képességek: Front-end és Back-end
>
> Fókusz: Adat munkafolyamat
>
> Nehézség: 2/5
>
> Kvíz készítése egy olyan témában, amelyet jól ismerünk, kiváló módja annak, hogy
> megtanuljunk elsajátítani egy egyszerű adatmunkafolyamatot és biztosítani tudjuk, hogy a játékosok
> ne tudjanak csalni, valamint népszerűsítsék és továbbítsák a szeretett témával kapcsolatos információkat.

A Fizzingbrain lényege, hogy a felhasználó és a computer tippelési párbajt vív egymással.

A program lehetőséget ad a nehézségi szint kiválasztására, mely a kérdésekre adandó időre és a a számítógép tippelési pontosságára van hatással.

A program a tippek abszolút értéke alapján értékeli a tippeket és annak ad pontot, aki a legközelebb van a megoldáshoz. Ha mindketten eltalálják a pontos megoldást, mindketten kapnak pontot. Minden kérdés helyes megválaszolása után 5 pont jár.

A játék 6 kérdés után ér véget és a program a megszerzett pontok alapján hirdet győztest: azonos pontérték esetén a program döntetlent hirdet.

### 1.1. A program továbbfejlesztési lehetőségei

- végtelen mód, ahol lehetőség van a folyamatos tippelésre,
- multiplayer mode, interneten keresztül
- két emberi játékos küzdelme helyileg,
- jelenlegi, 50 kérdésből álló kérdésbank bővítése,
- lehetőség a szöveges választ igénylő kérdések megválaszolására (a program elő van készítve erre),

## 2. Előkészületek a program futtatása előtt

### 2.1 Az egyik mellékelt SQL szkript importálása

A program futtatása előtt a 'backend/SQL adatbázis szkriptek/fkbpanik_fizzingbrain_onlyStructure.sql' fájlt be kell importálni a phpmyadmin vagy a kedvenc adatbázis-kezelőjébe.

Ha az adattáblák nincsenek létrehozva, a program backendje nem fog működni.

_Ha lusta vagy, importáld a "fkbpanik_fizzingbrain_withdata.sql" fájlt, vagy indítsd el egyszer a backendet `SEED_DATABASE=true` beállítással: a beépített seeder (alapértelmezetten ki van kapcsolva) létrehozza a táblákat és betölti a minta kérdéseket és felhasználókat. **Figyelem:** a seeder minden meglévő felhasználót töröl._

**A választás a tiéd, de fontos, hogy az "SQL adatbázis szkriptek" mappából _egyetlen_ fájlt importálj.**

### 2.2 Az .env fájl létrehozása

**Az alkalmazás nem tartalmazza az _.env_** fájlt, amely az adatbázis-kapcsolati adatokat tartalmazza. **Ha klónozod ezt a projektet, a ._env fájlt hozzá kell adni és megfelelően ki kell tölteni a backend mappa gyökerébe_.**

Másold le a `backend/.env.example` fájlt `backend/.env` néven, és töltsd ki a saját adatbázisod megfelelő adataival:

| Változó | Kötelező | Leírás |
| --- | --- | --- |
| `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` | igen (a `DB_PORT` alapértéke 3306) | MySQL/MariaDB kapcsolat |
| `JWT_SECRET` | igen | Hosszú, véletlenszerű szöveg a bejelentkezési tokenek aláírásához. Nélküle a backend el sem indul. |
| `JWT_EXPIRES_IN` | nem | A token élettartama, alapértéke `1h` |
| `PORT` | nem | A backend HTTP portja, alapértéke `3000` (kivéve a 3306-ot, amely az adatbázis-motorok számára van fenntartva) |
| `CORS_ORIGIN` | nem | Az engedélyezett originek vesszővel elválasztva, pl. `https://fizzingbrain.aporkolab.com`. Üresen vagy `*` értékkel mindent enged. |
| `SEED_DATABASE` | nem | `true` esetén induláskor lefut a seeder (lásd 2.1) |
| `LOG_LEVEL` | nem | A winston naplózási szintje, alapértéke `info` |

## **3. Version history**

Alkalmazott technológiák: a frontenden Angular 22 (standalone komponensek, esbuild application builder, Vitest unit tesztek), ngx-translate 18 és Bootstrap 5; a backenden Node.js, Express 5, Sequelize 6 (MySQL/MariaDB), JWT autentikáció és Jest/Supertest tesztek. Támogatott Node.js verziók: 22.22+, 24.15+ vagy 26+. A pontos függőségi listáért lásd a `package.json` fájlokat.

### v.1.0.0 (2022-11-11)

- A program alapvető működése elkészült.
- A nehézségek beállíthatóak.
- Randomizált nehézségválasztás.
- Kérdésszerkesztő és userszerkesztő kialakítása.
- 50 kérdésből álló kérdésbank készült.
- Teljes körű authorizáció és autentikáció készült.

## **4. Az alkalmazás telepítése**

1. Ha nincs telepítve a Git verziókezelő szoftver, akkor a https://git-scm.com weboldalról töltsük le és telepítsük fel a főoldalon megtalálható változatok közül az operációs rendszerünknek megfelelőt.

2. Ha nincs telepítve a NodeJS futtatókörnyezet, akkor a https://nodejs.org/en/ weboldalról töltsük le és telepítsük fel a főoldalon található, "LTS" megjelölésű változatot.

3. Ha nincs telepítve az Angular keretrendszer a rendszeren, akkor azt a PowerShell-ben kiadott `npm i -g @angular/cli` paranccsal ezt tegyük meg.

4. Le kell klónozni az adott GitHub repository tartalmát. Tehát a PowerShell-ben a következő parancsot kell kiadni:

   `git clone https://github.com/APorkolab/FizzingBrain.git`

5. Telepíteni kell az alkalmazás függőségeit:

   - Backend

     - A terminálon be kell lépni a /backend mappába (`cd backend`) és futtatni az `npm i` parancsot.

   - Frontend
     - A terminálon be kell lépni a /frontend mappába és futtatni az `npm i` parancsot.

6. A frontend buildelése:

- A /frontend mappában ki kell adni az `npm run build` parancsot.
- Ha a backend szolgálja ki a frontendet, a /frontend/dist/fizzing-brain mappa tartalmát be kell másolni a /backend/public mappába.

7. A tesztek futtatása:

- Backend: a /backend mappában `npm test` (Jest + Supertest, adatbázis nem kell hozzá).
- Frontend: a /frontend mappában `npm test` (Vitest az Angular CLI-n keresztül).

## **4. Az alkalmazás konfigurálása**

- A _/frontend/environments_ mappában be kell állítani az API végpont elérési útvonalát:

  - _environment.ts_ állomány (fejlesztés): `http://localhost:3000`
  - _environment.prod.ts_ állomány (éles build): `https://api.fizzingbrain.porkolab.hu`

## **5. Az alkalmazás indítása**

- Mind a backend, mind a frontend az `npm start` paranccsal indítható. A backend megvárja az adatbázist, majd a `PORT`-on figyel; a frontend `npm start` a `dist/fizzing-brain` éles buildet szolgálja ki.
- Frontend fejlesztéshez: `npx ng serve` (http://localhost:4200).
- Az API dokumentáció a backend `/api-docs` útvonalán érhető el.
- A kérdés- és felhasználószerkesztő (`/question`, `/user`) bejelentkezést igényel.

## **7. Külön köszönöm...**

- Köszönöm a projekt ötletét Josef Cruznak: (https://javascript.plainenglish.io/9-super-creative-project-ideas-for-junior-web-developers-e8181e6f4eef).
- Köszönöm a kérdéseket Elaine Foley-nak: https://triviabliss.com/trivia-where-the-answer-is-a-number/
- Köszönet a kérdésekért Steve Wright-nak: https://triviabliss.com/trivia-tie-breakers/
- Köszönet az ingyenes HTML sablonért: https://www.tooplate.com/view/2122-nano-folio

## **8. Jogi információk**

<a rel="license" href="http://creativecommons.org/licenses/by-nc/4.0/"><img alt="Creative Commons Licenc" style="border-width:0" src="https://i.creativecommons.org/l/by-nc/4.0/88x31.png" /></a><br /><a xmlns:cc="http://creativecommons.org/ns#" href="aporkolab.com" property="cc:attributionName" rel="cc:attributionURL">Dr. Porkoláb Ádám</a> <span xmlns:dct="http://purl.org/dc/terms/" href="http://purl.org/dc/dcmitype/InteractiveResource" property="dct:title" rel="dct:type">FizzingBrain</span> című műve <a rel="license" href="http://creativecommons.org/licenses/by-nc/4.0/">Creative Commons Nevezd meg! - Ne add el! 4.0 Nemzetközi Licenc</a> alatt van.<br />Based on a work at <a xmlns:dct="http://purl.org/dc/terms/" href="www.github.com/APorkolab" rel="dct:source">www.github.com/APorkolab</a>.<br />Az ezen publikus licenc <strong>hatáskörén kívül eső</strong> jogok megtekinthetőek itt: <a xmlns:cc="http://creativecommons.org/ns#" href="www.aporkolab.com" rel="cc:morePermissions">www.aporkolab.com</a>
