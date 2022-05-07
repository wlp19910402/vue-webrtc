<script setup lang="ts">
import { inject, computed } from "vue";
const screenWidth: any = inject("screenWidth");
const scaleVaule = computed(() => {
  return screenWidth.value / 1920;
});
</script>

<template>
  <div
    class="qm-scale-box"
    :style="{
      transform: `scale(${scaleVaule}) `,
      width: `calc(100vw / ${scaleVaule} )`,
      minHeight: `calc(100vh / ${scaleVaule} )`,
    }"
  >
    <router-view v-slot="{ Component }">
      <keep-alive>
        <component :is="Component" v-if="$route.meta.keepAlive" />
      </keep-alive>
      <component :is="Component" v-if="!$route.meta.keepAlive" />
    </router-view>
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
</style>
