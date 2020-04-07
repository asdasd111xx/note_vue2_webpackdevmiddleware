<template>
    <div :class="mainClass">
        <div
            v-if="!grandExcluded.includes(curVendor) && parseFloat(jackpot[curVendor].jpGrand).toString() !== 'NaN'"
            :class="[getClass(['cumulation-jackpot-wrap']), 'clearfix']"
        >
            <div :class="getClass(['jackpot-title-img-wrap'])">
                <div :class="getClass(['jackpot-title-img', curVendor])" />
                <span>JACKPOT</span>
            </div>
            <div :class="getClass(['jackpot-show-wrap'])">
                <div :class="getClass(['jackpot-amount-bar', curVendor])">
                    <span :class="getClass(['amount-icon'])">¥</span>
                    <animated-number
                        :value="grandAmount"
                        :format-value="formatToPrice"
                        :duration="duration"
                        :class="getClass(['jackpot-text'])"
                    />
                </div>
            </div>
            <div
                v-if="jackpot[curVendor].jpUserList && jackpot[curVendor].jpUserList.length !== 0"
                :class="getClass(['jackpot-accumulation-list'])"
            >
                <transition-group key="user-list-slide" name="slide-top">
                    <div
                        v-for="userInfo in userList"
                        :key="`userInfo-${userInfo.id}`"
                        :class="[getClass(['jackpot-accumulation']), 'clearfix']"
                    >
                        <span :class="getClass(['user', 'user-number'])">no.{{ userInfo.id }}</span>
                        <span :class="getClass(['user', 'user-name'])">{{ userInfo.username }}</span>
                        <span :class="getClass(['user', 'user-amount'])">{{ userInfo.amount }}</span>
                    </div>
                </transition-group>
            </div>
        </div>
        <div
            v-if="!singleExcluded.includes(curVendor) && jackpot[curVendor].jpMinor"
            :class="getClass(['single-jackpot-wrap'])"
        >
            <transition-group key="single-jackpot-slide" name="slide-top">
                <div
                    v-for="jackpotInfo in singleJackpot"
                    :key="`jackpot-${jackpotInfo.code}`"
                    :class="getClass(['single-jackpot', curVendor])"
                >
                    <img :src="$getCdnPath(`${cdnDomain}/image/casino/${curVendor}/Game_${jackpotInfo.code}.png`)" />
                    <span :class="getClass(['single', 'single-name'])">{{ jackpotInfo.name }}</span>
                    <span :class="getClass(['single', 'single-icon'])">¥</span>
                    <span :class="getClass(['single', 'single-amount-text'])">{{ jackpotInfo.amount }}</span>
                </div>
            </transition-group>
        </div>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import animatedNumber from 'animated-number-vue';

