<template>
  <div v-if="hasReceive && messageData.length === 0" :class="$style['no-data']">
    <div :class="$style['no-data-wrap']">
      <img
        :src="
          $getCdnPath('/static/image/_new/mcenter/information/no_message.png')
        "
      />
      <div>还没有新通知</div>
    </div>
  </div>
  <div v-else :class="$style['message-wrap']">
    <div
      v-if="isEditing"
      :class="$style['btn-close']"
      @click="isEditing = false"
    >
      <img
        :src="
          $getCdnPath('/static/image/_new/mcenter/information/btn_close.png')
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
          :src="
            $getCdnPath('/static/image/_new/mcenter/information/btn_more.png')
          "
          @click="onShowFunction(true)"
        />
      </template>
    </div>
    <div v-if="!$route.query.pid" :class="$style['message-list']">
      <div
        v-for="message in messageData"
        :key="message.id"
        :class="[
          $style.message,
          { [$style['edit-mode']]: isEditing },
          'clearfix'
        ]"
        @click="onClick(message)"
      >
        <div
          v-if="isEditing"
          :class="[
            $style['icon-edit'],
            { [$style.active]: selectMessage.includes(message.id) }
          ]"
        />
        <div :class="$style['icon-message']">
          <img
            :src="
              $getCdnPath(
                '/static/image/_new/mcenter/information/icon_information.png'
              )
            "
          />
          <span v-if="!message.read" />
        </div>
        <div :class="$style.wrap">
          <div class="clearfix">
            <div :class="$style.title" v-html="message.title" />
            <div :class="$style['msg-time']">
              {{ message.sent_at | shortDateFormat }}
            </div>
          </div>
          <div :class="$style.content" v-html="message.content" />
        </div>
      </div>
    </div>
    <div v-else :class="$style['message-content']">
      <div :class="[$style['content-title'], 'clearfix']">
        <div :class="$style['icon-message']">
          <img
            :src="
              $getCdnPath(
                '/static/image/_new/mcenter/information/icon_information.png'
              )
            "
          />
        </div>
        <div :class="$style.wrap">
          <div :class="$style.title" v-html="currentMessage.title" />
          <div :class="$style.time">
            {{ currentMessage.sent_at | dateFormat }}
          </div>
        </div>
      </div>
      <div :class="$style['content-wrap']" v-html="currentMessage.content" />
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
          :class="[$style.button, { [$style.disable]: memInfo.msgCount === 0 }]"
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
      <div :class="$style.delete" @click="isDelete = true">删除</div>
    </div>
    <div v-if="isLoading" :class="$style.loading">
      <div :class="$style['loading-wrap']">
        <div :class="$style['icon-loading']">
          <icon name="spinner" width="32" height="32" pulse />
        </div>
        <div :class="$style['loading-text']">数据加载中...</div>
      </div>
    </div>
    <div v-if="isDelete" :class="$style['delete-tips']">
      <div :class="$style['tips-wrap']">
        <div :class="$style['tips-title']">温馨提醒</div>
        <div :class="$style['tips-text']">删除后将无法恢复，确定要删除吗？</div>
        <div :class="[$style['tips-button'], 'clearfix']">
          <div :class="$style['delete-cancel']" @click="isDelete = false">
            取消
          </div>
          <div :class="$style['delete-confirm']" @click="onDelete">确定</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import { mapGetters, mapActions } from 'vuex';
import axios from 'axios';
import find from 'lodash/find';
import mcenter from '@/api/mcenter';
import { API_MCENTER_MESSAGES_CONTENT } from '@/config/api';
import { getCookie, setCookie } from '@/lib/cookie';
import EST from '@/lib/EST';

