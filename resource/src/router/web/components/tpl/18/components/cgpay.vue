<template>
    <div class="cgpay-wrap">
        <img class="cgpay-bg" src="/static/image/tpl/18/cgpay/bg_cgpay_help.jpg" />
        <div class="cgpay-help" @click="goCGPay()" />
    </div>
</template>

<script>
export default {
    methods: {
        goCGPay() {
            window.open('/cgPay', 'cgPay');
        }
    }
};
</script>

<style lang="scss" scoped>
.cgpay-wrap {
    position: relative;
    width: 100%;
    background-color: #FFF;
}
.cgpay-bg{
    width: 100%;
    height: auto;
}

.cgpay-help{
    position: absolute;
    width: 16.5%;
    height: 7%;
    left: 30%;
    top: 45%;
    background-image:url('/static/image/tpl/18/cgpay/btn_cgpay_help.png');
    background-repeat: no-repeat;
    background-size:contain;
    box-sizing:border-box;
    color:rgba(0, 0, 0, 0.87);
    cursor:pointer;
    display:block;
    line-height:19.999px;
    text-size-adjust:100%;
    word-break:break-all;
    &:hover {
        background-image:url('/static/image/tpl/18/cgpay/btn_cgpay_help_hover.png');
    }
}

</style>
