import DatabaseManager from "./DatabaseManager.mjs";
import RestaurantModel from "./RestaurantModel.mjs";
import MealController from "./MealController.mjs";

export default class RestaurantController {
    static async getRestaurant(url) {
        if (url.match(/^(http|https):\/\//)) {
            return await RestaurantController.getRestaurantByUrl(url);
        } else {
            return await RestaurantController.getRestaurantByName(url);
        }
    }

    static async getRestaurantByUrl(url) {
        const client = DatabaseManager.getConnection();

        await client.connect();
        const result = await client.query('SELECT idrestaurant, url, name FROM radulescut.restaurant WHERE url = $1', [url]);
        await client.end();
        let restaurant = new RestaurantModel(result.rows[0].idrestaurant, result.rows[0].url, result.rows[0].name);


        restaurant.meals = await MealController.getMealsFromRestaurant(restaurant.idrestaurant);

        return restaurant;
    }

    static async getRestaurantByName(name) {
        const client = DatabaseManager.getConnection();

        await client.connect();
        const result = await client.query('SELECT idrestaurant, url, name FROM radulescut.restaurant WHERE name = $1', [name]);
        await client.end();
        let restaurant = new RestaurantModel(result.rows[0].idrestaurant, result.rows[0].url, result.rows[0].name);


        restaurant.meals = await MealController.getMealsFromRestaurant(restaurant.idrestaurant);

        return restaurant;
    }

    static async getRestaurants() {
        const client = DatabaseManager.getConnection();

        await client.connect();
        const result = await client.query('SELECT idrestaurant, url, name FROM radulescut.restaurant');
        await client.end();

        let restaurants = result.rows.map(row => new RestaurantModel(row.idrestaurant, row.url, row.name));

        for (let restaurant of restaurants) {
            restaurant.meals = await MealController.getMealsFromRestaurant(restaurant.idrestaurant);
        }

        return restaurants;
    }
}