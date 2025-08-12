<template>
  <div
    v-if="open"
    class="drawer-mask"
    @click.self="
      () => {
        emitSave();
        $emit('update:open', false);
      }
    ">
    <div class="drawer">
      <header class="drawer__header">
        <strong>搜索设置</strong>
        <button
          class="btn"
          @click="
            () => {
              emitSave();
              $emit('update:open', false);
            }
          ">
          关闭
        </button>
      </header>

      <section class="drawer__section">
        <div class="section__title">
          <strong>插件来源</strong>
          <div class="section__tools">
            <button class="btn" @click="onSelectAll">全选</button>
            <button class="btn" @click="onClearAll">全不选</button>
          </div>
        </div>
        <div class="plugin-grid">
          <label v-for="name in allPlugins" :key="name" class="plugin-item">
            <input
              type="checkbox"
              :value="name"
              v-model="inner.enabledPlugins"
              @change="saveTemp" />
            <span>{{ name }}</span>
          </label>
        </div>
      </section>

      <section class="drawer__section">
        <div class="section__title">
          <strong>频道来源</strong>
          <div class="section__tools">
            <button class="btn" @click="onSelectAllTg">全选</button>
            <button class="btn" @click="onClearAllTg">全不选</button>
          </div>
        </div>
        <div class="plugin-grid">
          <label v-for="name in allTgChannels" :key="name" class="plugin-item">
            <input
              type="checkbox"
              :value="name"
              v-model="inner.enabledTgChannels"
              @change="saveTemp" />
            <span>{{ name }}</span>
          </label>
        </div>
      </section>

      <footer class="drawer__footer">
        <button class="btn" @click="$emit('reset-default')">恢复默认</button>
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
interface UserSettings {
  enabledTgChannels: string[];
  enabledPlugins: string[];
}
const props = defineProps<{
  modelValue: UserSettings;
  open: boolean;
  allPlugins: string[];
  allTgChannels: string[];
}>();
const emit = defineEmits([
  "update:modelValue",
  "update:open",
  "save",
  "reset-default",
]);

const inner = ref<UserSettings>({
  enabledTgChannels: [],
  enabledPlugins: [],
});

watch(
  () => props.modelValue,
  (v) => {
    if (!v) return;
    inner.value = JSON.parse(JSON.stringify(v));
  },
  { immediate: true }
);

function saveTemp() {
  emit("update:modelValue", inner.value);
  emit("save");
}
function emitSave() {
  emit("update:modelValue", inner.value);
  emit("save");
}
function onSelectAll() {
  inner.value.enabledPlugins = [...props.allPlugins];
  saveTemp();
}
function onClearAll() {
  inner.value.enabledPlugins = [];
  saveTemp();
}

function onSelectAllTg() {
  inner.value.enabledTgChannels = [...props.allTgChannels];
  saveTemp();
}
function onClearAllTg() {
  inner.value.enabledTgChannels = [];
  saveTemp();
}
</script>

<style scoped>
.drawer-mask {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
  display: flex;
  justify-content: flex-end;
  z-index: 50;
}
.drawer {
  width: min(480px, 92vw);
  background: #fff;
  box-shadow: -6px 0 24px rgba(0, 0, 0, 0.08);
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
  max-height: 90vh;
  overflow: auto;
}
.drawer__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}
.drawer__section {
  border: 1px solid #eee;
  border-radius: 10px;
  padding: 12px;
  margin-bottom: 12px;
  background: #fff;
}
.drawer__footer {
  margin-top: auto;
  display: flex;
  justify-content: space-between;
  gap: 10px;
}
.row {
  display: flex;
  align-items: center;
  gap: 8px;
}
.block .label {
  font-size: 12px;
  color: #666;
}
.block textarea {
  width: 100%;
  margin-top: 6px;
}
.section__title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}
.plugin-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px 14px;
}
@media (min-width: 820px) {
  .plugin-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}
.plugin-item {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0; /* 允许内部省略号生效 */
}
.plugin-item span {
  display: inline-block;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.btn {
  padding: 8px 12px;
  border: 1px solid #e5e7eb;
  background: #fff;
  color: #111;
  border-radius: 10px;
  cursor: pointer;
}
.btn--primary {
  background: #111;
  color: #fff;
  border-color: #111;
}
</style>
