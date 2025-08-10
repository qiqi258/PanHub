<template>
  <div class="home">
    <header class="hero">
      <div class="hero__logo">
        <img src="/favicon.ico" alt="logo" />
      </div>
      <h1 class="hero__title">盘Hub</h1>
      <p class="hero__subtitle">基于 TG 频道的网盘搜索工具</p>
    </header>

    <SearchBox
      v-model="kw"
      :loading="loading"
      :placeholder="placeholder"
      @search="onSearch"
      @reset="resetSearch" />

    <ResultHeader
      v-if="searched"
      :total="total"
      :elapsed-ms="elapsedMs"
      :platforms="platforms"
      :has-results="hasResults"
      :platform-name="platformName"
      :model="{ sortType: sortType, filterPlatform: filterPlatform }" />

    <section v-if="hasResults" class="results">
      <ResultGroup
        v-for="group in groupedResults"
        :key="group.type"
        :title="platformName(group.type)"
        :color="platformColor(group.type)"
        :icon="platformIcon(group.type)"
        :items="visibleSorted(group.items)"
        :expanded="isExpanded(group.type)"
        :initial-visible="initialVisible"
        @toggle="toggleExpand(group.type)"
        @copy="copyLink" />
    </section>

    <section v-else-if="searched && !loading" class="empty">
      <div class="card">
        <div class="empty__inner">未找到相关资源，试试其他关键词</div>
      </div>
    </section>

    <section v-if="error" class="alert">{{ error }}</section>
  </div>
</template>

<script setup lang="ts">
import SearchBox from "./SearchBox.vue";
import ResultHeader from "./ResultHeader.vue";
import ResultGroup from "./ResultGroup.vue";
import type {
  GenericResponse,
  SearchResponse,
  MergedLinks,
} from "@/server/core/types/models";

const config = useRuntimeConfig();
const apiBase = (config.public?.apiBase as string) || "/api";

const placeholder = "搜索网盘资源，支持 115、百度云、阿里云盘等";

const kw = ref("");
// 默认快速搜索，后续自动触发深度搜索
const mode = ref<"fast" | "deep">("fast");
const isFocused = ref(false);

const loading = ref(false);
const error = ref("");
const searched = ref(false);
const elapsedMs = ref(0);

const merged = ref<MergedLinks>({});
const total = ref(0);

const sortType = ref<
  "default" | "date-desc" | "date-asc" | "name-asc" | "name-desc"
>("default");
const filterPlatform = ref<string>("all");
const initialVisible = 3;
const expandedSet = ref<Set<string>>(new Set());

// 已移除热搜相关功能

// 平台可视化信息
const platformInfo: Record<
  string,
  { name: string; color: string; icon: string }
> = {
  aliyun: { name: "阿里云盘", color: "#7c3aed", icon: "☁️" },
  quark: { name: "夸克网盘", color: "#6366f1", icon: "🔎" },
  baidu: { name: "百度网盘", color: "#2563eb", icon: "🧰" },
  "115": { name: "115网盘", color: "#f59e0b", icon: "📦" },
  xunlei: { name: "迅雷云盘", color: "#fbbf24", icon: "⚡" },
  uc: { name: "UC网盘", color: "#ef4444", icon: "🧭" },
  tianyi: { name: "天翼云盘", color: "#ec4899", icon: "☁️" },
  "123": { name: "123网盘", color: "#10b981", icon: "#" },
  mobile: { name: "移动云盘", color: "#0ea5e9", icon: "📱" },
  others: { name: "其他网盘", color: "#6b7280", icon: "…" },
};

const platforms = computed(() => Object.keys(merged.value));
const hasResults = computed(() => platforms.value.length > 0);

const groupedResults = computed(() => {
  const list: Array<{ type: string; items: any[] }> = [];
  const source =
    filterPlatform.value === "all"
      ? merged.value
      : { [filterPlatform.value]: merged.value[filterPlatform.value] || [] };
  for (const type of Object.keys(source)) {
    if (!source[type]?.length) continue;
    list.push({ type, items: source[type] || [] });
  }
  return list;
});

