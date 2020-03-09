<template lang="html">
  <div>
    <div class="action-sheet__backdrop" :class="{'open': value}" ref="backdrop" @click="$emit('input', false)"></div>
    <div class="action-sheet" :class="{'action-sheet__toggle': value}" ref="actionsheet">
      <div class="action-sheet__hd">
        <div class="action-sheet-btns">
          <span class="btn-action-cancel" @click="$emit('input', false)">取消</span>
        </div>
      </div>
      <div class="action-sheet__bd">
        <div class="rcm-calendar">
          <div class="rcm-calendar-weekdays">
            <div class="weekday-cell">日</div>
            <div class="weekday-cell">一</div>
            <div class="weekday-cell">二</div>
            <div class="weekday-cell">三</div>
            <div class="weekday-cell">四</div>
            <div class="weekday-cell">五</div>
            <div class="weekday-cell">六</div>
          </div>
          <div class="rcm-calendar-months" ref="calendarmonths">
            <template v-for="(item, index) in totalMonthList">
              <div class="rcm-month" :key="index">
                <div class="rcm-month-title">{{item.year + '年' + (item.month + 1) + '月'}}</div>
                <div class="rcm-month-days">
                  <template v-for="(date, k) in item.monthDates">
                    <div
                      :class="['day-cell', {
                        'select-start': date.type === 'normal' && (selectedStart === `${item.year}/${item.month + 1}/${date.content}`),
                        'select-end': date.type === 'normal' && (selectedEnd === `${item.year}/${item.month + 1}/${date.content}`),
                        'day-range': isInRange(item.year, item.month, date),
                        'disabled': isDisabled(item.year, item.month, date)
                      }]"
                      :key="`${index}_${k}`"
                      @click="handleDayClick(item.year, item.month, date)">
                      <div class="day-tooltip" v-if="showTip && date.type === 'normal' && (selectedStart === `${item.year}/${item.month + 1}/${date.content}`) && tipVisible">
                        <slot name="tip">
                          <span>请选择结束日期</span>
                        </slot>
                      </div>
                      <abbr>{{date.content}}</abbr>
                    </div>
                  </template>
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { addClass } from '../utils/dom';

  const currentFullYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  const currentDate = new Date().getDate();

  export default {
    name: 'range-calendar',
    props: {
      value: Boolean,
      showTip: {
        type: Boolean,
        default: false
      },
      minDate: {
        type: [String, Date],
        default: function() {
          const cur = new Date(currentFullYear, currentMonth, currentDate);
          cur.setDate(1);
          cur.setMonth(cur.getMonth() - 3);
          return cur;
        }
      },
      maxDate: {
        type: [String, Date],
        default: function() {
          return new Date(currentFullYear, currentMonth, currentDate);
        }
      },
      startDate: {
        type: [String, Date],
        default: function() {
          return new Date(currentFullYear, currentMonth, currentDate);
        }
      },
      endDate: {
        type: [String, Date],
        default: function() {
          return new Date(currentFullYear, currentMonth, currentDate);
        }
      },
    },
    data() {
      const selectedEnd = new Date(this.endDate).getTime() > new Date(this.maxDate).getTime()
        ? new Date(this.maxDate).toLocaleDateString() : new Date(this.endDate).toLocaleDateString();
      console.log(selectedEnd);
      return {
        totalMonthList: [],
        selectedStart: new Date(this.startDate).toLocaleDateString(),
        selectedEnd: selectedEnd,
        latestStartDate: new Date(this.startDate).toLocaleDateString(),
        latestEndDate: selectedEnd,
        tipVisible: false,
      };
    },
    watch: {
      value(val) {
        if (val) {
          this.selectedStart = this.latestStartDate;
          this.selectedEnd = this.latestEndDate;
          this.tipVisible = false;
          this.open();
          this.$nextTick(() => {
            this.scrollIntoView();
          });
        }
      }
    },
    created() {
      this.totalMonthList = this.getTotalMonthList();
    },
    methods: {
      open() {
        setTimeout(() => {
          addClass(this.$refs.backdrop, 'in');
        }, 0);
      },
      scrollIntoView() {
        document.querySelector('.select-start').scrollIntoView();
      },
      getMonthDates(year = currentFullYear, month = currentMonth) {
        let dayCountInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        if ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) {
          dayCountInMonth[1] = 29;
        }
        
        const preDates = this.getPreEmptyDates(year, month);
        const nextDates = this.getNextEmptyDates(year, month);
        const solidDates = [];
        for (let index = 0; index < dayCountInMonth[month]; index++) {
          solidDates.push({
            type: 'normal',
            content: index + 1
          });
        }
        return [...preDates, ...solidDates, ...nextDates];
      },
      getPreEmptyDates(year = currentFullYear, month = currentMonth) {
        const firstDayInMonth = new Date(year, month, 1).getDay();
        const result = [];
        for (let index = 0; index < firstDayInMonth; index++) {
          result.push({
            type: 'pre',
            content: ''
          });
        }
        return result;
      },
      getNextEmptyDates(year = currentFullYear, month = currentMonth) {
        const lastDayInMonth = new Date(year, month + 1, 0).getDay();
        const result = [];
        for (let index = 0; index < 6 - lastDayInMonth; index++) {
          result.push({
            type: 'next',
            content: ''
          }); 
        }
        return result;
      },
      isInRange(year, month, date) {
        const curDate = new Date(year, month, date.content);
        const startDateTimestamp = new Date(this.selectedStart).getTime();
        const endDateTimestamp = new Date(this.selectedEnd).getTime();
        return date.type === 'normal' && !!startDateTimestamp && !!endDateTimestamp && curDate.getTime() > startDateTimestamp && curDate.getTime() < endDateTimestamp;
      },
      isDisabled(year, month, date) {
        const curDate = new Date(year, month, date.content);
        const minDateTimestamp = new Date(this.minDate).getTime();
        const maxDateTimestamp = new Date(this.maxDate).getTime();
        return date.type === 'normal' && !!minDateTimestamp && !!maxDateTimestamp && (curDate.getTime() < minDateTimestamp || curDate.getTime() > maxDateTimestamp);
      },
      handleDayClick(year, month, date) {
        if (date.type === 'normal') {
          const curDate = new Date(year, month, date.content);
          const curDateStr = `${year}/${month + 1}/${date.content}`;

          if (this.selectedStart) {
            if (this.selectedEnd) {
              this.selectedStart = curDateStr;
              this.selectedEnd = undefined;
              this.$emit('select-start', curDate);
              this.tipVisible = true;
            } else {
              if (new Date(curDate).getTime() < new Date(this.selectedStart)) {
                this.selectedStart = curDateStr;
                this.$emit('select-start', curDate);
                this.tipVisible = true;
              } else {
                this.selectedEnd = curDateStr;
                this.latestStartDate = this.selectedStart;
                this.latestEndDate = curDateStr;
                this.$emit('range-pick', [new Date(this.selectedStart), curDate]);
                this.$emit('input', false);
              }
            }
          }
        }
      },
      getTotalMonthList() {
        const result = [];
        const minDate = new Date(this.minDate);
        const maxDate = new Date(this.maxDate);
        if (minDate.getTime() > maxDate.getTime()) return [];
        
        let cursor = new Date(minDate.getFullYear(), minDate.getMonth());
        const max = new Date(maxDate.getFullYear(), maxDate.getMonth());

        while(cursor.getTime() <= max.getTime()) {
          result.push({
            year: cursor.getFullYear(),
            month: cursor.getMonth(),
            monthDates: this.getMonthDates(cursor.getFullYear(), cursor.getMonth())
          });
          let curMonth = cursor.getMonth() + 1;
          let curYear = cursor.getFullYear();
          cursor = new Date(curMonth > 11 ? curYear + 1 : curYear, curMonth > 11 ? curMonth % 12 : curMonth);
        }
        return result;
      },
    },
  };
