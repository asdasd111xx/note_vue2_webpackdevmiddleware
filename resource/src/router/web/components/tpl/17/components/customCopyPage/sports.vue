<template>
    <div>
        <div :class="$style['paragraph-item']">
            <h3>足球的结算以什么时间为准？</h3>
            <p>1.所有足球投注的结算皆以球赛所规定的完场时间90分钟为准，完场时间90分钟包括球员伤停补时。加时赛、淘汰赛、点球，以及赛事后如果裁判或相关管理机构更改任何赛果则不计算在内。</p><br />
            <p>2.对于某些以全场完场时间为80分钟（2 x40分钟）的特定赛事或者友谊赛，所有投注的结算皆以完场时间为准。</p><br />
            <p>3.若少年赛、友谊赛的完场时间为70分钟（2 x 35分钟）或更少，本公司将在开赛前做出公布，否则该场赛事的注单一律作废。</p>
        </div>
        <div :class="$style['paragraph-item']">
            <h3>赛事中断怎么办？</h3>
            <p>如果赛事中断或延迟，并且没有在36小时内重新开始，所有该场赛事的投注即被视为无效且取消，除非在个别投注类型规则里另有指定注明。</p>
        </div>
        <div :class="$style['paragraph-item']">
            <h3>多久可以结算？</h3>
            <p>1. 单注派彩：正常情况下，单场赛事投注会在赛事结束后15到30分钟内完成确认赛果并返彩，一些赛事可能需要更长时间处理（比如腰斩，赛事中断等情况）。</p>
            <p>2. 上半场派彩：正常情况下，上半场投注会在赛事上半场结束后30分钟内完成确认赛果并返彩，一些赛事可能需要更长时间处理（比如腰斩，赛事中断等情况）。</p>
            <p>3. 连串过关派彩：正常情况下，连串过关将会在您该注单最后一场连串过关赛事结束2小时内，官方公布结果后进行派彩，一些赛事可能需要更长时间处理（比如腰斩，赛事中断等情况）。</p>
        </div>
        <div :class="$style['paragraph-item']">
            <h3>危险球的定义？</h3>
            <p>会员在投注滚球时，如果赛场中出现以下几种情况，会员的投注将会维持在‘危险球-待确认’ 的状态。危险球的定义有:</p>
            <p :class="$style['paragraph-item-indent']">12码罚球</p>
            <p :class="$style['paragraph-item-indent']">自由球(攻方在守方禁区附近的自由球)。</p>
            <p :class="$style['paragraph-item-indent']">角球 /掷入球(攻方靠近守方禁区的掷入球)。</p>
            <p :class="$style['paragraph-item-indent']">A队向B队禁区附近进攻(或是B队在A队的禁区附近进攻)。</p>
            <p>在以下的状况，会员所下注注单将会被取消，而会员所下注的金额将会全数退回：</p>
            <p :class="$style['paragraph-item-indent']">进球。</p>
            <p :class="$style['paragraph-item-indent']">红卡。</p>
            <p>在以下这几种状况将会释放危险球，而会员在危险球下注的注单都会以当时下注的盘口、赔率和金额为准。</p>
            <p :class="$style['paragraph-item-indent']">门将开球。</p>
            <p :class="$style['paragraph-item-indent']">皮球重新去到中场线。</p>
            <p :class="$style['paragraph-item-indent']">己方球员在自己的后场抢回控球权。</p>
            <p :class="$style['paragraph-item-indent']">攻防转换，原来的防守一方在自己後场开出自由球 。</p>
        </div>
        <div :class="$style['paragraph-item']">
            <h3>赛事中断怎么办？</h3>
            <p>如果赛事中断或延迟，并且没有在36小时内重新开始，所有该场赛事的投注即被视为无效且取消，除非在个别投注类型规则里另有指定注明。</p>
        </div>
        <div :class="$style['paragraph-item']">
            <h3>体育赛事中断？</h3>
            <p>1.如果比赛或赛事取消，中断或延迟并且没有在官方指定开球时间的36小时内重新开始，所有该场赛事的投注即被视为无效且取消，除非在个别体育规则里另有指定注明。某些无条件终止的盘口将会相应地结算。单独的体育规则中对此类盘口的结算程序做了说明。 公司取消该赛事所有注单的结果被视为最终决定，无需参考官方赛事裁判或相关部门的决定。连串投注将会继续按照注单剩余赛事的赛果结算，该取消赛事的赔率将会按照1计算。</p>
            <p>2.如果赛事中断前已有明确结果并且之后没有任何显著会影响赛事结果的情况，大/小盘注单才会被结算。</p>
        </div>
        <div :class="$style['paragraph-item']">
            <h3>主要投注盘口类型</h3>
            <p>1x2（独赢盘）：</p>
            <p :class="$style['paragraph-item-indent']">盘口提供两支球队和平局为投注选项，预测哪一支球队将在90分钟比赛胜出或赛事和局。</p>
            <p>让球盘：</p>
            <p :class="$style['paragraph-item-indent']">根据盘口让球信息预测最终获得胜利的球队。</p>
            <p :class="$style['paragraph-item-indent']">投注的结算皆以球赛所规定的完场时间90分钟为准。</p>
            <p :class="$style['paragraph-item-indent']">如果赛事在90分钟结束前取消或中断，那已有明确结果并且之后没有任何显著会影响赛事结果的注单将会结算，其他所有注单将会被视为无效。</p>
            <p>足球滚球让球盘：</p>
            <p :class="$style['paragraph-item-indent']">根据盘口让球信息预测，从投注当时到赛事结束最终获得胜利的球队。</p>
            <p :class="$style['paragraph-item-indent']">投注的结算皆以球赛所规定的完场时间90分钟为准。</p>
            <p :class="$style['paragraph-item-indent']">如果赛事在90分钟结束前取消或中断，那已有明确结果并且之后没有任何显著会影响赛事结果的注单将会结算，其他所有注单将会被视为无效。</p>
            <p>大小：</p>
            <p :class="$style['paragraph-item-indent']">预测赛事总入球数将大于或小于在盘口指定的大/小盘球数。</p>
            <p :class="$style['paragraph-item-indent']">如果赛事的总入球数多于盘口的大/小盘球数，则为大盘。如果少于盘口的大/小盘球数，则为小盘。</p>
            <p :class="$style['paragraph-item-indent']">所有注单将按盘口开出的大/小盘球数在玩法的时节结束后结算。</p>
            <p>单双：</p>
            <p :class="$style['paragraph-item-indent']">预测90分钟内，赛事总入球对单或双。</p>
            <p :class="$style['paragraph-item-indent']">若最终比分为：0-0，将会按照“双”来计算。</p>
            <p>波胆：</p>
            <p :class="$style['paragraph-item-indent']">预测一场特定赛事中相关时间段的准确比分。</p>
            <p :class="$style['paragraph-item-indent']">"任何其他比分"是指任何的比分，而不是一个市场选项列表中已存在的类型。</p>
            <p>净胜值：</p>
            <p :class="$style['paragraph-item-indent']">净胜值是指一个用数字价值来区分赛事获胜者和其他参与者比分或进球的差值，例如：比分或进球差值越大，净胜值就越高。</p>
            <p :class="$style['paragraph-item-indent']">如果赛事结局是平局，将会根据平分或“0-0”进行结算。</p>
            <p>半场/全场：</p>
            <p :class="$style['paragraph-item-indent']">预测赛事的半/全场结果。</p>
            <p>双重机会：</p>
            <p :class="$style['paragraph-item-indent']">在三种可能出现的赛果中选择两种进行投注; 主场赢或打平（1和X）, 客场赢或打平（2和X）或主场或客场赢（1和2）。 共有三种选择: 1 X, X 2, 1 2</p>
            <p :class="$style['paragraph-item-indent']">如果比赛在中立场进行﹐列在盘面的上方球队则被视为主队。</p>
            <p :class="$style['paragraph-item-indent']">"1" 代表: 主场赢。</p>
            <p :class="$style['paragraph-item-indent']">"X" 代表: 平手。</p>
            <p :class="$style['paragraph-item-indent']">"2" 代表: 客场赢。</p>
            <p>胜负平让球盘：</p>
            <p :class="$style['paragraph-item-indent']">这是一个类似于标准让球盘的盘口，不同的是它包括平局的投注类型。</p>
            <p :class="$style['paragraph-item-indent']">让球（-1）- 如果您的球队以2个或更多净胜球赢得比赛，您就获胜。</p>
            <p :class="$style['paragraph-item-indent']">平局：如果球队在让1球（-1）的情况下以1球赢得比赛，您就获胜。</p>
            <p :class="$style['paragraph-item-indent']">让球（+1） 如果您的球队是平局或赢得比赛，您就获胜</p>
            <p>总进球数：</p>
            <p :class="$style['paragraph-item-indent']">预测全场两队的总入球数。</p>
            <p :class="$style['paragraph-item-indent']">全场总入球数注单结算是根据全场“90分钟”为准。</p>
        </div>
        <div :class="$style['paragraph-item']">
            <h3>什么是并列名次（冠军）规则？</h3>
            <p>并列名次规则适用于所有多个获胜者或冠军的市场（以市场显示信息为准），例如一场赛事的盘口产生2名或者以上的获胜者，那么赢利金额将减少。计算方法是将本金除以获胜者人数，然后乘以原赔率。这部分本金及赢利将返还给会员，剩余的本金将输掉。</p>
        </div>
        <div :class="$style['paragraph-item']">
            <h3>连串投注是指什么？</h3>
            <p>连串过关（Parlay）：采用欧洲赔率【包含本金】-- 选择二个或更多的赛事在一个单一的注单中，每一个选择连串投注的赛事必须获胜此连串的注单才视为赢，只要其中有一场赛事输，注单为输。</p>
        </div>
        <div :class="$style['paragraph-item']">
            <h3>复式连串投注是指什么？</h3>
            <p>复式连串过关，是指将多场赛事串做多个单式连串过关，至少3场最多8场。复式连串过关可以容错，如果有一场比赛赛果为输，那么所有包含该比赛的单式连串全部算输扣除本金，其它单式连串继续计算输赢。</p>
        </div>
    </div>
</template>

<style lang="scss" module>
.paragraph-item {
    margin: 33px 0 60px;

    h3 {
        line-height: 1;
        margin: 0;
        font-size: 14px;
        font-weight: 700;
        color: #C39E51;
    }

    p {
        margin: 8px 0 0;
        line-height: 22px;
        text-align: justify;
        font-size: 12px;
        color: #647C85;
    }
}

.paragraph-item-indent {
    padding-left: 15px;
}
</style>
