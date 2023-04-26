export default class UserModel{
    constructor(iduser, mail, password, name, idschool, restaurants, ical){
        this.iduser = iduser;
        this.mail = mail;
        this.password = password;
        this.name = name;
        this.idschool = idschool;
        this.ical = ical;
        this.restaurants = restaurants;
    }

    getJson(){
        return {
            iduser: this.iduser,
            mail: this.mail,
            password: this.password,
            name : this.name || ""
        }
    }


    setName(name){
        this.name = name;
    }


    getRestaurants(){
        const sqlQuery = ""
    }


    static getHeaders(){
        return "iduser, mail, password, name, idschool, ical";
    }

    static buildUser(row){
        return new UserModel(row.iduser, row.mail, row.password, row.name, row.idschool, null, row.ical);
    }
}