export default {
    components: {
        animatedNumber
    },
    props: {
        theme: {
            type: String,
            required: true
        },
        curVendor: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            listIndex: 0, // 彩金索引值
            userIndex: 0, // 玩家索引值
            animateTimer: {}, // 動畫時間器
            duration: 0, // 動畫時間
            isTimer: false, // 是否有使用時間器
            grandAmount: 0,
            isDesktop: true,
            grandDefaultTheme: ['jdb', 'cq9'], // 總彩金預設樣式
            singleExcluded: ['bbin'], // 不顯示遊戲彩金
            grandExcluded: ['fg'] // 不顯示總彩金
        };
    },
    computed: {
        ...mapGetters({
            isBackEnd: 'getIsBackEnd',
            cdnDomain: 'getCdnDomain',
            jackpot: 'getJackpot',
            sidebarWidth: 'getSidebarWidth'
        }),
        /**
         * 判斷當前class
         * @method mainClass
         * @returns {object} 外層ClassName
         */
        mainClass() {
            const {
                singleExcluded, grandDefaultTheme, curVendor, jackpot, getClass
            } = this;
            const info = {
                'game-jackpot-single': !singleExcluded.includes(curVendor) && jackpot[curVendor].jpMinor,
                'grand-default-wrap': grandDefaultTheme.includes(curVendor),
                'game-no-jackpot': jackpot[curVendor].jpUserList && jackpot[curVendor].jpUserList.length === 0
            };

            return getClass(['game-jackpot-wrap', 'game-jackpot-single', 'grand-default-wrap', 'game-no-jackpot'], info);
        },
        /**
         * 獨立彩金列表
         * @method singleJackpot
         * @returns {array} 當前須顯示的彩金資料
         */
        singleJackpot() {
            const minorData = this.jackpot[this.curVendor].jpMinor;
            const secondIndex = this.listIndex + 1 === minorData.length ? 0 : this.listIndex + 1;

            // 資料長度只有一筆
            if (minorData.length === 1) {
                return [{
                    ...minorData[this.listIndex],
                    amount: this.priceToNormal(minorData[this.listIndex].amount)
                }];
            }

            return [
                {
                    ...minorData[this.listIndex],
                    amount: this.priceToNormal(minorData[this.listIndex].amount)
                },
                {
                    ...minorData[secondIndex],
                    amount: this.priceToNormal(minorData[secondIndex].amount)
                }
            ];
        },
        /**
         * 玩家列表
         * @method userList
         * @returns {array} 當前須顯示的玩家資料
         */
        userList() {
            const listData = this.jackpot[this.curVendor].jpUserList;

            if (listData.length <= 3) {
                return listData.map((items, index) => ({
                    ...items,
                    id: index + 1,
                    amount: this.priceToNormal(listData[index].amount)
                }));
            }

            if (this.isDesktop) {
                const listLength = listData.length;

                const secondIndex = this.userIndex + 2 > listLength ? (this.userIndex + 1) - listLength : this.userIndex + 1;
                const thirdIndex = this.userIndex + 3 > listLength ? (this.userIndex + 2) - listLength : this.userIndex + 2;

                return [
                    {
                        ...listData[this.userIndex],
                        id: this.userIndex + 1,
                        amount: this.priceToNormal(listData[this.userIndex].amount)
                    },
                    {
                        ...listData[secondIndex],
                        id: secondIndex + 1,
                        amount: this.priceToNormal(listData[secondIndex].amount)
                    },
                    {
                        ...listData[thirdIndex],
                        id: thirdIndex + 1,
                        amount: this.priceToNormal(listData[thirdIndex].amount)
                    }
                ];
            }
            return [
                {
                    ...listData[this.userIndex],
                    id: this.userIndex + 1,
                    amount: this.priceToNormal(listData[this.userIndex].amount)
                }
            ];
        }
    },
    watch: {
        jackpot(next, prev) {
            if (this.isBackEnd) {
                return;
            }

            if (!this.grandExcluded.includes(this.curVendor) && this.jackpot[this.curVendor].jpGrand && prev[this.curVendor].jpGrand !== next[this.curVendor].jpGrand) {
                this.cumulationAnimate();
            }

            if (!this.singleExcluded.includes(this.curVendor) && this.jackpot[this.curVendor].jpMinor && !this.isTimer) {
                this.singleAnimate();
            }
        }
    },
    created() {
        this.handleResize();
        window.addEventListener('resize', this.handleResize);
    },
    mounted() {
        if (!this.grandExcluded.includes(this.curVendor) && this.jackpot[this.curVendor].jpGrand) {
            this.cumulationAnimate();
        }

        if (!this.singleExcluded.includes(this.curVendor) && this.jackpot[this.curVendor].jpMinor) {
            this.singleAnimate();
        }
    },
    destroyed() {
        window.removeEventListener('resize', this.handleResize);
    },
    methods: {
        ...mapActions([
            'actionSetJackpot'
        ]),
        /**
         * 取得Class名稱
         * @method getClass
         * @param {array} className - 要取得的Class名稱
         * @param {object} classInfo - 判斷是否要取得此Class
         * @returns {object} Class Object
        */
        getClass(className, classInfo) {
            const style = this[`$style_${this.theme}`] || this.$style_basic;
            const classObj = {};

            className.forEach((name) => {
                if (!style[name]) {
                    return;
                }

                const value = classInfo && name in classInfo ? classInfo[name] : true;
                classObj[style[name]] = value;
            });

            return classObj;
        },
        /**
         * 獨立彩金動畫
         * @method singleAnimate
        */
        singleAnimate() {
            if (this.jackpot[this.curVendor].jpMinor.length < 2) {
                return;
            }

            this.isTimer = true;

            this.animateTimer = setInterval(() => {
                // 重設彩金索引值
                if (this.listIndex + 2 >= this.jackpot[this.curVendor].jpMinor.length) {
                    this.listIndex = (this.listIndex + 2) - this.jackpot[this.curVendor].jpMinor.length;
                    return;
                }
                this.listIndex += 2;
            }, 5000);
        },
        /**
         * 累積彩金套件動畫
         * @method cumulationAnimate
        */
        cumulationAnimate() {
            // 套件動畫以 duration 控制動畫速度，因此設定初始值為0，讓金額直接到開始值後在開始跑動畫
            this.duration = 0;

            if (!this.grandAmount) {
                this.grandAmount = this.jackpot[this.curVendor].jpGrand - 2;
            }

            if (this.grandAmount > this.jackpot[this.curVendor].jpGrand) {
                this.$nextTick(() => {
                    this.grandAmount = this.jackpot[this.curVendor].jpGrand;
                });
                return;
            }

            if (this.jackpot[this.curVendor].jpUserList && !this.isTimer) {
                this.userAnimate();
            }

            // 套件動畫速度及結束值設定
            this.$nextTick(() => {
                this.duration = 60000;
                this.grandAmount = this.jackpot[this.curVendor].jpGrand;
            });
        },
        /**
         * 玩家列表動畫
         * @method userAnimate
        */
        userAnimate() {
            if (this.jackpot[this.curVendor].jpUserList.length <= 3) {
                return;
            }

            this.isTimer = true;

            this.animateTimer = setInterval(() => {
                const userlistLength = this.jackpot[this.curVendor].jpUserList.length;

                // 顺序演算
                if (!this.isDesktop) {
                    this.userIndex = this.userIndex + 2 > userlistLength ? 0 : this.userIndex += 1;
                    return;
                }
                this.userIndex = this.userIndex + 3 >= userlistLength ? (this.userIndex + 3) - userlistLength : this.userIndex += 3;
            }, 5000);
        },
        /**
         * 套件金額格式化
         * @method formatToPrice
        */
        formatToPrice(value) {
            return `${Number(value).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
        },
        /**
         * 監聽裝置
         * @method handleResize
        */
        handleResize() {
            this.isDesktop = window.innerWidth >= 960 + this.sidebarWidth;
        },
        /**
         * 金額格式化
         * @method priceToNormal
        */
        priceToNormal(amount) {
            // 取小數點後二位，若為整數則補小數點
            let price = (Math.round(amount * 100) / 100).toString().replace(/^(\d*)$/, '$1.');
            // 只取小數點後二位
            price = `${price}00`.replace(/(\d*\.\d{2})\d*/, '$1');
            // 小數點千分位逗點
            price = price.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

            return price;
        }
    }
};
</script>

<style lang="scss" src="../css/basic/gameJackpot.scss" module="$style_basic"></style>
<style lang="scss" src="../css/519/gameJackpot.scss" module="$style_519"></style>
