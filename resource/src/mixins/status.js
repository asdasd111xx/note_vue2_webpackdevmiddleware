import { getDoamin } from '@/lib/getCurrentDoamin';

// 404 500 upup no_service domain判斷
export default {
    data() {
        return {
            imgSite: '',
            domain: {
                domain: '',
                site: 'porn1'
            }
        }
    },
    created() {
        getDoamin().then((res) => {
            this.domain = res || '';
            this.imgSite = res && res.site ? res.site : 'porn1';
        })
    },
};
