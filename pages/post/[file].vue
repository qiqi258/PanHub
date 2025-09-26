<!-- 文章详情页面 -->
<template>
  <div class="post-container">
    <!-- 导航链接区域 -->
    <div class="nav-links">
      <!-- 下一篇链接 -->
      <a v-if="nextPost" @click.prevent="goToNextPost" class="nav-link next-link">
        下一篇 →
      </a>
      
      <!-- 返回首页链接 -->
      <NuxtLink to="/" class="nav-link back-link">
        ← 返回首页
      </NuxtLink>
    </div>

    <!-- 文章内容区域 -->
    <div v-if="content" class="post-content">
      <div v-html="content"></div>
    </div>

    <!-- 加载状态 -->
    <div v-else-if="loading" class="loading">
      正在加载文章...
    </div>

    <!-- 错误状态 -->
    <div v-else-if="error" class="error">
      {{ error }}
    </div>
  </div>
</template>

<script setup lang="ts">
// 获取路由实例和导航器
const route = useRoute();
const router = useRouter();

// 定义响应式变量
const content = ref('');
const loading = ref(true);
const error = ref('');
const nextPost = ref<{ filename: string } | null>(null);

// 获取文章列表并找到下一篇文章
async function fetchNextPost() {
  try {
    const response = await $fetch<any>('/api/post-list');
    if (response.success && Array.isArray(response.data)) {
      const currentIndex = response.data.findIndex(
        (post: any) => post.filename === route.params.file
      );
      
      // 如果找到当前文章，并且还有下一篇
      if (currentIndex !== -1 && currentIndex < response.data.length - 1) {
        nextPost.value = response.data[currentIndex + 1];
      } else {
        nextPost.value = null;
      }
    }
  } catch (e) {
    console.error('Failed to fetch next post:', e);
    nextPost.value = null;
  }
}

// 跳转到下一篇文章
function goToNextPost() {
  if (nextPost.value) {
    router.push(`/post/${nextPost.value.filename}`);
  }
}

// 获取文章内容的函数
async function fetchPostContent() {
  try {
    loading.value = true;
    error.value = '';
    
    // 发起请求获取文章内容
    const response = await $fetch<string>(`/post/${route.params.file}`);
    content.value = response;
    
    // 获取下一篇文章信息
    await fetchNextPost();
  } catch (e) {
    console.error('Failed to fetch post content:', e);
    error.value = '文章加载失败，请稍后重试';
  } finally {
    loading.value = false;
  }
}

// 监听路由参数变化，重新加载文章
watch(() => route.params.file, () => {
  fetchPostContent();
});

// 在组件挂载时获取文章内容
onMounted(() => {
  fetchPostContent();
});
</script>

<style scoped>
/* 容器样式 */
.post-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  min-height: 100vh;
  position: relative;
}

/* 导航链接区域样式 */
.nav-links {
  display: flex;
  justify-content: space-between;
  padding: 10px 20px;
  margin: 60px auto 20px;
  max-width: 800px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

/* 导航链接基础样式 */
.nav-link {
  color: #666;
  text-decoration: none;
  font-size: 15px;
  transition: all 0.3s;
  cursor: pointer;
  padding: 8px 16px;
  border-radius: 4px;
  background: rgba(0, 0, 0, 0.02);
}

.nav-link:hover {
  color: #1890ff;
  background: rgba(24, 144, 255, 0.05);
}

/* 文章内容样式 */
.post-content {
  background: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  line-height: 1.6;
  margin-top: 20px;
}

/* 加载状态样式 */
.loading {
  text-align: center;
  padding: 40px;
  color: #666;
  font-size: 16px;
  margin-top: 20px;
}

/* 错误状态样式 */
.error {
  text-align: center;
  padding: 40px;
  color: #ff4d4f;
  font-size: 16px;
  margin-top: 20px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .post-container {
    padding: 10px;
  }
  
  .post-content {
    padding: 20px;
  }

  .nav-links {
    margin: 50px 10px 20px;
    padding: 10px;
  }

  .nav-link {
    font-size: 14px;
    padding: 6px 12px;
  }
}

/* 文章内容的全局样式 */
:deep(h1) {
  font-size: 2em;
  margin-bottom: 1em;
  color: #333;
}

:deep(h2) {
  font-size: 1.5em;
  margin: 1em 0;
  color: #444;
}

:deep(p) {
  margin: 1em 0;
  color: #666;
}

:deep(img) {
  max-width: 100%;
  height: auto;
  border-radius: 4px;
  margin: 1em 0;
}

:deep(a) {
  color: #1890ff;
  text-decoration: none;
}

:deep(a:hover) {
  text-decoration: underline;
}
</style>