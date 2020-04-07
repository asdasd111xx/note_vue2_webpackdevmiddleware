<template>
    <div>
        <div :class="$style['paragraph-item']">
            <button
                v-for="item in list"
                :key="item.value"
                :class="[$style['paragraph-item-btn'],{ [$style.active]: item.value === currentTitle} ]"
                @click="currentTitle = item.value"
            >
                {{ item.name }}
            </button>
        </div>
        <template v-if="currentTitle === 'transfer'">
            <div :class="$style['paragraph-item']">
                <h2>一、转账</h2>
                <p>
                    充值的资金在中心钱包，如要进行体育或者其他场馆的游戏，请点击【转账】将主账户的资金转账到相应场馆即可。<br />
                    【一键转入】快速将主账户金额转入对应的场馆。<br />
                    【一键回收】快速将各个场馆的金额转到主账户。
                </p>
                <img :src="$getCdnPath('/static/image/tpl/17/copywriting/betting1-1.png')" />
            </div>
        </template>
        <template v-if="currentTitle === 'betting'">
            <div :class="$style['paragraph-item']">
                <h2>二、投注</h2>
                <p>在网站首页选择【威尼斯人贵宾厅体育】进入投注界面。根据比赛时间，投注界面可以分为【滚球】、【今日】、【早盘】三种，可以将不同的赛事组合为串关，以小博大。</p>
                <p>注意：以下盘口是指90分钟常规时间，包括补时。如有加时赛、点球会单独开盘口。</p>
                <p>1.【滚球】：投注正在进行的比赛，玩家可以边看比赛边下注。</p>
                <img :src="$getCdnPath('/static/image/tpl/17/copywriting/betting2-1.png')" />
                <p>2.【今日】：投注今日所有赛事，中午12:00到次日12:00为一个比赛日。</p>
                <img :src="$getCdnPath('/static/image/tpl/17/copywriting/betting2-2.png')" />
                <p>3.【早盘】：投注未来几天即将开始的赛事。</p>
                <img :src="$getCdnPath('/static/image/tpl/17/copywriting/betting2-3.png')" />
            </div>
        </template>
        <template v-if="currentTitle === 'introduction'">
            <div :class="$style['paragraph-item']">
                <h2>三、威尼斯人贵宾厅盘口玩法介绍</h2>
                <p>1.【独赢】：顾名思义，可直接下注比赛的胜负平。</p>
                <img :src="$getCdnPath('/static/image/tpl/17/copywriting/betting3-1.png')" />
                <p>2.【让球】：在现有比分基础上让球或受让，下注前已获得的进球将不被计算，下注时的比分将视为0-0.如标注有“上半场”字样，则以半场赛果来结算，没有标注则默认为全场，以全场赛果来结算</p>
                <img :src="$getCdnPath('/static/image/tpl/17/copywriting/betting3-2.png')" />
                <img :src="$getCdnPath('/static/image/tpl/17/copywriting/betting3-3.png')" />
                <p>3.【大小球】：投注两队总进球数的大小，总进球数比盘口大即大球，比盘口小即小球，刚好等于盘口退本金。如图：</p>
                <img :src="$getCdnPath('/static/image/tpl/17/copywriting/betting3-4.png')" />
                <img :src="$getCdnPath('/static/image/tpl/17/copywriting/betting3-5.png')" />
            </div>
        </template>
    </div>
</template>

<script>
export default {
    data() {
        return {
            currentTitle: 'transfer',
            list: [
                {
                    name: '一、转账',
                    value: 'transfer'
                },
                {
                    name: '二、投注',
                    value: 'betting'
                },
                {
                    name: '三、威尼斯人贵宾厅盘口玩法介绍',
                    value: 'introduction'
                }
            ]
        };
    }
};
</script>

<style lang="scss" module>
.paragraph-item {
    margin: 33px 0 60px;

    h2 {
        line-height: 1;
        margin: 8px 0 45px;
        text-align: justify;
        font-size: 36px;
        font-weight: normal;
        color: #647C85;
    }

    p {
        margin: 8px 0 0;
        line-height: 22px;
        text-align: justify;
        font-size: 12px;
        color: #647C85;
    }

    img {
        display: block;
        max-width: 750px;
    }
}

.paragraph-item-btn {
    display: inline-block;
    width: 160px;
    height: 60px;
    margin-right: 35px;
    line-height: 60px;
    text-align: center;
    font-size: 26px;
    font-weight: 700;
    color: #007AFF;
    background: #FFF;
    border: 1px solid #007AFF;
    border-radius: 7px;
    box-shadow: 0 4px 2px #007AFF;
    outline: 0;
    cursor: pointer;
    transition: all 0.3s;

    &.active,
    &:hover {
        color: #FFF;
        background: #007AFF;
        box-shadow: 0 0 0 #007AFF;
    }

    &:last-child {
        width: 310px;
        margin-right: 0;
    }
}
</style>
