<template>
    <div class="reset-container">
        <div class="reset-content">
            <div class="form-data">
                <div
                    v-for="field in pwdResetInfo"
                    :key="field.key"
                    class="field-wrap"
                >
                    <div class="field-right clearfix">
                        <div class="form-icon">
                            <img :src="$getCdnPath(`/static/image/mobile/tpl/theme3/reset/${field.key}.png`)" />
                        </div>
                        <input
                            :id="field.key"
                            :type="field.type"
                            :name="field.key"
                            :placeholder="$t(field.text)"
                            class="join-input"
                            @input="verification($event.target.id, $event.target.value)"
                        />
                        <div class="pwd-reset-tip" />
                    </div>
                </div>
            </div>
            <div class="submit" @click="pwdResetSubmit()">{{ $t('S_JM_SURE_SEND') }}</div>
        </div>
    </div>
</template>

<script>
import resetPwd from '@/mixins/resetPwd';

export default {
    mixins: [resetPwd]
};
</script>

<style lang="scss" scoped>
.reset-container {
    min-height: 100vh;
    padding-top: 130px;
    background: url('/static/image/mobile/tpl/theme3/login/forget-bg.png') no-repeat center;
    background-size: cover;
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
