<script setup lang="ts">
import BasicMainCmp from "@/components/common/BasicMainCmp.vue";
</script>

<template>
  <BasicMainCmp>
    <router-view v-slot="{ Component }">
      <keep-alive>
        <component :is="Component" v-if="$route.meta.keepAlive" />
      </keep-alive>
      <component :is="Component" v-if="!$route.meta.keepAlive" />
    </router-view>
  </BasicMainCmp>
</template>

<style lang="scss" scoped></style>
