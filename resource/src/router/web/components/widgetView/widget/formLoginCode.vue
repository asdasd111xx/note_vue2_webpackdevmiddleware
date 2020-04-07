<template>
    <widget-container :is-new="!!widgetsInfo[currentIndex].newWidget">
        <div v-if="isBackEnd" :class="$style['back-end-view']" />
        <img
            v-else-if="unit.formLoginCode"
            :src="unit.formLoginCode"
            :class="$style.code"
            @click="onImgClick"
        />
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
        codeUrl() {
            return this.unit.formLoginCode;
        }
    },
    created() {
        this.$emit('update:unit', {
            ...this.unit, formLoginCode: ''
        });
    },
    methods: {
        onImgClick() {
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
.back-end-view {
    background-color: #666;
    width: 100%;
    height: 100%;
}

.code {
    background-color: #000;
    width: 100%;
    height: 100%;
}
</style>
