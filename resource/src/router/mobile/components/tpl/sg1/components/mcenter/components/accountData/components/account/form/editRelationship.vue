<template>
  <div :class="[$style['field-editer'], 'clearfix']">
    <div :class="$style['field-title']">{{ "感情" }}</div>
    <div :class="$style['input-wrap']">
      <div :class="$style['field-value']">
        <select v-model="selectRelationshipValue" :class="$style.select" ref="input">
          <option
            :key="index"
            v-for="(item, index) in relationshipList"
            :value="item.id"
          >
            {{ item.status }}
          </option>
        </select>
      </div>
      <div :class="$style['btn-wrap']">
        <span :class="$style['btn-cancel']" @click="$emit('cancel')">
          {{ $text("S_CANCEL", "取消") }}
        </span>
        <span :class="$style['btn-confirm']" @click="handleSubmit()">
          {{ $text("S_CONFIRM", "確認") }}
        </span>
      </div>
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
      relationshipList: [],
      selectRelationshipValue: "1",
    };
  },
  mounted() {
    this.getRelationshipData();
    // this.$refs.input.focus();
    
  },
  methods: {
    ...mapActions(["actionSetUserdata", "actionSetGlobalMessage","actionGetExtRedirect"]),
    getRelationshipData() {
      this.actionGetExtRedirect({
        api_uri: "/api/platform/v1/info/relationship-list",
        method: "get",
      }).then((data) => {
        this.relationshipList = data.result || [];
      });
    },
    handleSubmit() {
       // 空值驗證
      if (this.selectRelationshipValue === "") {
        this.$emit("msg", this.$text("S_CR_NUT_NULL"));
        return Promise.resolve("error");
      }

      this.actionGetExtRedirect({
        api_uri: "/api/platform/v1/user/update-relationship",
        method: "put",
        data: { relationship: `${this.selectRelationshipValue}` },
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
