<template>
    <div :class="$style.register">
        <div :class="$style['main-title']">如何注册</div>
        <div :class="$style.content">
            <div :class="$style.title">如何注册 Common problem</div>
            <div :class="$style.wrap">
                <div :class="$style['sub-title']">如何注册帐号？</div>
                <p>第一步：网页右上角点击【注册】；</p>
                <p>第二步：建立你的“用户名”和“密码”，输入图形验证码--→立即注册；</p>
                <p>第三步：编辑个性昵称，挑选喜爱的头像，注册完成</p>
            </div>
            <div :class="$style.wrap">
                <div :class="$style['sub-title']">忘记帐号怎么办？</div>
                <p>忘记会员账户名您可以及时联系我们的在线客服，7x24小时为您提供必要的协助。</p>
            </div>
            <div :class="$style.wrap">
                <div :class="$style['sub-title']">忘记密码怎么办？</div>
                <p>在登录页点击【忘记密码】通过已绑定手机号找回密码，如未绑定手机号，请联系在线客服找回密码。</p>
            </div>
            <div :class="$style.wrap">
                <div :class="$style['sub-title']">备注：</div>
                <p>1. 请注意，注册时要求填写真实而准确的信息。</p>
                <p>2. 最重要的是，阁下使用网站务必先阅读规则与条款，承认您已年满18岁。</p>
            </div>
        </div>
        <div :class="$style.content">
            <div :class="$style.title">账户相关问题</div>
            <div :class="$style.wrap">
                <div :class="$style['sub-title']">1. 我能在乐动注册几个账户？</div>
                <p>您仅允许注册一个账号, 任何时候都不能拥有超过一个账号。如发现客户拥有多个户口， 公司有权限制会员保留其中一个账号，同时保留取消或关闭您账户的权利。</p>
            </div>
            <div :class="$style.wrap">
                <div :class="$style['sub-title']">2.我的个人资料安全吗？</div>
                <p>我们坚持实行最好的安全措施，为广大客户提供舒适、安全的博彩环境。 我们承诺保护个人信息是按照数据保护法进行，包括我们如何处理这些数据。所有服务都需要遵守法律及乐动集团的隐私标准。 请参考隐私权保护规则页面查看更多信息。</p>
            </div>
            <div :class="$style.wrap">
                <div :class="$style['sub-title']">3. 如果我的账户长时间不使用会被取消吗？</div>
                <p>不会关闭，您的账户若长时间没有登录和使用，不会被关闭。</p>
            </div>
            <div :class="$style.wrap">
                <div :class="$style['sub-title']">4.我的个人资料是否能更改？</div>
                <p>姓名/生日，填写不可以更改；</p>
                <p>手机号码/电子邮箱，需要联系在线客服进行修改；</p>
                <p>其他个人资料用户可以自行进行修改。</p>
            </div>
        </div>
    </div>
</template>

<style lang="scss" module>
.register {
    width: 100%;
    background-color: #FFF;
}

.main-title {
    line-height: 36px;
    padding: 13px 40px;
    background: url('/static/image/tpl/18/about/bg01.png') 0 0 no-repeat;
    background-size: 100%;
    color: #000;
    font-size: 25px;
    font-weight: 400;
}

.content {
    padding: 0px 40px 80px;
}

.wrap {
    line-height: 20px;
    margin-top: 23px;
    > p {
        color: #969696;
        font-size: 14px;
        font-weight: 400;
        margin: 20px 0px;
    }
}
.title {
    line-height: 30px;
    margin: 12px 0px 23px;
    color: #000;
    font-size: 24px;
}
.sub-title {
    line-height: 22px;
    color: #333;
    font-size: 16px;
    font-weight: 600;
}
</style>
