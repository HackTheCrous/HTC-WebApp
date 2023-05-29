import DatabaseManager from "../DatabaseManager.mjs";
import FoodModel from "../models/FoodModel.mjs";

export default class FoodController {
  static async getFoodLike(idRestaurant, pattern) {
    const keywords = pattern.split(" ").filter((term) => term.length > 2);
    const results = [];
    
    const client = DatabaseManager.getConnection();
    await client.connect();
    for (const keyword of keywords) {
      results.push(
        await FoodController.getFoodByKeyword(idRestaurant, keyword,client)
      );
    }
    await client.end();
    return results;
  }

  static async getFoodByKeyword(idRestaurant, keyword, client) {
    const query =
      "select keyword from radulescut.suggestions_restaurant where idrestaurant = $1 and idcat=2 order by dis_lev(UPPER($2), UPPER(keyword))";


    const result = await client.query(query, [idRestaurant, keyword]);

    const row = result.rows[0];
    return new FoodModel(row.keyword, "row.cat", "row.period");
  }
}
