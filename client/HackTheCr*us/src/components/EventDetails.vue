<template>
  <div id="event-details">
    <h2>{{ event().summary }}</h2>
    <h3>{{ event().location }}</h3>
    <h3>
      {{ formatDate(event().start) }} - {{ formatHour(event().start) }} à
      {{ formatHour(event().end) }}
    </h3>
    <p v-html='formatDescription(event().description)'></p>
  </div>
</template>

<script>
import { useCalendarStore } from "@/stores/calendar";

export default {
  name: "EventDetails",
  props: {
    event: {
      type: Object,
      required: true,
    },
  },
  setup() {
    const calendarStore = useCalendarStore();
    return { calendarStore };
  },
  data() {
    return {
      focused: false,
    };
  },
  methods: {
    event() {
      return this.calendarStore.getDay(this.$route.params.timestamp);
    },
    formatDate(date) {
      return new Date(date).toLocaleDateString("fr-FR", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    },
    formatHour(date) {
      return new Date(date).toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
      });
    },
    formatDescription(description) {
      return description.replace(/#/g, "<br />");
    },
  },
};
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

@keyframes slidein-left {
  from {
    transform: translateX(100%);
  }

  to {
    transform: translateX(0);
  }
}

@keyframes slideout-left {
  from {
    transform: translateX(0);
  }

  to {
    transform: translateX(100%);
  }
}

#event-details {
  h2 {
    font-size: 25px;
    font-weight: 600;
    margin: 0;
  }
  h3 {
    font-size: 20px;
    font-weight: 400;
    margin: 0;
  }
  p {
    font-size: 16px;
    font-weight: 300;
    margin: 0;
  }
}
</style>