function platformName(t: string): string {
  return platformInfo[t]?.name || t;
}
function platformColor(t: string): string {
  return platformInfo[t]?.color || "#9ca3af";
}
function platformIcon(t: string): string {
  return platformInfo[t]?.icon || "📦";
}

function setMode(m: "fast" | "deep") {
  mode.value = m;
  if (typeof window !== "undefined") localStorage.setItem("searchMode", m);
}
// 分类与热搜入口已移除
function isExpanded(type: string) {
  return expandedSet.value.has(type);
}
function toggleExpand(type: string) {
  if (expandedSet.value.has(type)) expandedSet.value.delete(type);
  else expandedSet.value.add(type);
}
function visibleItems(type: string, items: any[]) {
  return isExpanded(type) ? items : items.slice(0, initialVisible);
}

function sortItems(items: any[]) {
  const arr = [...items];
  switch (sortType.value) {
    case "date-desc":
      return arr.sort(
        (a, b) =>
          new Date(b.datetime || "1970-01-01").getTime() -
          new Date(a.datetime || "1970-01-01").getTime()
      );
    case "date-asc":
      return arr.sort(
        (a, b) =>
          new Date(a.datetime || "1970-01-01").getTime() -
          new Date(b.datetime || "1970-01-01").getTime()
      );
    case "name-asc":
      return arr.sort((a, b) =>
        String(a.note || "").localeCompare(String(b.note || ""), "zh-CN")
      );
    case "name-desc":
      return arr.sort((a, b) =>
        String(b.note || "").localeCompare(String(a.note || ""), "zh-CN")
      );
    default:
      return items;
  }
}

function visibleSorted(items: any[]) {
  return sortItems(items);
}

function formatDate(d?: string) {
  if (!d) return "";
  const dt = new Date(d);
  if (Number.isNaN(dt.getTime())) return "";
  return dt.toLocaleDateString() + " " + dt.toLocaleTimeString();
}

async function copyLink(url: string) {
  try {
    await navigator.clipboard.writeText(url);
  } catch {}
}

// 失效标记功能暂时移除（无真实接口）

function resetSearch() {
  kw.value = "";
  merged.value = {};
  total.value = 0;
  searched.value = false;
  error.value = "";
}

// 热搜功能暂时移除（无真实接口）

// 已去除随机合集

async function onSearch() {
  if (!kw.value || loading.value) return;
  loading.value = true;
  error.value = "";
  searched.value = true;
  elapsedMs.value = 0;
  total.value = 0;
  merged.value = {};
  expandedSet.value = new Set();
  filterPlatform.value = "all";
  const start = performance.now();
  try {
    // 1. 快速搜索
    const fastPlugins = "pansearch,pan666";
    const deepPlugins = "pansearch,qupansou,panta,pan666,hunhepan,jikepan";
    const fastQuery: Record<string, any> = {
      kw: kw.value,
      res: "merged_by_type",
      src: "plugin",
      plugins: fastPlugins,
    };
    const fastResp = await $fetch<GenericResponse<SearchResponse>>(
      `${apiBase}/search`,
      { method: "GET", query: fastQuery } as any
    );
    const fastData = fastResp?.data;
    total.value = fastData?.total || 0;
    merged.value = fastData?.merged_by_type || {};

    // 2. 立即触发深度搜索，追加/替换为更全的结果
    const deepQuery: Record<string, any> = {
      kw: kw.value,
      res: "merged_by_type",
      src: "plugin",
      plugins: deepPlugins,
    };
    $fetch<GenericResponse<SearchResponse>>(`${apiBase}/search`, {
      method: "GET",
      query: deepQuery,
    } as any)
      .then((resp) => {
        const d = resp?.data as SearchResponse;
        if (!d) return;
        // 覆盖为更全的数据
        total.value = d.total || 0;
        merged.value = (d.merged_by_type || {}) as MergedLinks;
      })
      .catch(() => {});
  } catch (e: any) {
    error.value = e?.data?.message || e?.message || "请求失败";
  } finally {
    elapsedMs.value = Math.round(performance.now() - start);
    loading.value = false;
  }
}

