<template>
  <section class="result-header">
    <div class="stats">
      <span
        >结果: <strong>{{ total }}</strong></span
      >
      <span
        >用时: <strong>{{ elapsedMs }}ms</strong></span
      >
    </div>
    <div class="tools" v-if="hasResults">
      <label
        >排序
        <select v-model="model.sortType">
          <option value="default">默认</option>
          <option value="date-desc">时间(新→旧)</option>
          <option value="date-asc">时间(旧→新)</option>
          <option value="name-asc">名称(A→Z)</option>
          <option value="name-desc">名称(Z→A)</option>
        </select>
      </label>
      <label v-if="platforms.length">
        平台
        <select v-model="model.filterPlatform">
          <option value="all">全部</option>
          <option v-for="p in platforms" :key="p" :value="p">
            {{ platformName(p) }}
          </option>
        </select>
      </label>
    </div>
  </section>
</template>

<script setup lang="ts">
const props = defineProps<{
  total: number;
  elapsedMs: number;
  platforms: string[];
  hasResults: boolean;
  platformName: (p: string) => string;
  model: { sortType: string; filterPlatform: string };
}>();
defineEmits(["update:model"]);
</script>

<style scoped>
.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 14px 2px;
}
.result-header .tools {
  display: flex;
  gap: 10px;
  align-items: center;
}
.result-header select {
  padding: 6px 8px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
}
</style>
