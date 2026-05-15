<script setup>
import { computed } from 'vue'
import {
  getDocNumber,
  getExecuteDate,
  getDepartment,
} from '@/utils/knowledgeSearch'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  record: { type: Object, default: null },
})

const emit = defineEmits(['update:modelValue'])

const visible = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v),
})

const paragraphs = computed(() => {
  if (!props.record?.content) return []
  return props.record.content
    .split(/\n+/)
    .map((p) => p.trim())
    .filter(Boolean)
})
</script>

<template>
  <el-dialog
    v-model="visible"
    class="law-detail-modal"
    width="70%"
    top="5vh"
    destroy-on-close
    :show-close="true"
    append-to-body
  >
    <template v-if="record">
      <header class="modal-header">
        <h2 class="modal-title">{{ record.title }}</h2>
        <div class="modal-meta">
          <span class="meta-chip">
            <span class="meta-label">文号</span>
            {{ getDocNumber(record) }}
          </span>
          <span class="meta-chip">
            <span class="meta-label">发布日期</span>
            {{ record.publishDate || '—' }}
          </span>
          <span class="meta-chip">
            <span class="meta-label">实施日期</span>
            {{ getExecuteDate(record) }}
          </span>
          <span class="meta-chip">
            <span class="meta-label">发布部门</span>
            {{ getDepartment(record) }}
          </span>
          <span v-if="record.type" class="meta-chip meta-chip--tag">
            <el-tag size="small" effect="plain">{{ record.type }}</el-tag>
          </span>
          <span v-if="record.status" class="meta-chip meta-chip--tag">
            <el-tag
              size="small"
              :type="record.status === '现行有效' ? 'success' : 'info'"
            >
              {{ record.status }}
            </el-tag>
          </span>
        </div>
        <div v-if="record.categoryPath" class="modal-path">
          {{ record.categoryPath }}
        </div>
      </header>

      <section class="modal-body">
        <div class="body-label">正文</div>
        <div class="content-scroll">
          <template v-if="paragraphs.length">
            <p v-for="(para, index) in paragraphs" :key="index" class="content-paragraph">
              {{ para }}
            </p>
          </template>
          <p v-else class="content-empty">暂无正文内容</p>
        </div>
      </section>
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped>
@use '@/styles/variables.scss' as *;

.law-detail-modal {
  :deep(.el-dialog__header) {
    display: none;
  }

  :deep(.el-dialog__body) {
    padding: 0 28px 24px;
    max-height: calc(90vh - 40px);
    display: flex;
    flex-direction: column;
  }
}

.modal-header {
  flex-shrink: 0;
  padding: 20px 0 16px;
  border-bottom: 1px solid $color-border;
  margin-bottom: 16px;
}

.modal-title {
  margin: 0 0 14px;
  font-size: 22px;
  font-weight: 700;
  color: $color-primary-dark;
  line-height: 1.4;
}

.modal-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 12px 20px;
  align-items: center;
}

.meta-chip {
  font-size: 13px;
  color: $color-text-secondary;
  line-height: 1.5;

  .meta-label {
    color: #94a3b8;
    margin-right: 6px;

    &::after {
      content: '：';
    }
  }
}

.modal-path {
  margin-top: 10px;
  font-size: 12px;
  color: #94a3b8;
}

.modal-body {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
}

.body-label {
  flex-shrink: 0;
  font-size: 14px;
  font-weight: 600;
  color: $color-primary;
  margin-bottom: 10px;
  padding-left: 10px;
  border-left: 3px solid $color-primary;
}

.content-scroll {
  flex: 1;
  overflow-y: auto;
  max-height: calc(90vh - 220px);
  padding: 20px 24px;
  background: #fafbfc;
  border: 1px solid $color-border;
  border-radius: 8px;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-thumb {
    background: #c5d4e8;
    border-radius: 4px;
  }
}

.content-paragraph {
  margin: 0 0 1em;
  font-size: 15px;
  line-height: 1.8;
  color: #1e293b;
  text-align: justify;
  text-indent: 2em;

  &:last-child {
    margin-bottom: 0;
  }
}

.content-empty {
  margin: 0;
  color: $color-text-secondary;
  text-align: center;
  padding: 40px 0;
}
</style>
