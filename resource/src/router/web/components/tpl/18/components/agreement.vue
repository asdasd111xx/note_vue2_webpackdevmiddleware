<template>
    <div :class="$style.agreement">
        <div :class="$style['main-title']">{{ $text('S_TERMS_TREATY', '条款条约') }}</div>
        <div :class="$style.content">
            <div :class="$style.wrap">
                <div :class="$style.title">{{ $text('S_DEFINITION', '定义') }}</div>
                <p>{{ $text('S_DEFINITION_CONTENT_01') }}</p>
                <p>{{ $text('S_DEFINITION_CONTENT_02') }}</p>
            </div>
            <div :class="$style.wrap">
                <div :class="$style.title">{{ $text('S_AGREE', '同意') }}</div>
                <p>{{ $text('S_MILLER_AGREE_CONTENT_01') }}：</p>
                <p :class="$style.list">{{ $text('S_MILLER_AGREE_CONTENT_02') }}</p>
                <p :class="$style.list">{{ $text('S_MILLER_AGREE_CONTENT_03') }}</p>
                <p :class="$style.list">{{ $text('S_MILLER_AGREE_CONTENT_04') }}</p>
            </div>
            <div :class="$style.wrap">
                <div :class="$style.title">{{ $text('S_CS_EDIT', '修改') }}</div>
                <p>{{ $text('S_MILLER_EDIT_CONTENT_01') }}</p>
                <p>{{ $text('S_MILLER_EDIT_CONTENT_02') }}</p>
            </div>
            <div :class="$style.wrap">
                <div :class="$style.title">{{ $text('S_BETTING_PROPERTY', '博彩资讯和知识产权') }}</div>
                <p>{{ $text('S_BETTING_PROPERTY_CONTENT_01') }}</p>
                <p>{{ $text('S_BETTING_PROPERTY_CONTENT_02') }}</p>
                <p>{{ $text('S_BETTING_PROPERTY_CONTENT_03') }}</p>
            </div>

            <div :class="$style.wrap">
                <div :class="$style.title">{{ $text('S_USE_CONDITIONS', '使用条件') }}</div>
                <p>{{ $text('S_USE_CONDITIONS_CONTENT_01') }}</p>
                <p>{{ $text('S_USE_CONDITIONS_CONTENT_02') }}：</p>
                <p :class="$style.list">{{ $text('S_USE_CONDITIONS_LIST_01') }}；</p>
                <p :class="$style.list">{{ $text('S_USE_CONDITIONS_LIST_02') }}；</p>
                <p :class="$style.list">{{ $text('S_USE_CONDITIONS_LIST_03') }}；</p>
                <p :class="$style.list">{{ $text('S_USE_CONDITIONS_LIST_04') }}；</p>
                <p :class="$style.list">
                    {{ $text('S_USE_CONDITIONS_LIST_05') }}:
                    <br />
                    (a) {{ $text('S_USE_CONDITIONS_LIST_06') }}；
                    (b) {{ $text('S_USE_CONDITIONS_LIST_07') }}；
                </p>
                <p :class="$style.list">{{ $text('S_USE_CONDITIONS_LIST_08') }}；</p>
                <p :class="$style.list">{{ $text('S_USE_CONDITIONS_LIST_09') }}；</p>
                <p :class="$style.list">{{ $text('S_USE_CONDITIONS_LIST_10') }}；</p>
                <p :class="$style.list">{{ $text('S_USE_CONDITIONS_LIST_11') }}；</p>
                <p :class="$style.list">{{ $text('S_USE_CONDITIONS_LIST_12') }}；</p>
                <p :class="$style.list">{{ $text('S_USE_CONDITIONS_LIST_13') }}；</p>
                <p :class="$style.list">{{ $text('S_USE_CONDITIONS_LIST_14') }}；</p>
                <p :class="$style.list">{{ $text('S_USE_CONDITIONS_LIST_15') }}；</p>
                <p :class="$style.list">{{ $text('S_USE_CONDITIONS_LIST_16') }}；</p>
                <p :class="$style.list">{{ $text('S_USE_CONDITIONS_LIST_17') }}；</p>
                <p :class="$style.list">{{ $text('S_USE_CONDITIONS_LIST_18') }}；</p>
                <p :class="$style.list">{{ $text('S_USE_CONDITIONS_LIST_19') }}；</p>
                <p :class="$style.list">{{ $text('S_USE_CONDITIONS_LIST_20') }}；</p>
                <p :class="$style.list">{{ $text('S_USE_CONDITIONS_LIST_21') }}。</p>
            </div>
            <div :class="$style.wrap">
                <div :class="$style.title">{{ $text('S_REGISTER_MEMBERSHIP', '注册开立博彩账户和会员资格') }}</div>
                <p>{{ $text('S_REGISTER_MEMBERSHIP_LIST_01') }}。</p>
                <p :class="$style.list">{{ $text('S_REGISTER_MEMBERSHIP_LIST_02') }}；</p>
                <p :class="$style.list">{{ $text('S_REGISTER_MEMBERSHIP_LIST_03') }}；</p>
                <p :class="$style.list">{{ $text('S_REGISTER_MEMBERSHIP_LIST_04') }}；</p>
                <p :class="$style.list">{{ $text('S_REGISTER_MEMBERSHIP_LIST_05') }}；</p>
                <p :class="$style.list">{{ $text('S_REGISTER_MEMBERSHIP_LIST_06') }}；</p>
                <p :class="$style.list">{{ $text('S_REGISTER_MEMBERSHIP_LIST_07') }}；</p>
                <p :class="$style.list">{{ $text('S_REGISTER_MEMBERSHIP_LIST_08') }}；</p>
                <p :class="$style.list">{{ $text('S_REGISTER_MEMBERSHIP_LIST_09') }}；</p>
                <p :class="$style.list">{{ $text('S_REGISTER_MEMBERSHIP_LIST_10') }}；</p>
                <p :class="$style.list">{{ $text('S_REGISTER_MEMBERSHIP_LIST_11') }}。</p>
            </div>
            <div :class="$style.wrap">
                <div :class="$style.title">{{ $text('S_ACCEPT_BET', '下注及接受下注') }}</div>
                <p>{{ $text('S_ACCEPT_BET_CONTENT_01') }}；</p>
                <p>{{ $text('S_ACCEPT_BET_CONTENT_02') }}；</p>
                <p>{{ $text('S_ACCEPT_BET_CONTENT_03') }}；</p>
                <p>{{ $text('S_ACCEPT_BET_CONTENT_04') }}；</p>
                <p>{{ $text('S_ACCEPT_BET_CONTENT_05') }}；</p>
                <p>{{ $text('S_ACCEPT_BET_CONTENT_06') }}；</p>
                <p>{{ $text('S_ACCEPT_BET_CONTENT_07') }}；</p>
                <p>{{ $text('S_ACCEPT_BET_CONTENT_08') }}。</p>
            </div>
            <div :class="$style.wrap">
                <div :class="$style.title">{{ $text('S_USER_RESPONSIBLE') }}:</div>
                <p>
                    {{ $text('S_USER_RESPONSIBLE_CONTENT_01') }}
                    <br />
                    {{ $text('S_USER_RESPONSIBLE_CONTENT_02') }}
                    <br />
                    {{ $text('S_USER_RESPONSIBLE_CONTENT_03') }}；
                </p>
                <p>{{ $text('S_USER_RESPONSIBLE_CONTENT_04') }}；</p>
                <p>{{ $text('S_USER_RESPONSIBLE_CONTENT_05') }}；</p>
                <p>{{ $text('S_USER_RESPONSIBLE_CONTENT_06') }}；</p>
                <p>{{ $text('S_USER_RESPONSIBLE_CONTENT_07') }}；</p>
                <p>{{ $text('S_USER_RESPONSIBLE_CONTENT_08') }}；</p>
                <p>{{ $text('S_USER_RESPONSIBLE_CONTENT_09') }}；</p>
                <p>{{ $text('S_USER_RESPONSIBLE_CONTENT_10') }}；</p>
                <p>{{ $text('S_USER_RESPONSIBLE_CONTENT_11') }}；</p>
                <p>{{ $text('S_USER_RESPONSIBLE_CONTENT_12') }}；</p>
                <p>{{ $text('S_USER_RESPONSIBLE_CONTENT_13') }}；</p>
                <p>{{ $text('S_USER_RESPONSIBLE_CONTENT_14') }}；</p>
                <p>{{ $text('S_USER_RESPONSIBLE_CONTENT_15') }}；</p>
                <p>{{ $text('S_USER_RESPONSIBLE_CONTENT_16') }}；</p>
                <p>{{ $text('S_USER_RESPONSIBLE_CONTENT_17') }}；</p>
                <p>{{ $text('S_USER_RESPONSIBLE_CONTENT_18') }}；</p>
                <p>{{ $text('S_USER_RESPONSIBLE_CONTENT_19') }}；</p>
                <p>{{ $text('S_USER_RESPONSIBLE_CONTENT_20') }}。</p>
                <br />
                {{ $text('S_USER_RESPONSIBLE_CONTENT_21') }}
                <br />
                {{ $text('S_USER_RESPONSIBLE_CONTENT_22') }}；
                <p>{{ $text('S_USER_RESPONSIBLE_CONTENT_23') }}；</p>
                <p>{{ $text('S_USER_RESPONSIBLE_CONTENT_24') }}。</p>
            </div>
            <div :class="$style.wrap">
                <div :class="$style.title">{{ $text('S_USER_CAN_NOT', '用户不得') }}:</div>
                <p>{{ $text('S_USER_CAN_NOT_CONTENT_01') }}；</p>
                <p>{{ $text('S_USER_CAN_NOT_CONTENT_02') }}；</p>
                <p>{{ $text('S_USER_CAN_NOT_CONTENT_03') }}；</p>
                <p>{{ $text('S_USER_CAN_NOT_CONTENT_04') }}；</p>
                <p>{{ $text('S_USER_CAN_NOT_CONTENT_05') }}；</p>
                <p>{{ $text('S_USER_CAN_NOT_CONTENT_06') }}；</p>
                <p>{{ $text('S_USER_CAN_NOT_CONTENT_07') }}。</p>
            </div>
            <div :class="$style.wrap">
                <div :class="$style.title">{{ $text('S_TRANS_SETTLEMENT', '交易结算') }}</div>
                <p>{{ $text('S_TRANS_SETTLEMENT_CONTENT_01') }}；</p>
                <p>{{ $text('S_TRANS_SETTLEMENT_CONTENT_02') }}；</p>
                <p>{{ $text('S_TRANS_SETTLEMENT_CONTENT_03') }}；</p>
                <p>{{ $text('S_TRANS_SETTLEMENT_CONTENT_04') }}；</p>
                <p>{{ $text('S_TRANS_SETTLEMENT_CONTENT_05') }}；</p>
                <p>{{ $text('S_TRANS_SETTLEMENT_CONTENT_06') }}。</p>
            </div>
            <div :class="$style.wrap">
                <div :class="$style.title">{{ $text('S_RECEIVE_JACKPOT', '领取彩金') }}</div>
                <p>{{ $text('S_RECEIVE_JACKPOT_CONTENT_01') }}；</p>
                <p>{{ $text('S_RECEIVE_JACKPOT_CONTENT_02') }}。</p>
            </div>
            <div :class="$style.wrap">
                <div :class="$style.title">{{ $text('S_RECEIVE_JACKPOT', '促销和奖励') }}</div>
                <p>{{ $text('S_PROMOTION_REWARD_CONTENT_01') }}；</p>
                <p>{{ $text('S_PROMOTION_REWARD_CONTENT_02') }}；</p>
                <p>{{ $text('S_PROMOTION_REWARD_CONTENT_03') }}。</p>
            </div>
            <div :class="$style.wrap">
                <div :class="$style.title">{{ $text('S_COMPENSATION', '赔偿') }}</div>
                <div :class="$style['sub-title']">{{ $text('S_COMPENSATION_CONTENT') }}。</div>
            </div>
            <div :class="$style.wrap">
                <div :class="$style.title">{{ $text('S_COMPENSATION', '免责声明及特别注意事项') }}</div>
                <p>{{ $text('S_DISCLAIMER_NOTICE_CONTENT_01') }}；</p>
                <p>{{ $text('S_DISCLAIMER_NOTICE_CONTENT_02') }}；</p>
                <p>{{ $text('S_DISCLAIMER_NOTICE_CONTENT_03') }}；</p>
                <p>{{ $text('S_DISCLAIMER_NOTICE_CONTENT_04') }}；</p>
                <p>{{ $text('S_DISCLAIMER_NOTICE_CONTENT_05') }}；</p>
                <p>{{ $text('S_DISCLAIMER_NOTICE_CONTENT_06') }}；</p>
                <p>{{ $text('S_DISCLAIMER_NOTICE_CONTENT_07') }}；</p>
                <p>{{ $text('S_DISCLAIMER_NOTICE_CONTENT_08') }}；</p>
                <p>{{ $text('S_DISCLAIMER_NOTICE_CONTENT_09') }}；</p>
                <p>{{ $text('S_DISCLAIMER_NOTICE_CONTENT_10') }}；</p>
                <p>{{ $text('S_DISCLAIMER_NOTICE_CONTENT_11') }}；</p>
                <p>{{ $text('S_DISCLAIMER_NOTICE_CONTENT_12') }}。</p>
            </div>
            <div :class="$style.wrap">
                <div :class="$style.title">{{ $text('S_CLOSE_SERVICE', '终止、关户及暂停博彩服务') }}</div>
                <div :class="$style['sub-title']">{{ $text('S_CLOSE_SERVICE_CONTENT_01') }}：</div>
                <p :class="$style.list">{{ $text('S_CLOSE_SERVICE_CONTENT_02') }}；</p>
                <p :class="$style.list">{{ $text('S_CLOSE_SERVICE_CONTENT_03') }}；</p>
                <p :class="$style.list">{{ $text('S_CLOSE_SERVICE_CONTENT_04') }}；</p>
                <p :class="$style.list">{{ $text('S_CLOSE_SERVICE_CONTENT_05') }}；</p>
                <p :class="$style.list">{{ $text('S_CLOSE_SERVICE_CONTENT_06') }}；</p>
                <p :class="$style.list">{{ $text('S_CLOSE_SERVICE_CONTENT_07') }}；</p>
                <p :class="$style.list">{{ $text('S_CLOSE_SERVICE_CONTENT_08') }}；</p>
                <p :class="$style.list">{{ $text('S_CLOSE_SERVICE_CONTENT_09') }}；</p>
                <p :class="$style.list">{{ $text('S_CLOSE_SERVICE_CONTENT_10') }}；</p>
                <p :class="$style.list">{{ $text('S_CLOSE_SERVICE_CONTENT_11') }}；</p>
                <p :class="$style.list">{{ $text('S_CLOSE_SERVICE_CONTENT_12') }}；</p>
                <p :class="$style.list">{{ $text('S_CLOSE_SERVICE_CONTENT_13') }}。</p>
                <p :class="$style.list">{{ $text('S_CLOSE_SERVICE_CONTENT_14') }}。</p>
            </div>
            <div :class="$style.wrap">
                <div :class="$style.title">{{ $text('S_LINK_EXTERNAL_WEBSITE', '与外部网站的链接') }}</div>
                <p>{{ $text('S_LINK_EXTERNAL_WEBSITE_CONTENT_01') }}；</p>
                <p>{{ $text('S_LINK_EXTERNAL_WEBSITE_CONTENT_02') }}；</p>
                <p>{{ $text('S_LINK_EXTERNAL_WEBSITE_CONTENT_03') }}；</p>
                <p>{{ $text('S_LINK_EXTERNAL_WEBSITE_CONTENT_04') }}。</p>
            </div>
            <div :class="$style.wrap">
                <div :class="$style.title">{{ $text('S_SITE_LINK', '与博彩网站的链接／框入') }}</div>
                <p>{{ $text('S_SITE_LINK_CONTENT') }}。</p>
            </div>
            <div :class="$style.wrap">
                <div :class="$style.title">{{ $text('S_VIOLATE_REGULATION', '违反本条规') }}</div>
                <p>{{ $text('S_VIOLATE_REGULATION_CONTENT') }}。</p>
            </div>
            <div :class="$style.wrap">
                <div :class="$style.title">{{ $text('S_PRIORITY', '优先顺序') }}</div>
                <p>{{ $text('S_PRIORITY_CONTENT') }}。</p>
            </div>
            <div :class="$style.wrap">
                <div :class="$style.title">{{ $text('S_FORCE_MAJEURE', '不可抗力') }}</div>
                <p>{{ $text('S_FORCE_MAJEURE_CONTENT') }}。</p>
            </div>
            <div :class="$style.wrap">
                <div :class="$style.title">{{ $text('S_ABSTAIN', '弃权') }}</div>
                <p>{{ $text('S_ABSTAIN_CONTAIN') }}。</p>
            </div>
            <div :class="$style.wrap">
                <div :class="$style.title">{{ $text('S_SEVERABILITY', '可分割性') }}</div>
                <p>{{ $text('S_SEVERABILITY_CONTENT') }}。</p>
            </div>
            <div :class="$style.wrap">
                <div :class="$style.title">{{ $text('S_LAW_JURISDICTION', '适用法律和管辖') }}</div>
                <p>{{ $text('S_LAW_JURISDICTION_CONTENT') }}。</p>
            </div>
        </div>
    </div>
</template>

<style lang="scss" module>
.agreement {
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
    padding: 12px 40px 80px;
}

.wrap {
    line-height: 20px;
    font-size: 16px;
    margin-top: 23px;
    > p {
        color: #969696;
        font-size: 14px;
        font-weight: 400;
        margin: 20px 0px;
    }
}
.title {
    line-height: 22px;
    color: #333;
    font-size: 16px;
    font-weight: 600;
}
.sub-title {
    margin-top: 14px;
}
.list {
    line-height: 22px;
    font-size: 16px;
    font-weight: 400;
    > a {
        color: rgb(245, 180, 0);
        font-size: 14px;
        text-decoration: none;
        outline: none;
        &:hover {
            color: rgb(249, 196, 51);
        }
    }
    &::before {
        content: ' ';
        display: inline-block;
        width: 11px;
        height: 11px;
        margin-right: 7px;
        line-height: 14px;
        border-radius: 100%;
        background-color: #969696;
    }
}
</style>
