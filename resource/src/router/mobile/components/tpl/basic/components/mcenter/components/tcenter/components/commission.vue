<template>
    <div :class="`mcenter-wrap theme-basic`">
        <transition name="fade" mode="out-in">
            <div class="content-main">
                <tcenter func="commission" />
            </div>
        </transition>
    </div>
</template>

<script>
import tcenter from '@/router/mobile/components/common/mcenter/theme1/tcenter';

export default {
    components: {
        tcenter
    }
};
</script>
