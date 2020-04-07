<template>
    <div :class="$style['security-verify-wrap']">
        <security-verify>
            <template scope="{ title, personalData, bankCardData, directPage, close }">
                <div :class="$style['verify-header']">
                    {{ $text('S_SM_NOTE', '注意事项') }}
                    <div :class="$style['btn-close']" @click="close()">×</div>
                </div>
                <div :class="$style['verify-content']">
                    <div :class="$style['title']">{{ title }}：</div>
                    <div v-if="personalData.list.length !== 0" :class="$style['list-wrap']">
                        <div>{{ personalData.type }}</div>
                        <div
                            v-for="(item, index) in personalData.list"
                            :key="`personal-data-${index}`"
                            :class="$style['list-item']"
                        >
                            <span>{{ item.msg }}</span>
                            <span :class="$style['list-btn']" @click="directPage('accountData')">{{ $text('S_GO_NOW', '立即前往') }}</span>
                        </div>
                    </div>
                    <div v-if="bankCardData.list.length !== 0" :class="$style['list-wrap']">
                        <div>{{ bankCardData.type }}</div>
                        <div
                            v-for="(item, index) in bankCardData.list"
                            :key="`personal-data-${index}`"
                            :class="$style['list-item']"
                        >
                            <span>{{ item.msg }}</span>
                            <span :class="$style['list-btn']" @click="directPage('accountBankCard')">{{ $text('S_GO_NOW', '立即前往') }}</span>
                        </div>
                    </div>
                </div>
            </template>
        </security-verify>
    </div>
</template>

<script>
import securityVerify from '@/components/common/securityVerify';

export default {
    components: {
        securityVerify
    }
};
</script>

<style lang="scss" module>
.security-verify-wrap {
    position: relative;
    margin: 120px auto 0;
    width: 85%;
    max-width: 700px;
    border-radius: 2px;
    background-color: #FFF;
    box-shadow: 0 2px 8px rgba(0,0,0,.33);
}
.verify-header {
    position: relative;
    height: 40px;
    line-height: 40px;
    color: #FFF;
    font-size: 15px;
    text-align: center;
    background-color: #00347D;

    .btn-close {
        position: absolute;
        top: 0;
        right: 14px;
        line-height: 36px;
        color: #FADDB2;
        font-size: 24px;
    }
}
.verify-content {
    padding: 20px;
}
.title {
    color: #00347D;
}
.list-wrap {
    margin-top: 10px;
    font-size: 12px;
}
.list-item {
    margin-top: 5px;
}
.list-btn {
    display: inline-block;
    padding: 3px 5px;
    max-width: 100px;
    color: #FFF;
    vertical-align: middle;
    border-radius: 5px;
    background-color: #00347D;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
}
</style>
