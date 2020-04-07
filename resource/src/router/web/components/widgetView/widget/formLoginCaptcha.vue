<template>
    <widget-container :is-new="!!widgetsInfo[currentIndex].newWidget">
        <input
            v-model="inputVal"
            :class="$style.input"
            :style="inputStyle"
            :placeholder="widgetsInfo[currentIndex].placeholderText[curLang]"
            type="text"
            @focus="onFocus"
            @keydown.13="unit.formLoginSubmit"
        />
        <!-- eslint-disable vue/html-indent -->
        <v-style>
            .{{ $style.input }}::placeholder {
                color: rgba({{ widgetsInfo[currentIndex].fontColor.r }}, {{ widgetsInfo[currentIndex].fontColor.g }}, {{ widgetsInfo[currentIndex].fontColor.b }}, {{ widgetsInfo[currentIndex].fontColor.a }})
            }
        </v-style>
        <!-- eslint-enable vue/html-indent -->
    </widget-container>
</template>

<script>
import { mapGetters } from 'vuex';
import common from '@/api/common';
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
        inputVal: {
            get() {
                return this.unit.formLoginCaptcha;
            },
            set(value) {
                this.$emit('update:unit', {
                    ...this.unit, formLoginCaptcha: value
                });
            }
        },
        inputStyle() {
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
                background
            };
        }
    },
    created() {
        this.$emit('update:unit', {
            ...this.unit,
            formLoginCaptcha: ''
        });
    },
    methods: {
        onFocus() {
            if (this.isBackEnd) {
                return;
            }

            common.captcha({
                success: (response) => {
                    this.$emit('update:unit', {
                        ...this.unit,
                        formLoginCode: response.ret
                    });
                }
            });
        }
    }
};
</script>

<style lang="scss" module>
.input {
    box-sizing: border-box;
    outline: none;
    padding-left: 10px;
    width: 100%;
    height: 100%;
    border: none;
    border-style: solid;
}
</style>
