<template>
  <div class="page">
    <section class="searchbar">
      <div class="searchbar__input">
        <span class="icon">🔎</span>
        <input
          v-model.trim="kw"
          :placeholder="placeholder"
          @keyup.enter="onSearch" />
        <button
          class="btn btn--primary"
          @click="onSearch"
          :disabled="!kw || loading">
          搜索
        </button>
      </div>
      <div class="searchbar__filters">
        <label>
          <span>来源</span>
          <select v-model="src">
            <option value="all">全部</option>
            <option value="plugin">插件</option>
            <option value="tg">TG</option>
          </select>
        </label>
        <label v-if="src !== 'tg'" class="plugins-picker">
          <span>插件</span>
          <div class="chips">
            <button
              v-for="p in allPlugins"
              :key="p"
              class="chip"
              :class="{ 'chip--active': selectedPluginsSet.has(p) }"
              @click="togglePlugin(p)"
              type="button">
              {{ p }}
            </button>
          </div>
          <small class="hint">已选：{{ plugins }}</small>
        </label>
        <label>
          <span>刷新</span>
          <input type="checkbox" v-model="refresh" />
        </label>
      </div>
    </section>

    <section class="status" v-if="searched">
      <div class="stat">
        <span>搜索结果</span>
        <strong>{{ total }}</strong>
      </div>
      <div class="stat">
        <span>用时</span>
        <strong>{{ elapsedMs }}ms</strong>
      </div>
    </section>

    <section class="content" v-if="mergedKeys.length">
      <div class="tabs">
        <button
          v-for="key in mergedKeys"
          :key="key"
          class="tab"
          :class="{ 'is-active': key === activeTab }"
          @click="activeTab = key">
          {{ key }}<span class="pill">{{ mergedCounts[key] }}</span>
        </button>
      </div>

      <ul class="list" v-if="activeItems.length">
        <li v-for="(item, idx) in activeItems" :key="idx" class="row">
          <div class="row__main">
            <a
              class="title"
              :href="item.url"
              target="_blank"
              rel="noreferrer"
              >{{ item.note || item.url }}</a
            >
            <div class="meta">
              <span class="chip">{{ activeTab }}</span>
              <span v-if="item.password" class="chip chip--muted"
                >提取码: {{ item.password }}</span
              >
              <span v-if="item.datetime" class="chip chip--ghost">{{
                formatDate(item.datetime)
              }}</span>
              <span v-if="item.source" class="chip chip--ghost">{{
                item.source
              }}</span>
            </div>
          </div>
        </li>
      </ul>
      <div v-else class="empty">此分组暂无结果</div>
    </section>

    <section v-else-if="searched && !loading" class="empty">
      没有匹配的结果，换个关键词试试？
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

const kw = ref("");
const src = ref<"all" | "plugin" | "tg">("all");
const allPlugins = [
  "hunhepan",
  "zhizhen",
  "ouge",
  "wanou",
  "susu",
  "labi",
  "panta",
  "jikepan",
  "qupansou",
  "fox4k",
  "hdr4k",
  "thepiratebay",
  "duoduo",
  "muou",
  "pan666",
  "xuexizhinan",
  "huban",
  "panyq",
  "pansearch",
  "shandian",
];
const selectedPluginsSet = ref<Set<string>>(new Set([]));
const plugins = computed(() => Array.from(selectedPluginsSet.value).join(","));
const refresh = ref(false);

const loading = ref(false);
const error = ref("");
const searched = ref(false);
const elapsedMs = ref(0);

const merged = ref<MergedLinks>({});
const total = ref(0);

const activeTab = ref("");
const mergedKeys = computed(() => Object.keys(merged.value || {}));
const mergedCounts = computed<Record<string, number>>(() => {
  const out: Record<string, number> = {};
  for (const k of mergedKeys.value) out[k] = merged.value[k]?.length || 0;
  return out;
});
const activeItems = computed(() => merged.value[activeTab.value] || []);

const placeholder = "搜索资源、电影、音乐、软件...";

