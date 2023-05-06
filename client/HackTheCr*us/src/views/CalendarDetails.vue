<template>
    <div id="infos">
        <h1>
            Agenda
        </h1>
        <DateSelector @change="handleDateChange" :date="new Date(this.dayOfWeek)">{{ this.dayOfWeek }}</DateSelector>
    </div>
    <Planning @previous-triggered="goOneWeekBefore" @next-triggered="goOneWeekAfter" :data="getDays(this.start,this.end)"
              :start="this.start" :end="this.end" :hours="15" :nbdays="nbDays"/>
</template>

<script>
import {useCalendarStore} from "@/stores/calendar";
import Planning from "@/components/Planning.vue";
import DateSelector from "@/components/DateSelector.vue";

export default {
    name: "CalendarDetails",
    components: {DateSelector, Planning},
    setup() {
        const calendarStore = useCalendarStore();
        const {getDays} = calendarStore;

        return {calendarStore, getDays}
    },
    data() {
        const nbDaysInitial = window.innerWidth > 1000 ? 6 : 1;

        this.calendarStore.setDays(new Date(), this.getNthDate(new Date(), nbDaysInitial*2));

        return {
            calendar: [],
            dayOfWeek: new Date(),
            start : this.getNthDate(new Date(), 0),
            end : this.getNthDate(new Date(), nbDaysInitial -1),
            nbDays: nbDaysInitial
        }
    },
    methods: {
        handleDateChange(e){
            this.dayOfWeek = new Date(e);
        },
        goOneWeekBefore() {
            const date = new Date(this.dayOfWeek)
            date.setDate(date.getDate() - this.nbDays);
            this.dayOfWeek = date.toISOString().split('T')[0];

        },
        goOneWeekAfter() {
            const date = new Date(this.dayOfWeek)
            date.setDate(date.getDate() + this.nbDays);
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
            const dateToChange = new Date(date);
            dateToChange.setDate(dateToChange.getDate() + delta);
            return dateToChange;
        }
    },
    watch: {
        dayOfWeek(newVal) {
            this.start = this.getNthDate(newVal, 0);
            this.end = this.getNthDate(newVal, this.nbDays-1);
            this.calendarStore.setDays(this.getNthDate(this.end, this.nbDays*-2), this.getNthDate(this.end, this.nbDays*2));

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