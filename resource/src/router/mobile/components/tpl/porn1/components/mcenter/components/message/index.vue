<template>
    <mobile-container>
        <div slot="content" :class="$style['content-wrap']">
            <message />
        </div>
    </mobile-container>
</template>

<script>
import message from '@/components/mcenter/components/message';
import mobileContainer from '../../../common/mobileContainer';

export default {
    components: {
        mobileContainer,
        message
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
