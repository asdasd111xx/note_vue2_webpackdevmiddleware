<template>
    <div :class="$style['pop-verify']" @click.self="$emit('close')">
        <div :class="$style.wrap">
            <div :class="$style['title-wrap']">
                <div :class="$style.title">{{ title }}</div>
                <div :class="$style.close" @click.stop="$emit('close')">
                    <icon
                        name="times"
                        width="19"
                        height="19"
                    />
                </div>
            </div>
            <div :class="$style['content-wrap']">
                <div :class="[$style['input-field'], { clearfix: currentVerify === 'phone' }]">
                    <input
                        v-if="currentVerify === 'phone'"
                        v-model="countryCode"
                        :class="$style['country-code']"
                        :placeholder="$text('S_COUNTRY_CODE', '国码')"
                        type="text"
                        disabled="disabled"
                    />
                    <input
                        v-model="value"
                        :class="$style[currentVerify]"
                        :placeholder="title"
                        type="text"
                        disabled="disabled"
                    />
                    <div :class="[$style['btn-verify'], { [$style.disabled]: second }]" @click="$emit('send', getCount, status)">
                        <template v-if="second">{{ $text('S_SEND_CHECK_CODE_ALREADY', '验证码已发送') }}(<span>{{ second }}</span>)</template>
                        <template v-else>{{ $text('S_SEND_CHECK_CODE', '发送验证码') }}</template>
                    </div>
                </div>
                <div :class="$style['input-field']">
                    <input
                        v-model="keyring"
                        :class="$style.keyring"
                        :placeholder="$text('S_CHECK_CODE', '验证码')"
                        type="text"
                    />
                </div>
                <!-- eslint-disable vue/no-v-html -->
                <div
                    v-if="!isMobile && verifyTips"
                    :class="$style.tips"
                    v-html="verifyTips"
                />
                <div :class="$style['btn-submit']" @click="$emit('verify', keyring)">{{ $text('S_JM_SURE_SEND', '确认送出') }}</div>
                <div
                    v-if="isMobile && verifyTips"
                    :class="$style.tips"
                    v-html="verifyTips"
                />
                <!-- eslint-enable vue/no-v-html -->
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import capitalize from 'lodash/capitalize';
import ajax from '@/lib/ajax';
import isMobile from '@/lib/is_mobile';

export default {
    props: {
        type: {
            type: String,
            required: true
        },
        currentVerify: {
            type: String,
            required: true
        },
        value: {
            type: String,
            required: true
        },
        oldValue: {
            type: String,
            required: true
        },
        countryCode: {
            type: String,
            required: true
        },
        verifyTips: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            isMobile: isMobile(),
            keyring: '',
            second: 0,
            timer: null,
            status: false
        };
    },
    computed: {
        ...mapGetters({
            siteConfig: 'getSiteConfig'
        }),
        $style() {
            if (this.isMobile) {
                if (this.siteConfig.MOBILE_WEB_TPL === 'brilliant') {
                    return this[`$style${capitalize(this.siteConfig.MOBILE_WEB_TPL)}${capitalize(this.siteConfig.MOBILE_COLOR)}`];
                }

                return this.$styleBasic;
            }

            if (this.siteConfig.JOIN_MEMBER_THEME === 'default') {
                return this.$styleBasic;
            }

            return this[`$style${capitalize(this.siteConfig.JOIN_MEMBER_THEME)}Yellow`];
        },
        title() {
            return this.currentVerify === 'email' ? this.$text('S_E_MAIL', '电子邮箱') : this.$text('S_TEL', '手机号码');
        }
    },
    created() {
        this.getCount();
    },
    beforeDestroy() {
        if (!this.timer) {
            return;
        }

        clearInterval(this.timer);
    },
    methods: {
        getCount() {
            if (this.status) {
                return;
            }

            this.status = true;
            ajax({
                method: 'get',
                url: `/api/v1/c/${this.type}/register/${this.currentVerify}/ttl`,
                success: ({ result, ret }) => {
                    if (result !== 'ok' || ret === 0) {
                        this.status = false;
                        return;
                    }

                    this.second = ret;
                    this.timer = setInterval(() => {
                        if (this.second === 0) {
                            clearInterval(this.timer);
                            this.$emit('clear');
                            this.status = false;
                            this.timer = null;
                            return;
                        }

                        this.second -= 1;
                    }, 1000);
                },
                fail: () => {
                    this.status = false;
                }
            });
        }
    }
};
</script>

<style lang="scss" src="./css/basic.module.scss" module="$styleBasic"></style>
<style lang="scss" src="./css/brilliantBluePurple.module.scss" module="$styleBrilliantBluepurple"></style>
<style lang="scss" src="./css/brilliantYellow.module.scss" module="$styleBrilliantYellow"></style>
