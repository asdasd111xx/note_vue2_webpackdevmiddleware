<template>
    <div :class="$style['notice-item-wrap']">
        <transition-group name="slide">
            <template v-for="msg in noticeData">
                <notice-item
                    v-if="msgType.includes(msg.type)"
                    :key="msg.id"
                    :msg="msg"
                    :is-mobile="isMobile"
                    :$notice-style="$style"
                    @deleMsg="deleMsg"
                />
            </template>
        </transition-group>
    </div>
</template>

<script>
import { mapActions } from 'vuex';
import cloneDeep from 'lodash/cloneDeep';
import isMobile from '@/lib/is_mobile';
import noticeItem from './components/noticeItem';

export default {
    components: {
        noticeItem
    },
    props: {
        noticeData: {
            type: Array,
            default: () => ([])
        }
    },
    data() {
        return {
            msgType: ['player_deposit', 'player_withdraw', 'agent_withdraw', 'player_rebate', 'player_activity', 'player_inbox', 'agent_inbox', 'all_player_inbox', 'all_agent_inbox', 'player_feedback_reply', 'agent_feedback_reply'],
            isMobile: isMobile()
        };
    },
    watch: {
        noticeData() {
            if (this.noticeData.length > 4) {
                const resultMsg = cloneDeep(this.noticeData);
                resultMsg.splice(0, 1);
                this.actionNoticeData(resultMsg);
            }
        }
    },
    methods: {
        ...mapActions([
            'actionNoticeData'
        ]),
        deleMsg(id) {
            const resultMsg = cloneDeep(this.noticeData);
            const index = resultMsg.findIndex((data) => data.id === id);
            resultMsg.splice(index, 1);
            this.actionNoticeData(resultMsg);
        }
    }
};
</script>

<style lang="scss" src="./css/index.module.scss" module="$style"></style>
