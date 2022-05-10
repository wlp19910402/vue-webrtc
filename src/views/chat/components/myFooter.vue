<script lang="ts" setup>
import { inject, onMounted, reactive, ref } from "vue";
import { useWebSocket } from "@/utils/websocket";
import createStoreUserInfo from "@/store/userinfo";
import myAside from "./components/myAside.vue";
import myFooter from "./components/myFooter.vue";
import myMain from "./components/myMain.vue";
let useUserInfo = createStoreUserInfo();
let hhxsUserId = localStorage.getItem("hhxsUserId");
useUserInfo.getUserAllList();
let msgInput = ref("");
const ws = inject("ws");
const handleSendMessage = () => {
  if (msgInput.value.trim() === "") return;
  let msg = {
    userAvatar: useUserInfo.userBasic.userAvatar,
    hhxsUserId: useUserInfo.userBasic.hhxsUserId,
    nickName: useUserInfo.userBasic.nickName,
    msgTime: new Date().getTime(),
    msgType: "text",
    msgContent: msgInput.value,
  };
  ws.send(
    JSON.stringify({
      cmd: 2,
      sendType: 0,
      userId: hhxsUserId,
      chatId: useUserInfo.currentCantUser.hhxsUserId,
      message: msg,
    })
  );
  msgInput.value = "";
  const currchat = useUserInfo.chatList.find(
    (item) => item.hhxsUserId === useUserInfo.currentCantUser.hhxsUserId
  );
  if (currchat) {
    currchat.dataList.push(msg);
  } else {
    useUserInfo.chatList.push({
      hhxsUserId: useUserInfo.currentCantUser.hhxsUserId,
      dataList: [msg],
    });
  }
};
</script>
<template>
  <div class="d-flex align-center justify-center mt-4">
    <el-input
      type="textarea"
      placeholder="请输入内容"
      v-model="msgInput"
      :autosize="false"
      resize="none"
      rows="1"
      :disabled="useUserInfo.currentCantUser.hhxsUserId === undefined"
    >
    </el-input>
    <el-button
      class="ml-8"
      :disabled="msgInput.trim() === ''"
      color="green"
      @click="handleSendMessage"
    >
      发送</el-button
    >
  </div>
</template>

<style></style>