function formatDate(d: string) {
  if (!d) return "";
  const dt = new Date(d);
  if (isNaN(dt.getTime())) return d;
  return dt.toLocaleString();
}

async function onSearch() {
  if (!kw.value) return;
  loading.value = true;
  error.value = "";
  searched.value = true;
  elapsedMs.value = 0;
  total.value = 0;
  merged.value = {};
  const start = performance.now();
  try {
    const query: Record<string, any> = {
      kw: kw.value,
      res: "merged_by_type",
      src: src.value,
    };
    if (refresh.value) query.refresh = "true";
    if (src.value !== "tg" && plugins.value) query.plugins = plugins.value;

    const resp = await $fetch<GenericResponse<SearchResponse>>(
      `${apiBase}/search`,
      { method: "GET", query }
    );
    const data = resp?.data;
    total.value = data?.total || 0;
    merged.value = data?.merged_by_type || {};
    const keys = Object.keys(merged.value);
    activeTab.value = keys[0] || "";
  } catch (e: any) {
    error.value = e?.data?.message || e?.message || "请求失败";
  } finally {
    elapsedMs.value = Math.round(performance.now() - start);
    loading.value = false;
  }
}

onMounted(() => {
  // 可选：带上示例关键词进行首次体验
  // kw.value = 'vue'
  // onSearch()
});

function togglePlugin(p: string) {
  const set = selectedPluginsSet.value;
  if (set.has(p)) set.delete(p);
  else set.add(p);
}
</script>

<style scoped>
.page {
  max-width: 1100px;
  margin: 36px auto;
  padding: 0 16px;
}
.searchbar {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.searchbar__input {
  display: flex;
  align-items: center;
  gap: 8px;
  border: 1px solid #e5e7eb;
  padding: 10px 12px;
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.03);
}
.searchbar__input input {
  flex: 1;
  border: 0;
  outline: none;
  font-size: 16px;
}
.icon {
  opacity: 0.6;
}
.searchbar__filters {
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
}
.searchbar__filters label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #666;
}
.searchbar__filters input,
.searchbar__filters select {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 6px 8px;
}

.status {
  display: flex;
  gap: 16px;
  margin: 10px 2px 0;
}
.stat {
  display: flex;
  gap: 6px;
  align-items: center;
  color: #666;
}
.stat strong {
  color: #111;
}

.tabs {
  display: flex;
  gap: 8px;
  border-bottom: 1px solid #eee;
  margin-top: 16px;
  flex-wrap: wrap;
}
.tab {
  padding: 8px 12px;
  background: #fff;
  border: 1px solid #eee;
  border-bottom: none;
  border-radius: 10px 10px 0 0;
  cursor: pointer;
}
.tab.is-active {
  background: #111;
  color: #fff;
  border-color: #111;
}
.pill {
  margin-left: 6px;
  padding: 0 6px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.35);
  font-size: 12px;
}

.list {
  list-style: none;
  padding: 0;
  margin: 0;
}
.row {
  padding: 14px 10px;
  border-bottom: 1px dashed #eee;
}
.title {
  color: #0a58ff;
  text-decoration: none;
}
.title:hover {
  text-decoration: underline;
}
.meta {
  display: flex;
  gap: 8px;
  margin-top: 6px;
  flex-wrap: wrap;
}
.chip {
  font-size: 12px;
  border: 1px solid #e5e7eb;
  background: #f9fafb;
  border-radius: 999px;
  padding: 2px 8px;
  color: #333;
}
.chip--muted {
  color: #555;
}
.chip--ghost {
  background: transparent;
}

.btn {
  padding: 8px 12px;
  border: 1px solid #e5e7eb;
  background: #fff;
  border-radius: 10px;
  cursor: pointer;
}
.btn:hover {
  background: #f6f7f9;
}
.btn--primary {
  background: #111;
  color: #fff;
  border-color: #111;
}
.btn--primary:hover {
  background: #000;
}

.empty {
  color: #777;
  padding: 24px 8px;
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
