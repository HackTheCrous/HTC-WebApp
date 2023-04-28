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
        addAlert(alert) {
            this.alerts.push(alert);
        },
        popAlert() {
            this.alerts.pop();
        }
    }
});