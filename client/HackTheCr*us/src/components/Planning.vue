<template>

    <div id="calendar" @mousedown="unfocus">
        <div class="error" v-if="this.calendarStore.failed">
            <SettingField :regex="/^(https:\/\/proseconsult\.umontpellier\.fr\/)/" placeholder="Entre ton lien Ical"
                          @send="updateIcal" long>
                <template v-slot:title>
                    ⚠️ Tu n'as pas ajouté de lien Ical
                </template>
                <template v-slot:label>
                    Ce lien nous permet de récupérer ton emploi du temps. Si il n’est pas précisé on ne pourra pas te le
                    fournir.
                    Pour le récupérer <a href="https://app.umontpellier.fr/prose-etudiant/protected/ical"
                                         target="_blank">clique ici
                    !</a>
                </template>
                <template v-slot:hint>
                    Les liens ne commençant pas par <b>https://proseconsult.umontpellier.fr</b> ne sont pas accepté.
                </template>
            </SettingField>
        </div>
        <div class="border">
            <button @click="$emit('previousTriggered')">
                <squeeze size="30" opacity="0.5" color="white"/>
            </button>
        </div>
        <div class="day" v-for="day in this.days" :key="day.timestamp">
            <h2 :data-day="this.getDay(day.timestamp)" :data-month="this.getMonth(day.timestamp)" ref="title">
                {{ new Date(day.timestamp).getDate() }}</h2>
            <div v-for="hour in 14" :class="!this.calendarStore.isLoading(day.timestamp) ? 'hour' : 'hour loading'"
                 :key="hour" :id="hour+6" ref="hours"></div>
            <DetailEventCard @mouseup="setfocus" :height="this.height* this.getHeightOfEvent(event.start, event.end)"
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
    <router-view :focus="this.focus" @unfocus="handlefocus"></router-view>
</template>

<script>
import DetailEventCard from "@/components/DetailEventCard.vue";
import {useCalendarStore} from "@/stores/calendar";
import Squeeze from "@/assets/squeeze.vue";
import SettingField from "@/components/SettingField.vue";
import {apolloClient} from "@/main";
import gql from "graphql-tag";
import {useLoadingStore} from "@/stores/loadingStore";
import {useUserStore} from "@/stores/user";
import {useAlertsStore} from "@/stores/alerts";

export default {
    name: "Planning",
    emits: ['previousTriggered', 'nextTriggered'],
    components: {SettingField, Squeeze, DetailEventCard},
    props: {
        data: Object,
        start: Date,
        end: Date,
        hours: Number,
        nbdays: Number,
    },
    data() {
        return {
            width: 0,
            margin: 0,
            height: 0,
            focus: false,
        }
    },
    setup() {
        const calendarStore = useCalendarStore();
        const loadingStore = useLoadingStore();
        const userStore = useUserStore();
        const alertStore = useAlertsStore();
        return {calendarStore, loadingStore, userStore, alertStore};
    },

    methods: {
        /**
         *
         * @param timestamp
         * @returns {string} day of the week for day label
         */
        getDay(timestamp) {
            const date = new Date(timestamp);
            const days = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
            return days[date.getDay()];
        },
        /*
         * @param timestamp
         * @returns {string} month of the year for month label
         */
        getMonth(timestamp) {
            const date = new Date(timestamp);
            const days = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
            return days[date.getMonth()];
        },
        /*
         * @param timestamp
         * @returns {number} offset of the event in the calendar for the top position
         */
        getOffsetOfEvent(timestamp) {
            const date = new Date(timestamp);
            return date.getHours() + date.getMinutes() / 60;
        },
        /**
         *
         * @param timestampStart
         * @param timestampEnd
         * @returns {number} height of the event in the calendar according to the start and end time
         */
        getHeightOfEvent(timestampStart, timestampEnd) {
            return this.getOffsetOfEvent(timestampEnd) - this.getOffsetOfEvent(timestampStart);
        },
        /**
         * listenner callback for responsivness
         */
        onResize() {
            this.width = this.$refs.hours[this.$refs.hours.length - 1].clientWidth;
            this.margin = this.$refs.title[0].clientHeight;
            this.height = this.$refs.hours[0].clientHeight;
        },
        sameDay(dateA, dateB) {
            const todateA = new Date(dateA);
            const todateB = new Date(dateB);
            return todateA.getDate() === todateB.getDate() && todateA.getMonth() === todateB.getMonth() && todateA.getFullYear() === todateB.getFullYear();
        },
        unfocus(e) {
            const event = e.target.closest(".event");
            if (event !== null && this.focus) {
                if ((event || event.contains(e.target))) {
                    console.log(e.target)

                    this.focus = false;
                }
            } else {
                console.log(e.target)

                this.focus = false;
            }

        },
        setfocus(e) {
            const event = e.target.closest(".event");
            if ((event || event.contains(e.target)) && !this.focus) {
                this.focus = true;
            }

        },
        handlefocus(focus) {
            this.focus = !focus;
        },
        updateIcal(ical) {
            this.loadingStore.startLoading();
            apolloClient.mutate({
                mutation: gql`
          mutation UpdateIcal($ical: String!){
            modifyUserField(ical: $ical){
              ical
            }
          }
        `,
                variables: {
                    ical
                }
            }).then(({data}) => {
                this.loadingStore.stopLoading();
                console.log(data);
                this.userStore.setIcal(data.modifyUserField.ical);
                this.alertStore.addAlert({
                    status: "Success",
                    message: "Ton emploi du temps a bien été mis à jour !"
                });
                this.calendarStore.setDays(this.start, this.end);
            }).catch(err => {
                this.loadingStore.stopLoading();
                console.log(err);
            })
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


            const tomorrow = new Date(startToTimestamp);
            tomorrow.setDate(this.start.getDate() + 1);

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

@keyframes loading {
  0% {
    background-position: 0 50%;
  }
  50% {
    background-position: 100% 50%;
  }

  100% {
    background-position: 0 50%;
  }
}

#calendar {
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 100vh;

  .error {
    position: absolute;
    height: 100%;
    width: 100%;
    z-index: 101;
    backdrop-filter: blur(5px);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .setting-field {
      flex: none
    }
  }

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
    flex: 2;
    @media screen and (max-width: 1000px) {
      flex: 0.7;
    }
  }

  .day {
    display: flex;
    flex-direction: column;
    flex: 2;
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

      &.loading {
        background: linear-gradient(90deg, rgba(128, 128, 128, 0.1) 0%, rgba(189, 181, 181, 0.1) 50%, rgba(128, 128, 128, 0.1) 100%);
        background-size: 500% 500%;
        animation: loading 1.4s ease infinite;

      }
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
        @media screen and (max-width: 1000px) {
          padding-right: 16%;
        }

      }
    }
  }
}

.event-detail {
  position: fixed;
  bottom: 0;
  right: 0;
  @media screen and (max-width: 1000px) {
    bottom: 0;
    left: 0;
  }
  z-index: 999;
}
</style>