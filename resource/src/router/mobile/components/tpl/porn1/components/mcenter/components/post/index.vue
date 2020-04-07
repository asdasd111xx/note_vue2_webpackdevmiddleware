<template>
    <mobile-container>
        <div slot="content" :class="$style['content-wrap']">
            <post />
        </div>
    </mobile-container>
</template>

<script>
import post from '@/components/mcenter/components/post';
import mobileContainer from '../../../common/mobileContainer';

export default {
    components: {
        mobileContainer,
        post
    }
};
</script>

<style lang="scss" module>
.content-wrap {
    position: relative;
    padding: 65px 0 45px;
    background: #EEE;
    min-height: calc(100vh);
}
</style>
