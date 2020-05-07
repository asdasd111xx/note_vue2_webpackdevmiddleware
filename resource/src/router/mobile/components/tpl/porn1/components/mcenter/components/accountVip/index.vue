<template>
    <div :class="$style['content-wrap']">
        <vip />
    </div>
</template>

<script>
import vip from "./components/vip";

export default {
    components: {
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
