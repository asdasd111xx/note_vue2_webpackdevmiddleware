<template>
    <mobile-container :header-config="headerConfig" :has-footer="false">
        <div slot="content" :class="$style['content-wrap']">
            <bonus />
        </div>
    </mobile-container>
</template>

<script>
import { mapGetters } from "vuex";
import mobileContainer from "../../../common/mobileContainer";
import bonus from "./components/index";

export default {
    components: {
        mobileContainer,
        bonus
    },
    data() {
        return {};
    },
    computed: {
        headerConfig() {
            return {
                prev: true,
                title: this.$text("S_BONUS", "紅利彩金"),
                onClick: () => {
                    this.$router.back();
                }
            };
        }
    },
    created() {}
};
</script>
<style lang="scss" module>
.content-wrap {
    background: #f8f8f7;
    min-height: calc(100vh - 43px);
    position: relative;
    padding-top: 50px;
}
</style>
