import {defineStore} from "pinia";

export const usePreferencesStore = defineStore('preferences', {
    state: () => ({
        name: '',
        school: '',
        icalLink: '',
        restaurants: [],
    }),

    getters: {
        getRestaurants() {
            return this.restaurants;
        },
        getState(){
            return this;
        }

    },
    actions: {
        setName(name) {
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

            if(!this.restaurants.includes(restaurant)){
                this.restaurants.push(restaurant);
            }else{
                this.restaurants.splice(this.restaurants.indexOf(restaurant), 1);
            }
        },
        setPreferences(name, school, icalLink, restaurants) {
            this.name = name;
            this.school = school;
            this.icalLink = icalLink;
            this.restaurants = restaurants;
        },
        containsRestaurant(restaurant) {
            return this.restaurants.includes(restaurant) ? 'selected' : '';
        },
        savePreferences() {

        }
    }
});