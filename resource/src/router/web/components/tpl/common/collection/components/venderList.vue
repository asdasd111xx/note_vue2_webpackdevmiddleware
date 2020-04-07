<template>
    <div class="vendor-list clearfix">
        <span
            v-for="(vendor, vendorKey) in vendorList"
            :key="`vendor-${vendorKey}`"
            :class="['vendor', { 'is-current': curVendor === vendorKey }]"
            @click="onVendorClick(vendorKey)"
        >
            {{ getVendorName(vendor) }}
        </span>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
    props: {
        selfStore: {
            type: Object,
            required: true
        },
        storeMethods: {
            type: Object,
            required: true
        },
        parentRefs: {
            type: Object,
            required: true
        }
    },
    subscriptions() {
        return {
            curVendor: this.selfStore.curVendor$
        };
    },
    computed: {
        ...mapGetters({
            gameData: 'getGameData',
            favoriteGame: 'getFavoriteGame'
        }),
        vendorList() {
            const { gameData } = this;
            const uniVendor = [];
            const result = {
                '': this.$t('S_ALL')
            };

            this.favoriteGame.forEach((info) => {
                if (!uniVendor.includes(info.vendor)) {
                    uniVendor.push(info.vendor);
                }
            });

            Object.keys(gameData).forEach((type) => {
                if (([3, 5, 6].includes(gameData[type].kind)) && gameData[type].switch === 'Y') {
                    // 配合 rd5 api 參數，調整 type 名稱
                    const transList = {
                        bbcasino: 'bbin',
                        fg_card: 'fg'
                    };
                    const resultType = transList[type] ? transList[type] : type;

                    if (!uniVendor.includes(resultType)) {
                        return;
                    }

                    result[resultType] = `${gameData[type].vendor.split('_')[0]}_${gameData[type].kind}`;
                }
            });

            return result;
        }
    },
    methods: {
        onVendorClick(vendor) {
            // this.$vuebar.refreshScrollbar(this.parentRefs.bar);
            this.storeMethods.setCollection('curVendor$', vendor);
        },
        getVendorName(vendorKey) {
            let kind = 0;
            const kindText = {
                0: '',
                3: this.$t('S_GAME_KIND_CASINO'),
                5: this.$t('S_GAME_KIND_CARD'),
                6: this.$t('S_GAME_KIND_MJ')
            };
            const transList = {
                lg: 'xbb',
                mg2: 'mg',
                rt: 'sbg'
            };

            if (vendorKey.split('_')[1]) {
                // eslint-disable-next-line prefer-destructuring
                kind = vendorKey.split('_')[1];
            }

            return `${(transList[vendorKey.split('_')[0]] || vendorKey.split('_')[0]).toUpperCase()} ${kindText[kind]}`;
        }
    }
};
</script>

<style lang="scss" src="../css/vendorList.scss" scoped></style>
