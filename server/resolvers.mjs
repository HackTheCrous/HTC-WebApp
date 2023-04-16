import RestaurantController from './RestaurantController.mjs';

export const resolvers = {
    Query: {
        restaurant: async (parent, args, context, info) => {
            const {url} = args;
            return await RestaurantController.getRestaurant(url);
        },
        restaurants: async (parent, args, context, info) => {
            return await RestaurantController.getRestaurants();
        }
    }
};