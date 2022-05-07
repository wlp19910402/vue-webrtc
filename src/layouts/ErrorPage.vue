<script lang="ts" setup>
import { inject, computed } from "vue";
const screenWidth: any = inject("screenWidth");
const scaleVaule = computed(() => {
  return screenWidth.value / 1920;
});
</script>

<template>
  <div
    class="qm-scale-box d-flex flex-column align-center justify-center"
    :style="{
      transform: `scale(${scaleVaule}) `,
      width: `calc(100vw / ${scaleVaule} )`,
      minHeight: `calc(100vh / ${scaleVaule} )`,
    }"
  >
    <div class="error-page">
      <div class="error-page__content">
        <div class="error-page__content__title">
          <div class="error-page-code">
            <i class="iconfont icon-a-4"></i>
          </div>
          <div class="error-page-earth">
            <i class="iconfont icon-earth-full"></i>
          </div>
          <i class="iconfont qm-icon-xingxing-1 icon-xingxing"></i>
          <i class="iconfont qm-icon-xingxing-2 icon-xingxing"></i>
          <div class="error-page-code">
            <i class="iconfont icon-a-4"></i>
          </div>
        </div>
        <div class="error-page__content__desc">
          <p>您访问的页面已经离家出走了～</p>
        </div>
        <router-link class="error-page__content__btn" to="/">
          返回首页
        </router-link>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.qm-scale-box {
  height: auto;
  position: fixed;
  transform-origin: left top;
  display: flex;
  flex-direction: column;
}
.error-page {
  width: 600px;
  height: 480px;
  transform-origin: left top;

  .error-page__content__title {
    width: 480px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: relative;
    .qm-icon-xingxing-1 {
      position: absolute;
      right: -40px;
      top: 80px;
      font-size: 30px;
      @include key_value("color", "primary_1");
      animation: xingxing_1 2s infinite;
    }
    .qm-icon-xingxing-2 {
      position: absolute;
      left: 180px;
      top: 36px;
      font-size: 24px;
      color: #ffffff;
      animation: xingxing_1 1.5s infinite;
    }
    .error-page-earth {
      width: 250px;
      height: 250px;
      border-radius: 50%;
      animation: bgLinear 4s infinite ease;
      position: relative;
      @include themeify {
        background: radial-gradient(
          rgba(themed(primary_1), 1) 24%,
          rgba(themed(primary_1), 0.3) 25%,
          rgba(themed(primary_1), 0.3) 57%,
          rgba(themed(primary_1), 0.1) 58%,
          rgba(themed(primary_1), 0.1) 65%
        );
      }
      .iconfont {
        width: 150px;
        width: 150px;
        height: 150px;
        background: #bab5ff;

        display: block;
        border-radius: 50%;
        margin: 50px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        font-size: 156px;
        @include key_value("color", "primary_1");
        animation: rotateEarth 12s infinite linear;
      }
    }
  }
  .error-page-code {
    width: 120px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    .iconfont {
      font-size: 188px;
      @include key_value("color", "primary_1");
    }
  }
  .error-page__content__desc {
    padding: 60px 60px 40px;
    width: 100%;
    text-align: center;
    @include key_value("color", "font-primary_1");
    font-size: 24px;
  }
  .error-page__content__btn {
    display: flex;
    @include qm-btn-primary;
    width: 110px;
    height: 44px;
    border-radius: 22px;
    color: #fff;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin: 0 auto;
    font-size: 18px;
    &:hover {
      transform: scale(1.1);
    }
  }
}

@keyframes bgLinear {
  0% {
    background: radial-gradient(
      rgba(themed(primary_1), 1) 24%,
      rgba(themed(primary_1), 0.3) 25%,
      rgba(themed(primary_1), 0.3) 57%,
      rgba(themed(primary_1), 0.08) 58%,
      rgba(themed(primary_1), 0.08) 65%
    );
  }
  25% {
    background: radial-gradient(
      rgba(themed(primary_1), 1) 24%,
      rgba(themed(primary_1), 0.3) 25%,
      rgba(themed(primary_1), 0.3) 57%,
      rgba(themed(primary_1), 0.13) 58%,
      rgba(themed(primary_1), 0.13) 65%
    );
  }
  50% {
    background: radial-gradient(
      rgba(themed(primary_1), 1) 24%,
      rgba(themed(primary_1), 0.3) 25%,
      rgba(themed(primary_1), 0.3) 57%,
      rgba(themed(primary_1), 0.08) 58%,
      rgba(themed(primary_1), 0.08) 65%
    );
  }
  75% {
    background: radial-gradient(
      rgba(themed(primary_1), 1) 24%,
      rgba(themed(primary_1), 0.27) 25%,
      rgba(themed(primary_1), 0.27) 57%,
      rgba(themed(primary_1), 0.08) 58%,
      rgba(themed(primary_1), 0.08) 65%
    );
  }

  100% {
    background: radial-gradient(
      rgba(themed(primary_1), 1) 24%,
      rgba(themed(primary_1), 0.3) 25%,
      rgba(themed(primary_1), 0.3) 57%,
      rgba(themed(primary_1), 0.08) 58%,
      rgba(themed(primary_1), 0.08) 65%
    );
  }
}
@keyframes rotateEarth {
  to {
    transform: rotate(0deg);
  }
  from {
    transform: rotate(360deg);
  }
}
@keyframes xingxing_1 {
  0% {
    transform: scale(0.6);
    opacity: 0.6;
    // transform: rotate(0deg);
  }
  50% {
    transform: scale(1);
    opacity: 1;
    // transform: rotate(30deg);
  }
  100% {
    transform: scale(0.6);
    opacity: 0.6;
    // transform: rotate(0deg);
  }
}
</style>
