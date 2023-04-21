import RestaurantController from './RestaurantController.mjs';
import UserController from "./UserController.js";

export const resolvers = {
    Query: {
        restaurant: async (parent, args, context, info) => {
            const {url} = args;
            return await RestaurantController.getRestaurant(url);
        },
        restaurants: async (parent, args, context, info) => {
            return await RestaurantController.getRestaurants();
        },
        search: async (parent, args, context, info) => {
            const {query} = args;
            return await RestaurantController.getRestaurantsFromMeal(query);
        }
    },
    Mutation : {
        register : async (parent, args, context, info) => {
            const {mail, password} = args;
            return await UserController.create(mail, password);
        }
    }
};

