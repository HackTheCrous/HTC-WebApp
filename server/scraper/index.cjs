const jsdom = require("jsdom");
const { JSDOM } = jsdom;
require("dotenv").config();

const { Client } = require("pg");

const clientInfo = {
  user: "radulescut",
  password: process.env.PASSWORD,
  host: "162.38.222.142",
  port: 5673,
  database: "iut",
};

const url = "https://www.crous-montpellier.fr/se-restaurer/ou-manger/";

if (process.env.PASSWORD === undefined) {
  console.log("Please set your password in the .env file");
}

class Restaurant {
  constructor(name, city, link) {
    this.name = name;
    this.city = city;
    this.url = link;
  }

  setCoords(coords) {
    this.coords = coords;
  }

  setMeal(meal) {
    this.meal = meal;
  }

  /**
   * this method gives me social anxiety
   * @returns {Promise<void>}
   */
  async storeRestaurant() {
    const sqlStoreRestaurant =
      "INSERT INTO radulescut.restaurant(url, name, gpscoord) VALUES ($1, $2 ,$3)";
    const sqlStoreRestaurantButNoCoords =
      "INSERT INTO radulescut.restaurant(url, name) VALUES ($1, $2)";

    const coords = `(${this.coords})`;

    const client = new Client(clientInfo);
    await client.connect();
    //await client.query('INSERT INTO radulescut.meal (typemeal, foodies, day, idrestaurant) VALUES ($1, $2, $3, $4)', [menu.typemeal, menu.foodies, menu.day, menu.idRestaurant]);

    if (coords === "(undefined,undefined)") {
      await client.query(sqlStoreRestaurantButNoCoords, [this.url, this.name]); // insert in db a restaurant
    } else {
      await client.query(sqlStoreRestaurant, [this.url, this.name, coords]); // insert in db a restaurant
    }

    let id = 0;

    const result = await client.query(
      "SELECT idrestaurant FROM radulescut.restaurant WHERE url = $1",
      [this.url]
    );
    id = result.rows[0].idrestaurant;

    await client.end();

    console.log(this.meal);

    if (this.meal.name !== "No data") {
      const time = this.meal.time;
      for (const menu of this.meal.menus) {
        await insertMealIntoBD(
          new Meal(
            menu.title,
            JSON.stringify(menu.foodies),
            stringToSQLDate(time),
            id
          )
        ); //that's where things could go ricas :D
      }
    }
  }
}

class Meal {
  constructor(typemeal, foodies, day, idRestaurant) {
    this.typemeal = typemeal;
    this.foodies = foodies;
    this.day = day;
    this.idRestaurant = idRestaurant;
  }
}

const stringToSQLDate = (date) => {
  const MONTHS = [
    "janvier",
    "février",
    "mars",
    "avril",
    "mai",
    "juin",
    "juillet",
    "août",
    "septembre",
    "octobre",
    "novembre",
    "décembre",
  ];
  for (const month of MONTHS) {
    if (date.includes(month)) {
      const day = date.substring(0, date.indexOf(month) - 1);
      const monthNumber = MONTHS.indexOf(month) + 1;
      const year = date.substring(
        date.indexOf(month) + month.length + 1,
        date.length
      );
      return `${day}-${monthNumber}-${year}`;
    }
  }
};

/**
 * Get all restaurant from crous by scraping their name, city, link and coordinates
 * @param url of crous list of restaurants
 * @returns {Promise<*[]>} that stands for a list of Restaurants.
 */
const getRestaurantFromCrous = (url) => {
  const restaurantsList = [];
  return JSDOM.fromURL(url).then((dom) => {
    const { document } = dom.window;
    const restaurants = document.querySelectorAll(".vc_restaurants article");

    restaurants.forEach((restaurant) => {
      let name,
        city,
        link,
        coords = "";
      try {
        name = restaurant.querySelector(".restaurant_title").innerHTML;
        city = restaurant.querySelector(".restaurant_area").innerHTML;
        link = restaurant.querySelector("a").href;
      } catch (e) {
        console.log("error = " + e);
      }
      if (city === "Montpellier") {
        const data = new Restaurant(name, city, link, coords);
        restaurantsList.push(data);
      }
    });
    return restaurantsList;
  });
};

/**
 * Get menu from crous by scraping the given url
 * @param url of crous restaurant
 * @returns {Promise<T>} containing a list of menus structured like {name, url, time, menus: [{title, foodies: [{type, food: []}]}]
 */
