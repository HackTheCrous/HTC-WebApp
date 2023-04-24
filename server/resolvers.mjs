import RestaurantController from './RestaurantController.mjs';
import UserController from "./UserController.js";
import passport from "passport";

export const resolvers = {
    Query: {
        restaurant: async (parent, args, context, info) => {
            const {url} = args;
            return await RestaurantController.getRestaurant(url);
        },
        restaurants: async (parent, args, context, info) => {
            console.log(context.req.user);
            return await RestaurantController.getRestaurants();
        },
        search: async (parent, args, context, info) => {
            const {query} = args;
            return await RestaurantController.getRestaurantsFromMeal(query);
        }
    }
};

