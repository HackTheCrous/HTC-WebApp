import DatabaseManager from "../DatabaseManager.mjs";
import SchoolModel from "../models/SchoolModel.mjs";

export default class SchoolController {
    static async getSchooLike(name) {
        let query = "SELECT idschool, name, coords FROM school WHERE UPPER(name) LIKE $1";
        let params = ["%" + name.toUpperCase() + "%"];

        const client = DatabaseManager.getConnection();

        await client.connect();
        let result = await client.query(query, params);
        await client.end();
        return result.rows.map(row => new SchoolModel(row.idschool, row.name, row.coords));
    }

    static async create(name){
        let query = "INSERT INTO school(name) VALUES($1)";
        let params = [name];

        const client = DatabaseManager.getConnection();

        await client.connect();
        await client.query(query, params);
        await client.end();
    }

    /**
     * Compute the distance between a school and a restaurant from their coordinates
     * @param idSchool
     * @param idRestaurant
     * @returns {Promise<void>}
     */
    static async getPosition(idSchool){
        const query= 'select coords from school where idschool=$1';
        const client = DatabaseManager.getConnection();
        await client.connect();
        const result = await client.query(query, [idSchool]);
        await client.end();
        return result.rows[0].coords;
    }

    static async getDistance(idSchool, positionRestaurant){
        const positionSchool = await SchoolController.getPosition(idSchool);

        const R = 6371e3;
        const phi1 = positionSchool.x * Math.PI/180;
        const phi2 = positionRestaurant.x * Math.PI/180;
        const deltaPhi = (positionRestaurant.x-positionSchool.x) * Math.PI/180;
        const deltaLambda = (positionRestaurant.y-positionSchool.y) * Math.PI/180;

        const a = Math.sin(deltaPhi/2) * Math.sin(deltaPhi/2) + Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda/2) * Math.sin(deltaLambda/2);

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

        return R * c;
    }
}