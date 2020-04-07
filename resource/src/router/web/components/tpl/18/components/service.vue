<template>
    <div class="online-service" @click="openCustomerService">
        <div class="service-content">
            <div class="service-img">
                <img :src="$getCdnPath('/static/image/tpl/customizeHome/500011/service.png')" />
            </div>
            <span class="service-text">{{ this.$text('S_CUSTOMER_SERVICE_ONLINE', '在线客服') }}</span>
        </div>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
    computed: {
        ...mapGetters({
            onlineService: 'getOnlineService'
        })
    },
    methods: {
        ...mapActions([
            'actionChangePage'
        ]),
        openCustomerService() {
            if (this.onlineService.url) {
                this.actionChangePage({ page: 'service', type: 'static' });
            }
        }
    }
};
</script>

<style lang="scss" scoped>
.online-service {
    width: 66px;
    height: 96px;
    margin-left: 640px;
    position: fixed;
    left: 50%;
    bottom: 50px;
    z-index: 9;
    color: #CF2A2A;
    background: #F7B500;
    border: 3px solid #FFF;
    cursor: pointer;
    transition: 0.3s;

    &:hover {
        background-color: #F4D46A;
        transition: background-color 0.3s;
    }
}

.service-img {
    width: 100%;
    padding-top: 3px;
    padding-left: 3px;
    padding-right: 3px;
    padding-bottom: 0;

    img {
        width: 100%;
    }
}

.service-content {
    color: #000;
    transition: ease 0.5s;

    &:hover {
        opacity: 0.5;
    }
}

.service-icon {
    text-align: center;
}

.service-text {
    display: block;
    width: 100%;
    text-align: center;
    font-size: 12px;
    line-height: 1;
}
</style>
