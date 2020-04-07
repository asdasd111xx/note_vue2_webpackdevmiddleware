<template>
    <div :class="$style.contact">
        <div :class="$style['main-title']">{{ $text('S_CONTACT_US', '联系我们') }}</div>
        <div :class="$style.content">
            <div :class="$style.wrap">
                {{ $text('S_CUSTOMER_SERVICE_ONLINE', '在线客服') }}
                <p>7*24 {{ $text('S_CUSTOMER_SERVICE_ONLINE', '在线客服') }}</p>
                <p>{{ $text('S_SERVICE_ONLINE_TIP_01') }}。</p>
                <p>
                    {{ $text('S_SERVICE_ONLINE_TIP_02') }}
                    <a
                        :class="$style.note"
                        href="#"
                        @click.prevent="onService"
                    >
                        {{ $text('S_BIBET', '必博') }} {{ $text('S_CUSTOMER_SERVICE_ONLINE', '在线客服') }}
                    </a>
                </p>
            </div>
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
        onService() {
            if (!this.onlineService.url) {
                return;
            }

            this.actionChangePage({ page: 'service', type: 'static' });
        }
    }
};
</script>

<style lang="scss" module>
.contact {
    width: 100%;
    background-color: #FFF;
}
.main-title {
    line-height: 36px;
    padding: 13px 40px;
    background: url('/static/image/tpl/18/about/bg01.png') 0 0 no-repeat;
    background-size: 100%;
    color: #000;
    font-size: 25px;
    font-weight: 400;
}

.content {
    padding: 0px 40px 80px;
}

.wrap {
    line-height: 28px;
    color: #333;
    font-size: 14px;
    font-weight: 600;
    margin-top: 30px;
    > p {
        line-height: 28px;
        color: #9298A2;
        font-size: 14px;
        font-weight: 400;
        margin-bottom: 0px;
    }
}
.note {
    color: rgb(247, 181, 0);
    text-decoration: none;
    &:hover {
        color: rgb(249, 196, 51);
    }
    &:focus {
        color: rgb(249, 196, 51);
    }
    &:active {
        color: rgb(222, 163, 0);
    }
}
</style>
