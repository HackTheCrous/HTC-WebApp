import {defineStore} from "pinia";
import gql from "graphql-tag";
import {apolloClient} from "@/main";

export const usePreferencesStore = defineStore('preferences', {
    state: () => ({
        name: '',
        school: 0,
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
            const id = parseInt(restaurant);
            if(!this.restaurants.includes(id)){
                this.restaurants.push(id);
            }else{
                this.restaurants.splice(this.restaurants.indexOf(id), 1);
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
            console.log("savePreferences name : " + this.name + " school : "+ this.school + " link : "+ this.icalLink +" restaurants :  " +  this.restaurants);

            const MUTATION_SET_PREFERENCES = gql`
                mutation ModifyUser($name: String, $ical: String, $school: Int, $restaurants: [Int]) {
                    modifyUser(name: $name, ical: $ical, school: $school, restaurants: $restaurants) {
                        iduser
                        name
                        mail
                        ical
                    }
                }
            `
            apolloClient.mutate({
                mutation: MUTATION_SET_PREFERENCES,
                variables: {
                    name: this.name,
                    ical: this.icalLink,
                    school: parseInt(this.school),
                    restaurants: this.restaurants.map((restaurant) => parseInt(restaurant))
                }
            }).then(result => {
                console.log(result);
            });

        }
    }
});