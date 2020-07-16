import { format, addDays } from 'date-fns';

export default {
    data() {
        const now = new Date(format(new Date(), 'yyyy/MM/dd HH:mm:ss+20:00')); // +20:00 自動減12小時變成美東時間
        const limit = addDays(now, -30);
        const start = addDays(now, -29);

        return {
            estToday: now,
            limitDays: limit,
            startTime: start,
            endTime: now,
            state: '0',
            searchInfo: {
                state: '0',
                startTime: start,
                endTime: now
            },
            detailInfo: null
        };
    },
    computed: {
        options() {
            return [
                { value: 0, text: this.$text('S_ALL', '全部') },
                { value: 1, text: this.$text('S_ASSIGN_ALREADY', '已派发') },
                { value: 3, text: this.$text('S_UNQUALIFIED_01', '资格不符') }
            ];
        }
    },
    methods: {
        // setDetailData(detail) {
        //     if (detail && detail.state !== 1) {
        //         return;
        //     }

        //     this.detailInfo = detail;
        // },
        onSearch() {
            const { state, startTime, endTime } = this;
            this.searchInfo = { state, startTime, endTime };
        }
    }
};
