import {defineStore} from 'pinia';

export const useAlertsStore = defineStore('alerts', {
    state: () => ({
        alerts: []
    }),

    getters: {
        getLastAlert: (state) => {
            return state.alerts[state.alerts.length - 1];
        },
        hasNext(state){
            return state.alerts.length > 0;
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
        }
    }
});