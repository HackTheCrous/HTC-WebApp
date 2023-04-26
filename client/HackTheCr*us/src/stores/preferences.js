import {defineStore} from "pinia";

export const usePreferencesStore = defineStore('preferences', {
    state: () => ({
        name: '',
        school: '',
        icalLink: '',
        restaurants: [],
    }),

    getters: {},
    actions: {
        setName(name) {
            console.log(name);
            this.name = name;
        },
        setSchool(school) {
            this.school = school;
        },
        setIcalLink(icalLink) {
            this.icalLink = icalLink;
        },
        setRestaurants(restaurants) {
            this.restaurants = restaurants;
        },
        addRestaurant(restaurant) {
            this.restaurants.push(restaurant);
        },
        setPreferences(name, school, icalLink, restaurants) {
            this.name = name;
            this.school = school;
            this.icalLink = icalLink;
            this.restaurants = restaurants;
        }
    }
});