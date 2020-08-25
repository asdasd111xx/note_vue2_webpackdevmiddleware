<template>
    <transition name="fade">
        <div :class="`account-pop-wrap ${select.position} ${select.type}`">
            <template v-if="!select.closeBtnHide">
                <div class="close-btn" @click="actionSetPop()">×</div>
            </template>
            <div :class="`account-pop-title ${select.type}`">
                {{ title }}
            </div>
            <div :class="`account-pop-content ${select.key}`">
                <bind
                    v-if="select.type === 'bind'"
                    :select="select"
                    :data="selectData"
                />
                <edit v-if="select.type === 'edit'" :select="select" />
                <password v-if="select.type === 'password'" :select="select" />
                <withdraw-pwd
                    v-if="select.type === 'withdrawPwd'"
                    :select="select"
                    :data="selectData"
                />
                <vip v-if="select.type === 'vip'" :select="select" />
                <nickname v-if="select.type === 'alias'" :select="select" />
            </div>
        </div>
    </transition>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
    components: {
        bind: () => import(/* webpackChunkName: 'bind' */'./bind'),
        edit: () => import(/* webpackChunkName: 'edit' */'./edit'),
        password: () => import(/* webpackChunkName: 'password' */'./password'),
        withdrawPwd: () => import(/* webpackChunkName: 'withdrawPwd' */'./withdraw_pwd'),
        vip: () => import(/* webpackChunkName: 'vip' */'./vip'),
        nickname: () => import(/* webpackChunkName: 'nickname' */'./nickname')
    },
    props: {
        select: {
            type: Object,
            default: () => ({})
        }
    },
    data() {
        return {
            selectData: {}
        };
    },
    computed: {
        ...mapGetters({
            memInfo: 'getMemInfo',
            agentInfo: 'getAgentInfo'
        }),
        title() {
            if (this.select.popTitle) {
                return this.$text(this.select.popTitle);
            }

            if (this.select.type === 'bind' || !this.select.btnText) {
                return this.$text(this.select.text);
            }

            return `${this.$text(this.select.text)}${this.select.btnText}`;
        }
    },
    created() {
        if (this.select.position === 'member') {
            this.selectData = this.memInfo;
        } else {
            this.selectData = this.agentInfo;
        }
    },
    methods: {
        ...mapActions([
            'actionSetPop'
        ])
    }
};
</script>

<style lang="scss" src="../../css/account/index.scss" scoped></style>