export default {
  filters: {
    dateFormat(date) {
      return EST(Vue.moment(date).format('YYYY-MM-DD HH:mm:ss'));
    },
    shortDateFormat(date) {
      return Vue.moment(date).format('YYYY-MM-DD');
    }
  },
  data() {
    return {
      hasReceive: false,
      isEditing: false,
      isLoading: false,
      isDelete: false,
      showFunctionButton: false,
      messageData: [],
      selectMessage: []
    };
  },
  computed: {
    ...mapGetters({
      memInfo: 'getMemInfo'
    }),
    currentMessage() {
      if (!this.$route.query.pid) {
        return null;
      }
      return this.messageData.find((message) => message.id === this.$route.query.pid);
    },
    isSelectAll() {
      return this.selectMessage.length === this.messageData.length;
    },
    hasAllRead() {
      return this.selectMessage.every((id) => find(this.messageData, (message) => message.id === id).read);
    }
  },
  created() {
    this.getMessgae();
  },
  methods: {
    ...mapActions([
      'actionSetMcenterMsgCount',
      'actionSetUserdata'
    ]),
    getMessgae() {
      mcenter.message({
        success: (response) => {
          this.messageData = response.ret;
          this.hasReceive = true;
        }
      });
    },
    getContent({ id, read }, isSetRead, isLastMsg) {
      if (read) {
        return;
      }
      mcenter.messageContent({
        success: ({ result }) => {
          if (result !== 'ok') {
            return;
          }
          if (!isSetRead) this.actionSetMcenterMsgCount();
          if (isLastMsg) {
            setTimeout(() => {
              this.actionSetMcenterMsgCount();
              this.isLoading = false;
            }, 1500);
          }
          this.messageData = this.messageData.map((message) => {
            if (message.id === id) {
              return { ...message, read: true };
            }
            return message;
          });
        }
      }, id);
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
      this.messageData.forEach((message, index) => {
        if (index === this.messageData.length - 1) {
          this.actionSetUserdata(true);
          this.getContent(message, true, true);
          return;
        } else {
          this.getContent(message, true);
        }
      });
      this.isEditing = false;
      this.onShowFunction(false);
    },
    onClick(info) {
      if (this.isEditing) {
        if (this.selectMessage.includes(info.id)) {
          this.selectMessage = [...this.selectMessage.filter((id) => id !== info.id)];
          return;
        }
        this.selectMessage = [...this.selectMessage, info.id];
        return;
      }
      this.getContent(info);
      this.$router.push({ query: { pid: info.id } });
    },
    onSelectAll() {
      this.selectMessage = [...this.messageData.map((message) => message.id)];
    },
    onRead() {
      if (this.hasAllRead) {
        return;
      }
      this.isLoading = true;
      this.selectMessage.forEach((id, index) => {
        this.getContent(find(this.messageData, (message) => message.id === id));
        if (index < this.selectMessage.length - 1) {
          return;
        }
        setTimeout(() => {
          this.isLoading = false;
        }, 500);
      });
      this.isEditing = false;
      this.onShowFunction(false);
    },
    onDelete() {
      this.isDelete = false;
      this.isLoading = true;

      axios({
        method: 'delete',
        url: API_MCENTER_MESSAGES_CONTENT,
        data: { message_ids: this.selectMessage.map((id) => +id) }
      }).then((response) => {
        setTimeout(() => {
          this.isLoading = false;
        }, 500);
        if (response.data.result !== 'ok') {
          return;

          if (response.data.code = "M00001") {
            if (getCookie('cid')) {
              alert(`${error.response.data.msg} ${error.response.data.code ? `(${error.response.data.code})` : ''}`);
            }
            setCookie('cid', '');
            window.location.href = '/mobile/login';
          }
        }

        this.getMessgae();
        this.onShowFunction(false);
        this.isEditing = false;
      });
    }
  }
};
</script>

<style lang="scss" module>
@keyframes slide-up {
  from {
    bottom: -162px;
  }

  to {
    bottom: 0;
  }
}

.no-data {
  position: relative;
  min-height: calc(100vh - 43px - 42px - 10px);
  margin-top: 52px;
  background-color: #fefffe;
}

.no-data-wrap {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 180px;
  height: 220px;
  margin: auto;

  > img {
    display: block;
    width: 100%;
  }

  > div {
    height: 20px;
    line-height: 20px;
    margin-top: 20px;
    color: #a5a9b3;
    font-size: 14px;
    text-align: center;
  }
}

.btn-close {
  position: fixed;
  top: 12px;
  left: 14px;
  z-index: 5;
  width: 20px;
  height: 20px;
  background-color: #fefffe;

  > img {
    display: block;
    width: 100%;
  }
}

.btn-more {
  position: fixed;
  top: 12px;
  right: 14px;
  z-index: 5;
  height: 20px;
  line-height: 20px;
  color: #414655;
  font-size: 16px;

  > img {
    display: block;
    width: 20px;
  }
}

.message-wrap {
  background-color: #fefffe;
}

.message-list {
  min-height: calc(100vh - 43px - 42px - 10px);
  margin-top: 52px;
}

.message-content {
  min-height: calc(100vh - 43px - 10px);
  margin-top: 10px;
  overflow-wrap: break-word;
}

