<template>
    <div :class="$style['page-wrap']">
        <div :class="[$style['page-container'], 'clearfix']">
            <transition-group name="slide-opacity-left">
                <div
                    v-for="data in imgData"
                    v-show="currentVendor === data.type"
                    :key="data.type"
                    :class="[$style[`${data.type}-img-wrap`], $style['img-wrap']]"
                >
                    <img
                        v-for="img in data.imgList"
                        :key="img"
                        :class="[$style[`${data.type}-${img}`], $style['img-wrap']]"
                        :src="$getCdnPath(`/static/image/tpl/customizeHome/500000/live/${data.type}/img_${img}.png`)"
                    />
                </div>
            </transition-group>
            <div :class="$style['vendor-wrap']">
                <div :class="$style['vendor-btn-wrap']">
                    <span
                        v-for="vendor in vendorList"
                        :key="vendor.link"
                        :class="[$style['vendor-btn'], { [$style.current]: currentVendor === vendor.link }]"
                        @click="currentVendor = vendor.link"
                    >
                        {{ vendor.text }}
                    </span>
                </div>
                <transition-group name="slide-opacity-right">
                    <div
                        v-for="vendor in vendorList"
                        v-show="currentVendor === vendor.link"
                        :key="vendor.link"
                        :class="$style['vendor-container']"
                    >
                        <img :src="$getCdnPath(`/static/image/tpl/customizeHome/500000/live/wz_${vendor.link}.png`)" />
                        <img :src="$getCdnPath(`/static/image/tpl/customizeHome/500000/live/img_tubiao_${vendor.link}.png`)" />
                        <div :class="$style.btn" @click="changePage({type: 'games', page: getVendor(vendor.link)})">{{ $text('S_PLAY_NOW', '立即游戏') }}</div>
                    </div>
                </transition-group>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        changePage: {
            type: Function,
            required: true
        }
    },
    data() {
        return {
            vendorList: [
                { text: this.$text('S_BBIN_LIVE2', 'BBIN真人'), link: 'bblive' },
                { text: this.$text('S_AG_LIVE', 'AG真人'), link: 'ag' },
                { text: this.$text('S_GD_LIVE', 'GD真人'), link: 'gd' },
                { text: this.$text('S_AB_LIVE2', 'AB真人'), link: 'ab' },
                { text: this.$text('S_BG_LIVE2', 'BG真人'), link: 'bg' },
                { text: this.$text('S_EVO_LIVE2', 'EVO真人'), link: 'evo' },
                { text: this.$text('S_MG_LIVE2', 'MG真人'), link: 'mg' },
                { text: this.$text('S_EBET_LIVE', 'EBET真人'), link: 'ebet' }
            ],
            currentVendor: 'bblive',
            imgData: [
                { type: 'ag', imgList: ['aglive', 'Chip_ag', 'greenChip_ag', 'pinkChip_ag', 'poker_ag', 'yellowChip_ag', 'people_ag'] },
                { type: 'bblive', imgList: ['bbinzrlive', 'bbin_element_1', 'bbin_element_2', 'bbin_element_3', 'bbin_element_4', 'bbin_poker_5', 'people_bbin', 'bbin_poker_4', 'bbin_poker_3', 'bbin_poker_2', 'bbin_poker_1'] },
                { type: 'gd', imgList: ['gdlive', 'poker_gd', 'chip_gd', 'chip_l_gd', 'chip_r_gd', 'clock_gd', 'poker_r_gd', 'people_gd'] },
                { type: 'ab', imgList: ['ablive', 'chip_allbet', 'people_allbet', 'poker1_allbet', 'poker2_allbet', 'poker3_allbet', 'poker4_allbet', 'poker5_allbet', 'poker6_allbet', 'poker7_allbet', 'poker8_allbet'] },
                { type: 'bg', imgList: ['bglive', 'chip_l_bg', 'chip_r_bg', 'dice_l_bg', 'dice_s_bg', 'poker_r_bg', 'poker_l_bg', 'people_bg'] },
                { type: 'evo', imgList: ['evolive', 'diamond', 'heart', 'people_evo'] },
                { type: 'mg', imgList: ['mglive', 'gold01', 'gold02', 'gold03', 'people_mg'] },
                { type: 'ebet', imgList: ['ebetlive', 'dice01', 'dice02', 'people_ebet'] }
            ]
        };
    },
    methods: {
        getVendor(vendor) {
            if (vendor === 'mg') {
                return 'mg_live';
            }

            return vendor;
        }
    }
};
</script>

<style lang="scss" src="./css/pageLive.module.scss" module></style>
