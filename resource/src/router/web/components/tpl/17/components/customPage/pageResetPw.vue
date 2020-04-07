<template>
    <div class="page-wrap">
        <div class="form-wrap">
            <div class="title">{{ $t('S_PASSWORD_RESET') }}</div>
            <div class="form-content">
                <div class="field-frame-wrap">
                    <div
                        v-for="field in pwdResetInfo"
                        :key="field.key"
                        class="field-wrap"
                    >
                        <div class="input-wrap clearfix">
                            <label :for="field.key">
                                {{ $t(field.text) }}
                            </label>
                            <input
                                :id="field.key"
                                :type="field.type"
                                :name="field.key"
                                class="join-input"
                                @input="verification($event.target.id, $event.target.value)"
                            />
                            <div class="pwd-reset-tip" />
                        </div>
                    </div>
                </div>
                <div class="join-btn" @click="pwdResetSubmit()">
                    {{ $t('S_JM_SURE_SEND') }}
                </div>
            </div>
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
.page-wrap {
    height: 1040px;
    padding-top: 120px;
    background: url('/static/image/tpl/17/customPage/forgetPw/forget_bg.jpg') 0 0/cover no-repeat;
}

.form-wrap {
    width: 1200px;
    height: 565px;
    margin: 120px auto 0;
    background: #FFF;
    box-shadow: 0 12px 27px 19px rgba(0,0,0,.04);
    border-radius: 10px;
}

.title {
    padding: 40px 0 0 40px;
    font-size: 18px;
    font-weight: 500;
}

.form-content {
    width: 356px;
    margin: 35px auto 0;
}

.input-wrap {
    margin-bottom: 25px;

    label {
        float: left;
        width: 70px;
        margin-right: 15px;
        font-size: 14px;
        color: #333;
        line-height: 40px;
        text-align: right;
    }

    .join-input {
        float: left;
        width: 260px;
        height: 40px;
        border: 1px solid #E3E3E3;
        border-radius: 2px;
        padding: 0 8px;
        background: none;
        color: #333;
        font-size: 14px;

        &:hover {
            border: 1px solid #000;
        }

        &:focus {
            outline: none;
            border: 1px solid #C39E51;
        }

        &::placeholder {
            color: #E3E3E3;
        }
    }

    .pwd-reset-tip {
        float: left;
        width: 356px;
        margin-top: 10px;
        text-align: center;
        color: #C39E51;
    }
}

.join-btn {
    float: right;
    width: 260px;
    height: 40px;
    margin-right: 11px;
    border-radius: 20px;
    background: linear-gradient(270deg, #955D2C, #F3D382);
    box-shadow: 0 10px 20px 6px rgba(145, 87, 40, 0.4);
    font-size: 14px;
    color: #FFF;
    text-align: center;
    line-height: 40px;
    cursor: pointer;

    &:hover {
        background: linear-gradient(270deg,#F3D382,#955D2C);
    }
}
</style>
