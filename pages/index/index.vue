<template>
  <div class="home">
    <header class="hero">
      <div class="hero__logo">
        <img src="/favicon.ico" alt="logo" />
      </div>
      <h1 class="hero__title">盘搜</h1>
      <p class="hero__subtitle">基于 TG 频道的网盘搜索工具</p>
    </header>

    <section class="search">
      <div class="search__box" :class="{ focused: isFocused }">
        <span class="search__icon">🔎</span>
        <input
          v-model.trim="kw"
          :placeholder="placeholder"
          @focus="isFocused = true"
          @blur="isFocused = false"
          @keyup.enter="onSearch" />
        <button v-if="kw" class="btn btn--ghost" @click="resetSearch">
          重置
        </button>
        <button
          class="btn btn--primary"
          :disabled="!kw || loading"
          @click="onSearch">
          {{ loading ? "搜索中…" : "搜索" }}
        </button>
      </div>

      <div class="mode">
        <div class="mode__seg">
          <button
            :class="['seg', { active: mode === 'fast' }]"
            @click="setMode('fast')">
            快速搜索
          </button>
          <button
            :class="['seg', { active: mode === 'deep' }]"
            @click="setMode('deep')">
            深度搜索
          </button>
        </div>
      </div>
    </section>

    <section class="categories">
      <div class="tabs">
        <button
          v-for="c in categoryTabs"
          :key="c.key"
          :class="['tab', { 'is-active': c.key === activeCategory }]"
          @click="switchCategory(c.key)">
          {{ c.label }}
        </button>
      </div>
      <div class="chips" v-if="categoryItems.length && !searched">
        <button
          class="chip"
          v-for="v in categoryItems"
          :key="v"
          @click="quickSearch(v)">
          {{ v }}
        </button>
      </div>
      <div class="chips" v-else-if="hotSearches.length && !searched">
        <button
          class="chip"
          v-for="x in hotSearches"
          :key="x"
          @click="quickSearch(x)">
          {{ x }}
        </button>
      </div>
    </section>

    <section v-if="searched" class="result-header">
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
          <select v-model="sortType">
            <option value="default">默认</option>
            <option value="date-desc">时间(新→旧)</option>
            <option value="date-asc">时间(旧→新)</option>
            <option value="name-asc">名称(A→Z)</option>
            <option value="name-desc">名称(Z→A)</option>
          </select>
        </label>
        <label v-if="platforms.length">
          平台
          <select v-model="filterPlatform">
            <option value="all">全部</option>
            <option v-for="p in platforms" :key="p" :value="p">
              {{ platformName(p) }}
            </option>
          </select>
        </label>
      </div>
    </section>

    <section v-if="hasResults" class="results">
      <div v-for="group in groupedResults" :key="group.type" class="card">
        <div class="card__header">
          <div class="badge" :style="{ background: platformColor(group.type) }">
            {{ platformIcon(group.type) }}
          </div>
          <h3 class="card__title">{{ platformName(group.type) }}</h3>
          <span class="card__count">{{ group.items.length }} 个资源</span>
          <button
            v-if="group.items.length > initialVisible"
            class="link"
            @click="toggleExpand(group.type)">
            {{ isExpanded(group.type) ? "收起" : "展开" }}
          </button>
        </div>
        <ul class="card__list">
          <li
            v-for="(r, idx) in visibleItems(group.type, group.items)"
            :key="idx"
            class="item">
            <a
              class="item__title"
              :href="r.url"
              target="_blank"
              rel="noreferrer"
              >{{ r.note || r.url }}</a
            >
            <div class="item__meta">
              <span class="pill">{{
                formatDate(r.datetime) || "时间未知"
              }}</span>
              <span v-if="r.password" class="pill pill--ok"
                >提取码: {{ r.password }}</span
              >
              <button class="link" @click.prevent="copyLink(r.url)">
                复制
              </button>
              <button
                class="link link--danger"
                @click.prevent="markInvalid(r.url)">
                标记失效
              </button>
            </div>
          </li>
        </ul>
        <div
          v-if="!isExpanded(group.type) && group.items.length > initialVisible"
          class="card__footer">
          <button class="btn btn--ghost" @click="toggleExpand(group.type)">
            显示更多 ({{ group.items.length - initialVisible }})
          </button>
        </div>
      </div>
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
import type {
  GenericResponse,
  SearchResponse,
  MergedLinks,
} from "@/server/core/types/models";

const config = useRuntimeConfig();
const apiBase = (config.public?.apiBase as string) || "/api";

const placeholder = "搜索网盘资源，支持 115、百度云、阿里云盘等";

const kw = ref("");
const mode = ref<"fast" | "deep">(
  (typeof window !== "undefined" &&
    (localStorage.getItem("searchMode") as any)) ||
    "deep"
);
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

const hotSearches = ref<string[]>([]);

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
    list.push({ type, items: sortItems(source[type] || []) });
  }
  return list;
});

