<template>
    <transition name="loading">
        <div
            v-if="isShow"
            :style="bgStyle"
            class="init-loading-bg"
        >
            <div class="init-loading-wrap">
                <div :style="roundStyle" class="loading-round" />
                <div :style="textStyle" class="loading-text">LOADING...</div>
            </div>
        </div>
    </transition>
</template>

<script>
export default {
    props: {
        isShow: {
            type: Boolean,
            default: false
        },
        bgColor: {
            type: String,
            default: 'transparent'
        },
        roundColor: {
            type: String,
            default: '#000'
        },
        textColor: {
            type: String,
            default: '#000'
        }
    },
    computed: {
        bgStyle() {
            return {
                'background-color': this.bgColor
            };
        },
        roundStyle() {
            return {
                'border-top-color': this.roundColor,
                'border-right-color': this.roundColor,
                'border-bottom-color': this.roundColor
            };
        },
        textStyle() {
            return {
                color: this.textColor
            };
        }
    }
};
</script>

<style lang="scss" scoped>
.init-loading-bg {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 100;
    transition: opacity .8s ease;

    &.loading-leave-active {
        opacity: 0;
    }
}

.init-loading-wrap {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    margin:  auto;
    height: 72px;
    text-align: center;

    .loading-round {
        width: 44px;
        height: 44px;
        border-radius: 50%;
        margin: 0 auto;
        border-width: 3px;
        border-style: solid;
        border-left: 3px solid transparent;
        animation: outRound 1s linear infinite running;
    }

    .loading-text {
        margin-top: 8px;
    }

    @keyframes outRound {
        0% {
            transform: rotate(120deg)
        }
        100% {
            transform: rotate(-240deg)
        }
    }
}
</style>
