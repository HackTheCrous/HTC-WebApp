<template>

    <div id="calendar">
        <div class="day" v-for="day in this.days" :key="day.timestamp">
            <h2 :id="this.getDay(day.timestamp)" ref="title"> {{ new Date(day.timestamp).getDate() }}</h2>
            <div v-for="hour in 13" class="hour" :key="hour" :id="hour+6" ref="hours"></div>
            <div class="event" v-for="event in day.data" :key="event.start"
                 :style="{'top' : this.margin +  this.height* (this.getOffsetOfEvent(event.start)-7)+ 'px', 'height' : this.height* this.getHeightOfEvent(event.start, event.end)+ 'px'}">
                <b>{{ event.summary }}</b>
                {{ event.location }}<br/>
                {{ new Date(event.start).getHours() }}h{{ new Date(event.start).getMinutes() }} -
                {{ new Date(event.end).getHours() }}h{{ new Date(event.start).getMinutes() }}
            </div>
        </div>
        <div id="now"
             :style="{'width' : this.width  + 'px', 'top': this.margin + this.height* (this.getOffsetOfEvent(Date.now())-7) + 'px', 'left': (new Date()).getDate() * this.width}"></div>
    </div>
</template>

<script>
export default {
    name: "Planning",
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
    methods: {
        getDay(timestamp) {
            const date = new Date(timestamp);
            const days = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
            return days[date.getDay()];
        },
        getOffsetOfEvent(timestamp) {
            const date = new Date(timestamp);
            return date.getHours() + date.getMinutes() / 60;
        },
        getHeightOfEvent(timestampStart, timestampEnd) {
            return this.getOffsetOfEvent(timestampEnd) - this.getOffsetOfEvent(timestampStart);
        }
    },
    mounted() {
        this.width = this.$refs.title[0].clientWidth;
        this.margin = this.$refs.title[0].clientHeight;
        this.height = this.$refs.hours[0].clientHeight;
    },
    computed: {
        days() {
            const days = [];
            const startToTimestamp = this.start - 1 + 1;
            const endToTimestamp = this.end - 1 + 1;

            const lengthDay = 86400000;

            for (let day = startToTimestamp; day < endToTimestamp + lengthDay; day += lengthDay) {
                const dayData = {timestamp: day, data: []};
                for (const event of this.data) {
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
      font-weight: 600;
      border-bottom: var(--color-border) 1px solid;
    }

    h2::before {
      content: attr(id);
      font-weight: 300;
    }

    border-left: 1px solid var(--color-border);

    .hour {
      height: calc(100vh / 13);
      border-bottom: var(--color-border) 1px solid;
      box-sizing: border-box;
    }


    .event {
      position: absolute;
      border: 1px solid rgba(36, 238, 118, 0.82);
      border-radius: 5px;
      width: 100%;
      text-align: center;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      background: var(--color-background-soft);

      b {
        font-weight: 600;
      }
    }

    &:last-of-type {
      border-right: 1px solid var(--color-border);
    }

    &:first-of-type {
      .hour::before {
        content: attr(id);
        color: var(--color-heading);
        font-weight: 300;
        position: absolute;
        transform: translateX(-100%) translateY(-50%);
        padding-right: 10px;
      }
    }
  }
}
</style>