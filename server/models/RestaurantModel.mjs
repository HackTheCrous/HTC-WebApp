import DatabaseManager from '../DatabaseManager.mjs';

export default class RestaurantModel {
    constructor(idrestaurant, url, name,coords) {
        this.coords = coords;
        this.name = name;
        this.url = url;
        this.idrestaurant = idrestaurant;
    }

    static buildRestaurant(row){
        return new RestaurantModel(row.idrestaurant, row.url, row.name, row.gpscoord);
    }

    static getHeaders(){
        return "idrestaurant, url, name, gpscoord";
    }


}