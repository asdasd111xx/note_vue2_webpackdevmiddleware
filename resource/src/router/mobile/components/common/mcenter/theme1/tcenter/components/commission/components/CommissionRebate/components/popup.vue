<template>
    <transition name="fade">
        <div class="pop-rebate-wrap pop-class">
            <div class="title">{{ $t("S_REAL_TIME_REBATE") }}</div>
            <div class="content-wrap">
                <template>
                    <div class="content">
                        <h1>
                            {{
                                computeState
                                    ? $t("S_DISTRIBUTION_COMPLETED")
                                    : $t("S_SYSTEM_COMPUTE_WAGER")
                            }}
                        </h1>
                        <div class="rebate-title">
                            {{ $t("S_COMPUTE_WAGER_INTERVAL") }}
                        </div>

                        <template v-if="computeState">
                            <div class="rebate-title">
                                {{ $t("S_COMPUTING_VALID_BET") }}
                            </div>
                            <div class="rebate-value">
                                43123
                            </div>
                            <div class="rebate-title">
                                {{ $t("S_COMPUTING_PREMIUM_AMOUNT") }}
                            </div>
                            <div class="rebate-value">
                                123
                            </div>
                            <div class="rebate-entry-button-wrap">
                                <a
                                    id="button-entry-history"
                                    href="###"
                                    @click="close()"
                                >
                                    {{ $t("S_REBATE_HISTORY") }}
                                </a>
                                <a
                                    id="button-entry-close"
                                    href="###"
                                    @click="close()"
                                >
                                    {{ $t("S_CLOSE") }}
                                </a>
                            </div>
                        </template>
                        <template v-else>
                            <p>{{ $t("S_COMPUTE_WAGER_TIP") }}</p>
                        </template>
                    </div>
                </template>
            </div>
        </div>
    </transition>
</template>

<script>
import { mapActions } from "vuex";
import EST from "@/lib/EST";
import mcenter from "@/api/mcenter";

export default {
    props: {
        data: {
            type: Object,
            default: () => {}
        }
    },
    data() {
        return {
            computeState: false,
            receiveEntryData: {},
        };
    },
    created() {
        setTimeout(() => {
            this.computeState = true;
        }, 5000);
    },
    methods: {
        close() {}
    }
};
</script>

<style lang="scss" scoped>
.pop-rebate-wrap {
    position: absolute;
    top: 50%;
    right: 0;
    left: 0;
    margin: -45% auto 0;
    border-radius: 5px;
    background: #fff;
    padding-bottom: 24px;
    width: 98%;
    max-width: 700px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
    .title {
        height: 48px;
        line-height: 48px;
        border-radius: 5px 5px 0 0;
        background-color: #be9e7f;
        color: #fff;
        font-size: 16px;
        text-align: center;
    }
    .content-wrap {
        padding: 13px;

        .content {
            text-align: center;
        }
        h1 {
            font-size: 16px;
            margin-bottom: 11px;
        }
    }
    .rebate-title,
    .rebate-value {
        line-height: 19px;
        margin-bottom: 5px;
        font-size: 14px;
    }
    .rebate-value {
        color: #2693cf;
    }
    .rebate-loding {
        margin: 20px 0;
    }
    .rebate-entry-button-wrap {
        text-align: center;
        margin-top: 15px;

        a {
            display: inline-block;
            width: 48%;
            max-width: 140px;
            height: 42px;
            line-height: 42px;
            text-decoration: none;
            border-radius: 4px;
            margin: 0 5px;
        }
        #button-entry-history {
            background: linear-gradient(to left, #bd9d7d, #f9ddbd);
            color: #fff;
        }
        #button-entry-close {
            background: #faf5f0;
            color: #be9e7f;
        }
    }
}
</style>
