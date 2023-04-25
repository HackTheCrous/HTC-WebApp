//example of sortinbg strategy
export default class RestaurantRecommendationStrategies{

    /**
     * @param restaurants a set of restaurants to be sorted by the strategy
     */
    constructor(restaurants) {
        this.restaurants = restaurants;
    }

    /*
    * @return the sorted restaurants by alphabetical order
     */
    sort(){
        return this.restaurants.sort((a, b) => {
            if(a.name < b.name) { return -1; }
            if(a.name > b.name) { return 1; }
            return 0;
        });
    }
}