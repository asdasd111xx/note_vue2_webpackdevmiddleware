<template>
  <div :class="[$style['account-data-field'], 'clearfix']">
    <div :class="$style['field-title']">{{ "地區" }}</div>
    <div :class="$style['input-wrap']">
      <template>
        <div :class="$style['hometown-input-wrap']">
          <select
            :class="$style['city']"
            v-model="thecity"
            id="selectcity"
            autofocus
          >
            <option
              v-for="(item, index) in theCityList"
              :key="index"
              :class="$style['cell']"
            >
              {{ item }}
            </option>
          </select>
          <select
            :class="$style['district']"
            v-model="thedistrict"
            id="selectdistrict"
            :disabled="
              thecity == '这是TA的秘密' || thecity == '火星' ? true : false
            "
          >
            <option
              v-for="(item, index) in filtertheDistrictList"
              :key="index"
              :class="$style['cell']"
            >
              {{ item }}
            </option>
          </select>

          <div :class="$style['btn-wrap']">
            <span :class="$style['btn-cancel']" @click="$emit('cancel')">
              {{ $text("S_CANCEL", "取消") }}
            </span>
            <span :class="$style['btn-confirm']" @click="handleSubmit()">
              {{ $text("S_CONFIRM", "确认") }}
            </span>
          </div>
        </div>
      </template>
      <!-- 地區選取備用套件pdselect -->
      <!-- <template v-if="showHometownEdit">
          <div :class="$style['more-method-wrap']">
            <div :class="$style['more-method-container']">
              <div
                :class="$style['more-method-header']"
                style="position: fixed;bottom: 220px;width: 100%; left:0; borderRadius: 20px 20px 0 0;"
              >
                <div
                  :class="$style['prev']"
                  @click.stop="showHometownEdit = false"
                >
                  {{ $text("S_CANCEL", "取消") }}
                </div>
                <div :class="$style['confirm']" @click="submitHometown">
                  {{ $text("S_CONFIRM_2", "确定") }}
                </div>
                <div :class="$style['title']">
                  地區
                </div>
              </div>
              <div :class="$style['more-method-content']">
                <pd-select-box
                  style="position: fixed;bottom: 0;width: 100%;"
                >
                  <pd-select-item
                    ref="thecity"
                    :listData="theCityList"
                    v-model="thecity"
                  ></pd-select-item>
                  <pd-select-item
                    ref="thedistrict"
                    :listData="filtertheDistrictList"
                    type="cycle"
                    v-model="thedistrict"
                  ></pd-select-item>
                </pd-select-box>
              </div>
            </div>
          </div>
        </template> -->
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import mcenter from "@/api/mcenter";
export default {
  components: {},
  data() {
    return {
      thecity: "北京",
      thedistrict: "东城区",
      theCityList: [],
      theDistrictList: [],
      hometownList: [],
    };
  },
  created() {
    this.getHometownListData();
  },
  mounted() {
    this.gettheDistrictList();
    this.actionSetSystemTime();
  },
  computed: {
    filtertheDistrictList() {
      this.hometownList.map((item) => {
        if (this.thecity == item.city) {
          this.theDistrictList = item.district || [];
          this.thedistrict = this.theDistrictList[0];
        }
      });

      return this.theDistrictList;
    },
  },
  methods: {
    ...mapActions([
      "actionSetUserdata",
      "actionSetGlobalMessage",
      "actionGetExtRedirect",
      "actionSetSystemTime",
    ]),
    getHometownListData() {
      this.actionGetExtRedirect({
        api_uri: "/api/platform/v1/info/hometown-list",
        method: "get",
      }).then((data) => {
        this.hometownList = data.result;
        this.theCityList = data.result.map((item) => {
          return item.city || [];
        });
      });
    },
    gettheDistrictList() {
      this.hometownList.map((item) => {
        if (this.thecity == item.city) {
          this.theDistrictList = item.district || [];
        }
      });
    },
    handleSubmit() {
      this.actionGetExtRedirect({
        api_uri: "/api/platform/v1/user/update-hometown",
        method: "put",
        data: {
          hometown:
            this.thecity == "这是TA的秘密" || this.thecity == "火星"
              ? `${this.thecity}`
              : `${this.thecity}-${this.thedistrict}`,
        },
      }).then((res) => {
        if (res.result === "success") {
          this.$emit("success");
        } else {
          this.actionSetGlobalMessage({ msg: `${res.error_text}` });
          this.$emit("cancel");
        }
      });
    },
  },
};
</script>
<style src="../../../css/index.module.scss" lang="scss" module>
