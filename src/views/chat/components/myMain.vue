<script lang="ts" setup>
import {
  inject,
  onMounted,
  reactive,
  computed,
  ref,
  watch,
  nextTick,
} from "vue";
import createStoreUserInfo from "@/store/userinfo";

import moment from "moment";
let useUserInfo: any = createStoreUserInfo();
let hhxsUserId: any = localStorage.getItem("hhxsUserId");
const msgBoxRef: any = ref(null);
const obj: any = reactive({
  keyword: "",
});
const filterUserList = computed(() => {
  return useUserInfo.userAllList.filter(
    (item: any) =>
      item.nickName.includes(obj.keyword) && item.hhxsUserId != hhxsUserId
  );
});
const setUserInfo = (res: any) => {
  useUserInfo.currentCantUser = {
    hhxsUserId: res.hhxsUserId,
    nickName: res.nickName,
    userAvatar: res.userAvatar,
  };
};
watch(useUserInfo, () => {
  nextTick(() => {
    msgBoxRef.value.scrollTop = msgBoxRef.value.scrollHeight;
  });
});
</script>
<template>
  <div class="qm-msg-box" ref="msgBoxRef">
    <!-- 先循环找到你想要聊天的那个人 -->
    <div v-for="(list, index) in useUserInfo.currentChat" :key="index">
      <div>
        <!-- 再循环显示聊天记录 -->
        <div class="text-center qm-time">
          {{
            moment(new Date(Number(list.msgTime))).format("YYYY-MM-DD HH:mm:ss")
          }}
        </div>
        <div
          :class="[
            'd-flex align-start mb-5',
            list.hhxsUserId == hhxsUserId ? 'justify-end' : '',
          ]"
        >
          <el-avatar
            v-if="list.hhxsUserId != hhxsUserId"
            :src="list.userAvatar"
          ></el-avatar>
          <el-avatar
            v-if="list.hhxsUserId == hhxsUserId"
            :src="list.userAvatar"
            style="order: 1"
          ></el-avatar>
          <span class="content mx-4">{{ list.msgContent }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.qm-msg-box {
  width: 100%;
  height: 100%;
  overflow: auto;
  padding: 20px;
}
.qm-time {
  font-size: 12px;
  color: #999;
  line-height: 40px;
}
.justify-end {
  .content {
    background-color: #a9ea7a;
  }
}
.content {
  background-color: antiquewhite;
  padding: 8px;
  border-radius: 10px;
  font-weight: bold;
  max-width: 200px;
  display: inline-block;
  text-align: left;
  font-weight: 300;
  font-size: 14px;
  white-space: pre-wrap;
  font-variant: small-caps;
  word-wrap: break-word;
}
</style>
