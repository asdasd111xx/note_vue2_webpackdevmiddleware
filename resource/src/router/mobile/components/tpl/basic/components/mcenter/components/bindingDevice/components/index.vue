<template>
    <div :class="`mcenter-wrap theme-basic`">
        <transition name="fade" mode="out-in">
            <div class="content-main">
                <binding-device />
            </div>
        </transition>
    </div>
</template>

<script>
import bindingDevice from '@/router/mobile/components/common/mcenter/theme1/bindingDevice';

export default {
    components: {
        bindingDevice
    }
};
</script>
