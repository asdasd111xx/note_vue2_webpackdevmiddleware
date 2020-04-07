<template>
    <mobile-container
        :class="$style['container-bg']"
        :header-setting="headerSetting"
    >
        <div slot="content" :class="$style['body-wrap']">
            <div :class="$style['contact-container']">
                <div :class="$style['title']">{{ $text('S_AGENT_CONTACT', '联系方式') }}</div>
                <ul :class="$style['contact-list']">
                    <li :class="$style['contact-item']">
                        <h5>{{ $text('S_SKYPE', 'S_SKYPE') }}</h5>
                        <div :class="$style['contact-item-text']">
                            <i :class="$style.skype" />
                            <p>{{ skype }}</p>
                        </div>
                    </li>
                    <li :class="$style['contact-item']">
                        <h5>{{ $text('S_OFFICIAL_WEBS_PHONE', '官网电话') }}</h5>
                        <div :class="$style['contact-item-text']">
                            <i :class="$style.phone" />
                            <p>{{ officialWebPhone }}</p>
                        </div>
                    </li>
                    <li :class="$style['contact-item']">
                        <h5>{{ $text('S_PROMOTIONS_MAIL', '优惠邮箱') }}</h5>
                        <div :class="$style['contact-item-text']">
                            <i :class="$style.mail" />
                            <p>{{ promotionsMail }}</p>
                        </div>
                    </li>
                    <li :class="$style['contact-item']">
                        <h5>{{ $text('S_SERVIEC_QQ', '客服QQ') }}</h5>
                        <div :class="$style['contact-item-text']">
                            <i :class="$style.qq" />
                            <p>{{ serviceQQ }}</p>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    </mobile-container>
</template>

<script>
import mobileContainer from '../../common/mobileContainer';

export default {
    components: {
        mobileContainer
    },
    data() {
        return {
            qq: '99003995',
            skype: 'wsdailibu@gmail.com',
            agentMail: 'wsdailibu@gmail.com',
            officialWebPhone: '0063-09208718888',
            promotionsMail: 'ws617com@gmail.com',
            serviceQQ: '951533777、951392777'
        };
    },
    computed: {
        headerSetting() {
            return {
                left: { show: true },
                center: {
                    show: true,
                    typeText: true,
                    text: this.$text('S_CONTACT_US', '联系我们')
                },
                right: { show: true }
            };
        }
    }
};
</script>

<style lang="scss" module>
.body-wrap {
    color: #F8F1EB;
    padding: 65px 20px 10px;

    ul, li {
        padding: 0;
        margin: 0;
        list-style: none;
    }
}

.title {
    text-align: center;
    background-image: linear-gradient(90deg, #efdfae, #edbf6a);
    margin: 0 auto 15px;
    color: #5C4030;
    font-size: 15px;
    display: inline-block;
    padding: 4px 15px;
    border-radius: 10px;
}

.contact-list {
    .contact-item {
        padding: 0 30px 10px;
        border-bottom: 1px solid #272727;
        margin: 0 -20px;

        & + li {
            margin-top: 9px;
        }

        h5 {
            font-weight: normal;
            font-size: 15px;
            margin: 0 0 2px 0;

            &:before {
                content: '';
                display: inline-block;
                vertical-align: middle;
                width: 3px;
                height: 18px;
                background: #F8F1EB;
                margin: 0 10px 3px 0;
            }
        }

        i {
            width: 22px;
            height: 22px;
            display: inline-block;
            vertical-align: middle;
            background-image: url('/static/image/mobile/tpl/theme3/contact/qq.png');
            background-size: 100%;

            &.skype {
                background-image: url('/static/image/mobile/tpl/theme3/contact/skype.png');
            }

            &.mail {
                background-image: url('/static/image/mobile/tpl/theme3/contact/mail.png');
            }

            &.phone {
                background-image: url('/static/image/mobile/tpl/theme3/contact/phone.png');
            }
        }

        .contact-item-text {
            margin: 0 0 0 10px;
            p {
                letter-spacing: 1px;
                color: #EFD497;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
                line-height: 1;
                display: inline-block;
                vertical-align: middle;
                width: calc(100% - 30px);
                padding: 0 0 2px;
            }
        }
    }
}

.copy-button {
    background: linear-gradient(270deg, #0b72cd, #2bb0c8);
    font-size: 12px;
    border: 0;
    line-height: 1;
    color: #fff;
    border-radius: 20px;
    padding: 5px 10px;
    position: absolute;
    bottom: 9px;
    right: 9px;

    &:focus {
        outline: 0
    }
}

</style>
