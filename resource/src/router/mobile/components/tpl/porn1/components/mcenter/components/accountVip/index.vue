<template>
    <mobile-container>
        <div slot="header" />
        <div slot="content" :class="$style['content-wrap']">
            <vip />
        </div>
    </mobile-container>
</template>

<script>
import vip from "./components/vip";
import mobileContainer from "../../../common/new/mobileContainer";

export default {
    components: {
        mobileContainer,
        vip
    }
};
</script>

<style lang="scss" module>
.content-wrap {
    padding-bottom: 60px;
    background: #eee;
}
</style>
