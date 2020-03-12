# daterange-calendar

一个简易的日期范围选择的移动web版，交互样式参考了携程的日期范围选择。

![ctrip-date-range](/src/assets/date_range.gif)

![ctrip-date-range](/src/assets/ctrip_date_range.gif)


## 如何使用

将代码克隆到本地，然后安装依赖即可预览查看

```bash

yarn install # 安装依赖

yarn run serve # 本地启动

```

## Options

| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|------|
| startDate | 日期范围的开始日期 | *Date \| String* | 当前日期 |
| endDate | 日期范围的结束日期 | *Date \| String* | 当前日期 |
| minDate | 可选择的最小日期 | *Date \| String* | 当前日期的三个月前 |
| maxDate | 可选值的最大日期 | *Date \| String* | 当前日期的三个月后 |
| showTip | 是否显示提示语 | *Boolean* | false |