const getRestaurantDetailsFromCrous = async (url) => {
  const menuData = {
    food: { name: "", url: url, time: "", menus: [] },
    coords: [],
  };

  const DAYS = [
    "lundi",
    "mardi",
    "mercredi",
    "jeudi",
    "vendredi",
    "samedi",
    "dimanche",
  ];

  return JSDOM.fromURL(url).then((dom) => {
    const { document } = dom.window;

    try {
      const menu = document.querySelector(".menu");
      const date = menu.querySelector(".menu_date_title").innerHTML;
      const meals = menu.querySelectorAll(".meal");

      const loc = document.querySelector("#map");

      DAYS.forEach((day) => {
        if (date.includes(day)) {
          menuData.food.time = date.substring(
            date.indexOf(day) + day.length + 1,
            date.length
          );
        }
      });

      menuData.food.name = document.querySelector("h1").textContent;

      menuData.coords = [loc.dataset.lat, loc.dataset.lon];

      meals.forEach((meal) => {
        let mealData = {
          title: meal.querySelector(".meal_title").innerHTML,
          foodies: [],
        };

        const foodies = meal.querySelectorAll(".meal_foodies > li");
        foodies.forEach((foody) => {
          let foodyData = {
            type: "",
            food: [],
          };
          const foods = foody.querySelectorAll("ul li");
          let sumOfMealLengths = 0;
          foods.forEach((food) => {
            foodyData.food.push(food.innerHTML);
            sumOfMealLengths += food.textContent.length;
          });
          foodyData.type = foody.textContent.substring(
            0,
            foody.textContent.length - sumOfMealLengths
          );

          mealData.foodies.push(foodyData);
        });
        menuData.food.menus.push(mealData);
      });

      return menuData;
    } catch (e) {
      return { food: { name: "No data", menu: [] }, coords: [] };
    }
  });
};

const insertRestaurantInDB = async (restaurants) => {
  //do not use forEach loops for async functions !!!
  const client = new Client(clientInfo);

  for (const restaurant of restaurants) {
    await client.query(
      "INSERT INTO radulescut.restaurant (name, url) VALUES ($1, $2)",
      [restaurant.name, restaurant.link]
    );
  }
};

/**
 *
 * @param menus must be of type Menu {typemeal, foodies, day, idRestaurant}
 * @returns {Promise<void>} nothin to return
 */
const insertMealIntoBD = async (menu, client) => {
  //do not use forEach loops for async functions !!!
  await client.query(
    "INSERT INTO radulescut.meal (typemeal, foodies, day, idrestaurant) VALUES ($1, $2, $3, $4)",
    [menu.typemeal, menu.foodies, menu.day, menu.idRestaurant]
  );
};

const getRestaurantId = async (url) => {
  let id = 0;
  const client = new Client(clientInfo);
  await client.connect();
  const result = await client.query(
    "SELECT idrestaurant FROM radulescut.restaurant WHERE url = $1",
    [url]
  );
  id = result.rows[0].idrestaurant;
  await client.end();

  return id;
};

const getRestaurantsInDB = async () => {
  const client = new Client(clientInfo);
  await client.connect();
  const result = await client.query(
    "SELECT idrestaurant,url,name FROM radulescut.restaurant"
  );
  await client.end();
  return result.rows;
};

const deleteAllFromMenus = async () => {
  const client = new Client(clientInfo);
  await client.connect();
  await client.query("DELETE FROM radulescut.meal");
  await client.query("DELETE FROM radulescut.suggestions_restaurant");
  await client.end();
};

const getIdCategory = async () => {
  const query = "SELECT idcat, namecat from radulescut.cat_suggestions";
  const client = new Client(clientInfo);
  await client.connect();
  const results = await client.query(query);
  await client.end();
  const categories = {};
  for(const result of results.rows){
    categories[result.namecat] = result.idcat;
  }
  return categories;
}

const updateMeals = async () => {
  const keywords = {
    restaurant: [],
    food: [],
    period: [],
  };

  await deleteAllFromMenus();
  getRestaurantsInDB().then(async (restaurants) => {
    let menus;
    const keywords_categories = await getIdCategory();
    for (const restaurant of restaurants) {
      keywords[restaurant.name] = [{id: restaurant.idrestaurant, category: keywords_categories['period']}];
      menus = await getRestaurantDetailsFromCrous(restaurant.url);
      if (menus.food.name !== "No data") {
        const time = menus.food.time;
        const idRestaurant = restaurant.idrestaurant;
        const client = new Client(clientInfo);
        await client.connect();
        for (const menu of menus.food.menus) {
          if (!Object.keys(keywords).includes(menu.title)) {
            keywords[menu.title] = [];
          }
          keywords[menu.title].push({id: idRestaurant, category: keywords_categories['restaurant']});
          for (const foody of menu.foodies) {
            for (const food of foody.food) {
              if (!Object.keys(keywords).includes(food)) {
                keywords[food] = [];
              }
              keywords[food].push({id: idRestaurant, category: keywords_categories['food']});
            }
          }

          await insertMealIntoBD(
            new Meal(
              menu.title,
              JSON.stringify(menu.foodies),
              stringToSQLDate(time),
              idRestaurant
            ),
            client
          ); //that's where things could go ricas :D
        }
        await client.end();
      }
    }
    //insert in database keywords which acutally is will be used for looking through food and restaurants.
    console.log(keywords);
    
    const client = new Client(clientInfo);
    const query =
      "INSERT INTO radulescut.Suggestions_Restaurant(keyword, idRestaurant, idcat)  VALUES($1,$2,$3)";
    await client.connect();
    for (const key in keywords) {
      for (const keyword of keywords[key]) {
        await client.query(query, [key, keyword.id, keyword.category]);
      }
    }
    await client.end();
  });
};

updateMeals();
