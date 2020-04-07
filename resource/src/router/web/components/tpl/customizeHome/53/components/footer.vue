<template>
    <div class="footer">
        <div class="footer-container">
            <div class="footer-info clearfix">
                <div class="footer-license">
                    <h3 class="footer-title">{{ $text('S_OPERATING_LICENSE', '运营牌照') }}</h3>
                    <div class="footer-license-list clearfix">
                        <div class="footer-license-item">
                            <p>{{ $text('S_UNITED_KINGDOM', '英国Gambling') }}</p>
                            <p>{{ $text('S_LICENSE', 'Commission牌照') }}</p>
                            <img :src="$getCdnPath('/static/image/tpl/customizeHome/53/footer-logo-01.png')" />
                        </div>
                        <div class="footer-license-item">
                            <p>{{ $text('S_PHILIPPINES', '菲律宾Pagcor') }}</p>
                            <p>{{ $text('S_GAMING_LICENSE', '博彩执照') }}</p>
                            <img :src="$getCdnPath('/static/image/tpl/customizeHome/53/footer-logo-02.png')" />
                        </div>
                    </div>
                </div>
                <div class="footer-pay">
                    <h3 class="footer-title">{{ $text('S_COOPERATIVE_PAYMENT', '合作支付') }}</h3>
                    <div class="footer-pay-list clearfix">
                        <div
                            v-for="(item, index) in payimg"
                            :key="`payimg-${index}`"
                            class="footer-pay-item"
                        >
                            <img :src="$getCdnPath(item)" />
                        </div>
                    </div>
                </div>
            </div>
            <ul class="footer-menu">
                <li
                    v-for="(item, index) in list"
                    :key="`footer-link-${index}`"
                    class="footer-menu-item"
                >
                    <span v-if="item.link" @click="$router.push(`/page/${item.link}`)">{{ item.name }}</span>
                    <a
                        v-else
                        href="https://f-iledong.iledong.com/login"
                        target="_blank"
                    >{{ item.name }}</a>
                </li>
            </ul>
        </div>
        <div class="footer-copyright">Copyright © {{ memInfo.config.domain_name[$i18n.locale] }} Reserved</div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
    data() {
        return {
            payimg: [
                '/static/image/tpl/customizeHome/53/footer-pay-03.png',
                '/static/image/tpl/customizeHome/53/footer-pay-02.png',
                '/static/image/tpl/customizeHome/53/footer-pay-04.png',
                '/static/image/tpl/customizeHome/53/footer-pay-05.png',
                '/static/image/tpl/customizeHome/53/footer-pay-06.png',
                '/static/image/tpl/customizeHome/53/footer-pay-07.png'
            ],
            list: [
                {
                    name: this.$text('S_ABOUT_US', '关于我们'),
                    link: '12171'
                },
                {
                    name: this.$text('S_HELP_CENTER', '帮助中心'),
                    link: '12180'
                },
                {
                    name: this.$text('S_CONTACT_US', '联系我们'),
                    link: '12174'
                }
            ]
        };
    },
    computed: {
        ...mapGetters({
            memInfo: 'getMemInfo'
        })
    }
};
</script>

<style lang="scss" src="../css/footer.scss" scoped />
