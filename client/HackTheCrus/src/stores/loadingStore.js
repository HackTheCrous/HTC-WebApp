import {defineStore} from "pinia";

export const useLoadingStore = defineStore('loading', {
    state: () => ({
        loading: false,
    }),
    getters : {
        isLoading(){
            return this.loading;
        }
    },
    actions: {
        startLoading() {
            this.loading = true;
        },
        stopLoading() {
            this.loading = false;
        }
    },
});