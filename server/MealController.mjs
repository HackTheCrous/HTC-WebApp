import DatabaseManager from "./DatabaseManager.mjs";
import MealModel from "./MealModel.mjs";

export default class MealController{
    static async getMealsFromRestaurant(idrestaurant){
        const client = DatabaseManager.getConnection();

        await client.connect();
        const result = await client.query('SELECT idmeal, typemeal, foodies, day, idrestaurant FROM radulescut.meal WHERE idrestaurant = $1', [idrestaurant]);
        await client.end();

        return result.rows.map(row => new MealModel(row.idmeal, row.typemeal, row.foodies, row.day, row.idrestaurant));
    }
}