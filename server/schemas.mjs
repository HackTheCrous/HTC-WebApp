import { gql } from "apollo-server-express";

export const typeDefs = gql`
    scalar JSON

    type Query {
        restaurant(url: String): Restaurant,
        restaurants: [Restaurant],
        search(query: String): [Restaurant],
    }


    type Restaurant {
        idrestaurant: Int
        url: String
        name: String
        meals: [Meal]
    }

    type Meal{
        idmeal: Int
        typemeal: String
        foodies: JSON
        day: String
    }
    
   
`;