<template>
  <section class="search">
    <div class="search__box" :class="{ focused: isFocused }">
      <span class="search__icon">🔎</span>
      <input
        :value="modelValue"
        :placeholder="placeholder"
        @input="
          $emit('update:modelValue', ($event.target as HTMLInputElement).value)
        "
        @focus="isFocused = true"
        @blur="isFocused = false"
        @keyup.enter="$emit('search')" />
      <button
        v-if="modelValue"
        class="btn btn--ghost"
        @click="
          $emit('update:modelValue', '');
          $emit('reset');
        ">
        重置
      </button>
      <button
        class="btn btn--primary"
        :disabled="!modelValue || loading"
        @click="$emit('search')">
        {{ loading ? "搜索中…" : "搜索" }}
      </button>
    </div>

    <div class="mode">
      <div class="mode__seg">
        <button
          :class="['seg', { active: mode === 'fast' }]"
          @click="$emit('update:mode', 'fast')">
          快速搜索
        </button>
        <button
          :class="['seg', { active: mode === 'deep' }]"
          @click="$emit('update:mode', 'deep')">
          深度搜索
        </button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: string;
  mode: "fast" | "deep";
  loading: boolean;
  placeholder: string;
}>();
defineEmits(["update:modelValue", "update:mode", "search", "reset"]);

const isFocused = ref(false);
</script>

<style scoped>
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
</style>
