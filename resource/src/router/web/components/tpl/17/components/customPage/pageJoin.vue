<template>
    <div :class="$style['page-wrap']">
        <div :class="$style['join-wrap']">
            <div :class="$style['img-wrap']">
                <img :src="$getCdnPath('/static/image/tpl/17/customPage/join/text.png')" />
            </div>
            <div :class="$style['img-wrap']">
                <img :src="$getCdnPath('/static/image/tpl/17/customPage/logo.png')" />
            </div>
            <div :class="$style['form-wrap']">
                <join-member :theme="$style">
                    <template slot="join-header" />
                </join-member>
                <div :class="$style['join-text']">
                    已经有帐号? 请
                    <span @click="changePage({ page: webInfo.alias === '500000' ? '31311' : webInfo.alias === '48' ? '10482' : '10514' })">{{ $text('S_LOGON', '登录') }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import joinMember from '../../../../page/join_member';

export default {
    components: {
        joinMember
    },
    props: {
        changePage: {
            type: Function,
            required: true
        }
    },
    computed: {
        ...mapGetters({
            webInfo: 'getWebInfo'
        })
    }
};
</script>

<style lang="scss" src="./css/join.module.scss" module></style>
