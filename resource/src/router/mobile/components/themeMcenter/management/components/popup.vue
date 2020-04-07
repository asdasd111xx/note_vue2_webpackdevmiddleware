<template>
    <div :class="$style.wrap">
        <template v-if="['CODE', 'LINK'].includes(type)">
            <div :class="$style.mask" />
            <div :class="$style.content">
                <div :class="$style.icon"><img :src="$getCdnPath('/static/image/mobile/mcenter/icon_check.png')" /></div>
                <div :class="$style.text">{{ $text(`S_${type}_COPIED`) }}</div>
            </div>
        </template>
        <template v-else>
            <div :class="$style.mask" @click="$emit('close')" />
            <div :class="$style.content">
                <div :class="$style.title">QRcode</div>
                <div :class="$style.qrcode">
                    <qrcode
                        :value="link"
                        :options="{ width: 1480, height: 1480 }"
                        tag="img"
                    />
                    <div :class="$style.text">{{ $text('S_PRESS_DOWNLOAD') }}</div>
                </div>
            </div>
        </template>
    </div>
</template>

<script>
/**
 * @param {String} type - 彈窗類型
 * @param {String} link - 推廣連結
 */
export default {
    props: {
        type: {
            type: String,
            required: true
        },
        link: {
            type: String,
            required: true
        }
    }
};
</script>

<style lang="scss" src="../css/popup.scss" module></style>
