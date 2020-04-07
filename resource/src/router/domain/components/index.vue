<template>
    <div :class="$style['domain-wrap']">
        <div :class="$style['header-wrap']">
            <div :class="$style['logo-wrap']">
                <ele-logo :logo-width="200" :logo-height="62" />
            </div>
        </div>
        <div :class="$style['content-wrap']">
            <div :class="$style['title-wrap']">{{ memInfo.config.domain_name[curLang] }}&nbsp;{{ $text('S_BACKUP_DOMAIN', '备用网址') }}</div>
            <!-- eslint-disable vue/no-v-html -->
            <div
                ref="service-text"
                :class="$style['service-wrap']"
                v-html="getText('01')"
            />
            <!-- eslint-enable vue/no-v-html -->
            <div :class="[$style['url-wrap'], 'clearfix']">
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
            <!-- eslint-disable vue/no-v-html -->
            <div :class="$style['tips-wrap']">
                <div :class="$style.title">{{ $text('S_BACKUP_DOMAIN_TEXT_02', '状况排除') }}</div>
                <div :class="$style.tips" v-html="getText('03')" />
                <div :class="[$style['guide-wrap'], 'clearfix']">
                    <div :class="$style.guide">
                        <div :class="$style['guide-title']">{{ $text('S_BACKUP_DOMAIN_TEXT_04', '打开IE浏览器，选择：') }}</div>
                        <div :class="$style['guide-text']" v-html="getText('05')" />
                        <div :class="[$style['img-wrap'], 'clearfix']">
                            <img :src="$getCdnPath('/static/image/domain/browser01.png')" />
                        </div>
                    </div>
                    <div :class="$style.line" />
                    <div :class="$style.guide">
                        <div :class="$style['guide-title']">{{ $text('S_BACKUP_DOMAIN_TEXT_06', '打开Chrome浏览器，选择：') }}</div>
                        <div :class="$style['guide-text']" v-html="getText('07')" />
                        <div :class="[$style['img-wrap'], 'clearfix']">
                            <img :src="$getCdnPath('/static/image/domain/browser02.png')" />
                        </div>
                    </div>
                    <div :class="$style.line" />
                    <div :class="$style.guide">
                        <div :class="$style['guide-title']">{{ $text('S_BACKUP_DOMAIN_TEXT_08', '如果您体验过程中出现卡顿：') }}</div>
                        <div :class="$style['guide-text']" v-html="getText('09')" />
                        <div :class="[$style['img-wrap'], 'clearfix']">
                            <img :src="$getCdnPath('/static/image/domain/browser03.png')" />
                        </div>
                    </div>
                    <div :class="$style.line" />
                    <div :class="$style.guide">
                        <div :class="$style['guide-title']">{{ $text('S_BACKUP_DOMAIN_TEXT_10', '建议使用火狐或谷歌浏览器：') }}</div>
                        <div :class="$style['guide-text']" v-html="getText('11')" />
                        <div :class="[$style['img-wrap'], 'clearfix']">
                            <img :src="$getCdnPath('/static/image/domain/browser02.png')" />
                            <img :src="$getCdnPath('/static/image/domain/browser04.png')" />
                        </div>
                    </div>
                </div>
            </div>
            <!-- eslint-enable vue/no-v-html -->
        </div>
        <div :class="$style['footer-wrap']">Copyright © {{ memInfo.config.domain_name[curLang] }} Reserved.</div>
    </div>
</template>

<script>
/* global $ */
import { mapGetters, mapActions } from 'vuex';
import ajax from '@/lib/ajax';
import eleLogo from '@/router/web/components/common/logo';
import store from '@/store';

export default {
    components: {
        eleLogo
    },
    data() {
        return {
            urlList: []
        };
    },
    computed: {
        ...mapGetters({
            memInfo: 'getMemInfo',
            curLang: 'getCurLang',
            onlineService: 'getOnlineService'
        })
    },
    beforeRouteEnter(to, from, next) {
        store.dispatch('actionMemInit').then(() => { next(); });
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
        ...mapActions([
            'actionChangePage'
        ]),
        getText(index) {
            if (index === '01') {
                const ele = ['<span>', '</span>'];

                return this.$text(`S_BACKUP_DOMAIN_TEXT_${index}`, {
                    replace: [
                        { target: '%s', value: '' },
                        { target: '%s', value: ele[0] },
                        { target: '%s', value: ele[1] }
                    ]
                });
            }

            if (index === '11') {
                return this.$text(`S_BACKUP_DOMAIN_TEXT_${index}`, {
                    replace: [
                        { target: '%s', value: this.memInfo.config.domain_name[this.curLang] },
                        { target: '%s', value: '<span>' },
                        { target: '%s', value: '</span>' }
                    ]
                });
            }

            return this.$text(`S_BACKUP_DOMAIN_TEXT_${index}`, {
                replace: [
                    { target: '%s', value: '<span>' },
                    { target: '%s', value: '</span>' }
                ]
            });
        },
        onClick(url) {
            window.open(`https://${url}`, '_blank');
        },
        onService() {
            if (!this.onlineService.url) {
                return;
            }

            this.actionChangePage({ page: 'service', type: 'static' });
        }
    }
};
</script>

