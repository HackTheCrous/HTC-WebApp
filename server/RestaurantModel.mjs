import DatabaseManager from './DatabaseManager.mjs';

export default class RestaurantModel {
    constructor(idrestaurant, url, name) {
        this.name = name;
        this.url = url;
        this.idrestaurant = idrestaurant;
    }


}