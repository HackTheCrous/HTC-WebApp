import RestaurantController from './controllers/RestaurantController.mjs';
import UserController from "./controllers/UserController.js";
import passport from "passport";
import jwt from "jsonwebtoken";

import dotenv from 'dotenv';
import SchoolController from "./controllers/SchoolController.mjs";
import MealController from "./controllers/MealController.mjs";
import PlanningController from './controllers/PlanningController.js';

dotenv.config();


export const resolvers = {
    Query: {
        restaurant: async (parent, args, context, info) => {
            const {url} = args;

            if (context.req.headers.authorization) {
                const token = context.req.headers.authorization.split(' ')[1];
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                if (decoded.id != null) {
                    const school = await UserController.getSchool(decoded.id);
                    const restaurant = await RestaurantController.getRestaurant(url);
                    restaurant.school = school;
                    return restaurant;
                }
            }

            return (await RestaurantController.getRestaurant(url));
        },
        restaurants: async (parent, args, context, info) => {
            if (context.req.headers.authorization) {
                const token = context.req.headers.authorization.split(' ')[1];
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                if (decoded.id != null) {
                    const school = await UserController.getSchool(decoded.id);
                    if (school != null) {
                        const restaurants = await RestaurantController.getRestaurants();
                        restaurants.forEach(restaurant => {
                            restaurant.school = school;
                        });
                        console.log(restaurants);
                        return restaurants;
                    }

                }
            }

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
        },
        searchSchool: async (parent, args, context, info) => {
            const {query} = args;
            return (await SchoolController.getSchooLike(query)).slice(0, 5);
        },
        day: async (parent, args, context, info) => {
            const {date} = args;
            return await (new PlanningController).getEventsByDate(date);
        }
    },

    Mutation: {
        createSchool: async (parent, args, context, info) => {
            const {name, coords} = args;
            return await SchoolController.create(name, coords);
        },
        modifyUser: async (parent, args, context, info) => {
            const {name, ical, school, restaurants} = args;
            const token = context.req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            await UserController.modify(decoded.id, name, school, ical, restaurants);
            return await UserController.get(decoded.id);
        },
        modifyUserBySchoolName: async (parent, args, context, info) => {
            const {name, ical, school, restaurants} = args;
            const token = context.req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const idSchool = await SchoolController.getSchoolId(school);

            await UserController.modify(decoded.id, name, idschool, ical, restaurants);
            return await UserController.get(decoded.id);
        },
        like: async (parent, args, context, info) => {
            const {idrestaurant} = args;
            const token = context.req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            return await UserController.like(idrestaurant, decoded.id);
        },
        dislike: async (parent, args, context, info) => {
            const {idrestaurant} = args;
            const token = context.req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            return await UserController.dislike(idrestaurant, decoded.id);
        }
    },
    Restaurant: {
        meals: async (parent, args, context, info) => {
            return await MealController.getMealsFromRestaurant(parent.idrestaurant);
        },
        distance: async (parent, args, context, info) => {
            if (parent.school == null) {
                return 0;
            }
            if(parent.coords == null){
                return 0;
            }
            return await SchoolController.getDistance(parent.school.idschool, parent.coords);
        }
    },
    User: {
        school: async (parent, args, context, info) => {
            return await UserController.getSchool(parent.iduser);
        },
        favorites: async (parent, args, context, info) => {
            return await UserController.getFavoriteRestaurants(parent.iduser);
        }
    }
};


const assertIsUser = async (idSupposed, token) => {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.id !== idSupposed) {
        throw new Error("Not authenticated");
    }
    return decoded;
}
