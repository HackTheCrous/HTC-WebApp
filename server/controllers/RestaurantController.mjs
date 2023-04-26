import DatabaseManager from "../DatabaseManager.mjs";
import RestaurantModel from "../models/RestaurantModel.mjs";
import MealController from "./MealController.mjs";

export default class RestaurantController {
    static async getRestaurant(url) {
        if (url.match(/^(http|https):\/\//)) {
            return await RestaurantController.getRestaurantByUrl(url);
        } else {
            return await RestaurantController.getRestaurantByName(url);
        }
    }


    static async get(id){
        const query = 'SELECT ' + RestaurantModel.getHeaders() + ' FROM radulescut.restaurant WHERE idrestaurant=$1';
        const client = DatabaseManager.getConnection();
        await client.connect();
        const result = await client.query(query, [id]);
        await client.end();
        return RestaurantModel.buildRestaurant(result.rows[0]);
    }

    static async getRestaurantLike(name) {
        const client = DatabaseManager.getConnection();
        await client.connect();
        const result = await client.query('SELECT ' + RestaurantModel.getHeaders() + ' FROM radulescut.restaurant WHERE UPPER(name) LIKE $1', ['%' + name.toUpperCase() + '%']);
        await client.end();
        return result.rows.map(row => {
            return RestaurantModel.buildRestaurant(row);
        });
    }

    static async getRestaurantByUrl(url) {
        const client = DatabaseManager.getConnection();

        await client.connect();
        const result = await client.query('SELECT ' + RestaurantModel.getHeaders() + ' FROM radulescut.restaurant WHERE url = $1', [url]);
        await client.end();
        let restaurant = RestaurantModel.buildRestaurant(result.rows[0]);


        return restaurant;
    }

    static async getRestaurantByName(name) {
        const client = DatabaseManager.getConnection();

        await client.connect();
        const result = await client.query('SELECT ' + RestaurantModel.getHeaders() + ' FROM radulescut.restaurant WHERE name = $1', [name]);
        await client.end();
        return RestaurantModel.buildRestaurant(result.rows[0]);
    }

    static async getRestaurants() {

        const query = 'SELECT rest.idrestaurant as idrestaurant,\n' +
            '       url,\n' +
            '       name,\n' +
            '        coalesce(SUM(jsonb_array_length(foodies)), 0) as nbMeals,\n' +
            '        rest.gpscoord\n' +
            'FROM radulescut.restaurant as rest\n' +
            '         left join radulescut.meal as m on rest.idrestaurant = m.idrestaurant\n' +
            'group by rest.idrestaurant, url, name\n' +
            'order by nbMeals DESC'

        const client = DatabaseManager.getConnection();

        await client.connect();
        const result = await client.query(query);
        await client.end();

        return result.rows.map(row => RestaurantModel.buildRestaurant(row));
    }


    static async getRestaurantsFromMeal(name) {
        const client = DatabaseManager.getConnection();

        const values = ['%' + name.toUpperCase() + '%'];
        await client.connect();
        const result = await client.query("select DISTINCT r.idrestaurant, r.url, r.name,foods->>'food' as foods from meal m join jsonb_array_elements(foodies) as foods on true join restaurant r on r.idrestaurant = m.idrestaurant where UPPER(foods->>'food') LIKE $1", values);
        await client.end();


        return result.rows.map(async (row) => {
            const resto = new RestaurantModel(row.idrestaurant, row.url, row.name);
            resto.meals = await MealController.getMealsFromRestaurant(row.idrestaurant);
            return resto;
        });

    }
}