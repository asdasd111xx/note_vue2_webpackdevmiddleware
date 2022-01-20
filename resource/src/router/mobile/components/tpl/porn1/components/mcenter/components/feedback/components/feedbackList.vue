<template>
  <div>
    <template v-if="!$route.params.id">
      <template v-if="isReceive">
        <div v-if="feedbackList.length === 0" :class="[$style['no-feedback']]">
          <img
            :src="`/static/image/${theme}/mcenter/feedback/no_feedback.png`"
          />
          <p>{{ $text("S_NO_FEEDBACK", "暂无反馈记录") }}</p>
          <button @click="btnPre">
            {{ $text("S_SEND_FEEDBACK", "立即反馈") }}
          </button>
        </div>
        <ul v-else :class="$style['feedback-list']">
          <template v-for="message in feedbackAddReply">
            <li
              :class="[$style['feedback-item'], 'clearfix']"
              :key="message.id"
              @click="getCurrentMassage(message)"
            >
              <div :class="$style['feedback-icon']">
                <template v-if="typeList && typeList.length > 0">
                  <img
                    :src="
                      message.imageId
                        ? `/static/image/${theme}/mcenter/feedback/question_${message.imageId}.png`
                        : `/static/image/${theme}/mcenter/feedback/question_8.png`
                    "
                  />
                </template>
              </div>
              <div :class="$style['feedback-content']">
                <div class="clearfix">
                  <h3 :class="$style['title']">{{ message.title }}</h3>
                  <p :class="$style['time']">
                    {{ message.created_at | getTime }}
                  </p>
                </div>

                <p
                  :class="$style['question']"
                  v-html="getShortConetent(message.content)"
                ></p>
              </div>
            </li>
          </template>
        </ul>
      </template>
    </template>
    <template v-else-if="currentFeedback">
      <div :class="$style['feedback-detail']">
        <div :class="$style['detail-content']">
          <div :class="[$style['detail-title'], 'clearfix']">
            <template v-if="typeList && typeList.length > 0">
              <img
                :src="
                  typeList.find(i => i.id === String(currentFeedback.type_id))
                    ? `/static/image/${theme}/mcenter/feedback/question_${
                        typeList.find(
                          i => i.id === String(currentFeedback.type_id)
                        ).imageId
                      }.png`
                    : `/static/image/${theme}/mcenter/feedback/question_8.png`
                "
              />
            </template>
            <h3>{{ currentFeedback.title }}</h3>
          </div>
          <div :class="[$style['detail-question'], 'clearfix']">
            <img :class="$style['detail-icon']" :src="avatarSrc" />
            <div :class="$style['question-info']">
              <div :class="$style['question-name']">
                {{ memInfo.user.username }}
              </div>
              <div
                :class="$style['question-description']"
                v-html="
                  setContent(
                    currentFeedback.content.replace(/\r?\n/g, '<br />')
                  )
                "
              />
              <p :class="$style['question-time']">
                {{ currentFeedback.created_at | getDeatilTime }}
              </p>
            </div>
          </div>
          <div
            v-if="currentFeedback.reply_content"
            :class="[$style['detail-service'], 'clearfix']"
          >
            <img
              :class="$style['detail-icon']"
              :src="
                `/static/image/${theme}/mcenter/feedback/ic_feedback_answer.png`
              "
            />
            <div :class="$style['question-info']">
              <div :class="$style['question-name']">
                {{ siteName }}
              </div>
              <p
                :class="$style['question-description']"
                v-html="setContent(currentFeedback.reply_content)"
              />
              <p :class="$style['question-time']">
                {{ currentFeedback.replied_at | getDeatilTime }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import mcenter from "@/api/mcenter";
import ajax from "@/lib/ajax";
import { API_FEEDBACK_REPLIED_LIST } from "@/config/api";
import EST from "@/lib/EST";
import axios from "axios";
import goLangApiRequest from "@/api/goLangApiRequest";
import { mapGetters, mapActions } from "vuex";

export default {
  filters: {
    getTime(time) {
      if (!time) {
        return "";
      }

      return EST(time, "YYYY-MM-DD");
    },
    getDeatilTime(time) {
      if (!time) {
        return "";
      }

      return EST(time);
    }
  },
  data() {
    return {
      feedbackAddReply: [],
      feedbackList: [],
      currentFeedback: null,
      unReadCount: 0,
      repliedList: [],
      isReceive: false,
      typeList: null,
      avatarSrc: `/static/image/common/default/avatar_nologin.png`
    };
  },
  computed: {
    ...mapGetters({
      memInfo: "getMemInfo",
      siteConfig: "getSiteConfig",
      loginStatus: "getLoginStatus"
    }),
    $style() {
      const style =
        this[`$style_${this.siteConfig.MOBILE_WEB_TPL}`] || this.$style_porn1;
      return style;
    },
    theme() {
      return this.siteConfig.ROUTER_TPL;
    },
    siteName() {
      return this.siteConfig.SITE_NAME;
    }
  },
  created() {
    const params = [
      this.getFeedbackRecord(),
      //this.getRepliedList(),
      this.getAvatarSrc(),
      this.getTypeList()
    ];

    Promise.all(params).then(() => {
      this.isReceive = true;
    });

    //  to do
    if (this.currentFeedback === null) {
      this.$router.push(
        `/mobile/mcenter/feedback/feedbackList/${
          this.$route.query.redirect === "sendFeedback"
            ? "?redirect=sendFeedback"
            : ""
        }`
      );
    }
  },
  methods: {
    ...mapActions(["actionGetExtRedirect"]),
    getShortConetent(content) {
      return content.replace(/<?\/?br ?\/?>/g, "\n");
    },
    getTypeList() {
      ajax({
        method: "get",
        url: "/api/v1/c/feedback_type/list",
        errorAlert: false
      }).then(res => {
        this.typeList = res.ret.map((item, index) => {
          return {
            id: item.id,
            content: item.content,
            imageId: index + 1 < 8 ? index + 1 : 8
          };
        });
      });
    },
    setContent(content) {
      return content;
      // let urlRegex = /(https?:\/\/[^\s]+)/g;
      // return content.replace(/\n/g, '<br/>').replace(urlRegex, function (url) {
      //   return '<a href="' + url + '" target="_blank">' + url + '</a>';
      // })
    },
    getFeedbackRecord() {
      mcenter.feedbackRecord({
        success: response => {
          this.feedbackList = response.ret;
          this.getRepliedList();
        }
      });
    },
    getCurrentMassage(content) {
      console.log(content);
      this.currentFeedback =
        this.repliedList.find(item => item.id === content.id) || content;

      this.setReplyReadAt(content.id);
      this.$router.push(
        `/mobile/mcenter/feedback/feedbackList/${content.id}${
          this.$route.query.redirect === "sendFeedback"
            ? "?redirect=sendFeedback"
            : ""
        }`
      );
    },
    getRepliedList() {
      ajax({
        method: "get",
        url: API_FEEDBACK_REPLIED_LIST,
        errorAlert: false
      }).then(response => {
        if (response.result !== "ok") {
          return;
        }
        this.repliedList = response.ret;
        this.getFeedbackAddReply();
      });
    },
    getFeedbackAddReply() {
      //反饋列表客服有回覆則顯示回覆的內容

      this.feedbackAddReply = this.feedbackList;
      for (let i in this.feedbackAddReply) {
        for (let j in this.repliedList) {
          if (this.feedbackAddReply[i].id == this.repliedList[j].id) {
            this.feedbackAddReply[i].content = this.repliedList[
              j
            ].reply_content;
          }
        }
      }

      //反饋列表客服圖片
      for (let i in this.typeList) {
        for (let j in this.feedbackAddReply) {
          if (this.feedbackAddReply[j].type_id == this.typeList[i].id) {
            this.feedbackAddReply[j].imageId = this.typeList[i].imageId;
          }
        }
      }
    },
    getAvatarSrc() {
      if (!this.loginStatus) return;

      if (this.siteConfig.ROUTER_TPL === "sg1") {
        // 是否自訂上傳頭像
        this.actionGetExtRedirect({
          api_uri: "/api/platform/v1/user/front-page",
          method: "get"
        }).then(data => {
          if (data && data.result && data.result.head_photo) {
            this.avatarSrc = data.result.head_photo;
          }
        });

        if (this.avatarSrc) {
          return;
        }

        this.actionGetExtRedirect({
          api_uri: "/api/platform/v1/head-photo/preset-list",
          method: "get"
        }).then(res => {
          if (res && res.result && res.result.data) {
            let currentImgID = res.result.use;
            let defaultAvatarList = res.result.data;
            if (currentImgID && defaultAvatarList) {
              this.avatarSrc = defaultAvatarList.find(
                i => i.image_id === currentImgID
              ).link;
            }
          }
        });
        return;
      }

      const imgSrcIndex = this.memInfo.user.image;
      if (this.memInfo.user && this.memInfo.user.custom) {
        axios({
          method: "get",
          url: this.memInfo.user.custom_image
        })
          .then(res => {
            if (res && res.data && res.data.result === "ok") {
              this.avatarSrc = res.data.ret;
            }
          })
          .catch(error => {
            this.actionSetGlobalMessage({ msg: error.data.msg });
            this.avatarSrc = this.$getCdnPath(
              `/static/image/common/mcenter/default/avatar_${imgSrcIndex}.png`
            );
          });
      } else {
        this.avatarSrc = this.$getCdnPath(
          `/static/image/common/mcenter/default/avatar_${imgSrcIndex}.png`
        );
      }
    },
    setReplyReadAt(id) {
      return goLangApiRequest({
        method: "put",
        url: `${this.siteConfig.YABO_GOLANG_API_DOMAIN}/xbb/Feedback/${id}/ReplyReadAt`,
        params: {
          lang: "zh-cn",
          feedbackID: id
        }
      })
        .then(res => {
          const { status, data, msg, errorCode } = res;

          if (status !== "000" && errorCode !== "00") {
            dispatch("actionSetGlobalMessage", {
              msg,
              code
            });
            return;
          }

          return;
        })
        .catch(error => {
          const { msg, code } = error.response.data;
          dispatch("actionSetGlobalMessage", {
            msg,
            code
          });
        });
    },
    btnPre() {
      if (this.$route.query.redirect === "sendFeedback") {
        this.$router.back();
      } else {
        this.$router.replace("/mobile/mcenter/feedback/sendFeedback");
      }
    }
  }
};
</script>

<style
  lang="scss"
  src="./css/feedbackList.module.scss"
  module="$style_porn1"
></style>
<style
  lang="scss"
  src="./css/ey1.feedbackList.scss"
  module="$style_ey1"
></style>
<style
  lang="scss"
  src="./css/sg1.feedbackList.scss"
  module="$style_sg1"
></style>
