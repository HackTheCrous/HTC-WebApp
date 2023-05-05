<template>
    <div ref="slidable"  id="event-detail" draggable="true" @touchend="dragEnded" @touchmove="handletouch" @dragstart="dragStarted" @drag="dragHandled" @dragend="dragEnded" :class="this.focus ? 'event-detail focused' : 'unfocused event-detail'" >
        <h2>{{ this.data.summary }}</h2>
        <p>{{ this.data.location }}</p>
        <p v-html="(this.data.description.replaceAll('\n', '<br>')).replaceAll(/^(<br>)*/ig,'')"></p>
    </div>
</template>

<script>
import {useCalendarStore} from "@/stores/calendar";

export default {
    name: "EventDetails",
    setup() {
        const calendarStore = useCalendarStore();
        return {
            calendarStore
        }
    },
    emits: ['unfocus'],

    props: {
        focus: Boolean,
    },
    methods: {
        dragStarted(event){
          event.dataTransfer.setDragImage(new Image(), 0, 0);
        },

        handletouch(event){
            event.preventDefault();
            event.stopPropagation();
            this.$refs.slidable.style.top= `${event.touches[0].clientY}px`;
            if(event.touches[0].clientY>window.innerHeight*0.8){
                this.$emit('unfocus', true);
            }
        },

      dragHandled(event) {
          event.dataTransfer.setData("text/plain", this.data.id);
          event.dataTransfer.dropEffect= "none";
          event.dataTransfer.effectAllowed= "none";
          if(event.screenY>window.innerHeight*0.7){
              this.$refs.slidable.style.top= `${event.screenY}px`;

          }
          if(event.screenY>window.innerHeight*0.95){
              this.$emit('unfocus', true);
          }
      },
      dragEnded() {
          this.$refs.slidable.style.bottom= `0px`;
          this.$refs.slidable.style.top= `auto`;
      }
    },
    computed: {
        data() {
            return this.calendarStore.getDay(this.$route.params.timestamp)
        }
    },
}
</script>

<style lang="scss" scoped>


@keyframes slidein {
  from {
    transform: translateY(100%);
  }

  to {
    transform: translateY(0);
  }

}

@keyframes slideout {
  from {
    transform: translateY(0);
  }

  to {
    transform: translateY(100%);
  }

}


.event-detail {
  width: 100%;
  background: white;
  margin: 0;
  padding-top: 30px;
  padding-left: 20px;
  border-radius: 30px;
  padding-bottom: 70px;
  box-shadow: 0 0 10px var(--color-shadow);


    &.focused{
        animation: slidein 0.1s ease;
    }
    &.unfocused{
        animation: slideout 0.1s ease;
        animation-fill-mode: forwards;
    }

  h2 {
    font-size: 30px;
    font-weight: 600;
    margin: 0;
  }

  pre {
    margin: 0;
    padding: 0;
  }
}
</style>