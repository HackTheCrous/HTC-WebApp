import {defineStore} from 'pinia';

export const useAlertsStore = defineStore('alerts', {
    state: () => ({
        alerts: [],
        popUp:{
         show: false, 
         title: "",
          message: "",
        }
    }),

    getters: {
        getLastAlert: (state) => {
            return state.alerts[state.alerts.length - 1];
        },
        hasNext(state){
            return state.alerts.length > 0;
        },
        popUpTriggered(state){
          return state.popUp.show;    
        }
    },
    actions: {
        /**
         * Push an alert to the stack
         * @param alert an object with the following fields: <b>status (Success or Error)</b>, message
         */
        addAlert(alert) {
            this.alerts.push(alert);
        },
        popAlert() {
            this.alerts.pop();
        },
        addPopUp(title, message){
          this.popUp.title = title;
          this.popUp.message = message;
          this.popUp.show = true;
        },
        popPopUp(){
          this.popUp.show = false;
        }
    }
});
