<template>
    <div :class="[$style['content-wrap'], colorClass]">
        <div :class="[$style['content-header'], 'clearfix']">
            <div :class="$style['content-time']">
                {{ EST(datalist.sent_at) }}
            </div>
        </div>
        <!-- eslint-disable vue/no-v-html -->
        <div :class="$style['content-title']" v-html="datalist.title" />
        <div v-if="datalist.content" :class="$style['content-text-wrap']">
            <div :class="$style['content-text']" v-html="datalist.content.replace(/\n/ig, '')" />
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
