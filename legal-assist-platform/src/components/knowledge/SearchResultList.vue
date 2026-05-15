<script setup>
import { View } from '@element-plus/icons-vue'
import {
  getDocNumber,
  getExecuteDate,
  getDepartment,
} from '@/utils/knowledgeSearch'

defineProps({
  items: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false },
})

const emit = defineEmits(['select'])
</script>

<template>
  <div v-loading="loading" class="search-result-list">
    <div
      v-for="item in items"
      :key="item.id"
      class="search-result-item"
      @click="emit('select', item)"
    >
      <h3 class="result-title" v-html="item._titleHtml" />
      <div class="result-meta">
        <span class="meta-item">{{ getDocNumber(item) }}</span>
        <span class="meta-divider">|</span>
        <span class="meta-item">{{ item.publishDate || '—' }}</span>
        <span class="meta-divider">|</span>
        <span class="meta-item">{{ getExecuteDate(item) }}</span>
        <span class="meta-divider">|</span>
        <span class="meta-item">{{ getDepartment(item) }}</span>
      </div>
      <p
        v-if="item._hasContentHit && item._snippetHtml"
        class="result-snippet"
        v-html="item._snippetHtml"
      />
      <div class="result-footer">
        <el-tag size="small" effect="plain">{{ item.type }}</el-tag>
        <span class="result-path">{{ item.categoryPath }}</span>
        <el-button
          type="primary"
          link
          :icon="View"
          class="result-detail-btn"
          @click.stop="emit('select', item)"
        >
          详情
        </el-button>
      </div>
    </div>
    <el-empty v-if="!loading && !items.length" description="未找到匹配的法规文档" />
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/variables.scss' as *;

.search-result-list {
  min-height: 200px;
}

.search-result-item {
  padding: 16px 4px;
  border-bottom: 1px solid $color-border;
  cursor: pointer;
  transition: background 0.2s;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: #f8fafc;
  }
}

.result-title {
  margin: 0 0 8px;
  font-size: 16px;
  font-weight: 600;
  line-height: 1.5;
  color: $color-primary;

  :deep(.search-mark) {
    background: transparent;
    color: #c41e3a;
    font-weight: 700;
    padding: 0 1px;
  }
}

.result-meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px 8px;
  margin-bottom: 8px;
  font-size: 12px;
  color: #94a3b8;
  line-height: 1.5;
}

.meta-item {
  color: $color-text-secondary;
}

.meta-divider {
  color: #cbd5e1;
  user-select: none;
}

.result-snippet {
  margin: 0 0 10px;
  font-size: 13px;
  line-height: 1.75;
  color: #475569;
  text-align: justify;

  :deep(.search-mark) {
    background: #fff3cd;
    color: #c41e3a;
    font-weight: 600;
    padding: 0 2px;
    border-radius: 2px;
  }
}

.result-footer {
  display: flex;
  align-items: center;
  gap: 10px;
}

.result-path {
  flex: 1;
  font-size: 12px;
  color: #94a3b8;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.result-detail-btn {
  flex-shrink: 0;
}
</style>
