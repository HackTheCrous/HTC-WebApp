const jsdom = require("jsdom");
const {JSDOM} = jsdom;
require('dotenv').config();

const {Client} = require('pg');

const clientInfo = {
    user: 'radulescut',
    password: process.env.PASSWORD,
    host: '162.38.222.142',
    port: 5673,
    database: 'iut'
};

class School {
    constructor(name, coords) {
        this.name = name;
        this.coords = coords;
    }

    async storeSchool() {
        const sqlStoreSchool = 'INSERT INTO radulescut.school(name, coords) VALUES ($1, $2)';
        const coords = `(${this.coords})`;

        const client = new Client(clientInfo);
        await client.connect();

        await client.query(sqlStoreSchool, [this.name, coords]); // insert in db a school and pray that the coords are not undefined

        await client.end();
    }
}

const url = "https://data.opendatasoft.com/api/records/1.0/search/?dataset=onisep-etablissements-denseignement-superieur-herault%40data-herault-occitanie&q=&rows=150&facet=statut&facet=commune&refine.statut=Public";

const getSchools = async () => {
    fetch(url).then(response => response.json()).then(data => {
        data.records.forEach(school => {
            const name = school.fields.nom;
            const coords = school.geometry.coordinates[0] + ', ' + school.geometry.coordinates[1];

            const schoolObject = new School(name, coords);
            schoolObject.storeSchool();
        });
    });
}

//getSchools();