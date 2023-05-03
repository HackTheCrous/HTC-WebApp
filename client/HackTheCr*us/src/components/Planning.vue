<template>

    <div id="calendar">
        <div class="border">
            <button @click="$emit('previousTriggered')">
                <squeeze size="30" opacity="0.5" color="white"/>
            </button>
        </div>
        <div class="day" v-for="day in this.days" :key="day.timestamp">
            <h2 :data-day="this.getDay(day.timestamp)" :data-month="this.getMonth(day.timestamp)" ref="title">
                {{ new Date(day.timestamp).getDate() }}</h2>
            <div v-for="hour in 13" class="hour" :key="hour" :id="hour+6" ref="hours"></div>
            <DetailEventCard :height="this.height* this.getHeightOfEvent(event.start, event.end)"
                             :offset-y="this.margin +  this.height* (this.getOffsetOfEvent(event.start)-7)"
                             v-for="event in day.data" :key="event.start" :summary="event.summary"
                             :start="new Date(event.start)" :end="new Date(event.end)" :location="event.location"/>
            <div v-if="this.sameDay(Date.now(), day.timestamp)" id="now"
                 :style="{'width' : this.width  + 'px', 'top': this.margin + this.height* (this.getOffsetOfEvent(Date.now())-7) + 'px', 'left': (new Date()).getDate() * this.width}"></div>
        </div>
        <div class="border">
            <button @click="$emit('nextTriggered')">
                <squeeze size="30" opacity="0.5" color="white"/>
            </button>

        </div>

    </div>
</template>

<script>
import DetailEventCard from "@/components/DetailEventCard.vue";
import {useCalendarStore} from "@/stores/calendar";
import Squeeze from "@/assets/squeeze.vue";

export default {
    name: "Planning",
    components: {Squeeze, DetailEventCard},
    props: {
        data: Object,
        start: Date,
        end: Date,
    },
    data() {
        return {
            width: 0,
            margin: 0,
            height: 0
        }
    },
    setup() {
        const calendarStore = useCalendarStore();
        return {calendarStore}
    },
    methods: {
        getDay(timestamp) {
            const date = new Date(timestamp);
            const days = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
            return days[date.getDay()];
        },
        getMonth(timestamp) {
            const date = new Date(timestamp);
            const days = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Novembre', 'Décembre'];
            return days[date.getMonth()];
        },
        getOffsetOfEvent(timestamp) {
            const date = new Date(timestamp);
            return date.getHours() + date.getMinutes() / 60;
        },
        getHeightOfEvent(timestampStart, timestampEnd) {
            return this.getOffsetOfEvent(timestampEnd) - this.getOffsetOfEvent(timestampStart);
        },
        onResize() {
            this.width = this.$refs.hours[this.$refs.hours.length - 1].clientWidth;
            this.margin = this.$refs.title[0].clientHeight;
            this.height = this.$refs.hours[0].clientHeight;
        },
        sameDay(dateA, dateB) {
            const todateA = new Date(dateA);
            const todateB = new Date(dateB);
            return todateA.getDay() === todateB.getDay() && todateA.getMonth() === todateB.getMonth() && todateA.getFullYear() === todateB.getFullYear();
        }
    },
    mounted() {
        this.onResize()
        this.$nextTick(() => {
            window.addEventListener('resize', this.onResize);
        })
    },
    computed: {
        days() {
            const days = [];
            const startToTimestamp = this.start.getTime();
            const endToTimestamp = this.end.getTime();

            const lengthDay = 86400000;

            for (let day = startToTimestamp; day < endToTimestamp + lengthDay; day += lengthDay) {
                const dayData = {timestamp: day, data: []};
                for (const event of Object.entries(this.calendarStore.getAllDays)) {
                    if (event[1].start > day && event[1].start < day + lengthDay) {
                        dayData.data.push(event[1])
                    }
                }
                days.push(dayData)
            }
            return days;
        },


    }
}
</script>

<style lang="scss" scoped>
#calendar {
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 100vh;

  #now {
    height: 2px;
    background: red;
    position: absolute;
    z-index: 100;
    top: 0;
    left: 0;
  }

  .border {
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;

    button {
      height: calc(100% / 13);
      background: transparent;
      border: 0px solid transparent;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    &:last-of-type {
      button {
        transform: rotate(180deg);

      }
    }
  }


  div {
    flex: 1;
  }

  .day {
    display: flex;
    flex-direction: column;
    flex: 1;
    height: 100%;

    h2 {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin: 0;
      padding: 0;
      font-weight: 800;
      font-size: 27px;
      line-height: 30px;
      border-bottom: var(--color-border) 1px solid;
    }

    h2::before {
      opacity: 0.7;
      content: attr(data-day);
      font-weight: 400;
      font-size: 60%;
    }

    h2::after {
      opacity: 0.7;

      content: attr(data-month);
      font-weight: 400;
      font-size: 60%;

    }

    border-left: 1px solid var(--color-border);

    .hour {
      height: calc(100vh / 13);
      border-bottom: var(--color-border) 1px solid;
      box-sizing: border-box;
    }


    &:last-of-type {
      border-right: 1px solid var(--color-border);
    }

    &:nth-of-type(2) {
      .hour::before {
        content: attr(id);
        color: var(--color-heading);
        font-weight: 300;
        position: absolute;
        transform: translateX(-100%) translateY(-50%);
        padding-right: 50%;

      }
    }
  }
}
</style>