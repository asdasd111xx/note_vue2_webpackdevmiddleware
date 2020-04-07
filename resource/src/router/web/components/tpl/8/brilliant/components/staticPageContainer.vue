<template>
    <div class="main-wrap brilliant">
        <div class="normal-page">
            <slot />
            <div class="page-bottom" />
        </div>
        <!-- eslint-disable vue/html-indent -->
        <v-style>
            .brilliant .normal-page[{{ this.$options._scopeId }}] {
                background: url({{ $getCdnPath('/static/image/tpl/8/container_bg_y.png') }}) repeat-y left top;
            }

            .main-wrap.brilliant[{{ this.$options._scopeId }}] {
                background: url({{ $getCdnPath('/static/image/tpl/8/main_bg.png') }}) no-repeat center bottom;
            }

            .brilliant .page-bottom[{{ this.$options._scopeId }}] {
                background: url({{ $getCdnPath('/static/image/tpl/8/container_bg_bottom.png') }}) repeat-y 50% 0;
            }
        </v-style>
        <!-- eslint-enable vue/html-indent -->
    </div>
</template>

<style lang="scss" scoped>
.brilliant {
    padding-bottom: 34px;
}

.normal-page {
    border: 1px solid #382A2B;
    border-radius: 4px;
    border-top: none;
}

.page-bottom {
    height: 24px;
}
</style>
