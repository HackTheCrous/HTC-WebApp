<template>
  <div id="settings">
    <div class="widget">
      <span class="head-row">
        <h3>{{ this.getMonthAndYear(this.start) }}</h3>
        <span>
          <span @click="this.monthBefore()" class="arrow left">&lt;</span>
          <span @click="this.monthAfter()" class="arrow right">></span>
        </span>
      </span>

      <div id="calendar-head">
        <div v-for="day in days" :key="day" class="day">
          <div class="day-name">{{ day }}</div>
        </div>
      </div>
      <div id="calendar">
        <div
          v-for="day in gridMonth"
          :key="'t-' + day"
          :class="this.classPeriod(day)"
          @click="this.changeDate(day)"
        >
          <div class="day-number">{{ day }}</div>
        </div>
      </div>
    </div>
    <div class="widget">
      <router-view :focus="true" @unfocus="handlefocus"></router-view>
    </div>
  </div>
</template>

<script>
export default {
  name: "PlanningSettings",
  emits: ["change"],
  props: {
    start: {
      type: Date,
      required: true,
    },
    end: {
      type: Date,
      required: true,
    },
  },
  data() {
    return {
      days: ["L", "M", "M", "J", "V", "S", "D"],
    };
  },
  methods: {
    formatDate(date) {
      if (typeof date === "string") date = new Date(date);
      const formated = date.toLocaleDateString("fr-FR", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      return formated.charAt(0).toUpperCase() + formated.slice(1);
    },
    getMonthAndYear(date) {
      const formated = date.toLocaleDateString("fr-FR", {
        year: "numeric",
        month: "long",
      });
      return formated.charAt(0).toUpperCase() + formated.slice(1);
    },
    changeDate(nbDay) {
      const start = new Date(this.start);
      start.setDate(nbDay);
      start.setMonth(this.start.getMonth());
      const end = new Date(start);
      end.setDate(end.getDate() + 5);
      this.$emit("change", { start, end });
    },
    monthBefore() {
      const start = new Date(this.start);
      start.setMonth(start.getMonth() - 1);
      const end = new Date(start);
      end.setDate(end.getDate() + 5);
      this.$emit("change", { start, end });
    },
    monthAfter() {
      const start = new Date(this.start);
      start.setMonth(start.getMonth() + 1);
      const end = new Date(start);
      end.setDate(end.getDate() + 5);
      this.$emit("change", { start, end });
    },
    classPeriod(day) {
      let classDay = "day";
      const start = new Date(this.start);
      const end = new Date(this.end);
      const date = new Date(this.start);
      date.setDate(day);
      if (date >= start && date <= end) {
        classDay += " in-period";
      }
      if (date.getDay() === start.getDay()) {
        classDay += " start";
      }
      if (date.getDay() === end.getDay()) {
        classDay += " end";
      }
      return classDay;
    },
  },
  computed: {
    gridMonth() {
      const grid = [];
      let firstDay =
        new Date(this.start.getFullYear(), this.start.getMonth(), 1).getDay() -
        1;
      if (firstDay === -1) firstDay = 6;

      for (let i = 0; i < firstDay; i++) {
        grid.push("");
      }

      for (
        let i = 1;
        i <=
        new Date(
          this.start.getFullYear(),
          this.start.getMonth() + 1,
          0
        ).getDate();
        i++
      ) {
        grid.push(i);
      }
      return grid;
    },
  },
};
</script>

<style lang="scss">
#settings {
  height: 100vh;
  width: 20%;
  border-left: 1px solid var(--color-border);
  box-shadow: 0px 0px 10px 0px var(--color-shadow);
  position: fixed;
  right: 0px;
  top: 0px;
  .widget {
    padding: 0px 30px;
    border-bottom: 1px solid var(--color-border);
    padding-bottom: 20px;
    padding-top: 50px;
    &:last-child {
      border-bottom: none;
    }
  }
  .head-row {
    margin-left: 10px;
    margin-right: 10px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
    .arrow {
      cursor: pointer;
      margin: 0px;
      padding: 0;
      &:hover {
        color: var(--color-primary);
      }
      &.left {
        margin-right: 5px;
      }
    }
  }
  h3 {
    font-weight: 600;
  }
  #calendar-head {
    display: flex;
    flex-direction: row;
    width: 100%;
    align-items: center;
    justify-content: space-between;
    .day {
      display: flex;
      flex-direction: column;
      align-items: center;
      flex: 1;
      justify-content: center;
      .day-name {
        opacity: 0.7;
        text-align: center;
        flex: 1;
      }
      .day-name {
        opacity: 0.7;
        text-align: center;
        flex: 1;
      }
    }
  }
  #calendar {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    grid-template-rows: repeat(6, 1fr);
    .day {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      &:hover {
        background: var(--color-background-secondary);
        color: white;
        cursor: pointer;
      }
      &.in-period {
        background: var(--color-primary);
        color: black;
        opacity: 0.7;
      }
      &.start {
        border-radius: 50px 0px 0px 50px;
      }
      &.end {
        border-radius: 0px 50px 50px 0px;
      }
    }
  }
}
</style>
