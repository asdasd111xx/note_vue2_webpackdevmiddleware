import { mapGetters, mapActions } from "vuex";
import axios from 'axios';

export default {
  props: {
    userVipInfo: {
      type: Object | null,
      required: true
    }
  },
  data() {
    return {
      avatarSrc: `/static/image/_new/mcenter/avatar_nologin.png`,
    };
  },
  computed: {
    ...mapGetters({
      memInfo: "getMemInfo",
      loginStatus: 'getLoginStatus',
    }),
    runPercent() {
      return this.userVipInfo.percent + "%";
    }
  },
  mounted() {
    this.actionSetUserdata(true).then(() => {
      this.getAvatarSrc();
    })
  },
  methods: {
    ...mapActions([
      'actionSetUserdata'
    ]),
    getAvatarSrc() {
      if (!this.loginStatus) return;

      const imgSrcIndex = this.memInfo.user.image;
      if (this.memInfo.user && this.memInfo.user.custom) {
        axios({
          method: 'get',
          url: this.memInfo.user.custom_image,
        }).then(res => {
          if (res && res.data && res.data.result === "ok") {
            this.avatarSrc = res.data.ret;
          }
        }).catch(error => {
          this.actionSetGlobalMessage({ msg: error.data.msg });
          this.avatarSrc = this.$getCdnPath(`/static/image/_new/mcenter/default/avatar_${imgSrcIndex}.png`);
        })
      } else {
        this.avatarSrc = this.$getCdnPath(`/static/image/_new/mcenter/default/avatar_${imgSrcIndex}.png`);
      }
    },
  },
}
