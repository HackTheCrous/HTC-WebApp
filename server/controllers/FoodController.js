import DatabaseManager from "../DatabaseManager.mjs";
import FoodModel from "../models/FoodModel.mjs";

export default class FoodController {
  static async getFoodLike(idRestaurant, pattern) {
    const keywords = pattern.split(" ").filter((term) => term.length > 2);
    const results = [];

    const client = DatabaseManager.getConnection();
    await client.connect();
    if (keywords.length === 0) {
      return [];
    }
    for (const keyword of keywords) {
      results.push(
        await FoodController.getFoodByKeyword(idRestaurant, keyword, client)
      );
    }
    await client.end();
    return results;
  }

  static async getFoodByKeyword(idRestaurant, keyword, client) {
    const query =
      "select keyword from suggestions_restaurant where idrestaurant = $1 and idcat=2 order by dis_lev(UPPER($2), UPPER(keyword))";
    if (keyword == undefined) {
      return await FoodController.getFoodWhenNotFound(client, idRestaurant);
    }
    const result = await client.query(query, [idRestaurant, keyword]);
    if (result.rows == null || result.rows.length === 0) {
      return await FoodController.getFoodWhenNotFound(client, idRestaurant);
    }
    if (result.rows.length === 0) {
      return new FoodModel("fermé", "row.cat", "row.period");
    }
    const row = result.rows[0];

    return new FoodModel(row.keyword, "row.cat", "row.period");
  }

  static async getFoodWhenNotFound(client, idRestaurant) {
    const query_if_not_found =
      "select keyword from suggestions_restaurant where idrestaurant = $1 and idcat=2 limit 1";
    const result_if_not_found = await client.query(query_if_not_found, [
      idRestaurant,
    ]);
    if (result_if_not_found.rows.length === 0) {
      return new FoodModel("fermé", "row.cat", "row.period");
    }
    return new FoodModel(
      result_if_not_found.rows[0].keyword,
      "row.cat",
      "row.period"
    );
  }
}
