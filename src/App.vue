<template>
  <div id="app">
    <button @click="handleOpen" class="btn">选择日期</button>
    <range-calendar v-model="show" :show-tip="true" min-date="2019-09-09" max-date="2021-09-09" end-date="2022-01-01">
    </range-calendar>
  </div>
</template>

<script>
import RangeCalendar from './components/RangeCalendar';

export default {
  name: 'App',
  components: {
    RangeCalendar,
  },
  data() {
    return {
      show: false,
    };
  },
  methods: {
    handleOpen() {
      this.show = !this.show;
    },
  },
}
</script>

<style lang="scss" scoped>
  .btn {
    border: 1px solid #000;
  }
</style>
