<template>
  <div class="basic-wrap">
    <div class="deposit-preview-wrap">
      <div class="preview-wrap">
        <div
          v-for="index in 3"
          :key="`preview-group-${index}`"
          class="pay-group-item"
        >
          <img
            :src="
              $getCdnPath('/static/image/simple/deposit/payment_default_bg.jpg')
            "
          />
        </div>
      </div>
      <div class="preview-wrap">
        <div class="mode-title">{{ $text("S_PAY_MODE", "支付方式") }}</div>
        <div class="pay-mode-item">
          <img
            :src="
              $getCdnPath(
                '/static/image/simple/deposit/methods_default_bg01.jpg'
              )
            "
          />
          <img
            :src="
              $getCdnPath(
                '/static/image/simple/deposit/methods_default_bg02.jpg'
              )
            "
          />
          <img
            :src="
              $getCdnPath(
                '/static/image/simple/deposit/methods_default_bg03.jpg'
              )
            "
          />
        </div>
      </div>
      <div class="preview-wrap">
        <div class="mode-title">{{ $text("S_DEPOSIT_MONEY", "存款金额") }}</div>
        <div class="pay-money-wrap" />
      </div>
      <div class="preview-wrap">
        <div class="mode-title">
          {{ $text("S_ESTIMATE_ENTER", "预计存入") }}
        </div>
        <div class="preview-real-wrap">
          <div class="pay-money-wrap" />
          <div class="pay-deposit-btn">
            {{ $text("S_ENTER_PAY", "立即充值") }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.preview-wrap {
  margin-top: 25px;
}

.pay-group-item {
  display: inline-block;
  vertical-align: top;
  width: 33%;
  margin-right: 2px;
  background-color: #e5e5e5;

  img {
    display: block;
    max-width: 100%;
    margin: 0 auto;
  }
}

.mode-title {
  display: inline-block;
  vertical-align: top;
  width: 100px;
  line-height: 30px;
  font-size: 16px;
  color: #262626;
}

.pay-mode-item {
  display: inline-block;
  vertical-align: top;

  img {
    display: inline-block;
    vertical-align: top;
    width: 148px;
    height: 63px;
    margin-right: 5px;
    border-radius: 4px;
  }
}

.preview-real-wrap {
  display: inline-block;
  vertical-align: top;
}

.pay-money-wrap {
  display: inline-block;
  vertical-align: top;
  width: 190px;
  height: 40px;
  border-radius: 4px;
  background-color: #e5e5e5;
}

.pay-deposit-btn {
  display: block;
  width: 190px;
  height: 40px;
  line-height: 40px;
  margin-top: 8px;
  text-align: center;
  border-radius: 4px;
  color: #fff;
  background-color: #e5e5e5;
}
</style>
