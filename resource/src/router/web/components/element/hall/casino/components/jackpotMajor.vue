<template>
    <div :class="getClass(['game-jackpot-wrap'])">
        <div :class="getClass(['single-jackpot-wrap'])">
            <div
                v-for="jackpotInfo in singleJackpot"
                :key="`jackpot-${jackpotInfo.code}`"
                :class="getClass(['single-jackpot', curVendor])"
            >
                <img :src="$getCdnPath(`/static/image/game/${jackpotInfo.icon}_icon.png`)" />
                <span :class="getClass(['single', 'single-name'])">{{ jackpotInfo.name }}</span>
                <span :class="getClass(['single', 'single-icon'])">¥</span>
                <span :class="getClass(['single', 'single-amount-text'])">{{ jackpotInfo.amount }}</span>
            </div>
        </div>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
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
    computed: {
        ...mapGetters({
            isBackEnd: 'getIsBackEnd',
            jackpot: 'getJackpot'
        }),
        /**
         * 獨立彩金列表
         * @method singleJackpot
         * @returns {array} 當前須顯示的彩金資料
         */
        singleJackpot() {
            const { jpGrand } = this.jackpot[this.curVendor];
            const { jpMajor } = this.jackpot[this.curVendor];

            return [
                {
                    name: 'GRAND',
                    icon: 'grand',
                    amount: this.priceToNormal(jpGrand)
                },
                {
                    name: 'MAJOR',
                    icon: 'major',
                    amount: this.priceToNormal(jpMajor)
                }
            ];
        }
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
