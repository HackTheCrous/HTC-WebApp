import {defineStore} from "pinia";
import gql from "graphql-tag";
import {apolloClient} from "@/main";

const GET_CALENDAR_ON = gql`
    query Day($date: String){
        day(date: $date){
            start
            end
            summary
            location
            description
        }
    }
`

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
        days: new Map(),
    }),

    getters: {
        getDays :(state) =>{

            return (start, end) => {

                let days = [];
                for (const [key, value] of state.days.entries()) {
                    if (key >= start && key <= end) {
                        days.push(value);
                    }
                }
                return state.days;
            };
        }
    },
    actions: {
        clean() {
            this.days = new Map();
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
                    this.days.set(day.start, day);
                }
            });
        }
    }
});