const categoryTabs = [
  { key: "hot", label: "热搜" },
  { key: "电影", label: "电影" },
  { key: "电视剧", label: "电视剧" },
  { key: "小说", label: "小说" },
  { key: "综艺", label: "综艺" },
  { key: "游戏", label: "游戏" },
  { key: "动漫", label: "动漫" },
];
const activeCategory = ref<string>("hot");

const categoryData: Record<string, string[]> = {
  电影: [
    "阿凡达3",
    "超人传承",
    "雷神5",
    "蜘蛛侠4",
    "奇异博士3",
    "疾速追杀5",
    "沙丘3",
    "神奇四侠",
  ],
  电视剧: ["庆余年2", "赘婿2", "大奉打更人", "凡人修仙传"],
  小说: ["大奉打更人", "宿命之环", "赤心巡天", "灵境行者"],
  综艺: ["歌手2025", "乘风2025", "披荆斩棘", "乐队的夏天"],
  游戏: ["黑神话悟空", "GTA6", "怪物猎人荒野", "塞尔达传说王国之泪"],
  动漫: ["鬼灭之刃", "咒术回战3", "我独自升级2", "海贼王"],
};
const categoryItems = computed<string[]>(() =>
  activeCategory.value === "hot" ? [] : categoryData[activeCategory.value] || []
);

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
function switchCategory(key: string) {
  activeCategory.value = key;
  if (key === "hot") fetchHotSearches();
}
function quickSearch(v: string) {
  kw.value = v;
  onSearch();
}
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

async function markInvalid(url: string) {
  try {
    await $fetch("/api/mark-invalid", { method: "POST", body: { url } });
  } catch {}
}

function resetSearch() {
  kw.value = "";
  merged.value = {};
  total.value = 0;
  searched.value = false;
  error.value = "";
}

async function fetchHotSearches() {
  try {
    const resp = await $fetch<any>("/api/hot-searches", { method: "GET" });
    const list: string[] = (resp?.hotSearches || [])
      .map((x: any) => x.term || x)
      .filter(Boolean);
    if (Array.isArray(list)) hotSearches.value = list.slice(0, 30);
  } catch {
    hotSearches.value = [];
  }
}

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
    const fastPlugins = "pansearch,pan666";
    const deepPlugins = "pansearch,qupansou,panta,pan666,hunhepan,jikepan";
    const query: Record<string, any> = {
      kw: kw.value,
      res: "merged_by_type",
      src: "plugin",
      plugins: mode.value === "deep" ? deepPlugins : fastPlugins,
    };

    const resp = await $fetch<GenericResponse<SearchResponse>>(
      `${apiBase}/search`,
      { method: "GET", query } as any
    );
    const data = resp?.data;
    total.value = data?.total || 0;
    merged.value = data?.merged_by_type || {};

    // 过滤失效资源（如果后端提供接口）
    try {
      const allUrls: string[] = (Object.values(merged.value) as any[])
        .flat()
        .map((it: any) => it.url)
        .filter((u: string) => !!u) as string[];
      if (allUrls.length) {
        const invalidResp = await $fetch<any>("/api/get-invalid-status", {
          method: "POST",
          body: { urls: allUrls },
        } as any);
        const invalid: Record<string, boolean> =
          invalidResp?.invalidStatus || {};
        const m: MergedLinks = {};
        for (const t of Object.keys(merged.value)) {
          const items = (merged.value[t] || []).filter(
            (x: any) => !invalid[x.url]
          );
          if (items.length) m[t] = items as any;
        }
        merged.value = m;
        total.value = (Object.values(merged.value) as any[]).reduce(
          (s: number, a: any) => s + (a?.length || 0),
          0
        );
      }
    } catch {}

    // 记录热搜（如果后端提供接口）
    if (total.value > 0) {
      try {
        await $fetch("/api/hot-searches", {
          method: "POST",
          body: { term: kw.value },
        } as any);
      } catch {}
    }
  } catch (e: any) {
    error.value = e?.data?.message || e?.message || "请求失败";
  } finally {
    elapsedMs.value = Math.round(performance.now() - start);
    loading.value = false;
  }
}

onMounted(() => {
  fetchHotSearches();
});
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
.mode {
  display: flex;
  justify-content: center;
  margin-top: 10px;
}
.mode__seg {
  position: relative;
  display: inline-flex;
  background: #f0f2f5;
  border-radius: 999px;
  padding: 4px;
}
.seg {
  border: 0;
  background: transparent;
  padding: 6px 12px;
  border-radius: 999px;
  cursor: pointer;
  color: #666;
}
.seg.active {
  background: #fff;
  color: #0a58ff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.categories {
  margin-top: 14px;
}
.tabs {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
.tab {
  padding: 8px 12px;
  border-radius: 999px;
  border: 1px solid #eee;
  background: #fff;
  cursor: pointer;
}
.tab.is-active {
  background: #111;
  color: #fff;
  border-color: #111;
}
.chips {
  margin-top: 10px;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
.chip {
  font-size: 13px;
  border: 1px solid #e5e7eb;
  padding: 6px 10px;
  border-radius: 999px;
  background: #f9fafb;
  cursor: pointer;
}

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
