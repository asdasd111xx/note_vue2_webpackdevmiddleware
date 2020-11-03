import { format, addDays } from 'date-fns';

export default {
    data() {
        const now = new Date(format(new Date(), 'yyyy/MM/dd HH:mm:ss+20:00')); // +20:00 自動減12小時變成美東時間
        const limit = addDays(now, -29);
        const start = addDays(now, -29);

        return {
            estToday: now,
            limitDays: limit,
            startTime: start,
            endTime: now,
            searchInfo: {
                startTime: start,
                endTime: now
            },
            detailInfo: null
        };
    },
    methods: {
        onSearch() {
            const { startTime, endTime } = this;
            this.searchInfo = { startTime, endTime };
        }
    }
};
