<template>
  <div>
    <div
      id="header"
      :class="[$style['message-header']]"
      :style="isEditing ? { width: '100%', background: 'transparent' } : {}"
    >
      <div
        v-if="isEditing"
        :class="[$style['btn-close'], { [$style['active']]: isDelete }]"
        @click="isDelete ? '' : (isEditing = false)"
      >
        <img
          :src="
            $getCdnPath(
              `/static/image/common/btn_close_${
                themeTPL === 'porn1'
                  ? 'grey'
                  : themeTPL === 'ey1'
                  ? 'white'
                  : themeTPL === 'sg1'
                  ? 'black'
                  : null
              }.png`
            )
          "
        />
      </div>
      <div v-if="!$route.query.pid" :class="$style['btn-more']">
        <template v-if="isEditing">
          <span v-if="isSelectAll" @click="selectMessage = []">取消全选</span>
          <span v-else @click="onSelectAll">全选</span>
        </template>
        <template v-else>
          <img
            v-if="messageData.length !== 0"
            :src="
              $getCdnPath(
                `/static/image/${siteConfig.MOBILE_WEB_TPL}/common/btn_more.png`
              )
            "
            @click="onShowFunction(true)"
          />
        </template>
      </div>
    </div>
    <div
      v-if="!hasReceive && messageData.length === 0"
      :class="$style['no-data']"
    >
      <div :class="$style['no-data-wrap']">
        <img
          :src="
            $getCdnPath(
              '/static/image/porn1/mcenter/information/no_message.png'
            )
          "
        />
        <div>还没有新通知</div>
      </div>
    </div>
    <div v-else :class="$style['message-wrap']">
      <div
        v-if="!$route.query.pid"
        :class="[
          $style['message-list'],
          { [$style['message-list-editing']]: isEditing }
        ]"
      >
        <div
          v-for="message in messageData"
          :key="message.id"
          :class="[
            $style.message,
            { [$style['edit-mode']]: isEditing },
            'clearfix'
          ]"
          @click="!isEditing ? onClick(message) : {}"
        >
          <div
            v-if="isEditing"
            @click="onClick(message)"
            :class="[
              $style['icon-edit'],
              $style[`image-${siteConfig.ROUTER_TPL}`],
              { [$style.active]: selectMessage.includes(message.id) }
            ]"
          />
          <div :class="$style['icon-message']">
            <img
              :src="
                $getCdnPath(
                  `/static/image/${siteConfig.MOBILE_WEB_TPL}/mcenter/information/icon_information.png`
                )
              "
            />
            <span v-if="!message.read" />
          </div>
          <div :class="$style.wrap">
            <div class="clearfix">
              <div
                :class="$style.title"
                v-html="setTitleContent(message.title)"
              />
              <div :class="$style['msg-time']">
                {{ message.sent_at | shortDateFormat }}
              </div>
            </div>
            <div
              :class="$style.content"
              v-html="setTitleContent(message.content)"
            />
          </div>
        </div>
      </div>
      <div v-else-if="currentMessage" :class="$style['inner-message-content']">
        <div :class="[$style['content-title'], 'clearfix']">
          <div :class="$style['icon-message']">
            <img
              :src="
                $getCdnPath(
                  `/static/image/${siteConfig.MOBILE_WEB_TPL}/mcenter/information/icon_information.png`
                )
              "
            />
          </div>

          <div :class="$style['inner-wrap']">
            <div
              :class="$style['inner-title']"
              v-html="setTitleContent(currentMessage.title)"
            />
            <div :class="$style['inner-time']">
              {{ currentMessage.sent_at | dateFormat }}
            </div>
          </div>
        </div>
        <div
          :class="$style['message-content-wrap']"
          v-html="setContent(currentMessage.content)"
        />
      </div>
      <div
        v-if="showFunctionButton"
        :class="$style['function-button']"
        @click="onShowFunction(false)"
      >
        <div :class="$style['button-wrap']">
          <div :class="$style.button" @click="isEditing = true">编辑消息</div>
          <div :class="$style.divider" />
          <div
            :class="[
              $style.button,
              { [$style.disable]: memInfo.msgCount === 0 }
            ]"
            @click.stop="onAllRead"
          >
            全部已读
          </div>
          <div :class="$style.cancel" @click.stop="onShowFunction(false)">
            取消
          </div>
        </div>
      </div>
      <div
        v-if="isEditing"
        :class="[$style['bottom-button'], { [$style.show]: true }, 'clearfix']"
      >
        <div
          :class="[$style.read, { [$style.disable]: hasAllRead }]"
          @click="onRead"
        >
          标记已读
        </div>
        <div
          :class="[
            $style.delete,
            { [$style['disable']]: !selectMessage || !selectMessage.length > 0 }
          ]"
          @click="
            () => {
              if (!selectMessage || !selectMessage.length > 0) {
                return;
              } else {
                isDelete = true;
              }
            }
          "
        >
          删除
        </div>
      </div>
      <!-- <div v-if="isLoading" :class="$style.loading">
        <div :class="$style['loading-wrap']">
          <div :class="$style['icon-loading']">
            <icon name="spinner" width="32" height="32" pulse />
          </div>
          <div :class="$style['loading-text']">数据加载中...</div>
        </div>
      </div> -->
      <div v-if="isDelete" :class="$style['delete-tips']">
        <div :class="$style['tips-wrap']">
          <div :class="$style['tips-title']">温馨提醒</div>
          <div :class="$style['tips-text']">
            删除后将无法恢复，确定要删除吗？
          </div>
          <div
            :class="[
              $style['tips-button'],
              $style[siteConfig.ROUTER_TPL],
              'clearfix'
            ]"
          >
            <div :class="$style['delete-cancel']" @click="isDelete = false">
              取消
            </div>
            <div :class="[$style['delete-confirm']]" @click="onDelete">
              确定
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import axios from "axios";
import find from "lodash/find";
import mcenter from "@/api/mcenter";
import { API_MCENTER_MESSAGES_CONTENT } from "@/config/api";
import mixin from "@/mixins/mcenter/message/message";
export default {
  mixins: [mixin],
  data() {
    return {
      hasReceive: false,
      isEditing: false,
      isLoading: false,
      isDelete: false,
      showFunctionButton: false,
      //messageData: [],
      selectMessage: []
    };
  },
  computed: {
    ...mapGetters({
      memInfo: "getMemInfo",
      siteConfig: "getSiteConfig"
    }),
    $style() {
      const style =
        this[`$style_${this.siteConfig.MOBILE_WEB_TPL}`] || this.$style_porn1;
      return style;
    },
    messageData: {
      get() {
        return this.memInfo.msgData;
      },
      set(val) {
        return val;
      }
    },
    currentMessage() {
      if (!this.$route.query.pid || this.messageData.length == 0) {
        this.$router.back();
        return null;
      }

      return this.messageData.find(
        message => message.id === this.$route.query.pid
      );
    },
    isSelectAll() {
      return this.selectMessage.length === this.messageData.length;
    },
    hasAllRead() {
      return this.selectMessage.every(
        id => find(this.messageData, message => message.id === id).read
      );
    }
  },
  created() {
    this.actionSetMcenterMsgCount();
  },
  methods: {
    ...mapActions([
      "actionSetMcenterMsgCount",
      "actionSetUserdata",
      "actionSetGlobalMessage"
    ]),
    getMessgae() {
      this.actionSetMcenterMsgCount().then(() => {
        if (this.memInfo.msgCount) this.hasReceive = true;
      });

      // mcenter.message({
      //   success: response => {
      //     this.messageData = response.ret;
      //     this.hasReceive = true;
      //   }
      // });
    },
    getContent({ id, read }, isSetRead) {
      if (read) {
        return;
      }
      return mcenter.messageContent(
        {
          success: ({ result }) => {
            if (result !== "ok") {
              return;
            }
            // if (!isSetRead) this.actionSetMcenterMsgCount();
            this.messageData = this.messageData.map(message => {
              if (message.id === id) {
                return { ...message, read: true };
              }
              return message;
            });
          }
        },
        id
      );
    },
    onShowFunction(value) {
      this.showFunctionButton = value;
      this.selectMessage = [];
    },
    onAllRead() {
      if (this.memInfo.msgCount === 0) {
        return;
      }

      this.isLoading = true;
      const params = [];
      this.messageData.forEach((message, index) => {
        if (index === this.messageData.length - 1) {
          Promise.all(params).then(() => {
            setTimeout(() => {
              this.isLoading = false;
              this.$nextTick(() => {
                window.location.reload();
              });
            }, 1000);
          });
        }

        params.push(this.getContent(message, true));
      });
      this.isEditing = false;
      this.onShowFunction(false);
    },
    onClick(info) {
      if (this.isEditing) {
        if (this.selectMessage.includes(info.id)) {
          this.selectMessage = [
            ...this.selectMessage.filter(id => id !== info.id)
          ];
          return;
        }
        this.selectMessage = [...this.selectMessage, info.id];
        return;
      }
      this.getContent(info);
      this.$router.push({ query: { pid: info.id } });
      this.unReadMessage();
    },
    onSelectAll() {
      if (this.isDelete) {
        return;
      }
      this.selectMessage = [...this.messageData.map(message => message.id)];
    },
    onRead() {
      if (this.hasAllRead) {
        return;
      }
      this.isLoading = true;
      this.selectMessage.forEach((id, index) => {
        this.getContent(find(this.messageData, message => message.id === id));
        if (index < this.selectMessage.length - 1) {
          return;
        }
        setTimeout(() => {
          this.getMessgae();
          this.isLoading = false;
        }, 500);
      });
      this.isEditing = false;
      this.onShowFunction(false);
    },
    onDelete() {
      if (!this.selectMessage || !this.selectMessage.length > 0) {
        return;
      }

      this.isDelete = false;
      this.isLoading = true;

      axios({
        method: "delete",
        url: API_MCENTER_MESSAGES_CONTENT,
        data: { message_ids: this.selectMessage.map(id => +id) }
      }).then(res => {
        this.isLoading = false;

        if (res.data.result !== "ok") {
          this.actionSetGlobalMessage({
            msg: res.data.msg,
            code: res.data.code
          });
        } else {
          this.getMessgae();
          this.onShowFunction(false);
          this.isEditing = false;
          this.actionSetGlobalMessage({ msg: "消息删除成功" });
        }
      });
    },
    //點擊未讀訊息進入 返回後變為已讀訊息要往下放
    unReadMessage() {
      setTimeout(() => {
        this.getMessgae();
      }, 200);
    }
  }
};
</script>

<style
  lang="scss"
  src="../../css/porn1.message.scss"
  module="$style_porn1"
></style>
<style lang="scss" src="../../css/sg1.message.scss" module="$style_sg1"></style>
