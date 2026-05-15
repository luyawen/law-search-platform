<script setup>
import { ref, computed, watch } from 'vue'
import { Download, CircleCheck, CircleClose } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { processList } from '@/mock/process'
import { STORAGE_KEY } from '@/mock/process'
import { loadProcessResults, saveProcessResults } from '@/utils/storage'
import { buildProcessReport, downloadTextFile } from '@/utils/exportReport'

const results = ref(loadProcessResults(STORAGE_KEY, {}))

watch(
  results,
  (val) => {
    saveProcessResults(STORAGE_KEY, val)
  },
  { deep: true },
)

const stats = computed(() => {
  let pass = 0
  let fail = 0
  let pending = 0
  processList.forEach((item) => {
    const s = results.value[item.id]
    if (s === 'pass') pass++
    else if (s === 'fail') fail++
    else pending++
  })
  return { pass, fail, pending, total: processList.length }
})

const completionRate = computed(() => {
  const done = stats.value.pass + stats.value.fail
  if (!stats.value.total) return 0
  return Math.round((done / stats.value.total) * 100)
})

function setResult(id, value) {
  if (results.value[id] === value) {
    const next = { ...results.value }
    delete next[id]
    results.value = next
    return
  }
  results.value = { ...results.value, [id]: value }
}

function exportReport() {
  const content = buildProcessReport({
    processList,
    results: results.value,
    meta: { operator: '管理员', department: '安全合规部' },
  })
  const filename = `标准流程执行报告_${new Date().toISOString().slice(0, 10)}.txt`
  downloadTextFile(filename, content)
  ElMessage.success('执行报告已下载')
}

function clearAll() {
  results.value = {}
  ElMessage.info('已清空全部勾选状态')
}
</script>

<template>
  <div class="process-page">
    <div class="page-header">
      <div>
        <h2 class="page-title">标准流程执行工具</h2>
        <p class="page-desc">
          对照标准流程逐项评定通过/不通过，结果自动保存至本地，可导出执行报告
        </p>
      </div>
      <div class="header-actions">
        <el-button @click="clearAll">清空勾选</el-button>
        <el-button type="primary" :icon="Download" @click="exportReport">
          导出执行报告
        </el-button>
      </div>
    </div>

    <div class="stats-row">
      <div class="stat-card page-card">
        <span class="stat-label">流程总数</span>
        <span class="stat-value">{{ stats.total }}</span>
      </div>
      <div class="stat-card page-card stat-card--pass">
        <span class="stat-label">通过</span>
        <span class="stat-value">{{ stats.pass }}</span>
      </div>
      <div class="stat-card page-card stat-card--fail">
        <span class="stat-label">不通过</span>
        <span class="stat-value">{{ stats.fail }}</span>
      </div>
      <div class="stat-card page-card">
        <span class="stat-label">完成度</span>
        <span class="stat-value">{{ completionRate }}%</span>
      </div>
    </div>

    <div class="process-list page-card">
      <div
        v-for="item in processList"
        :key="item.id"
        class="process-item"
        :class="{
          'is-pass': results[item.id] === 'pass',
          'is-fail': results[item.id] === 'fail',
        }"
      >
        <div class="process-order">{{ item.order }}</div>
        <div class="process-content">
          <h3 class="process-name">{{ item.name }}</h3>
          <p class="process-desc">{{ item.description }}</p>
          <div class="process-standard">
            <span class="label">判定标准：</span>{{ item.standard }}
          </div>
          <div class="process-ref">
            <span class="label">依据：</span>{{ item.reference }}
          </div>
        </div>
        <div class="process-actions">
          <el-radio-group
            :model-value="results[item.id] || ''"
            @change="(v) => setResult(item.id, v)"
          >
            <el-radio-button label="pass">
              <el-icon><CircleCheck /></el-icon>
              通过
            </el-radio-button>
            <el-radio-button label="fail">
              <el-icon><CircleClose /></el-icon>
              不通过
            </el-radio-button>
          </el-radio-group>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/variables.scss' as *;

.process-page {
  min-height: 100%;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
  gap: 16px;
  flex-wrap: wrap;
}

.page-title {
  margin: 0 0 6px;
  font-size: 20px;
  font-weight: 600;
  color: $color-primary-dark;
}

.page-desc {
  margin: 0;
  color: $color-text-secondary;
  font-size: 13px;
}

.header-actions {
  display: flex;
  gap: 8px;
}

.stats-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  margin-bottom: 16px;
}

.stat-card {
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 4px;

  &--pass .stat-value {
    color: #16a34a;
  }

  &--fail .stat-value {
    color: #dc2626;
  }
}

.stat-label {
  font-size: 13px;
  color: $color-text-secondary;
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
  color: $color-primary;
  line-height: 1.2;
}

.process-list {
  padding: 8px 0;
}

.process-item {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 20px 24px;
  border-bottom: 1px solid $color-border;
  transition: background 0.2s;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: #f8fafc;
  }

  &.is-pass {
    background: linear-gradient(90deg, rgba(22, 163, 74, 0.06), transparent);
  }

  &.is-fail {
    background: linear-gradient(90deg, rgba(220, 38, 38, 0.06), transparent);
  }
}

.process-order {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: linear-gradient(135deg, $color-primary, $color-accent);
  color: #fff;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-size: 15px;
}

.process-content {
  flex: 1;
  min-width: 0;
}

.process-name {
  margin: 0 0 8px;
  font-size: 16px;
  font-weight: 600;
  color: $color-text;
}

.process-desc {
  margin: 0 0 10px;
  color: $color-text-secondary;
  line-height: 1.65;
  font-size: 14px;
}

.process-standard,
.process-ref {
  font-size: 13px;
  color: #475569;
  line-height: 1.5;
  margin-bottom: 4px;

  .label {
    color: $color-primary;
    font-weight: 500;
  }
}

.process-actions {
  flex-shrink: 0;
  align-self: center;

  :deep(.el-radio-button__inner) {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 10px 18px;
  }

  :deep(.el-radio-button__original-radio:checked + .el-radio-button__inner) {
    font-weight: 600;
  }
}

@media (max-width: 900px) {
  .stats-row {
    grid-template-columns: repeat(2, 1fr);
  }

  .process-item {
    flex-wrap: wrap;
  }

  .process-actions {
    width: 100%;
    padding-left: 52px;
  }
}
</style>
