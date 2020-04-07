<template>
    <div :class="[$style['content-wrap'], colorClass]">
        <div :class="[$style['content-header'], 'clearfix']">
            <div :class="$style['content-time']">
                {{ EST(datalist.enable_at) }}
            </div>
        </div>
        <!-- eslint-disable vue/no-v-html -->
        <div :class="$style['content-title']" v-html="datalist.reply_title" />
        <div v-if="datalist.content" :class="$style['content-text-wrap']">
            <template v-if="datalist.type === 'mailbox'">
                <div :class="$style['content-top']" v-html="datalist.reply_content" />
                <div :class="$style['content-bottom']">
                    <span>{{ $text('S_FEEDBACK', '意见反馈') }} {{ $text('S_ADDDATE_MSG', '发送时间') }} {{ datalist.created_at }}</span>
                    <div v-html="datalist.title" />
                    <div v-html="datalist.content.replace(/\n/ig, '<br/>')" />
                </div>
            </template>
            <template v-else>
                <div :class="$style['feedback-title']" v-html="datalist.title" />
                <div v-html="datalist.content.replace(/\n/ig, '<br/>')" />
            </template>
        </div>
        <!-- eslint-enable vue/no-v-html -->
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import EST from '@/lib/EST';

export default {
    props: {
        datalist: {
            type: Object,
            default: () => {}
        }
    },
    computed: {
        ...mapGetters({
            memInfo: 'getMemInfo'
        }),
        colorClass() {
            return [
                {
                    [this.$style[`site-${this.memInfo.user.domain}`]]: this.$style[`site-${this.memInfo.user.domain}`],
                    [this.$style['preset-color']]: !this.$style[`site-${this.memInfo.user.domain}`]
                }
            ];
        }
    },
    created() {
        window.scrollTo(0, 0);
    },
    methods: {
        EST
    }
};
</script>

<style lang="scss" src="./css/index.module.scss" module />
