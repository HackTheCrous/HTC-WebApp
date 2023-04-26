export default class UserModel{
    constructor(iduser, mail, password){
        this.iduser = iduser;
        this.mail = mail;
        this.password = password;
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

}