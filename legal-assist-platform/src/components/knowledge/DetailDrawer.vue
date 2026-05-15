<script setup>
import { computed } from 'vue'

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
  return props.record.content.split('\n').filter((p) => p.trim())
})
</script>

<template>
  <el-drawer
    v-model="visible"
    :title="record?.title || '详细内容'"
    direction="rtl"
    size="520px"
    class="detail-drawer"
  >
    <template v-if="record">
      <div class="detail-meta">
        <el-tag type="primary" effect="plain">{{ record.type }}</el-tag>
        <el-tag :type="record.status === '现行有效' ? 'success' : 'info'" effect="plain">
          {{ record.status }}
        </el-tag>
      </div>
      <dl class="meta-list">
        <div class="meta-row">
          <dt>文号</dt>
          <dd>{{ record.docNo }}</dd>
        </div>
        <div class="meta-row">
          <dt>分类</dt>
          <dd>{{ record.categoryPath }}</dd>
        </div>
        <div class="meta-row">
          <dt>发布日期</dt>
          <dd>{{ record.publishDate }}</dd>
        </div>
        <div class="meta-row">
          <dt>施行日期</dt>
          <dd>{{ record.effectiveDate }}</dd>
        </div>
        <div class="meta-row">
          <dt>关联流程</dt>
          <dd>{{ record.process }}</dd>
        </div>
        <div class="meta-row">
          <dt>关联预案</dt>
          <dd>{{ record.plan }}</dd>
        </div>
        <div class="meta-row meta-row--full">
          <dt>关键词</dt>
          <dd>
            <el-tag
              v-for="kw in record.keywords"
              :key="kw"
              size="small"
              class="kw-tag"
            >
              {{ kw }}
            </el-tag>
          </dd>
        </div>
      </dl>

      <div class="detail-summary">
        <h4>摘要</h4>
        <p>{{ record.summary }}</p>
      </div>

      <div class="detail-body">
        <h4>正文</h4>
        <div class="content-text">
          <p v-for="(para, i) in paragraphs" :key="i">{{ para }}</p>
        </div>
      </div>
    </template>
    <el-empty v-else description="暂无数据" />
  </el-drawer>
</template>

<style lang="scss" scoped>
.detail-meta {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
}

.meta-list {
  margin: 0 0 24px;
  padding: 16px;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e8eef4;
}

.meta-row {
  display: grid;
  grid-template-columns: 72px 1fr;
  gap: 8px;
  margin-bottom: 10px;
  font-size: 13px;
  line-height: 1.6;

  &:last-child {
    margin-bottom: 0;
  }

  dt {
    color: #64748b;
    margin: 0;
  }

  dd {
    margin: 0;
    color: #1e293b;
  }

  &--full dd {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }
}

.kw-tag {
  margin: 0;
}

.detail-summary,
.detail-body {
  h4 {
    margin: 0 0 12px;
    font-size: 15px;
    color: #0f2d54;
    font-weight: 600;
    padding-left: 10px;
    border-left: 3px solid #1a4b8c;
  }
}

.detail-summary p {
  margin: 0 0 24px;
  color: #475569;
  line-height: 1.75;
  font-size: 14px;
}

.content-text {
  p {
    margin: 0 0 14px;
    font-size: 14px;
    line-height: 1.85;
    color: #334155;
    text-align: justify;

    &:last-child {
      margin-bottom: 0;
    }
  }
}

:deep(.el-drawer__header) {
  margin-bottom: 8px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e8eef4;
}

:deep(.el-drawer__body) {
  padding-top: 8px;
}
</style>
