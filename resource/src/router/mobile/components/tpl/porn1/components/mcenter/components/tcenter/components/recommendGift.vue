<template>
    <div :class="$style['content-wrap']" :style="{ height: divHeight + 'px' }">
        <tcenter func="recommendGift" />
    </div>
</template>

<script>
import tcenter from "@/router/mobile/components/common/mcenter/theme1/tcenter";

export default {
    components: {
        tcenter
    },
    data() {
        return {
            divHeight: 0
        };
    },
    mounted() {
        this.divHeight = document.body.offsetHeight;
    }
};
</script>

<style lang="scss" module>
@import "@/css/variable.scss";

.content-wrap {
    padding-top: 43px;
    background-color: $main_background_white1;
}
</style>
