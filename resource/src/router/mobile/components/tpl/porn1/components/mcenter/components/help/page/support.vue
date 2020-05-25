<template>
    <mobile-container
        :header-config="headerConfig"
        :has-footer="false"
        :is-app="isApp"
        :class="$style.container"
    >
        <div slot="content">
            <div :class="$style['section']" style="margin-top: 10px">
                <div
                    v-for="(item, index) in data"
                    :id="`q-${index}`"
                    :class="[$style['cell'], $style['flex']]"
                    :key="item.key"
                    @click="
                        $router.push(
                            `/mobile/mcenter/help/detail?key=${
                                item.key
                            }&type=support${isApp ? '&app=true' : ''}`
                        )
                    "
                >
                    <div :class="$style['title-icon']">
                        <img
                            :src="
                                $getCdnPath(
                                    '/static/image/_new/mcenter/ic_help.png'
                                )
                            "
                            alt="help"
                        />
                    </div>
                    <div :class="$style['title']" style="font-weight: 400">
                        {{ item.title }}
                    </div>
                </div>
            </div>
        </div>
    </mobile-container>
</template>

<script>
import mobileContainer from "../../../../common/new/mobileContainer";
import info from "../json/support.json";

export default {
    components: {
        mobileContainer
    },
    mounted() {
        if (!info) this.$router.back();
    },
    computed: {
        isApp() {
            let isApp = !!(
                (this.$route.query && this.$route.query.app) ||
                (this.$route.query && this.$route.query.APP)
            );
            if (isApp) document.title = "技术支持";

            return isApp;
        },
        headerConfig() {
            if (!this.isApp)
                return {
                    prev: true,
                    onClick: () => {
                        this.$router.back();
                    },
                    title: this.$text("S_TECH_SUP", "技术支持")
                };
        },
        data() {
            return info.data.map(item => {
                return item;
            });
        }
    }
};
</script>

<style src="../css/index.module.scss" lang="scss" module />
