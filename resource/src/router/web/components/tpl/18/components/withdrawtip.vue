<template>
    <div :class="$style.withdrawtip">
        <div :class="$style['main-title']">提现说明</div>
        <div :class="$style.content">
            <div :class="$style.wrap">
                <p>提现区间【100 ~ 49999】</p>
                <p>1. 当日免费提现 6 次，每次提现不收取手续费；</p>
                <p>2. 超出6次提现后，如无免费提现次数， 则需收取0%手续费。</p>
            </div>
            <div :class="$style.wrap">
                <p>提现区间【50000 ~ 300000】</p>
                <p>1. 提现次数限制4次，如无免费提现次数， 则需收取5%的手续费；</p>
                <p>2. 单笔提现限额50000~300000元，发起提现时系统默认拆成多笔提现订单。</p>
            </div>
            <div :class="[$style.wrap,$style['wrap-content']]">
                <p>3.【免提条件】</p>
                <p>每周有效投注额越高，当周可享受免费提现次数越多：</p>
                <p>
                    <b>体育类</b>
                    投注额达到1,000,000.00时，可享受免费提现1次
                </p>
                <p>
                    <b>体育类</b>
                    投注额达到2,000,000.00时，可享受免费提现2次
                </p>
                <p>
                    <b>体育类</b>
                    投注额达到3,800,000.00时，可享受免费提现3次
                </p>
                <p>
                    <b>体育类</b>
                    投注额达到7,800,000.00时，可享受免费提现4次
                </p>
                <p>
                    <b>体育类</b>
                    体育类 投注额达到13,000,000.00时，可享受免费提现5次
                </p>
                <p>
                    <b>娱乐类（所有非体育）</b>
                    投注额达到3,000,000.00时，可享受免费提现1次
                </p>
                <p>
                    <b>娱乐类（所有非体育）</b>
                    投注额达到6,000,000.00时，可享受免费提现2次
                </p>
                <p>
                    <b>娱乐类（所有非体育）</b>
                    投注额达到11,000,000.00时，可享受免费提现3次
                </p>
                <p>
                    <b>娱乐类（所有非体育）</b>
                    投注额达到23,000,000.00时，可享受免费提现4次
                </p>
                <p>
                    <b>娱乐类（所有非体育）</b>
                    投注额达到40,000,000.00时，可享受免费提现5次
                </p>
            </div>
            <div :class="$style.wrap">
                <p>温馨提示：</p>
                <p>1. 当日是指00:00~24:00时间段；</p>
                <p>2. 会员当日累计提现次数不超过10次；</p>
                <p>3. 提现金额最高限制1200000元，达到提现次数或金额上限后，无法进行提现</p>
            </div>
        </div>
    </div>
</template>

<style lang="scss" module>
.withdrawtip {
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
    margin: 14px 0px;
    line-height: 20px;
    > p {
        color: #969696;
        font-size: 14px;
        font-weight: 400;
        margin: 15px 0px;
    }
}
.wrap-content > p {
    line-height: 25px;
}
</style>
