import {defineStore} from "pinia";
import gql from "graphql-tag";
import {apolloClient} from "@/main";


const GET_CALENDAR_ON_PERIOD = gql`
    query Period($start: Date, $end: Date){
        period(start: $start, end: $end){
            start
            end
            summary
            location
            description
        }
    }
`

export const useCalendarStore = defineStore('calendar', {
    state: () => ({
        days: {},
    }),

    getters: {
        getDays :(state) =>{
            return (start, end) => {
                let days = [];

                for (let key of Object.entries(state.days)) {
                    if (key >= start && key <= end) {
                        days.push(state.days[key]);
                    }
                }

                return days;
            };
        },
        getAllDays: (state) => {
            return state.days;
        }
    },
    actions: {
        clean() {
            this.days = {};
        },
        setDays(start, end){
            apolloClient.query({
                query: GET_CALENDAR_ON_PERIOD,
                variables: {
                    start: start,
                    end: end
                }
            }).then((result) => {
                const days = result.data.period;
                for(const day of days){
                    this.days[day.start] = day;
                }
            });
        }
    },
    persist: {
        storage:sessionStorage
    }
});