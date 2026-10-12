<template>
  <!-- 列表没有数据时的空状态：文件夹图标和「暂无数据」。 -->
  <div class="empty-data" role="status">
    <img :src="folder" alt="" />
    <p>{{ label }}</p>
  </div>
</template>

<script setup>
import folder from '@/assets/events/empty-folder.png'

defineProps({ label: { type: String, required: true } })
</script>

<style scoped>
.empty-data {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 420px;
  padding: 48px 16px;
  text-align: center;
}

.empty-data img {
  width: 88px;
  height: auto;
}

.empty-data p {
  margin: 16px 0 0;
  color: #c8c3bb;
  font-size: 14px;
  line-height: 20px;
  letter-spacing: 1px;
}
</style>
