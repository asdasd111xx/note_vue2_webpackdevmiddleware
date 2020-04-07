<template>
    <div :class="$style['artist-info-wrap']">
        <div :class="$style['btn-prev']" @click="$router.back()">
            <img :src="$getCdnPath('/static/image/mobile/tpl/porn1/header/btn_nav_back_h.png')" />
        </div>
        <div :class="$style['main-info-wrap']">
            <img :src="$getCdnPath('/static/image/mobile/tpl/porn1/artist/bg.png')" />
            <div :class="$style['main-info']">
                <div :class="$style['profile-photo']">
                    <img :src="image" />
                    <div>{{ $text('S_VIDEO_AMOUNT', { replace: [{ target: '%s', value: amount }] }) }}</div>
                </div>
                <div :class="$style['info-text']">
                    <span :class="$style.artist">{{ artist }}</span>
                    <span :class="$style.birthday">{{ birthday }}</span>
                </div>
            </div>
        </div>
        <div :class="$style['sub-info-wrap']">
            <div :class="$style['info-text']">
                <span :class="$style.height">{{ $text('S_HEIGHT', '身高') }}：{{ height }}cm</span>
                <span :class="$style.measurement">{{ $text('S_MEASUREMENT', '三围') }}：{{ measurement }}cm</span>
                <span :class="$style.cup">{{ cup }}{{ $text('S_CUP', '杯') }}</span>
            </div>
            <div :class="$style['desc-wrap']">
                <div :class="$style.title">{{ $text('S_DESC', '简介') }}</div>
                <div :class="$style.desc">{{ desc }}</div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        artist: {
            type: String,
            required: true
        },
        image: {
            type: String,
            required: true
        },
        birthday: {
            type: String,
            required: true
        },
        measurement: {
            type: String,
            required: true
        },
        cup: {
            type: String,
            required: true
        },
        desc: {
            type: String,
            required: true
        },
        height: {
            type: Number,
            required: true
        },
        amount: {
            type: Number,
            required: true
        }
    }
};
</script>

<style lang="scss" module>
@import '~@/css/variable.scss';

.artist-info-wrap {
    position: relative;
}

.btn-prev {
    position: absolute;
    top: 5px;
    left: 5px;
    z-index: 1;
    width: 24px;
    height: 24px;

    > img {
        display: block;
        width: 100%;
    }
}

.main-info-wrap {
    position: relative;

    > img {
        display: block;
        width: 100%;
    }
}

.main-info {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
}

.profile-photo {
    position: relative;
    width: 80px;
    height: 80px;
    margin: 0 auto;

    > img {
        display: block;
        width: 80px;
        height: 80px;
        border-radius: 50%;
    }

    > div {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 20px;
        line-height: 20px;
        border-radius: 10px;
        background: linear-gradient(#FF3574, #FF004F);
        color: #FFF;
        font-weight: 500;
        font-size: 12px;
        text-align: center;
    }
}

.info-text {
    height: 30px;
    margin-top: 10px;
    text-align: center;

    &::before {
        content: '';
        display: inline-block;
        height: 100%;
        vertical-align: middle;
    }

    > span {
        display: inline-block;
        font-weight: 500;
        vertical-align: middle;
    }
}

.artist {
    color: #FFF;
    font-size: 18px;
}

.birthday {
    margin-left: 8px;
    color: #D3D7E2;
    font-size: 12px;
}

.height,
.measurement,
.cup {
    color: #D3D7E2;
    font-size: 12px;
}

.measurement,
.cup {
    margin-left: 8px;
}

.desc-wrap {
    padding: 0 15px 10px;
}

.title {
    height: 30px;
    line-height: 30px;
    color: #FFF;
    font-weight: 500;
    font-size: 15px;
}

.desc {
    line-height: 20px;
    color: #9A9DA4;
    font-weight: 500;
    font-size: 12px
}

@media screen and (min-width: $phone) {
    .profile-photo {
        > div {
            font-size: 13px;
        }
    }

    .artist {
        font-size: 19px;
    }

    .birthday {
        font-size: 13px;
    }

    .height,
    .measurement,
    .cup {
        font-size: 13px;
    }

    .title {
        font-size: 16px;
    }

    .desc {
        font-size: 13px;
    }
}

@media screen and (min-width: $pad) {
    .profile-photo {
        > div {
            font-size: 14px;
        }
    }

    .artist {
        font-size: 20px;
    }

    .birthday {
        font-size: 14px;
    }

    .height,
    .measurement,
    .cup {
        font-size: 14px;
    }

    .title {
        font-size: 18px;
    }

    .desc {
        font-size: 14px;
    }
}
</style>
