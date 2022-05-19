<script lang="ts" setup>
import { inject, onMounted, reactive, computed } from "vue";
import { useWebSocket } from "@/utils/websocket";
import createStoreUserInfo from "@/store/userinfo";
let useUserInfo = createStoreUserInfo();
let hhxsUserId = localStorage.getItem("hhxsUserId");
const obj = reactive({
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
</script>
<template>
  <div>
    <el-row style="height: 60px">
      <!-- 我的信息 -->
      <div class="myinfo">
        <el-avatar
          fit="cover"
          :src="useUserInfo.userBasic.userAvatar"
        ></el-avatar>
        <span class="ml-4">{{ useUserInfo.userBasic.nickName }}</span>
      </div>
    </el-row>
    <!-- 搜索好友 -->
    <el-row style="height: 50px">
      <el-input v-model="obj.keyword" placeholder="搜索好友">
        <el-button slot="append" icon="el-icon-search"></el-button>
      </el-input>
    </el-row>
    <!-- 好友列表 -->
    <el-row style="height: 390px">
      <el-table
        @cell-click="setUserInfo"
        :data="filterUserList"
        height="390px"
        stripe
        style="width: 100%"
        :show-header="false"
      >
        <el-table-column label="Thumbnail">
          <template #default="scope">
            <div style="display: flex; align-items: center">
              <el-avatar
                :src="
                  scope.row.userAvatar +
                  '?x-image-process=image/resize,w_80,limit_0'
                "
              ></el-avatar>
              <span style="margin-left: 10px">{{ scope.row.nickName }}</span>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
  </div>
</template>

<style scoped lang="scss">
:deep(.el-avatar) {
  img {
    width: 100%;
    height: 100%;
  }
}
.myinfo {
  text-align: left;
  vertical-align: middle;
  margin-top: 10px;
  margin-left: 10px;
}
.myinfo span {
  text-align: left;
  vertical-align: middle;
}
.userlist {
  vertical-align: middle;
  cursor: pointer;
}
.userlist span {
  vertical-align: middle;
  margin-left: 10px;
}
</style>
