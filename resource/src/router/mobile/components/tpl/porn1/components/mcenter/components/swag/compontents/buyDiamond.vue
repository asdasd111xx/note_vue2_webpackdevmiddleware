<template>
  <div :class="['clearfix']"></div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import axios from "axios";
import mixin from "@/mixins/mcenter/diamond/diamond";
export default {
  mixins: [mixin],
  data() {
    return {
    };
  },
  components: {
  },
  computed: {
    ...mapGetters({
      memInfo: "getMemInfo"
    }),
  },
  created() {
    // this.getRechargeBalance();
    // this.actionSetRechargeConfig();
  },
  watch: {
  },
  methods: {
  }
};
</script>

<style lang="scss" module>
@import "../css/index.module.scss";

.form {
  background-color: #eeeeee;
  font-size: 14px;
}

.form-content {
  display: flex;
  align-items: center;
  height: 50px;
  padding: 0 13px;
  color: #222222;
  background-color: #fefffe;
  margin-top: 1px;
  font-family: Microsoft JhengHei, Microsoft JhengHei-Regular;
  font-weight: 400;
  line-height: 20px;
  position: relative;
}

.keyring-tips {
  color: $main_error_color1;
}

.form-tips {
  padding: 0 13px;
  background-color: #fefffe;
  margin-top: 1px;
  font-family: Microsoft JhengHei, Microsoft JhengHei-Regular;
  font-weight: 400;
  line-height: 20px;
  position: relative;
  color: $main_error_color1;
  display: block;
  word-break: break-all;
  //   height: 30px;
  //   line-height: 30px;
  padding-top: 5px;
}

.form-tips {
  + .form-content {
    margin-top: unset;
  }
}

.keyring-content {
  height: auto;
  display: block;
  padding-top: 17px;
  padding-bottom: 8px;
}

.form-title {
  height: 20px;
  width: 100px;
}

.form-input {
  padding: 0 5px;

  input {
    width: 100%;

    &.amount {
      width: 80%;
    }
  }
}

.keyring-title {
  margin-bottom: 11px;
  height: 20px;
  width: 100%;
}

.keyring-input {
  height: 35px;
  width: 100%;
  position: relative;
  line-height: 35px;
  input {
    width: 60%;
  }
}

.send-keyring {
  -moz-tap-highlight-color: rgba(0, 0, 0, 0);
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  background-color: #d1b79c;
  border-radius: 3px;
  color: white;
  font-weight: 400;
  height: 30px;
  line-height: 30px;
  position: absolute;
  right: 0;
  text-align: center;
  top: 0;
  width: 100px;

  &.disabled {
    color: white;
    background-color: #e9dacc;
    pointer-events: none;
  }
}

input::placeholder {
  color: #aaaaaa;
}

.submit-wrap {
  height: 43px;
  margin: 15px auto;
  padding: 0 14px;
  max-width: $mobile_max_width;

  > div {
    border-radius: 3px;
    background: -webkit-linear-gradient(to right, #f9ddbd, #bd9d7d);
    background: -o-linear-gradient(to right, #f9ddbd, #bd9d7d);
    background: -moz-linear-gradient(to right, #f9ddbd, #bd9d7d);
    background: linear-gradient(to right, #f9ddbd, #bd9d7d);
    line-height: 43px;
    font-family: Microsoft JhengHei, Microsoft JhengHei-Bold;
    font-weight: 700;
    text-align: center;
    color: #f3ede7;
    width: 100%;
    height: 100%;
  }

  &.disabled {
    > div {
      background: -webkit-linear-gradient(to right, #eee5db, #e9dacb);
      background: -o-linear-gradient(to right, #eee5db, #e9dacb);
      background: -moz-linear-gradient(to right, #eee5db, #e9dacb);
      background: linear-gradient(to right, #eee5db, #e9dacb);
      pointer-events: none;
    }
  }
}

.serial-number-links {
  color: #6aaaf5;
  position: absolute;
  right: 17px;
}
</style>
