<template>
    <div :class="$style['domain-wrap']">
        <div :class="$style['header-wrap']">
            <template v-if="webInfo.m_logo">
                <img :src="$getCdnPath(`${cdnDomain}${webInfo.m_logo}`)" />
            </template>
            <template v-else>
                <div>LOGO</div>
            </template>
        </div>
        <div :class="$style['content-wrap']">
            <div :class="$style['title-wrap']">{{ memInfo.config.domain_name[curLang] }}&nbsp;{{ $text('S_BACKUP_DOMAIN', '备用网址') }}</div>
            <!-- eslint-disable vue/no-v-html -->
            <div
                ref="service-text"
                :class="$style['service-wrap']"
                v-html="serviceText"
            />
            <!-- eslint-enable vue/no-v-html -->
            <div :class="['url-wrap', 'clearfix']">
                <div
                    v-for="(url, index) in urlList"
                    :key="index"
                    :class="$style.wrap"
                    @click="onClick(url)"
                >
                    <div :class="$style.url">{{ url }}</div>
                    <div :class="$style['btn-go']">{{ $text('S_GO_2', '前往') }}</div>
                </div>
            </div>
        </div>
        <div :class="$style['footer-wrap']">Copyright © {{ memInfo.config.domain_name[curLang] }} Reserved.</div>
    </div>
</template>

<script>
/* global $ */
import { mapGetters } from 'vuex';
import ajax from '@/lib/ajax';
import mobileLinkOpen from '@/lib/mobile_link_open';

export default {
    data() {
        return {
            urlList: []
        };
    },
    computed: {
        ...mapGetters({
            cdnDomain: 'getCdnDomain',
            webInfo: 'getWebInfo',
            memInfo: 'getMemInfo',
            curLang: 'getCurLang',
            onlineService: 'getOnlineService'
        }),
        serviceText() {
            const ele = ['<span>', '</span>'];

            return this.$text('S_BACKUP_DOMAIN_TEXT_01', {
                replace: [
                    { target: '%s', value: '<br />' },
                    { target: '%s', value: ele[0] },
                    { target: '%s', value: ele[1] }
                ]
            });
        }
    },
    created() {
        ajax({
            method: 'get',
            url: '/api/v1/c/hostnames',
            errorAlert: false,
            success: ({ result, ret }) => {
                if (result !== 'ok') {
                    return;
                }

                this.urlList = ret;
            }
        });
    },
    mounted() {
        $(this.$refs['service-text']).on('click', 'span', this.onService);
    },
    beforeDestroy() {
        $(this.$refs['service-text']).off('click', 'span', this.onService);
    },
    methods: {
        mobileLinkOpen,
        onClick(url) {
            window.open(`https://${url}`, '_blank');
        },
        onService() {
            if (!this.onlineService.url) {
                return;
            }

            this.mobileLinkOpen({ linkType: 'static', linkTo: 'service' });
        }
    }
};
</script>

<style lang="scss" module>
@import '~@/css/variable.scss';

.domain-wrap {
    min-height: 100%;
    padding-bottom: 50px;
    background-color: #17173C;
    background-image: url('/static/image/domain/bg2.jpg');
    background-position: 50% 0;
    background-repeat: no-repeat;
}

.header-wrap {
    padding: 6% 0;

    > div,
    > img {
        margin: 0 auto;
    }

    > div {
        width: 200px;
        height: 50px;
        line-height: 50px;
        background-color: #000;
        color: #FFF;
        font-size: 30px;
        text-align: center;
    }

    > img {
        display: block;
        max-width: 200px;
        max-height: 50px;
    }
}

.content-wrap {
    width: 94%;
    margin: 0 auto 3%;
    padding: 9% 6% 6%;
    border-radius: 10px;
    background-color: #1E1E42;
}

.title-wrap {
    line-height: 48px;
    color: #FFF;
    font-weight: 700;
    font-size: 21px;
    text-align: center;
}

.service-wrap {
    line-height: 24px;
    margin-bottom: 9%;
    color: #FFF;
    font-size: 16px;
    text-align: center;

    span {
        cursor: pointer;
        color: #11EFCF;
    }
}

.wrap {
    position: relative;
    width: 100%;
    height: 65px;
    margin: 8px auto;
    padding: 0 27% 0 6%;
    border-radius: 8px;
    background: url('/static/image/domain/url_bg.jpg') 0 0 no-repeat;
    background-size: 100% 100%;
    transition: all 0.1s ease-in-out;

    &::before {
        content: '';
        display: inline-block;
        height: 100%;
        vertical-align: middle;
    }
}

.url {
    display: inline-block;
    line-height: 24px;
    color: #FFF;
    font-size: 16px;
    vertical-align: middle;
}

.btn-go {
    overflow: hidden;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    width: 21%;
    height: 35px;
    line-height: 15px;
    margin: auto;
    padding: 20px 3px 0;
    border-left: 1px solid #48ADCE;
    background: url('/static/image/domain/icon_arrow.png') 50% 0 no-repeat;
    color: #FFF;
    font-size: 12px;
    text-align: center;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.footer-wrap {
    overflow: hidden;
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 50px;
    line-height: 50px;
    background-color: #17173C;
    color: #CCC;
    font-size: 13px;
    text-align: center;
    text-overflow: ellipsis;
    white-space: nowrap;
}

@media screen and (min-width: $phone) {
    .header-wrap {
        padding: 3% 0;

        > div,
        > img {
            height: 62px;
            line-height: 62px;
        }
    }

    .content-wrap {
        width: 65%;
        padding: 6% 5% 4%;
    }

    .title-wrap {
        line-height: 45px;
        font-size: 30px;
    }

    .service-wrap {
        margin-bottom: 40px;
    }

    .wrap {
        height: 85px;
        margin: 4% auto;
        padding: 0 32% 0 8%;
        border-radius: 10px;
    }

    .url {
        font-size: 18px;
    }

    .btn-go {
        width: 24%;
        background: url('/static/image/domain/icon_arrow.png') 50% 0 no-repeat;
    }
}

@media screen and (min-width: $pad) {
    .domain-wrap {
        background-image: url('/static/image/domain/bg.jpg');
    }
}
</style>
