<template>
    <div :class="$style['reset-container']">
        <div :class="$style.header">
            <div :class="$style['btn-prev']" @click.prevent="$router.back()">
                <img :src="$getCdnPath('/static/image/mobile/tpl/porn1/header/btn_nav_back_h.png')" />
            </div>
            <span>{{ $text('S_PASSWORD_RESET', '重设密码') }}</span>
        </div>
        <div :class="$style['reset-content']">
            <div :class="$style['form-data']">
                <div
                    v-for="field in pwdResetInfo"
                    :key="field.key"
                    :class="$style['field-wrap']"
                >
                    <div class="clearfix">
                        <div :class="$style['form-icon']">
                            <img :src="$getCdnPath(`/static/image/mobile/tpl/porn1/reset/${field.key}.png`)" />
                        </div>
                        <input
                            :id="field.key"
                            :type="field.type"
                            :name="field.key"
                            :placeholder="$t(field.text)"
                            @input="verification($event.target.id, $event.target.value)"
                        />
                    </div>
                </div>
            </div>
            <div :class="$style.submit" @click="pwdResetSubmit()">{{ $t('S_JM_SURE_SEND') }}</div>
        </div>
    </div>
</template>

<script>
import resetPwd from '@/mixins/resetPwd';

export default {
    mixins: [resetPwd]
};
</script>

<style lang="scss" module>
.reset-container {
    min-height: 100%;
    padding-top: 130px;
    background: url('/static/image/mobile/tpl/porn1/login/forget-bg.png') no-repeat center;
    background-size: cover;
}

.header {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 2;
    width: 100%;
    height: 43px;
    line-height: 43px;
    background-color: #272727;
    color: #F8F1EB;
    font-size: 16px;
    text-align: center;
}

.btn-prev {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 5%;
    width: 24px;
    height: 24px;
    margin: auto;

    > img {
        display: block;
        width: 100%;
    }
}

.reset-content {
    margin: 0 auto;
    width: 90%;
}

.form-data {
    padding: 7% 4%;
    background: rgba( #FFF, 0.5);
    border-radius: 5px;
}

.form-icon {
    float: left;
    width: 9%;
    margin-right: 3%;

    img {
        display: block;
        max-width: 100%;
    }
}

.field-wrap {
    margin-bottom: 15px;

    input {
        float: left;
        width: 88%;
        padding: 1.5% 0 4.5%;
        background: transparent;
        border: none;
        border-bottom: 1px solid rgba(0, 0, 0, 0.15);
        outline: 0;
    }
}

.submit {
    padding: 3.5% 0;
    margin-top: 25px;
    color: #FFF;
    text-align: center;
    border-radius: 35px;
    background: #955D2C;
    background: -webkit-linear-gradient(left , #955D2C ,#F3D382);
}
</style>
