import { gql } from "apollo-server-express";

export const typeDefs = gql`
    scalar JSON
    
    directive @auth on FIELD_DEFINITION

    type Query {
        restaurant(url: String): Restaurant,
        restaurants: [Restaurant],
        search(query: String): [Restaurant],
        user(iduser: Int): User,
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
    
    type User {
        iduser: Int
        name: String
        mail: String
    }
    
   
`;