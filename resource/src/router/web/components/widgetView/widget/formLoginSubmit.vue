<template>
    <widget-container :is-new="!!widgetsInfo[currentIndex].newWidget">
        <div
            :class="$style.button"
            :style="buttonStyle"
            @click="submit"
        >
            {{ widgetsInfo[currentIndex].btnText[curLang] }}
        </div>
    </widget-container>
</template>

<script>
import { mapGetters } from 'vuex';
import member from '@/api/member';
import widgetContainer from './common/widgetContainer';

export default {
    components: {
        widgetContainer
    },
    props: {
        currentIndex: {
            type: Number,
            required: true
        },
        widgetsInfo: {
            type: Array,
            default: () => []
        },
        updateInfo: {
            type: Function,
            required: true
        },
        unit: {
            type: Object,
            required: true
        }
    },
    computed: {
        ...mapGetters({
            isBackEnd: 'getIsBackEnd',
            curLang: 'getCurLang',
            cdnDomain: 'getCdnDomain'
        }),
        buttonStyle() {
            const {
                fontColor, fontSize, radius, borderColor, borderWidth, bgColor, useImage, image
            } = this.widgetsInfo[this.currentIndex];
            const background = useImage === 'Y'
                ? `url(${this.cdnDomain + image}) 50% 50% no-repeat`
                : `rgba(${bgColor.r}, ${bgColor.g}, ${bgColor.b}, ${bgColor.a})`;

            return {
                color: `rgba(${fontColor.r}, ${fontColor.g}, ${fontColor.b}, ${fontColor.a})`,
                'font-size': `${fontSize}px`,
                'border-color': `rgba(${borderColor.r}, ${borderColor.g}, ${borderColor.b}, ${borderColor.a})`,
                'border-radius': `${radius}px`,
                'border-width': `${borderWidth}px`,
                'line-height': `${this.widgetsInfo[this.currentIndex].h}px`,
                background
            };
        }
    },
    created() {
        this.$emit('update:unit', {
            ...this.unit, formLoginSubmit: this.submit
        });
    },
    methods: {
        submit() {
            if (this.isBackEnd) {
                return;
            }

            const { formLoginAccount, formLoginPassword, formLoginCaptcha } = this.unit;

            member.login({
                params: {
                    username: formLoginAccount,
                    password: formLoginPassword,
                    captcha_text: formLoginCaptcha
                },
                success: () => {
                    member.announcement({
                        success: (response) => {
                            if (response.result === 'ok') {
                                response.ret.forEach((post) => {
                                    alert(post.content);
                                });
                            }
                        }
                    }).then(() => {
                        window.location.reload();
                    });
                },
                fail: () => {
                    this.$emit('update:unit', {
                        ...this.unit,
                        formLoginCaptcha: ''
                    });
                }
            });
        }
    }
};
</script>

<style lang="scss" module>
.button {
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    text-align: center;
    border-style: solid;
    cursor: pointer;
}
</style>
