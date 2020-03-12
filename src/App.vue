<template>
  <div id="app">
    <button @click="handleOpen" class="btn">选择日期</button>
    <range-calendar v-model="show" :show-tip="true" @range-pick="handlePick">
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
    handlePick(val) {
      console.log(val);
    },
  },
}
</script>

<style lang="scss" scoped>
  .btn {
    border: 1px solid #000;
  }
</style>
