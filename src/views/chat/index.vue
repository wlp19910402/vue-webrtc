<script setup lang="ts">

</script>

<template>
  <div class="qm-mian-card-box"></div>
  <div class="qm-mian-box">
    <video id="video-local" controls autoplay></video>
  </div>
</template>

<style lang="scss" scoped>
.qm-mian-card-box {
  position: relative;
  width: 16.4%;
  height: 100%;
  min-width: 220px;
  max-width: 320px;
  border-radius: 30px;
  perspective: 1000;
  transform-style: preserve-3d;
  transition: all 0.5s ease-in-out;
}

.qm-mian-box {
  position: absolute;
  right: 50px;
  overflow: hidden;
  width: calc(100% - 440px);
  height: calc(100% - 106px);
  padding: 20px 40px 60px 40px;
  margin-top: -20px;
}
</style>