.message {
  height: 67px;
  margin: 0 7px;
  padding: 0 7px;
  border-bottom: 1px solid #eee;
  background-color: #fefffe;

  .icon-message {
    margin: 17px 0;
  }

  .wrap {
    padding: 13px 0;

    .title {
      max-width: calc(100% - 70px);
      float: left;
    }

    .msg-time {
      float: right;
      color: #a6a9b2;
      font-size: 12px;
    }
  }
}

.edit-mode {
  position: relative;
  padding-left: 41px;
}

.icon-edit {
  position: absolute;
  top: 24px;
  left: 13px;
  width: 18px;
  height: 18px;
  border: 1px solid #cbced8;
  border-radius: 50%;
  background-color: #fff;

  &.active {
    border: none;
    background: url("/static/image/_new/mcenter/information/icon_check.png") 0 0
      no-repeat;
    background-size: 18px 18px;
  }
}

.content-title {
  padding-left: 14px;

  .icon-message {
    margin: 13px 0;
  }

  .wrap {
    padding: 10px 0;
    border-bottom: 1px solid #eee;
  }
}

.content-wrap {
  padding: 8px 18px;
  color: #414655;
  font-size: 14px;
}

.icon-message {
  position: relative;
  float: left;
  width: 32px;
  height: 32px;

  > img {
    display: block;
    width: 100%;
  }

  > span {
    position: absolute;
    top: 0;
    right: 0;
    display: block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: #db6372;
  }
}

.wrap {
  float: left;
  width: calc(100% - 32px - 10px);
  margin-left: 10px;

  p {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.title {
  height: 20px;
  line-height: 20px;
  color: #414655;
  font-size: 14px;
}

.content {
  height: 17px;
  line-height: 17px;
  margin-top: 3px;
  color: #a6a9b2;
  font-size: 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.time {
  height: 12px;
  line-height: 12px;
  margin-top: 6px;
  color: #a6a9b2;
  font-size: 12px;
}

.function-button {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 5;
  background-color: rgba(0, 0, 0, 0.4);
  transition: background-color 0.3s;
}

.button-wrap {
  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: #f8f8f8;
  animation: slide-up 0.3s;
}

.button {
  height: 50px;
  line-height: 50px;
  background-color: #fff;
  color: #5e626d;
  font-size: 17px;
  text-align: center;

  &.disable {
    color: #cbced8;
  }
}

.divider {
  height: 1px;
  background-color: #f9f9f9;
}

.cancel {
  composes: button;
  margin-top: 11px;
}

.bottom-button {
  position: fixed;
  right: 0;
  bottom: -50px;
  left: 0;
  height: 50px;
  line-height: 50px;
  padding: 0 20px;
  background-color: #eee;
  transition: bottom 0.3s;

  &.show {
    bottom: 0;
  }
}

.read {
  float: left;
  color: #6aaaf5;
  font-size: 16px;

  &.disable {
    color: #cbced8;
  }
}

.delete {
  float: right;
  color: #db6372;
  font-size: 16px;
}

.loading {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 10;
}

.loading-wrap {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100px;
  height: 85px;
  margin: auto;
  padding: 15px;
  border-radius: 5px;
  background-color: rgba(65, 70, 85, 0.8);
}

.icon-loading {
  width: 32px;
  height: 32px;
  margin: 0 auto;
  color: #9ca29f;

  > svg {
    display: block;
  }
}

.loading-text {
  height: 18px;
  line-height: 18px;
  margin-top: 5px;
  color: #fff;
  font-size: 12px;
  text-align: center;
}

.delete-tips {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 10;
  background-color: rgba(0, 0, 0, 0.4);
}

.tips-wrap {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 270px;
  height: 130px;
  margin: auto;
  padding-top: 15px;
  border-radius: 10px;
  background-color: #fff;
}

.tips-title {
  height: 18px;
  line-height: 18px;
  margin-bottom: 13px;
  padding: 0 13px;
  color: #000;
  font-size: 18px;
  text-align: center;
}

.tips-text {
  height: 18px;
  line-height: 18px;
  margin-bottom: 15px;
  padding: 0 20px;
  color: #888;
  font-size: 12px;
  text-align: center;
}

.tips-button {
  border-top: 1px solid #f7f7f7;

  > div {
    float: left;
    width: 50%;
    height: 50px;
    line-height: 50px;
    font-size: 18px;
    text-align: center;
  }
}

.delete-cancel {
  color: #000;
}

.delete-confirm {
  color: #d2b79c;
}
</style>
