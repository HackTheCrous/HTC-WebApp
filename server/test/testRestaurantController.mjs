import test from "unit.js";
import RestaurantModel from "../RestaurantModel.mjs";
import RestaurantRecommendationStrategies from "../strategies/RestaurantRecommendationStrategies.mjs";

describe('Test RestaurantController', () => {
    it('Test RestaurantRecommendationSortCorrectly', async () => {
        const restaurants = [
            new RestaurantModel(1, "http://www.google.com", "Google"),
            new RestaurantModel(2, "http://www.facebook.com", "Facebook"),
            new RestaurantModel(3, "http://www.twitter.com", "Twitter"),
        ]

        const assumption = [
            new RestaurantModel(2, "http://www.facebook.com", "Facebook"),
            new RestaurantModel(1, "http://www.google.com", "Google"),
            new RestaurantModel(3, "http://www.twitter.com", "Twitter")
        ]

        const recommendationstratey = new RestaurantRecommendationStrategies(restaurants);
        const sortedRestaurants = recommendationstratey.sort();
        for (let i = 0; i < restaurants.length; i++) {
            test.assert(sortedRestaurants[i].idrestaurant === assumption[i].idrestaurant);
        }
    });
})