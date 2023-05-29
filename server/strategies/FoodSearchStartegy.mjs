import DatabaseManager from "../DatabaseManager.mjs";
import RestaurantController from "../controllers/RestaurantController.mjs";

export class FoodSearchStrategyByIntersection {
  static async searchFood(foodName) {
    const client = DatabaseManager.getConnection();

    const dis_lev_threshold = 4;
    const params = foodName.split(" ");

    let query = "";

    let values = [];

    let cursor = 1;
    for (const param of params) {
      if (param.length > 2) {
        query +=
          "(select idrestaurant from radulescut.suggestions_restaurant where dis_lev(UPPER($" +
          cursor +
          "), UPPER(keyword)) < " +
          dis_lev_threshold +
          ")\n" +
          "INTERSECT\n";
        values.push(param);
        cursor++;
      }
    }

    const operator = "INTERSECT\n";
    query = query.substring(0, query.length - operator.length);

    const restaurants = [];

    await client.connect();

    const result = await client.query(query, values);

    let idrestaurants = result.rows.map(
      (restaurant) => restaurant.idrestaurant
    );

    for (const id of idrestaurants) {
      restaurants.push(
        await RestaurantController.getRestaurantById(id, client)
      );
      while (idrestaurants.includes(id)) {
        idrestaurants.splice(
          idrestaurants.findIndex((elt) => id === elt),
          1
        );
      }
    }

    console.log(idrestaurants);

    await client.end();
    return restaurants;
  }
}

export class FoodSearchStrategyByCriteria {
  static async searchFood(foodName) {
    const client = DatabaseManager.getConnection();

    const restaurants = [];

    const terms = foodName.split(" ").filter((term) => term.length > 2);

    console.log(terms);

    let query, result;

    await client.connect();
    let cursor = 1;

    const dis_lev_threshold = 4;

    for (const term of terms) {
      query =
        "SELECT idrestaurant, idcat from radulescut.Suggestions_Restaurant where dis_lev($" +
        cursor +
        ", keyword) < " +
        dis_lev_threshold +
        ")";
      cursor++;
      result = await client.query(query, [term]);
      restaurants.push(result.rows);
    }
  }
}