<style lang="scss" src="@/css/index.scss" scope></style>
<style lang="scss" module>
.domain-wrap {
    position: relative;
    height: 100%;
    padding-bottom: 39px;
    background: #17173C url('/static/image/domain/bg.jpg') 50% 0 no-repeat;
}

.header-wrap {
    padding: 30px 0;
}

.logo-wrap {
    width: 200px;
    height: 62px;
    margin: 0 auto;
}

.content-wrap {
    width: 1200px;
    min-height: 840px;
    margin: 0 auto;
    padding: 45px 60px;
    background: url('/static/image/domain/content_bg.png') 50% 0 no-repeat;
}

.title-wrap {
    line-height: 45px;
    color: #FFF;
    font-weight: bold;
    font-size: 30px;
    text-align: center;
}

.service-wrap {
    line-height: 24px;
    margin-bottom: 40px;
    color: #FFF;
    font-size: 16px;
    text-align: center;

    span {
        cursor: pointer;
        color: #11EFCF;
    }
}

.url-wrap {
    padding: 0 30px 35px;
    border-bottom: 1px solid #383757;
}

.wrap {
    position: relative;
    float: left;
    width: 300px;
    height: 85px;
    margin: 15px 20px;
    padding: 0 80px 0 20px;
    border-radius: 10px;
    background: url('/static/image/domain/url_bg.jpg') 0 0 no-repeat;
    transition: all 0.1s ease-in-out;
    cursor: pointer;

    &::before {
        content: '';
        display: inline-block;
        height: 100%;
        vertical-align: middle;
    }

    &:hover {
        background: #28284A;
        box-shadow: 0 0 10px 0 #0E9AC4 inset, 0 0 10px 4px #0E9AC4;
        opacity: 0.9;

        .url {
            color: #FDFF8E;
        }

        .btn-go {
            border-left-color: #23466B;
            background: url('/static/image/domain/icon_arrow_h.png') 50% 0 no-repeat;
            color: #FDFF74
        }
    }
}

.url {
    display: inline-block;
    line-height: 22px;
    color: #FFF;
    font-size: 15px;
    vertical-align: middle;
}

.btn-go {
    overflow: hidden;
    position: absolute;
    top: 25px;
    right: 0;
    width: 65px;
    height: 35px;
    line-height: 15px;
    padding: 20px 3px ;
    border-left: 1px solid #48ADCE;
    background: url('/static/image/domain/icon_arrow.png') 50% 0 no-repeat;
    color: #FFF;
    font-size: 15px;
    text-align: center;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.tips-wrap {
    margin-top: 45px;
    padding: 0 45px;
}

.title {
    line-height: 36px;
    color: #FFF;
    font-size: 24px;
    text-align: center;
}

.tips {
    line-height: 24px;
    color: #CCC;
    font-size: 16px;
    text-align: center;

    > span {
        color: #FDFF74;
    }
}

.guide-wrap {
    margin-top: 30px;

    > div {
        float: left;
        height: 310px;
    }
}

.guide {
    width: 201px;
    padding-top: 20px;
}

.line {
    width: 1px;
    margin: 0 30px;
    background-color: #383757;
}

.guide-title {
    height: 84px;
    line-height: 28px;
    margin-bottom: 10px;
    color: #1EC3D9;
    font-weight: bold;
    font-size: 17px;
}

.guide-text {
    height: 126px;
    line-height: 21px;
    margin-bottom: 25px;
    color: #CCC;
    font-size: 14px;

    > span {
        color: #FDFF74;
    }
}

.img-wrap {
    > img {
        float: right;
        width: 39px;
        height: 40px;
        margin-left: 10px;
    }
}

.footer-wrap {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 39px;
    line-height: 39px;
    background-color: #0C0C21;
    color: #FFF;
    font-size: 13px;
    text-align: center;
}
</style>
