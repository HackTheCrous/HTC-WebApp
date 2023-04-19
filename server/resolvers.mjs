import RestaurantController from './RestaurantController.mjs';

export const resolvers = {
    Query: {
        restaurant: async (parent, args, context, info) => {
            const {url} = args;
            return await RestaurantController.getRestaurant(url);
        },
        restaurants: async (parent, args, context, info) => {
            if(JSON.stringify(info).includes("\"meals\"")){
                return await RestaurantController.getRestaurantsAndMeals();
            }
            return await RestaurantController.getRestaurants();
        },
        search: async (parent,args,context, info) =>  {
            const {query} = args;
          return await RestaurantController.getRestaurantsFromMeal(query);
        }
    }
};