import { gql } from "apollo-server-express";

export const typeDefs = gql`
    scalar JSON
    scalar Date
    
    directive @auth on FIELD_DEFINITION

    type Query {
        restaurant(url: String): Restaurant,
        restaurants: [Restaurant],
        search(query: String): [Restaurant],
        user(iduser: Int): User,
        searchRestaurant(query: String): [Restaurant],
        searchSchool(query: String): [School],
        searchFood(query: String): [Restaurant],
        day(date: String): [PlanningDay],
        today: [PlanningDay],
        period(start: Date, end: Date): [PlanningDay],
        getLatestMail: Mail,
        getLatestMails(range: Int): [Mail],
    }
    
    type Mutation {
        createSchool(name: String, coords: String): School,
        modifyUser(name: String, ical: String, school: Int, restaurants : [Int]): User,
        modifyUserBySchoolName(name: String, ical: String, school: String, restaurants : [Int]): User,
        like(idrestaurant: Int): [Restaurant],
        dislike(idrestaurant: Int): [Restaurant],
        modifyUserField(name: String, ical: String, school: String, mail: String): User,
    }
    
    type Restaurant {
        idrestaurant: Int
        url: String
        name: String
        meals: [Meal]
        coords: Coordinates,
        distance: Float,
        food: [Food]
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
        nonce: Boolean
        ical: String
        school: School
        favorites: [Restaurant]
    }
    
    type School{
        idschool: Int
        name: String
        coords: Coordinates
    }
    
    type Coordinates{
        x: Float
        y: Float
    }

    type PlanningDay{
        start: Date
        end: Date
        summary: String
        location: String
        description: String
    },
    type Food{
        name: String
        category: String
        period: String
    },
    type Mail{
        from: String
        to: String
        cc: String
        subject: String
        date: String
        tags: [String]
        text: String
        html: String
    },
    type Attachment{
        filename: String
        contentType: String
        size: Int
    }
`;
