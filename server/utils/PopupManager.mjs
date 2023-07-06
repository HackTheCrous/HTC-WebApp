import fs from 'fs';

export default class PopupManager{
  static async openPopupContent(name){
    return fs.readFile(`./src/popup/${name}.html`, 'utf8', (err, data) => {
      if (err) {
        console.error(err)
        return
      }
      return data;
    });
  }

  static async openGooglePopup(){
    return PopupManager.openPopupContent('GoogleAuth');
  }
}
