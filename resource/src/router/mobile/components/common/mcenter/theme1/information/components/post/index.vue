<template>
    <div v-if="hasReceive" :class="[$style['post-wrap'], colorClass]">
        <template v-if="!currentData">
            <div v-if="isPostValid">
                <div
                    v-for="(item, index) in popData"
                    :key="`post-item-${index}`"
                    :class="$style['post-item']"
                    @click="$router.push(`/mobile/mcenter/information/post/${item.id}`)"
                >
                    <div :class="[$style['post-item-top'], 'clearfix']">
                        <div :class="[$style['post-item-category'], item.category === 2 || item.category === 4 ? $style['is-important'] : '']">
                            {{ $text(popupData[index]) }}
                        </div>
                        <div :class="$style['post-item-time']">
                            {{ EST(item.enable_at) }}
                        </div>
                    </div>
                    <div :class="$style['post-item-title']">
                        {{ item.title }}
                    </div>
                </div>
            </div>
            <div v-if="!isPostValid" :class="$style['no-post-notice']">
                {{ $text('S_HAS_NOT_HOT_NEWS', '無公告') }}
            </div>
        </template>
        <context
            v-else
            :datalist="currentData"
            :imglist="eleImg"
            :title="contextTitle"
            @onLinkTo="onLinkTo"
        />
    </div>
</template>

<script>
import EST from '@/lib/EST';
import mixin from '@/mixins/mcenter/post';
import { mapGetters } from 'vuex';

export default {
    components: {
        context: () => import(/* webpackChunkName: 'commonContext' */ './components/context')
    },
    mixins: [mixin],
    computed: {
        ...mapGetters({
            memInfo: 'getMemInfo',
        }),
        colorClass() {
            return [
                {
                    [this.$style[`site-${this.memInfo.user.domain}`]]: this.$style[`site-${this.memInfo.user.domain}`],
                    [this.$style['preset-color']]: !this.$style[`site-${this.memInfo.user.domain}`]
                }
            ];
        },
        currentData() {
            if (!this.$route.params.pid) {
                return false;
            }

            return this.popData.find((item) => item.id === this.$route.params.pid);
        },
        contextTitle() {
            if (this.$route.params.pid) {
                const title = this.popupData[this.popData.findIndex((item) => item.id === this.$route.params.pid)];
                return this.$text(title);
            }

            return '';
        },
        isPostValid() {
            return this.popData.length !== 0;
        }
    },
    watch: {
        currentData() {
            this.$emit('changeTitle', this.currentData ? this.$text('S_HOT_NEWS', '公告') : this.$text('S_MSG_CENTER', '信息中心'));
        }
    },
    methods: {
        EST
    }
};
</script>

<style lang="scss" src="./css/index.module.scss" module />
