<template>
    <div :class="[$style['money-detail-wrap'], colorClass]">
        <mcenter-header :header-setting="headerSetting" />
        <div :class="$style['choice-swipe-list']">
            <swiper :options="swiperOption" :class="$style['type-list']">
                <swiper-slide
                    v-for="(option, index) in choiceTypes"
                    :key="`type-${index}`"
                    :class="[$style['type-item'], { [$style['is-active']]: choiceItem === option.key || type === option.key }]"
                >
                    <span @click="getTypeData(option.key)">
                        {{ option.text }}
                    </span>
                </swiper-slide>
            </swiper>
            <div :class="$style['choice-btn']" @click="showChoiceList()">
                <img :src="$getCdnPath('/static/image/mobile/mcenter/ic_arrow_d.png')" />
            </div>
        </div>
        <div v-if="showAllChoice" :class="$style['choice-expand-wrap']">
            <div :class="$style['choice-mask']" />
            <div :class="$style['choice-content']">
                <div
                    v-for="(option, index) in choiceTypes"
                    :key="`choice-${index}`"
                    :class="[$style['choice-item'], { [$style['is-active']]: choiceItem === option.key || type === option.key }]"
                    @click="getTypeData(option.key)"
                >
                    {{ option.text }}
                </div>
            </div>
        </div>
        <div :class="$style['total-input-wrap']">
            <div v-if="showSearch" :class="$style['select-list']">
                <div :class="$style['select-input']">
                    <div>{{ $text('S_PLEASE_SELECT_TYPE', '请选择类别') }}</div>
                    <select v-model="type">
                        <option
                            v-for="(option, key) in options"
                            :key="`option-${key}`"
                            :value="option.key"
                            :selected="type === option.key ? 'selected' : ''"
                        >
                            {{ option.text }}
                        </option>
                    </select>
                </div>
                <div :class="$style['date-pick']">
                    <div>{{ $text('S_STARTED_DAY', '起始日') }}</div>
                    <input v-model="startTime" type="date" />
                </div>
                <div :class="$style['date-pick']">
                    <div>{{ $text('S_END_DAY', '结束日') }}</div>
                    <input v-model="endTime" type="date" />
                </div>
                <div :class="$style['select-list-btn']">
                    <button :class="$style['select-btn']" @click="setInquire()">{{ $text('S_INQUIRE', '查询') }}</button>
                </div>
            </div>
        </div>
        <div v-if="type !== 'all'" :class="$style['date-header']">
            <div :class="$style['date-header-left']">{{ $text('S_DATE', '日期') }}</div>
            <div :class="$style['date-header-right']">
                <span>{{ startTime }} ～ {{ endTime }}</span>
                <div :class="$style['sort-btn']" @click="onSort(sort === 'asc' ? 'desc' : 'asc')"/>
            </div>
        </div>
        <div :class="$style['bank-money-detail']">
            <template v-if="detailList.length">
                <div
                    v-for="(item, index) in detailList"
                    :key="`money-detail-${index}`"
                    :class="$style['detail-wrap']"
                >
                    <div :class="$style['detail-top']">
                        <div :class="$style['top-title']">
                            <div :class="$style['top-date']">{{ item.created_at }}</div>
                            <div :class="$style['top-name']">{{ opcodeList[item.opcode] }}</div>
                        </div>
                        <div :class="[$style['top-money'], { [$style['is-negative']]: item.amount < 0 }]">{{ item.amount }}</div>
                        <div :class="$style['top-expand']">
                            <img
                                :class="$style['top-expand-btn']"
                                :src="$getCdnPath(!expandDetailList.includes(item.id) ? '/static/image/mobile/mcenter/btn_expand2.png' : '/static/image/mobile/mcenter/btn_collapse2.png')"
                                @click="selectExpandDetail(item.id)"
                            />
                        </div>
                    </div>
                    <div v-if="expandDetailList.includes(item.id)" :class="[$style['detail-content-wrap'], 'clearfix']">
                        <div :class="$style['detail-line']"/>
                        <div :class="$style['detail-content']">
                            <span :class="$style['content-left']">{{ $text('S_TRANSACTION_GOLD', '交易额度') }}</span>
                            <div :class="[$style['content-right'], { [$style['is-negative']]: item.amount < 0 }]">{{ item.amount }}</div>
                        </div>
                        <div :class="$style['detail-content']">
                            <span :class="$style['content-left']">{{ $text('S_MAIN_SUM', '主帐户小计') }}</span>
                            <div :class="$style['content-right']">{{ item.balance }}</div>
                        </div>
                        <div :class="$style['detail-content']">
                            <span :class="$style['content-left']">{{ $text('S_BETTYPE_1', '单号') }}</span>
                            <div :class="$style['content-right']">{{ item.ref_id }}</div>
                        </div>
                        <div :class="$style['detail-content']">
                            <span :class="$style['content-left']">{{ $text('S_REMARK', '备注') }}</span>
                            <div :class="$style['content-right']">{{ item.memo }}</div>
                        </div>
                    </div>
                </div>
                <pagination
                    :class="$style.pagination"
                    :page="pageNow"
                    :total="pageAll"
                    @update:page="(page) => onChange(false, page)"
                />
            </template>
            <template v-else>
                <div :class="$style['no-data']">
                    <div :class="$style['no-data-img']"/>
                    <p>{{ $text('S_NO_DATA_GENERATED', '尚未产生数据') }}</p>
                </div>
            </template>
            <div :class="[$style['remind-message'], { [$style['show']]: messageStatus }]">
                <div>{{ $text('S_CHANGE_PLEASE_CLICK', '更改查询条件请重复点击上方搜索') }}</div>
            </div>
        </div>
        <v-style>
            <!-- eslint-disable vue/html-indent -->
            .{{ $style['select-btn'] }} {
                background-image: url({{ $getCdnPath('/static/image/mobile/mcenter/btn_button_n.png') }});
            }
            .{{ $style['expand-btn'] }} {
                background: url({{ $getCdnPath('/static/image/mobile/mcenter/btn_cancel_n.png') }}) 100%/100% no-repeat;
            }
            <!-- eslint-enable vue/html-indent -->
        </v-style>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { swiper, swiperSlide } from 'vue-awesome-swiper';
