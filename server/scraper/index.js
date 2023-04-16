const jsdom = require("jsdom");
const {JSDOM} = jsdom;
require('dotenv').config();

const {Client} = require('pg');

const clientInfo  ={
    user: 'radulescut',
    password: process.env.PASSWORD,
    host: '162.38.222.142',
    port: 5673,
    database: 'iut'
};



const url = "https://www.crous-montpellier.fr/se-restaurer/ou-manger/";

class Restaurant {
    constructor(name, city, link) {
        this.name = name;
        this.city = city;
        this.link = link;
    }
}

class Meal{
    constructor(typemeal,foodies,day,idRestaurant){
        this.typemeal = typemeal;
        this.foodies = foodies;
        this.day = day;
        this.idRestaurant = idRestaurant;
    }
}


const stringToSQLDate = (date) => {
    const MONTHS = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];
    for(const month of MONTHS){
        if(date.includes(month)){
            const day = date.substring(0, date.indexOf(month)-1);
            const monthNumber = MONTHS.indexOf(month) + 1;
            const year = date.substring(date.indexOf(month) + month.length + 1, date.length);
            return `${day}-${monthNumber}-${year}`;
        }
    }
}

/**
 * Get all restaurant from crous
 * @param url of crous list of restaurants
 * @returns {Promise<*[]>} that stands for a list of Restaurants.
 */
const getRestaurantFromCrous = (url) => {
    const restaurantsList = [];
    return JSDOM.fromURL(url).then(dom => {
        const {document} = dom.window;
        const restaurants = document.querySelectorAll(".vc_restaurants article");
        restaurants.forEach(restaurant => {
            let name, city, link = "";
            try {
                name = restaurant.querySelector(".restaurant_title").innerHTML;
                city = restaurant.querySelector(".restaurant_area").innerHTML;
                link = restaurant.querySelector("a").href;
            } catch (e) {
                console.log("error = " + e);
            }
            if (city === "Montpellier") {
                const data = new Restaurant(name, city, link);
                restaurantsList.push(data);
            }

        });
        return restaurantsList;
    });
}

/**
 * Get menu from crous by scraping the given url
 * @param url of crous restaurant
 * @returns {Promise<T>} containing a list of menus structured like {name, url, time, menus: [{title, foodies: [{type, food: []}]}]
 */
const getMenuFromCrous = (url) => {
    const menuData = {name: "", url: url, time: "", menus: []};

    const DAYS = ["lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi", "dimanche"];

    return JSDOM.fromURL(url).then(dom => {
        const {document} = dom.window;

        try {
            const menu = document.querySelector(".menu");
            const date = menu.querySelector(".menu_date_title").innerHTML;
            const meals = menu.querySelectorAll(".meal");

            DAYS.forEach(day => {
                if (date.includes(day)) {
                    menuData.time = date.substring(date.indexOf(day) + day.length + 1, date.length);
                }
            });

            menuData.name = document.querySelector("h1").textContent;


            meals.forEach(meal => {
                let mealData = {
                    title: meal.querySelector(".meal_title").innerHTML,
                    foodies: []
                };

                const foodies = meal.querySelectorAll(".meal_foodies > li");
                foodies.forEach(foody => {
                    let foodyData = {
                        type: "",
                        food: []
                    };
                    const foods = foody.querySelectorAll("ul li");
                    let sumOfMealLengths = 0;
                    foods.forEach(food => {
                        foodyData.food.push(food.innerHTML);
                        sumOfMealLengths += food.textContent.length;
                    });
                    foodyData.type = foody.textContent.substring(0, foody.textContent.length - sumOfMealLengths);

                    mealData.foodies.push(foodyData);
                });
                menuData.menus.push(mealData);
            });

            return menuData;

        } catch (e) {
            return {name: "No data", menus: []};
        }
    });
}




const insertRestaurantInDB = async (restaurants) => {
    //do not use forEach loops for async functions !!!
    const client = new Client(clientInfo);

    for (const restaurant of restaurants) {
         await client.query('INSERT INTO radulescut.restaurant (name, url) VALUES ($1, $2)', [restaurant.name, restaurant.link]);
    }
};


/**
 *
 * @param menus must be of type Menu {typemeal, foodies, day, idRestaurant}
 * @returns {Promise<void>} nothin to return
 */
const insertMealIntoBD = async (menu) => {
    //do not use forEach loops for async functions !!!
    const client = new Client(clientInfo);
    await client.connect();
    await client.query('INSERT INTO radulescut.meal (typemeal, foodies, day, idrestaurant) VALUES ($1, $2, $3, $4)', [menu.typemeal, menu.foodies, menu.day, menu.idRestaurant]);
    await client.end();
}

const getRestaurantId = async (url) => {
    let id = 0;
    const client = new Client(clientInfo);
    await client.connect();
    const result = await client.query('SELECT idrestaurant FROM radulescut.restaurant WHERE url = $1', [url]);
    id = result.rows[0].idrestaurant;
    await client.end();

    return id;

}


/*
getRestaurantFromCrous(url).then(async restaurants => {
    await client.connect();
    await insertRestaurantInDB(restaurants).then(()=> {
        console.log("done");
    });
    await client.end();

});*/


/*
getRestaurantFromCrous(url).then(async restaurants => {
    for(const restaurant of restaurants){

    }
});*/

getRestaurantFromCrous(url).then(async restaurants => {
    for(const restaurant of restaurants){
        getMenuFromCrous(restaurant.link).then(async menus => {
            if(menus.name !== "No data"){
                const time = menus.time;
                const idRestaurant=  await getRestaurantId(restaurant.link);

                for(const menu of menus.menus){
                    await insertMealIntoBD(new Meal(menu.title, JSON.stringify(menu.foodies), stringToSQLDate(time), idRestaurant)); //that's where things could go ricas :D
                }
            }
        });
    }
});

