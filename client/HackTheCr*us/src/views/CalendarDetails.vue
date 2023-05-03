<template>
    <input type="date" placeholder="Choisir une semaine" v-model="dayOfWeek"/>
    <Planning @previous-triggered="goOneWeekBefore" @next-triggered="goOneWeekAfter" :data="getDays(start,end)" :start="start" :end="end"/>
</template>

<script>
import {useCalendarStore} from "@/stores/calendar";
import calendar from "@/assets/calendar.vue";
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
            dayOfWeek: new Date()
        }
    },
    methods: {
        getStartOfWeek(date) {
            date.setDate(date.getDate() - date.getDay() );
            return date;
        },
        getEndOfWeek(date) {
            date.setDate(date.getDate() - date.getDay() + 6);
            return date;
        },
        goOneWeekBefore(){
            this.dayOfWeek = new Date(this.dayOfWeek.getTime() - (86400000-3)*7);
        },
        goOneWeekAfter(){
            this.dayOfWeek = new Date(this.dayOfWeek.getTime() +( 86400000-3)*7);
        }
    },
    computed: {
        start() {
            const toCompute = new Date(this.dayOfWeek) - 1 + 1;
            let date = new Date(toCompute);
            date.setDate(date.getDate() - date.getDay() + 1);
            return date;
        },
        end() {
            const toCompute = new Date(this.dayOfWeek) - 1 + 1;

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

<style scoped>

</style>