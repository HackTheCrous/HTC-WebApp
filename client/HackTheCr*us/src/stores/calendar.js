import { defineStore } from "pinia";
import gql from "graphql-tag";
import { apolloClient } from "@/main";
import { useUserStore } from "@/stores/user";

const sameDay = (dateA, dateB) => {
  const todateA = new Date(dateA);
  const todateB = new Date(dateB);
  return (
    todateA.getDay() === todateB.getDay() &&
    todateA.getMonth() === todateB.getMonth() &&
    todateA.getFullYear() === todateB.getFullYear()
  );
};

const GET_CALENDAR_ON_PERIOD = gql`
query Period($start: Date, $end: Date) {
  period(start: $start, end: $end) {
    start
    end
      summary
      location
      description
    }
  }
`;

export const useCalendarStore = defineStore("calendar", {
  state: () => ({
    days: {},
    daysStored: [],
    loading: [],
    eventFocused: null,
    error: false,
  }),

  getters: {
    getDays: (state) => {
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
    getDay: (state) => {
      return (timestamp) => {
        if (state.days[timestamp] === undefined) {
          return null;
        }
        console.log(state.days[timestamp]);
        return state.days[timestamp];
      };
    },
    getAllDays: (state) => {
      return state.days;
    },
    isLoading: (state) => {
      return (timestamp) => {
        return state.loading.includes(timestamp);
      };
    },
    failed: (state) => {
      const userStore = useUserStore();
      if (userStore.getIcal === "") {
        return state.error;
      }
      return false;
    },
  },
  actions: {
    clean() {
      this.days = {};
      this.daysStored = [];
      this.loading = [];
    },
    setDays(start, end) {
      this.loading = [];

      for (let i = new Date(start); i <= end; i.setDate(i.getDate() + 1)) {
        if (!this.daysStored.includes(new Date(i).getTime())) {
          this.loading.push(new Date(i).getTime());
        }
      }

      if (this.loading.length !== 0) {
        apolloClient
          .query({
            query: GET_CALENDAR_ON_PERIOD,
            variables: {
              start: new Date(Math.min(...this.loading)).setHours(0, 0, 0, 0),
              end: new Date(Math.max(...this.loading)).setHours(
                23,
                59,
                59,
                999
              ),
            },
          })
          .then((result) => {
            this.error = false;
            const days = result.data.period;
            for (const day of days) {
              this.days[day.start] = day;
            }
            for (
              let i = new Date(start);
              i <= end;
              i.setDate(i.getDate() + 1)
            ) {
              if (this.daysStored.length < 500) {
                this.daysStored.push(new Date(i).getTime());
                this.loading.splice(
                  this.loading.indexOf(new Date(i).getTime()),
                  1
                );
              }
            }
          })
          .catch((error) => {
            this.error = true;
          });
      } else {
        this.loading = [];
      }
    },
  },
  persist: {
    storage: sessionStorage,
  },
});
