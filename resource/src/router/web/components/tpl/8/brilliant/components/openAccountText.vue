<template>
    <div class="open-account-text">
        <h1>{{ i18nList.openAccountTitle[language] }}</h1>
        <ul class="intro">
            <li v-for="item in 11" :key="`openAccount${item}`">
                {{ i18nList[`openAccount${item}`][language] }}
            </li>
        </ul>
        <div
            v-if="btnStatus"
            class="btn-wrap"
            @click="$emit('change-agreement')"
        >
            <icon
                name="check-circle"
                width="20"
                height="20"
            />
            <span>{{ $text('S_I_ADULT_AGREE', '我已届满合法博彩年龄，且同意各项开户条约。') }}</span>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import i18nList from '../config/lang';

export default {
    props: {
        btnStatus: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            i18nList
        };
    },
    computed: {
        ...mapGetters({
            curLang: 'getCurLang'
        }),
        language() {
            const openLang = ['zh-tw', 'zh-cn', 'en'];
            return openLang.includes(this.curLang) ? this.curLang : 'zh-cn';
        }
    }
};
</script>


<style lang="scss" scoped>
.open-account-text {
    h1 {
        color: #F2D718;
        font-size: 24px;
        font-weight: bold;
        line-height: 25px;
        margin: 18px 0 20px;
    }

    .intro {
        width: 625px;
        margin: 0;
        padding: 18px 0 18px 25px;

        li {
            color: #FFF;
            margin: 0;
            font-size: 12px;
            line-height: 22px;
        }
    }

    .btn-wrap {
        width: 498px;
        margin: 0 auto;
        padding: 14px 10px 7px 25px;
        background-color: #4D83B2;
        cursor: pointer;

        span {
            font-size: 20px;
            margin-left: 10px;
            vertical-align: top;
        }
    }
}
</style>
