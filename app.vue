<template>
  <div class="layout">
    <header class="header">
      <nav class="nav">
        <NuxtLink to="/" class="brand">PanHub</NuxtLink>
        <div class="spacer" />
        <NuxtLink to="/api" class="link">API 调试台</NuxtLink>
      </nav>
    </header>
    <main class="main">
      <NuxtPage />
    </main>
  </div>
</template>

<style scoped>
.layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
.header {
  /* 顶部不再吸顶，改由结果区域的 Tab 吸顶 */
  background: #fff;
  border-bottom: 1px solid #eee;
}
.nav {
  max-width: 1100px;
  margin: 0 auto;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  gap: 12px;
}
.brand {
  font-weight: 800;
  color: #111;
  text-decoration: none;
}
.spacer {
  flex: 1;
}
.link {
  color: #333;
  text-decoration: none;
  padding: 6px 10px;
  border-radius: 8px;
}
.link:hover {
  background: #f6f7f9;
}
.main {
  flex: 1;
  /* 初始不出现滚动条，给页脚状态预留 16px 内边距 */
  padding-bottom: 16px;
}
</style>