import mixin from '@/mixins/mcenter/moneyDetail';
import pagination from '../pagination';

export default {
    components: {
        mcenterHeader: () => import(/* webpackChunkName: 'recordDeposit' */'@/router/mobile/components/common/mcenter/theme1/header'),
        pagination,
        swiper,
        swiperSlide
    },
    mixins: [mixin],
    data() {
        return {
            headerSetting: {
                title: this.$text('S_FUNDS_DETAILS', '资金明细'),
                leftBtns: {
                    icon: 'arrow',
                    onClick: () => this.$router.push('/mobile/mcenter')
                },
                balance: true
            },
            swiperOption: {
                slidesPerView: 'auto' // 容器呈現內的項目數量
            },
            showSearch: false,
            expandDetailList: [],
            choiceItem: '',
            showAllChoice: false
        };
    },
    computed: {
        ...mapGetters({
            siteConfig: 'getSiteConfig',
            memInfo: 'getMemInfo'
        }),
        expandBtnText() {
            return this.detailList.length !== this.expandDetailList.length || this.expandDetailList.length === 0 ? this.$text('S_SHOW', '展开') : this.$text('S_CLOSE02', '收合');
        },
        colorClass() {
            return [
                {
                    [this.$style[`site-${this.memInfo.user.domain}`]]: this.$style[`site-${this.memInfo.user.domain}`],
                    [this.$style['preset-color']]: !this.$style[`site-${this.memInfo.user.domain}`]
                }
            ];
        }
    },
    watch: {
        detailList() {
            this.expandDetailList = [];
        }
    },
    methods: {
        /**
         * 取得圖片
         * @method getImg
         * @return {Object} 圖片路徑
         */
        getImg() {
            const srcImg = this.showSearch ? '/static/image/mobile/mcenter/btn_inquire_h.png' : '/static/image/mobile/mcenter/btn_inquire.png';

            return {
                src: this.$getCdnPath(srcImg),
                error: this.$getCdnPath('/static/image/mobile/mcenter/btn_inquire_h.png'),
                loading: this.$getCdnPath('/static/image/game_loading_s.gif')
            };
        },
        selectExpandDetail(key) {
            if (!this.expandDetailList.includes(key)) {
                this.expandDetailList.push(key);
                return;
            }
            this.expandDetailList.splice(this.expandDetailList.indexOf(key), 1);
        },
        showAllDetail() {
            if (this.detailList.length === this.expandDetailList.length) {
                this.expandDetailList = [];
                return;
            }

            this.detailList.forEach((key) => {
                if (this.expandDetailList.includes(key.id)) {
                    return;
                }
                this.expandDetailList.push(key.id);
            });
        },
        getTypeData(type) {
            this.choiceItem = type;
            this.showAllChoice = false;

            if (type === 'search') {
                this.type = 'all';
                this.showSearch = !this.showSearch;
                return;
            }

            this.showSearch = false;
            this.onType(type);
        },
        showChoiceList() {
            this.showAllChoice = !this.showAllChoice;
        },
        setInquire() {
            this.messageStatus = true;
            this.onInquire();
        }
    }
};
</script>

<style lang="scss" src="./css/index.scss" module></style>
