<template>
    <div>
        活动时间：即日起
        <br />
        活动对象：全网会员
        <br />
        活动内容：
        <table
            :class="$style['form-wrap']"
            rules="all"
            cellpadding="5"
        >
            <tr :class="$style.tr">
                <td>充值方式</td>
                <td>充值金额</td>
                <td>可获优惠</td>
                <td>彩金上限(单笔)</td>
                <td>流水要求</td>
            </tr>
            <tr>
                <td>CG Pay钱包</td>
                <td>100</td>
                <td>0.5%</td>
                <td>388</td>
                <td>1倍</td>
            </tr>
        </table>
        <br />
        &nbsp;&nbsp;&nbsp;&nbsp;1.每次入款前请先登入会员账号，使用CG Pay钱包充值即可获得0.5%的入款优惠，无需申请，充值成功后0.5%优惠自动到账；
        <br />
        &nbsp;&nbsp;&nbsp;&nbsp;2.存款优惠单次上限为388元，会员单日最高可获的优惠无上限；
        <br />
        &nbsp;&nbsp;&nbsp;&nbsp;3.存款优惠仅需达到一倍流水方可申请提款；
        <br />
        活动规则：
        <br />
        &nbsp;&nbsp;&nbsp;&nbsp;1.此优惠活动与威尼斯人贵宾厅其他优惠同时进行；
        <br />
        &nbsp;&nbsp;&nbsp;&nbsp;2.该优惠活动成功申请后不能取消，如解除账户限制，需完成活动指定流水要求，将自动解除未完成的流水倍数；
        <br />
        &nbsp;&nbsp;&nbsp;&nbsp;3.如会员使用一切不正常投注、套利行为，本公司将保留冻结账号盈利及余额等权利；
        <br />
        &nbsp;&nbsp;&nbsp;&nbsp;4.参与此活动代表完全遵守威尼斯人贵宾厅全部游戏规则【一般条款与规则】；
        <br />
        &nbsp;&nbsp;&nbsp;&nbsp;5.本活动最终解释权归威尼斯人贵宾厅所有；
    </div>
</template>

<style lang="scss" module>
.form-wrap {
    width: 100%;
    padding: 5px;
    border: 1px #000 solid;
}

.tr {
    background: #F3D382;

    >td {
        color: #FFF;
    }
}
</style>
