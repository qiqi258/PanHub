<template>
  <div class="post-container">
    <div class="post-content" v-html="content"></div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const content = ref('');

// 获取文章内容
async function fetchPostContent() {
  try {
    const response = await $fetch<any>(`/post/${route.params.file}`);
    content.value = response;
  } catch (e) {
    console.error('Failed to fetch post content:', e);
  }
}

onMounted(() => {
  fetchPostContent();
});
</script>

<style scoped>
.post-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  min-height: 100vh;
}

.post-content {
  background: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .post-container {
    padding: 10px;
  }
  
  .post-content {
    padding: 20px;
  }
}
</style>