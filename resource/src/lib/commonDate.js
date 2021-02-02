import Vue from "vue";
import EST from "@/lib/EST";

class CommonDate {
  constructor() {
    const startFormat = "YYYY-MM-DDT00:00:00-04:00";
    const endFormat = "YYYY-MM-DDT23:59:59-04:00";

    // 今天
    this.today = EST(new Date(), "", true);
    this.today_start = Vue.moment(this.today).format(startFormat);
    this.today_end = Vue.moment(this.today).format(endFormat);

    // 取得當前是「星期幾」，用來取得本週與上週的日期
    this.days = this.today.getDay() || 7;

    // 昨天
    this.yesterday = Vue.moment(this.today).add(-1, "days");
    this.yesterday_start = this.yesterday.format(startFormat);
    this.yesterday_end = this.yesterday.format(endFormat);

    // 本週
    this.week = [
      Vue.moment(this.today)
        .add(-(this.days - 1), "days")
        .format(startFormat),
      Vue.moment(this.today).format(endFormat)
    ];

    // 上週
    this.lastWeek = [
      Vue.moment(this.today)
        .add(-(this.days - 1 + 7), "days")
        .format(startFormat),
      Vue.moment(this.today)
        .add(-(this.days - 1 + 1), "days")
        .format(endFormat)
    ];

    // 近30天
    this.thirty = [
      Vue.moment(this.today)
        .add(-29, "days")
        .format(startFormat),
      Vue.moment(this.today).format(endFormat)
    ];
  }

  getDate() {
    const {
      today,
      today_start,
      today_end,
      days,
      yesterday,
      yesterday_start,
      yesterday_end,
      week,
      lastWeek,
      thirty
    } = this;

    const obj = {
      today,
      today_start,
      today_end,
      days,
      yesterday,
      yesterday_start,
      yesterday_end,
      week,
      lastWeek,
      thirty
    };

    return obj;
  }
}

export default new CommonDate();
