import DatabaseManager from "../DatabaseManager.mjs";
import RestaurantModel from "../models/RestaurantModel.mjs";
import { FoodSearchStrategyByIntersection } from "../strategies/FoodSearchStartegy.mjs";
import MealController from "./MealController.mjs";


export default class RestaurantController {
  static async getRestaurant(url) {
    if (url.match(/^(http|https):\/\//)) {
      return await RestaurantController.getRestaurantByUrl(url);
    } else {
      return await RestaurantController.getRestaurantByName(url);
    }
  }

  static async get(id) {
    return RestaurantController.getRestaurantById(
      id,
      DatabaseManager.getConnection()
    );
  }

  /**
   * get a restaurant from database by id with a provided client to avoid too many connections
   */
  static async getRestaurantById(id, client) {
    const query =
      "SELECT " +
      RestaurantModel.getHeaders() +
      " FROM radulescut.restaurant WHERE idrestaurant=$1";
    const result = await client.query(query, [id]);
    return RestaurantModel.buildRestaurant(result.rows[0]);
  }

  static async getRestaurantLike(name) {
    const client = DatabaseManager.getConnection();
    await client.connect();
    const result = await client.query(
      "SELECT " +
        RestaurantModel.getHeaders() +
        " FROM radulescut.restaurant WHERE UPPER(name) LIKE $1",
      ["%" + name.toUpperCase() + "%"]
    );
    await client.end();
    return result.rows.map((row) => {
      return RestaurantModel.buildRestaurant(row);
    });
  }

  static async getRestaurantByUrl(url) {
    const client = DatabaseManager.getConnection();

    await client.connect();
    const result = await client.query(
      "SELECT " +
        RestaurantModel.getHeaders() +
        " FROM radulescut.restaurant WHERE url = $1",
      [url]
    );
    await client.end();
    let restaurant = RestaurantModel.buildRestaurant(result.rows[0]);

    return restaurant;
  }

  static async getRestaurantByName(name) {
    const client = DatabaseManager.getConnection();

    await client.connect();
    const result = await client.query(
      "SELECT " +
        RestaurantModel.getHeaders() +
        " FROM radulescut.restaurant WHERE name = $1",
      [name]
    );
    await client.end();
    return RestaurantModel.buildRestaurant(result.rows[0]);
  }

  static async getRestaurants() {
    const query =
      "SELECT rest.idrestaurant as idrestaurant,\n" +
      "       url,\n" +
      "       name,\n" +
      "        coalesce(SUM(jsonb_array_length(foodies)), 0) as nbMeals,\n" +
      "        rest.gpscoord\n" +
      "FROM radulescut.restaurant as rest\n" +
      "         left join radulescut.meal as m on rest.idrestaurant = m.idrestaurant\n" +
      "group by rest.idrestaurant, url, name\n" +
      "order by nbMeals DESC";

    const client = DatabaseManager.getConnection();

    await client.connect();
    const result = await client.query(query);
    await client.end();

    return result.rows.map((row) => RestaurantModel.buildRestaurant(row));
  }

  /**
   * Search a food from a pattern
   * Must do an sql query fetch idRestaurant, url, name, food, food->>'type'
   * Im afraid that this query might be VERY VERY EXPENSIVE
   */
  static async getRestaurantsFromFood(name) {
    return FoodSearchStrategyByIntersection.searchFood(name);
  }

  static async getRestaurantsFromMeal(name) {
    const client = DatabaseManager.getConnection();

    const values = [name.toUpperCase()];
    await client.connect();
    const result = await client.query(
      "select r.idrestaurant, r.url, r.name,foods->>'food' as foods from meal m\n" +
        "join jsonb_array_elements(foodies) as foods on true\n" +
        "join restaurant r on r.idrestaurant = m.idrestaurant\n" +
        "ORDER BY dis_lev(upper(unnest((replace(replace(foods->>'food', ']','}'),'[','{'))::text[])), $1) ASC\n" +
        "LIMIT 5;",
      values
    );
    await client.end();

    return result.rows.map(async (row) => {
      const resto = new RestaurantModel(row.idrestaurant, row.url, row.name);
      resto.meals = await MealController.getMealsFromRestaurant(
        row.idrestaurant
      );
      return resto;
    });
  }

  static async getDistance(idRestaurant, position) {
    const query = "select gpscoord from restaurant where idrestaurant=$1";
    const client = DatabaseManager.getConnection();
    await client.connect();
    const result = await client.query(query, [idRestaurant]);
    await client.end();

    const position2 = result.rows[0].gpscoord;

    const R = 6371e3;
    const phi1 = (position.x * Math.PI) / 180;
    const phi2 = (position2.x * Math.PI) / 180;
    const deltaPhi = ((position2.x - position.x) * Math.PI) / 180;
    const deltaLambda = ((position2.y - position.y) * Math.PI) / 180;

    const a =
      Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
      Math.cos(phi1) *
        Math.cos(phi2) *
        Math.sin(deltaLambda / 2) *
        Math.sin(deltaLambda / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  }
}
