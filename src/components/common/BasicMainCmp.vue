<!-- 页面的主外框模式 -->
<script lang="ts" setup>
import { inject, computed } from "vue";
// import createStoreApp from "@/store/app";

// const useStoreApp: Store<
//   "app",
//   TYPE_APP.StoreAppState,
//   {},
//   TYPE_APP.StoreAppActions
// > = createStoreApp();

const mainWidth: any = inject("mainWidth");
const scaleVaule = computed(() => {
  return mainWidth.value / 1920;
});
</script>

<template>
  <div
    class="qm-scale-box"
    :style="{
      transform: `scale(${scaleVaule}) `,
    }"
  >
    <div class="qm-basic-main-layouts-resize d-flex">
      <div class="qm-mask desktop-app-mask"></div>
      <slot></slot>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.qm-basic-main-layouts-resize {
  transition: all 0.5s cubic-bezier(1, 0.01, 0.55, 0.75);
  border-radius: 20px;
  padding: 93px 77px;
  border-style: solid;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  flex: 1;
  position: relative;
  @include key_value("border-color", "card_bg_1");
  @include key_value("background-color", "board_bg_1");
  @include key_value("box-shadow", "shadow_card_2");
  &::before {
    content: "";
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 0;
    left: 0;
    top: 0;
    border-radius: 20px;
  }
  .desktop-app-mask {
    background: none;
    width: 100%;
    height: 100%;
    backdrop-filter: blur(0);
    cursor: pointer;
  }
}
.qm-scale-box {
  width: 1920px;
  height: 1080px;
  position: fixed;
  left: 50%;
  top: 50%;
  margin-left: -960px;
  margin-top: -540px;
  padding: 30px;
  display: flex;
  flex-direction: column;
}
</style>
