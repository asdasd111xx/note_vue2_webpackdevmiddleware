<template>
  <div>
    <div :class="[$style['form-search'], 'clearfix']">
      <div
        :class="[$style['field-date-wrap'], $style['start-date']]"
        @click="handleClickInqStartDate"
      >
        <div :class="$style.title">{{ $text("S_STARTED_DAY") }}</div>
        <input
          v-model="inqStart"
          ref="inqStartInput"
          :class="$style.date"
          :min="fromDate"
          :max="inqEnd"
          :id="`start`"
          type="date"
          @input="limitDate('start', $event.target.value)"
        />
        <span>{{ dateFormat(inqStart) }}</span>
      </div>
      <div
        :class="[$style['field-date-wrap'], $style['end-date']]"
        @click="handleClickInqEndDate"
      >
        <div :class="$style.title">{{ $text("S_END_DAY") }}</div>
        <input
          v-model="inqEnd"
          ref="inqEndInput"
          :class="$style.date"
          :min="inqStart"
          :max="endDate"
          :id="`end`"
          type="date"
          @input="limitDate('end', $event.target.value)"
        />
        <span>{{ dateFormat(inqEnd) }}</span>
      </div>

      <div v-if="chooseStatus" :class="$style['field-game-wrap']">
        <div :class="$style.title">
          {{ $text("S_PLEASE_SELECT_STATUS", "请选择状态") }}
        </div>

        <select :class="$style.select" @change="setParamsData($event)">
          <option v-for="info in options" :key="`list-${info.value}`">{{
            info.name
          }}</option>
        </select>
      </div>
      <div v-else :class="$style['field-game-wrap']">
        <div :class="$style.title">
          {{ "好友帐号" }}
        </div>

        <input v-model="name" @input="onInput" />
      </div>
    </div>
    <div :class="$style['field-search-wrap']">
      <div
        :class="[$style['btn-search'], { [$style['disable']]: !checkDate }]"
        @click.stop="
          () => {
            if (!checkDate) {
              return;
            } else {
              sendTime();
            }
          }
        "
      >
        {{ $text("S_INQUIRE") }}
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import { mapGetters, mapActions } from "vuex";
import EST from "@/lib/EST";

export default {
  props: {
    //派發文字
    options: {
      type: Array,
      require: true
    },
    //true 推薦禮金
    chooseStatus: {
      type: Boolean,
      default: true
    },
    dateRange: {
      type: Object,
      default: {}
    }
  },
  data() {
    const now = EST(new Date(), "", true);

    return {
      fromDate: Vue.moment(now)
        .add(-29, "days")
        .format("YYYY-MM-DD"),
      endDate: Vue.moment(now).format("YYYY-MM-DD"),
      inqVendor: "",
      inqKind: 0,
      inqStart: Vue.moment(now).format("YYYY-MM-DD"),
      inqEnd: Vue.moment(now).format("YYYY-MM-DD"),
      checkDate: true,
      allvendor: [{ alias: "全部", vendor: "", kind: 0 }],
      searchDate: {},
      name: ""
    };
  },
  created() {
    if (this.dateRange) {
      this.inqStart = this.dateRange.startTime;
      this.inqEnd = this.dateRange.endTime;
    }
    let friend = localStorage.getItem("friend-name");
    if (friend) {
      this.name = friend;
    }
  },
  computed: {
    ...mapGetters({
      siteConfig: "getSiteConfig"
    }),
    $style() {
      return this[`$style_${this.themeTPL}`] || this.$style_porn1;
    },
    themeTPL() {
      return this.siteConfig.MOBILE_WEB_TPL;
    },
    start: {
      get() {
        return format(new Date(this.startTime), "yyyy-MM-dd"); // 格式化成原生 input date 可以使用的格式
      },
      set(date) {
        if (!date) {
          return;
        } else {
          this.startTime = date;
        }
      }
    },
    end: {
      get() {
        return format(new Date(this.endTime), "yyyy-MM-dd"); // 格式化成原生 input date 可以使用的格式
      },
      set(date) {
        if (!date) {
          return;
        } else {
          this.endTime = date;
        }
      }
    }
  },

  methods: {
    ...mapActions(["actionSetGlobalMessage"]),
    setParamsData(event) {
      let selectType = {};
      let index = event.target.selectedIndex;
      let target = this.options[index];
      this.inqKind = target.key;
      this.inqVendor = target.status;
      selectType = {
        name: target.name ?? "",
        key: this.inqKind,
        status: this.inqVendor
      };
      this.$emit("select-type", selectType);
    },
    handleClickInqStartDate() {
      const el = this.$refs["inqStartInput"];
      el.click();
    },
    handleClickInqEndDate() {
      const el = this.$refs["inqEndInput"];
      el.click();
    },
    limitDate(key, val) {
      let _value = Vue.moment(val).format("YYYY/MM/DD");
      let _today = Vue.moment(EST(new Date()))
        .add(-29, "days")
        .format("YYYY/MM/DD");
      if (_value < _today) {
        this.checkDate = false;
        this.actionSetGlobalMessage({ msg: "查询记录不能超过30天" });
        this.inqStart = this.endDate;
        this.checkDate = true;
      } else if (this.inqStart > this.inqEnd) {
        this.checkDate = false;
        this.inqStart = this.endDate;
      } else if (this.inqEnd > this.endDate) {
        this.checkDate = true;
        this.inqEnd = this.endDate;
      } else {
        this.checkDate = true;
      }
    },
    dateFormat(value) {
      if (value) {
        return Vue.moment(value).format("YYYY-MM-DD");
      } else {
        return "";
      }
    },
    sendTime() {
      this.searchDate = { inqStart: this.inqStart, inqEnd: this.inqEnd };
      if (this.name != "") {
        this.searchDate = {
          inqStart: this.inqStart,
          inqEnd: this.inqEnd,
          friend_name: this.name
        };
        localStorage.setItem("friend-name", this.name);
      }

      this.$emit("search-date", this.searchDate);
    },
    onInput(e) {
      e.target.value = e.target.value
        .replace(/[^a-z0-9]/g, "")
        .substring(0, 20);
      this.name = e.target.value;
    }
  }
};
</script>

<style lang="scss" src="./css/porn1.module.scss" module="$style_porn1"></style>
<style lang="scss" src="./css/sg1.module.scss" module="$style_sg1"></style>
