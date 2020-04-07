<template>
    <div :class="$style['deposit-popup-wrap']" @click.self="$emit('close', false, '')">
        <div :class="$style.wrap">
            <div :class="$style.title">{{ title }}</div>
            <div :class="$style.qrcode">
                <img :src="value" />
            </div>
            <div :class="$style.tips">{{ $text('S_PRESS_DOWNLOAD', '长按下载图片') }}</div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        value: {
            type: String,
            required: true
        },
        title: {
            type: String,
            default: ''
        }
    }
};
</script>

<style lang="scss" module>
.deposit-popup-wrap {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 200;
    background-color: rgba(0, 0, 0, 0.5);
    color: #FFF;
}

.wrap {
    overflow: hidden;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    width: 212px;
    height: 212px;
    margin: auto;
    border-radius: 5px;
    background-color: #161616;
}

.title {
    margin: 11px 0;
    color: #00D96D;
    font-size: 17px;
    text-align: center;
}

.qrcode {
    width: 132px;
    height: 132px;
    margin: 0 auto;

    > img {
        display: block;
        width: 100%;
    }
}

.tips {
    margin: 10px 0;
    color: #F4D8AF;
    font-size: 14px;
    text-align: center;
}
</style>
