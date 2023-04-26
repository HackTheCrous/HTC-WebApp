import RestaurantController from './RestaurantController.mjs';
import UserController from "./UserController.js";
import passport from "passport";
import jwt from "jsonwebtoken";

import dotenv from 'dotenv';

dotenv.config();


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
        },
        user: async (parent, args, context, info) => {
            const {iduser} = args;
            const token = context.req.headers.authorization.split(' ')[1];

            if (iduser === undefined) {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                return await UserController.get(decoded.id);
            }
            await assertIsUser(iduser, token);
            return await UserController.get(iduser);
        },
        searchRestaurant: async (parent, args, context, info) => {
            const {query} = args;
            return await RestaurantController.getRestaurantLike(query);
        }
    }
};


const assertIsUser = async (idSupposed, token) => {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.id !== idSupposed) {
        throw new Error("Not authenticated");
    }
}
