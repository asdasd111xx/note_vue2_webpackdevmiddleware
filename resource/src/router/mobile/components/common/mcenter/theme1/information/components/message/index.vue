<template>
    <div v-if="hasReceive" :class="[$style['message-wrap'], colorClass]">
        <template v-if="!currentData">
            <div v-if="isMessageValid">
                <div :class="[$style['message-delete-wrap'], 'clearfix']">
                    <div
                        :class="[$style['message-cancel'], { [$style.active] : deleteStatus } ]"
                        @click="deleteStatus = false, deletelist = []"
                    >
                        <span :class="$style['message-cancel-text']">{{ $text('S_CANCEL', '取消') }}</span>
                    </div>
                    <div v-if="filterMessageData.length" :class="$style['message-delete']" @click="selectDeleteData">
                        <icon
                            name="regular/trash-alt"
                            width="24"
                            height="21"
                        />
                    </div>
                </div>
                <div
                    v-for="(item, index) in filterMessageData"
                    :key="`message-item-${index}`"
                    :class="[$style['message-item'], { [$style.active] : deleteStatus }, { [$style['no-read']] : !item.read } ]"
                    @click="getCurrentMassage(item.id, index)"
                >
                    <div
                        v-if="deleteStatus"
                        :class="$style['message-item-check']"
                        @click="changeStatus(item.id)"
                    >
                        <img :src="`/static/image/mobile/mcenter/btn_check_${deletelist.includes(item.id)? 's' : 'n'}.png`" />
                    </div>
                    <div :class="[$style['message-item-top'], 'clearfix']">
                        <div :class="$style['message-item-category']">
                            {{ msgTypeOptions[item.kind].text }}
                        </div>
                        <div :class="$style['message-item-time']">
                            {{ EST(item.sent_at) }}
                        </div>
                    </div>
                    <!-- eslint-disable vue/no-v-html -->
                    <div :class="$style['message-item-title']" v-html="item.title" />
                    <!-- eslint-enable vue/no-v-html -->
                </div>
            </div>
            <div v-if="!isMessageValid" :class="$style['no-message-notice']">
                {{ $text('S_HAS_NOT_MESSAGE', '無站內信') }}
            </div>
        </template>
        <context
            v-else
            :datalist="currentData"
        />
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import EST from '@/lib/EST';
import mixin from '@/mixins/mcenter/message';

export default {
    components: {
        context: () => import(/* webpackChunkName: 'commonContext' */ './components/context')
    },
    mixins: [mixin],
    data() {
        return {
            deletelist: [],
            deleteStatus: false
        };
    },
    computed: {
        ...mapGetters({
            siteConfig: 'getSiteConfig',
            memInfo: 'getMemInfo',
        }),
        currentData() {
            if (!this.$route.params.pid) {
                return false;
            }

            return this.filterMessageData.find((item) => item.id === this.$route.params.pid);
        },
        isMessageValid() {
            return this.filterMessageData.length !== 0;
        },
        colorClass() {
            return [
                {
                    [this.$style[`site-${this.memInfo.user.domain}`]]: this.$style[`site-${this.memInfo.user.domain}`],
                    [this.$style['preset-color']]: !this.$style[`site-${this.memInfo.user.domain}`]
                }
            ];
        }
    },
    watch: {
        currentData() {
            this.$emit('changeTitle', this.currentData ? this.$text('S_PERSONAL_MESSAGE', '站内信') : this.$text('S_MSG_CENTER', '信息中心'));
        }
    },
    methods: {
        changeStatus(id) {
            if (!this.deletelist.includes(id)) {
                this.deletelist.push(id);
                return;
            }

            this.deletelist.splice(this.deletelist.indexOf(id), 1);
        },
        getCurrentMassage(id, index) {
            if (this.deleteStatus) return;

            this.selectMessage(id, index);
            this.$router.push(`/mobile/mcenter/information/message/${id}`);
        },
        selectDeleteData() {
            if (!this.deleteStatus) {
                this.deleteStatus = true;
                return;
            }

            this.deleteStatus = false;

            if (this.deletelist.length === 0) {
                return;
            }

            if (this.deletelist.length === 1) {
                this.deleteMessgae(this.deletelist[0]);
                return;
            }

            this.deleteMessgaes(this.deletelist);
        },
        EST
    }
};
</script>

<style lang="scss" src="./css/index.scss" module />
