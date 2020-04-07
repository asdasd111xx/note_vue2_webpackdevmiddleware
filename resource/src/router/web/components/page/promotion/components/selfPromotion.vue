<template>
    <div class="content">
        <div class="nav-distribute clearfix">
            <span
                v-for="(item, key) in distributeOption"
                :key="`nav-distribute-${key}`"
                class="radio"
            >
                <input
                    :id="`nav-distribute-${key}`"
                    v-model="distributeState"
                    :checked="key === distributeState"
                    type="radio"
                    name="distribute-state"
                />
                <label :for="`nav-distribute-${key}`">
                    <span class="radio-item"><span class="radio-item-checked" /></span>
                    {{ $t(distributeI18n[key]) }}
                </label>
            </span>
        </div>
        <div class="list-distribute">
            <self-promotion-table
                :state="distributeOption[distributeState]"
                :data="promoData"
                :i18n="distributeI18n"
                :toggle-popup="togglePopup"
                :set-popup="setPopup"
            />
        </div>
    </div>
</template>

<script>
import { API_PROMOTION_MEM } from '@/config/api';
import ajax from '@/lib/ajax';
import selfPromotionTable from './selfPromotionTable';

/**
 * 固定頁 - 優惠活動 (我的優惠)
 * @module promotion/components/selfPromotion
 */
export default {
    components: {
        selfPromotionTable
    },
    props: {
        togglePopup: {
            type: Function,
            required: true
        },
        setPopup: {
            type: Function,
            required: true
        }
    },
    data() {
        return {
            distributeState: 'all',
            distributeI18n: {
                all: 'S_ALL',
                already: 'S_ASSIGN_ALREADY',
                yet: 'S_ASSIGN_NOT_YET',
                cancel: 'S_CANCEL',
                unqualified: 'S_UNABLE_PASS'
            },
            distributeOption: {
                all: ['all'],
                already: ['already'],
                yet: ['yet', 'unqualified'],
                cancel: ['cancel']
            },
            promoData: []
        };
    },
    created() {
        ajax({
            method: 'get',
            url: API_PROMOTION_MEM,
            errorAlert: false,
            success: (response) => {
                this.promoData = response.ret;
            }
        });
    }
};
</script>

<style lang="scss" scoped>
@import "~@/css/variable.scss";

.content {
    padding: 0 30px;

    .nav-distribute {
        margin-bottom: 17px;

        .radio {
            float: left;
            margin: 0 24px 8px 0;
            min-width: 74px;
            line-height: 25px;

            input[type="radio"] {
                display: none;
            }
            input[type="radio"] + label {
                position: relative;
                display: block;
                padding-left: 28px;
                line-height: 21px;
                text-align: left;

                .radio-item {
                    position: absolute;
                    left: 0;
                    top: 0;

                    display: inline-block;
                    border: 2px solid #CCC;
                    border-radius: 100%;
                    height: 21px;
                    width: 21px;
                    vertical-align: middle;

                    .radio-item-checked {
                        position: absolute;
                        top: 2px;
                        left: 2px;
                        border-radius: 100%;
                        height: 13px;
                        width: 13px;
                        cursor: pointer;
                    }
                }
            }
            input[type="radio"]:checked + label {
                .radio-item {
                    border-color: #55B9FF;

                    .radio-item-checked {
                        background: #CCC;
                    }
                }
            }
        }
    }

    @media screen and (min-width: $pad) {
        padding: 0;
    }
}
</style>