onMounted(() => {});
</script>

<style scoped>
.home {
  max-width: 1100px;
  margin: 24px auto 40px;
  padding: 0 16px;
}
.hero {
  text-align: center;
  padding: 24px 16px;
  border: 1px solid #e8e8e8;
  border-radius: 16px;
  background: linear-gradient(180deg, #fafafa, #f6faff);
}
.hero__logo img {
  width: 64px;
  height: 64px;
}
.hero__title {
  font-size: 28px;
  font-weight: 800;
  margin: 8px 0 4px;
}
.hero__subtitle {
  color: #666;
  font-size: 14px;
}

.search {
  margin-top: 16px;
}
.search__box {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  border-radius: 14px;
  border: 1px solid #e5e7eb;
  background: #fff;
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.04);
}
.search__box.focused {
  box-shadow: 0 10px 30px rgba(38, 132, 255, 0.12);
}
.search__icon {
  opacity: 0.6;
}
.search__box input {
  flex: 1;
  border: 0;
  outline: none;
  font-size: 16px;
}
/* 模式切换已移除 */

/* 分类与热搜入口样式已移除 */

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

.results {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
}
.card {
  background: #fff;
  border: 1px solid #eee;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
  overflow: hidden;
}
.card__header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-bottom: 1px solid #f1f1f1;
}
.badge {
  width: 28px;
  height: 28px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 14px;
}
.card__title {
  font-size: 16px;
  font-weight: 700;
}
.card__count {
  margin-left: auto;
  color: #666;
  font-size: 13px;
}
.link {
  background: transparent;
  border: 0;
  color: #0a58ff;
  cursor: pointer;
  padding: 4px 6px;
}
.link--danger {
  color: #e11d48;
}
.card__list {
  list-style: none;
  padding: 0;
  margin: 0;
}
.item {
  padding: 12px;
  border-bottom: 1px solid #f3f3f3;
}
.item:last-child {
  border-bottom: none;
}
.item__title {
  color: #0a58ff;
  text-decoration: none;
}
.item__title:hover {
  text-decoration: underline;
}
.item__meta {
  margin-top: 6px;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  align-items: center;
}
.pill {
  font-size: 12px;
  border: 1px solid #e5e7eb;
  background: #f9fafb;
  border-radius: 999px;
  padding: 2px 8px;
  color: #333;
}
.pill--ok {
  background: rgba(52, 199, 89, 0.15);
  border-color: rgba(52, 199, 89, 0.25);
  color: #22c55e;
}
.card__footer {
  padding: 10px;
  text-align: center;
}

.btn {
  padding: 8px 12px;
  border: 1px solid #e5e7eb;
  background: #fff;
  color: #111;
  border-radius: 10px;
  cursor: pointer;
}
.btn:hover {
  background: #f6f7f9;
}
.btn[disabled] {
  opacity: 0.6;
  cursor: not-allowed;
}
.btn--primary {
  background: #111;
  color: #fff;
  border-color: #111;
}
.btn--primary:hover {
  background: #000;
}
.btn--ghost {
  background: transparent;
}

.reco {
  margin-top: 16px;
}
.reco__title {
  font-weight: 700;
  margin: 6px 2px 10px;
}
.reco__row {
  display: flex;
  overflow-x: auto;
  gap: 12px;
  padding-bottom: 4px;
}
/* 占位选择器移除 */

.empty .card {
  padding: 16px;
}
.empty__inner {
  color: #777;
  text-align: center;
}

.alert {
  background: #fff6f6;
  border: 1px solid #ffd1d1;
  color: #a40000;
  padding: 8px 10px;
  border-radius: 8px;
  margin-top: 12px;
}
</style>
