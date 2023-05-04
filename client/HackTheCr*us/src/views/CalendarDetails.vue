<template>
    <div id="infos">
        <h1>
            Agenda
        </h1>
        <h2>{{ this.formatDate(getNthDate(this.start, 1)) }} - {{ this.formatDate(this.end) }}</h2>
    </div>
    <Planning @previous-triggered="goOneWeekBefore" @next-triggered="goOneWeekAfter" :data="getDays(start,end)"
              :start="start" :end="end" hours="15"/>
</template>

<script>
import {useCalendarStore} from "@/stores/calendar";
import Planning from "@/components/Planning.vue";

export default {
    name: "CalendarDetails",
    components: {Planning},
    setup() {
        const calendarStore = useCalendarStore();
        const {getDays} = calendarStore;

        return {calendarStore, getDays}
    },
    data() {
        const start = this.getStartOfWeek(new Date());
        const end = this.getEndOfWeek(new Date());

        this.calendarStore.setDays(start, end);
        return {
            calendar: [],
            dayOfWeek: new Date(),
            start,
            end
        }
    },
    methods: {
        getStartOfWeek(date) {
            date.setDate(date.getDate() - date.getDay());
            this.start = date;
            return date;
        },
        getEndOfWeek(date) {
            date.setDate(date.getDate() - date.getDay() + 6);
            this.end = date;
            return date;
        },
        goOneWeekBefore() {
            const date = new Date(this.dayOfWeek)
            date.setDate(date.getDate() - 7);
            this.dayOfWeek = date.toISOString().split('T')[0];

        },
        goOneWeekAfter() {
            const date = new Date(this.dayOfWeek)
            date.setDate(date.getDate() + 7);
            this.dayOfWeek = date.toISOString().split('T')[0];
        },
        formatDate(date) {

            const formated = date.toLocaleDateString('fr-FR', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });

            return formated.charAt(0).toUpperCase() + formated.slice(1);
        },
        getNthDate(date, delta){
            const dateToChange = new Date(date)
            dateToChange.setDate(dateToChange.getDate() + delta );
            return dateToChange
        }
    },
    computed: {
        start() {
            const toCompute = new Date(this.dayOfWeek).getTime();
            let date = new Date(toCompute);
            date.setDate(date.getDate() - date.getDay() + 1);
            return date;
        },
        end() {
            const toCompute = new Date(this.dayOfWeek).getTime();

            let date = new Date(toCompute);

            date.setDate(date.getDate() - date.getDay() + 6);
            return date;
        },

    },
    watch: {
        dayOfWeek(newVal) {
            this.calendarStore.setDays(this.getStartOfWeek(new Date(newVal)), this.getEndOfWeek(new Date(newVal)));
        }
    }
}
</script>

<style scoped lang="scss">
#controls {
  display: flex;
  flex-direction: row;

  p {
    margin-left: 10px;
    margin-right: 10px;
  }

  .date-selector {
    background: transparent;
    border: 0px solid transparent;
    border-bottom: 1px solid var(--color-border);
    font-family: Inter, sans-serif;
    font-size: 2em;
  }

  margin-bottom: 20px;
}
</style>