<template>
  <div class="layout">
    <header class="header">
      <nav class="nav">
        <NuxtLink to="/" class="brand">PanHub</NuxtLink>
        <div class="spacer" />
        <button class="link" type="button" @click="openSettings = true">
          设置
        </button>
      </nav>
    </header>
    <main class="main">
      <NuxtPage />
    </main>
    <ClientOnly>
      <SettingsDrawer
        v-model="settings"
        v-model:open="openSettings"
        :all-plugins="ALL_PLUGIN_NAMES"
        :all-tg-channels="TG_DEFAULT_CHANNELS"
        @save="onSaveSettings"
        @reset-default="resetToDefault" />
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import SettingsDrawer from "./pages/index/SettingsDrawer.vue";

const ALL_PLUGIN_NAMES = [
  "pansearch",
  "pan666",
  "qupansou",
  "panta",
  "hunhepan",
  "jikepan",
  "zhizhen",
  "ouge",
  "wanou",
  "labi",
  "susu",
  "fox4k",
  "hdr4k",
  "thepiratebay",
  "nyaa",
  "solidtorrents",
  "1337x",
  "torrentgalaxy",
  "duoduo",
  "muou",
  "xuexizhinan",
  "huban",
  "panyq",
  "shandian",
];

type UserSettings = {
  enabledTgChannels: string[];
  enabledPlugins: string[];
  concurrency: number;
  pluginTimeoutMs: number;
};

const openSettings = ref(false);
// 默认展示所有插件，但默认不勾选 thepiratebay
const DEFAULT_ENABLED_PLUGINS = ALL_PLUGIN_NAMES.filter(
  (n) => n !== "thepiratebay"
);
const settings = ref<UserSettings>({
  enabledTgChannels: [
    ...((useRuntimeConfig().public as any).tgDefaultChannels || []),
  ],
  enabledPlugins: [...DEFAULT_ENABLED_PLUGINS],
  concurrency: 4,
  pluginTimeoutMs: 5000,
});
const LS_KEY = "panhub.settings";

function loadSettings() {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw);
    const next: UserSettings = {
      enabledTgChannels: Array.isArray(parsed?.enabledTgChannels)
        ? parsed.enabledTgChannels.filter((x: any) => typeof x === "string")
        : [
            ...(((useRuntimeConfig().public as any).tgDefaultChannels ||
              []) as string[]),
          ],
      enabledPlugins: Array.isArray(parsed?.enabledPlugins)
        ? parsed.enabledPlugins.filter((x: any) => typeof x === "string")
        : [...DEFAULT_ENABLED_PLUGINS],
      concurrency:
        typeof parsed?.concurrency === "number" && parsed.concurrency > 0
          ? Math.min(16, Math.max(1, parsed.concurrency))
          : 4,
      pluginTimeoutMs:
        typeof parsed?.pluginTimeoutMs === "number" &&
        parsed.pluginTimeoutMs > 0
          ? parsed.pluginTimeoutMs
          : 5000,
    };
    next.enabledPlugins = next.enabledPlugins.filter((x) =>
      ALL_PLUGIN_NAMES.includes(x)
    );
    if (next.enabledPlugins.length === 0)
      next.enabledPlugins = [...DEFAULT_ENABLED_PLUGINS];
    settings.value = next;
  } catch {}
}
function persistSettings() {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(settings.value));
  } catch {}
}
function onSaveSettings() {
  persistSettings();
}
function resetToDefault() {
  if (typeof window !== "undefined") {
    try {
      localStorage.removeItem(LS_KEY);
    } catch {}
    // 彻底恢复默认：刷新页面，让运行时默认与配置接管
    window.location.reload();
  }
}

onMounted(() => loadSettings());
const TG_DEFAULT_CHANNELS = (useRuntimeConfig().public as any)
  .tgDefaultChannels as string[];
</script>

<style>
html,
body {
  margin: 0;
  padding: 0;
}
</style>

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
  border: 1px solid #eee;
  color: #333;
  text-decoration: none;
  padding: 6px 10px;
  border-radius: 8px;
  cursor: pointer;
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
