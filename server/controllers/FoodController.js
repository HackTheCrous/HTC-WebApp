import DatabaseManager from '../DatabaseManager.mjs'
import FoodModel from '../models/FoodModel.mjs'

export default class FoodController{
    static async getFoodLike(idRestaurant, pattern){
        const query = "select unnest((replace(replace(foods->>'food', ']','}'),'[','{'))::text[]) as food, foods->>'type' as cat, m.typemeal as period from meal m\n"+
"join jsonb_array_elements(foodies) as foods on true\n"+
"join restaurant r on r.idrestaurant = m.idrestaurant\n"+
"where r.name = $2\n"+
"ORDER BY dis_lev(upper($1),upper(unnest((replace(replace(foods->>'food', ']','}'),'[','{'))::text[]) || r.name)) ASC\n"+
"LIMIT 1";

        const client = await DatabaseManager.getConnection();

        await client.connect();

        const result = await client.query(query, [pattern, idRestaurant]);

        await client.end();
        const row = result.rows[0];
        return new FoodModel(row.food, row.cat, row.period);


    }
}
