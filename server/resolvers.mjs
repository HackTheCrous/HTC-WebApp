import RestaurantController from "./controllers/RestaurantController.mjs";
import FoodController from "./controllers/FoodController.js";
import UserController from "./controllers/UserController.js";
import jwt from "jsonwebtoken";

import dotenv from "dotenv";
import SchoolController from "./controllers/SchoolController.mjs";
import MealController from "./controllers/MealController.mjs";
import PlanningController from "./controllers/PlanningController.js";
import { GraphQLError } from "graphql/error/index.js";
import MailClientController from "./controllers/MailClientController.mjs";
import FoodModel from "./models/FoodModel.mjs";

dotenv.config();

export const resolvers = {
  Query: {
    restaurant: async (parent, args, context, info) => {
      const { url } = args;

      if (context.req.headers.authorization) {
        const token = context.req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.id != null) {
          const school = await UserController.getSchool(decoded.id);
          const restaurant = await RestaurantController.getRestaurant(url);
          restaurant.school = school;
          return restaurant;
        }
      }
      return await RestaurantController.getRestaurant(url);
    },
    restaurants: async (parent, args, context, info) => {
      if (context.req.headers.authorization) {
        const token = context.req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.id != null) {
          const school = await UserController.getSchool(decoded.id);
          if (school != null) {
            const restaurants = await RestaurantController.getRestaurants();
            restaurants.forEach((restaurant) => {
              restaurant.school = school;
            });
            return restaurants;
          }
        }
      }

      return await RestaurantController.getRestaurants();
    },
    search: async (parent, args, context, info) => {
      const { query } = args;
      return await RestaurantController.getRestaurantsFromMeal(query);
    },
    /**
     * Performs a search from a user query (client-side)
     */
    searchFood: async (parent, args, context, info) => {
      const { query } = args;
      const research = await RestaurantController.getRestaurantsFromFood(query);

      return research.map((restaurant) => {
        restaurant.query = query;
        return restaurant;
      });
    },
    user: async (parent, args, context, info) => {
      const { iduser } = args;
      const token = context.req.headers.authorization.split(" ")[1];

      if (iduser === undefined) {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return await UserController.get(decoded.id);
      }
      await assertIsUser(iduser, token);
      return await UserController.get(iduser);
    },
    searchRestaurant: async (parent, args, context, info) => {
      const { query } = args;
      const restaurants = await RestaurantController.getRestaurantLike(query);
      return restaurants;
    },
    searchSchool: async (parent, args, context, info) => {
      const { query } = args;
      return (await SchoolController.getSchooLike(query)).slice(0, 9);
    },
    day: async (parent, args, context, info) => {
      const { date } = args;
      const token = context.req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const ical = await UserController.getIcal(decoded.id);

      return await new PlanningController(ical).getEventsByDate(date);
    },
    today: async (parent, args, context, info) => {
      const token = context.req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const ical = await UserController.getIcal(decoded.id);
      return await new PlanningController(ical).getEventsByDate(
        new Date().toLocaleDateString()
      );
    },
    period: async (parent, args, context, info) => {
      const { start, end } = args;
      const token = context.req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const ical = await UserController.getIcal(decoded.id);

      if (ical == null) {
        throw new GraphQLError("No ical", {
          extensions: {
            code: "NO_ICAL",
          },
        });
      }

      return await new PlanningController(ical).getEventsByPeriod(start, end);
    },
    getLatestMail: async (parent, args, context, info) => {
      const mailGetter = new MailClientController();
      const request = await mailGetter.getLatestMail();
      return request.mapToGraphQL();
    },
    getLatestMails: async (parent, args, context, info) => {
      const { range } = args;
      const mailGetter = new MailClientController();
      const request = await mailGetter.getLatestMails(range);
      return request.map((mail) => mail.mapToGraphQL());
    },
  },

  Mutation: {
    createSchool: async (parent, args, context, info) => {
      const { name, coords } = args;
      return await SchoolController.create(name, coords);
    },
    modifyUserField: async (parent, args, context, info) => {
      const { name, ical, school, mail } = args;

      const token = context.req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      if (name != null) {
        if (name.length > 48) {
          throw new GraphQLError("Name too long", {
            extensions: {
              code: "NAME_TOO_LONG",
            },
          });
        }

        if ((await UserController.isNameUpdatable(decoded.id)) === false) {
          throw new GraphQLError("Name already updated in the month", {
            extensions: {
              code: "NAME_ALREADY_UPDATED",
            },
          });
        }

        await UserController.updateName(decoded.id, name);
      }
      if (ical != null) {
        if (
          ical.match(/^(https:\/\/proseconsult\.umontpellier\.fr\/)/) === null
        ) {
          throw new GraphQLError("Ical not valid", {
            extensions: {
              code: "ICAL_NOT_VALID",
            },
          });
        }
        await UserController.modifyField(decoded.id, ical, "ical");
      }
      if (school != null) {
        const idSchool = await SchoolController.getSchoolId(school);
        if (idSchool == null) {
          throw new GraphQLError("School not found", {
            extensions: {
              code: "SCHOOL_NOT_FOUND",
            },
          });
        }
        await UserController.modifyField(decoded.id, idSchool, "idschool");
      }
      if (mail != null) {
        if ((await UserController.getMail(mail)) != null) {
          throw new GraphQLError("Mail already used", {
            extensions: {
              code: "MAIL_ALREADY_USED",
            },
          });
        }
        await UserController.modifyField(decoded.id, mail, "mail");
      }
      return await UserController.get(decoded.id);
    },
    modifyUser: async (parent, args, context, info) => {
      const { name, ical, school, restaurants } = args;

      const token = context.req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      await UserController.modify(decoded.id, name, school, ical, restaurants);
      return await UserController.get(decoded.id);
    },
    modifyUserBySchoolName: async (parent, args, context, info) => {
      const { name, ical, school, restaurants } = args;
      const token = context.req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const idSchool = await SchoolController.getSchoolId(school);
      await UserController.modify(
        decoded.id,
        name,
        idSchool,
        ical,
        restaurants
      );
      return await UserController.get(decoded.id);
    },
    like: async (parent, args, context, info) => {
      const { idrestaurant } = args;
      const token = context.req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      return await UserController.like(idrestaurant, decoded.id);
    },
    dislike: async (parent, args, context, info) => {
      const { idrestaurant } = args;
      const token = context.req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      return await UserController.dislike(idrestaurant, decoded.id);
    },
  },
  Restaurant: {
    meals: async (parent, args, context, info) => {
      return await MealController.getMealsFromRestaurant(parent.idrestaurant);
    },
    distance: async (parent, args, context, info) => {
      if (parent.school == null) {
        return 0;
      }
      if (parent.coords == null) {
        return 0;
      }
      return await SchoolController.getDistance(
        parent.school.idschool,
        parent.coords
      );
    },
    food: async (parent, args, context, info) => {
      if (parent.idrestaurant == null) {
        throw new GraphQLError(
          "To fetch food we need to know at least the name of the restaurant",
          {
            extensions: {
              code: "UNKNOWN_RESTAURANT_FETCHING_FOOD",
            },
          }
        );
      }
      if (parent.query == null) {
        return null;
      }
      const suggestions = await FoodController.getFoodLike(parent.idrestaurant, parent.query);
      console.log("suggestions", suggestions);
      return suggestions;
    },
  },
  User: {
    school: async (parent, args, context, info) => {
      return await UserController.getSchool(parent.iduser);
    },
    favorites: async (parent, args, context, info) => {
      return await UserController.getFavoriteRestaurants(parent.iduser);
    },
    nonce: async (parent, args, context, info) => {
      return await UserController.checkNonce(parent.iduser);
    },
  },
};

const assertIsUser = async (idSupposed, token) => {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  if (decoded.id !== idSupposed) {
    throw new Error("Not authenticated");
  }
  return decoded;
};
