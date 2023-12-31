export default class UserModel {
  constructor(
    iduser,
    mail,
    password,
    name,
    idschool,
    restaurants,
    ical,
    refreshToken,
    nonce
  ) {
    this.iduser = iduser;
    this.mail = mail;
    this.password = password;
    this.name = name;
    this.idschool = idschool;
    this.ical = ical;
    this.restaurants = restaurants;
    this.refreshToken = refreshToken;
    this.nonce = nonce;
  }

  getJson() {
    return {
      iduser: this.iduser,
      mail: this.mail,
      password: this.password,
      name: this.name || "",
    };
  }

  getRefreshToken() {
    return this.refreshToken;
  }

  setName(name) {
    this.name = name;
  }

  static getHeaders() {
    return "iduser, mail, password, name, idschool, ical, token, nonce";
  }

  static buildUser(row) {
    return new UserModel(
      row.iduser,
      row.mail,
      row.password,
      row.name,
      row.idschool,
      null,
      row.ical,
      row.token,
      row.nonce
    );
  }

  getSerialized(){
    return {
      iduser: this.iduser,
      mail: this.mail,
    };
  }
}
