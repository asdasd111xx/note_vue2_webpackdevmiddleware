<template>
    <div class="top-info clearfix">
        <div class="logo">
            <router-link
                v-if="!webInfo.m_logo"
                tag="span"
                to="/mobile"
            >
                LOGO
            </router-link>
            <router-link
                v-else
                :src="$getCdnPath(logoPath)"
                tag="img"
                to="/mobile"
            />
        </div>
        <div class="info">
            <div class="user-name">{{ memInfo.user.show_alias ? memInfo.user.alias : memInfo.user.username }}</div>
            <div class="total" @click="showBalance = !showBalance">
                {{ memBalance.total }} {{ memCurrency }}&nbsp;
                <template v-if="hasCollection">
                    <img v-show="!showBalance" :src="$getCdnPath('/static/image/mobile/mcenter/btn_center_open.png')" />
                    <img v-show="showBalance" :src="$getCdnPath('/static/image/mobile/mcenter/btn_center_close.png')" />
                </template>
            </div>
        </div>
        <div v-if="showBalance" class="balance-wrap">
            <div
                v-for="(item, vendor) in memBalance.vendor"
                :key="vendor"
                class="balance-item clearfix"
            >
                <div class="col-vendor">{{ item.text }}：</div>
                <div class="col-balance">
                    <template v-if="item.maintain">
                        <font color="red">{{ $t('S_MAINTAIN') }}</font>
                    </template>
                    <template v-else>
                        {{ item.amount }}
                    </template>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
    data() {
        return {
            showBalance: false
        };
    },
    computed: {
        ...mapGetters({
            webInfo: 'getWebInfo',
            cdnDomain: 'getCdnDomain',
            memInfo: 'getMemInfo',
            memCurrency: 'getMemCurrency',
            memBalance: 'getMemBalance'
        }),
        logoPath() {
            return `${this.cdnDomain}${this.webInfo.m_logo}`;
        },
        hasCollection() {
            return typeof this.memBalance.total !== 'undefined';
        }
    }
};
</script>

<style lang="scss" src="../css/topInfo.scss" scoped></style>