</script>

<style lang="scss" scoped>
  .rcm-calendar {
    background: #fff;
  }

  .rcm-calendar-months {
    height: 340px;
    overflow: scroll;
    -webkit-overflow-scrolling: touch;
  }

  .rcm-calendar-weekdays {
    height: 25px;
    background: #f5f5f5;
    border-width: 0 0 1px;
    border-style: solid;
    border-color: #ddd;
    overflow: hidden;
    position: relative;
    z-index: 2;

    .weekday-cell {
      width: 14.28%;
      line-height: 25px;
      font-size: 14px;
      float: left;
      text-align: center;

      &:nth-of-type(7n),
      &:nth-of-type(7n+1) {
        color: #4289ff;
      }
    }
  }

  .rcm-month {
    .rcm-month-title {
      height: 40px;
      line-height: 40px;
      text-align: center;
      font-weight: 500;
      font-size: 16px;
      clear: both;
    }
  }

  .rcm-month-days {
    padding-bottom: 14px;

    &:after {
      content: ".";
      height: 0;
      display: block;
      clear: both;
      visibility: hidden;
    }

    .day-cell {
      width: 14.28%;
      height: 50px;
      font-weight: 400;
      font-size: 14px;
      float: left;
      text-align: center;
      position: relative;
      
      &:after {
        content: "";
        display: inline-block;
        width: 0;
        height: 100%;
        vertical-align: middle;
      }

      abbr {
        display: inline-block;
        vertical-align: middle;
      }

      .day-cell-extra {
        font-size: 12px;
        width: 100%;
        text-align: center;
      }

      .day-cell-extra--top {
        position: absolute;
        left: 0;
        top: 0;
        transform: scale(.75);
        color: inherit;
      }

      .day-cell-extra--bottom {
        position: absolute;
        left: 0;
        bottom: 0;
        transform: scale(.75);
      }

      &.day-range {
        background: #e6eefe;
      }

      &.disabled {
        color: #cfcfcf;
        pointer-events: none;
      }
    }

    .select-start {
      background: #4289ff;
      color: #fff;
      border-top-left-radius: 4px;
      border-bottom-left-radius: 4px;
    }

    .select-end {
      background: #4289ff;
      color: #fff;
      border-top-right-radius: 4px;
      border-bottom-right-radius: 4px;
    }
  }

  .day-tooltip {
    position: absolute;
    width: 200%;
    left: -50%;
    top: -38px;
    padding: 7px 0;
    color: #fff;
    border-radius: 5px;
    font-size: 12px;
    background: rgba(0, 0, 0, .7);

    &:after {
      content: "";
      position: absolute;
      bottom: -5px;
      left: 50%;
      transform: translateX(-50%);
      width: 0;
      height: 0;
      border-width: 5px 5px 0 5px;
      border-style: solid;
      border-color: rgba(0,0,0,.7) transparent transparent transparent;
    }
  }

  .action-sheet__backdrop {
    position: fixed;
    z-index: 1001;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.6);
    display: none;
    opacity: 0;
    transition: .3s;

    &.in {
      opacity: 1;
    }

    &.open {
      display: block;
    }
  }

  .action-sheet {
    position: fixed;
    left: 0;
    bottom: 0;
    transform: translate(0, 100%);
    backface-visibility: hidden;
    z-index: 1001;
    width: 100%;
    background-color: #efeff4;
    transition: transform 0.3s;
  }

  .action-sheet__hd,
  .action-sheet__bd,
  .action-sheet__ft {
    background-color: #fff;
  }

  .action-sheet__toggle {
    transform: translate(0, 0);
  }

  .action-sheet-btns {
    font-size: 15px;
    overflow: hidden;
    background: #f5f5f5;

    .btn-action-cancel {
      display: block;
      color: #666;
      float: left;
      padding: 8px 12px;
    }

    .btn-action-confirm {
      display: block;
      color: #3c72e1;
      float: right;
      padding: 8px 12px;
    }
  }


</style>

