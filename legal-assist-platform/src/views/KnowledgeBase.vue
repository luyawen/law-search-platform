<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { Search, Upload, View } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import ImportDialog from '@/components/knowledge/ImportDialog.vue'
import DetailModal from '@/components/knowledge/DetailModal.vue'
import SearchResultList from '@/components/knowledge/SearchResultList.vue'
import {
  categoryTree,
  knowledgeList as initialList,
  typeOptions,
} from '@/mock/knowledge'
import {
  matchesKeyword,
  enrichSearchResult,
} from '@/utils/knowledgeSearch'

const route = useRoute()
const STORAGE_KEY = 'legal-assist-knowledge-list'

function loadList() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) return JSON.parse(saved)
  } catch {
    /* ignore */
  }
  return JSON.parse(JSON.stringify(initialList))
}

const tableData = ref(loadList())
const treeRef = ref()
const selectedCategory = ref('')
const keyword = ref('')
const processFilter = ref('')
const planFilter = ref('')
const typeFilter = ref('全部')
const importVisible = ref(false)
const modalVisible = ref(false)
const currentRow = ref(null)
const loading = ref(false)

watch(
  tableData,
  (val) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(val))
  },
  { deep: true },
)

const filteredData = computed(() => {
  let list = [...tableData.value]
  if (selectedCategory.value) {
    list = list.filter((row) => row.categoryId === selectedCategory.value)
  }
  if (typeFilter.value && typeFilter.value !== '全部') {
    list = list.filter((row) => row.type === typeFilter.value)
  }
  const kw = keyword.value.trim()
  if (kw) {
    list = list.filter((row) => matchesKeyword(row, kw))
  }
  const proc = processFilter.value.trim().toLowerCase()
  if (proc) {
    list = list.filter((row) => row.process.toLowerCase().includes(proc))
  }
  const plan = planFilter.value.trim().toLowerCase()
  if (plan) {
    list = list.filter((row) => row.plan.toLowerCase().includes(plan))
  }
  return list
})

const isSearchMode = computed(() => !!keyword.value.trim())

const searchDisplayList = computed(() => {
  const kw = keyword.value.trim()
  if (!kw) return []
  return filteredData.value.map((row) => enrichSearchResult(row, kw))
})

function handleTreeClick(data) {
  selectedCategory.value = data.children?.length ? '' : data.id
}

function handleSearch() {
  loading.value = true
  setTimeout(() => {
    loading.value = false
    ElMessage.success(`检索完成，共 ${filteredData.value.length} 条记录`)
  }, 400)
}

function applyRouteKeyword() {
  const q = route.query.q
  if (q && typeof q === 'string' && q.trim()) {
    keyword.value = q.trim()
    handleSearch()
  }
}

onMounted(applyRouteKeyword)

watch(
  () => route.query.q,
  (q) => {
    if (q && typeof q === 'string' && q.trim()) {
      keyword.value = q.trim()
      handleSearch()
    }
  },
)

function resetSearch() {
  keyword.value = ''
  processFilter.value = ''
  planFilter.value = ''
  typeFilter.value = '全部'
  selectedCategory.value = ''
  treeRef.value?.setCurrentKey(null)
}

function openDetail(row) {
  const { _titleHtml, _snippetHtml, _hasContentHit, ...raw } = row
  currentRow.value = tableData.value.find((r) => r.id === row.id) || raw
  modalVisible.value = true
}

function onImportSuccess({ fileName, title, content, isPdf }) {
  const id = `KB-${String(Date.now()).slice(-6)}`
  const today = new Date().toISOString().slice(0, 10)
  const body =
    content?.trim() ||
    `【导入说明】\n\n本记录由文件「${fileName}」导入，请补充正文。`

  const newRow = {
    id,
    title: title || '新导入文档',
    type: isPdf ? '法律法规' : '法律法规',
    categoryId: 'law-national',
    categoryPath: '法律法规 / 国家法律',
    docNumber: `导入-${fileName || '未命名'}`,
    docNo: `导入-${fileName || '未命名'}`,
    publishDate: today,
    executeDate: today,
    effectiveDate: today,
    department: '待补充',
    status: '现行有效',
    process: '待关联',
    plan: '—',
    keywords: ['导入', isPdf ? 'PDF' : '待审核'],
    summary: `由文件「${fileName}」导入${isPdf ? '，已解析 PDF 全文' : ''}。`,
    content: body,
  }
  tableData.value = [newRow, ...tableData.value]
}
</script>

<template>
  <div class="knowledge-page">
    <div class="page-header">
      <div>
        <h2 class="page-title">法律法规知识库</h2>
        <p class="page-desc">集中管理法律法规、标准规范、规章条例及应急预案，支持多维检索与文档导入</p>
      </div>
      <el-button type="primary" :icon="Upload" @click="importVisible = true">
        导入
      </el-button>
    </div>

    <div class="knowledge-body">
      <aside class="knowledge-sidebar page-card">
        <div class="sidebar-section">
          <h3 class="sidebar-title">目录分类</h3>
          <el-tree
            ref="treeRef"
            :data="categoryTree"
            node-key="id"
            default-expand-all
            highlight-current
            :props="{ label: 'label', children: 'children' }"
            @node-click="handleTreeClick"
          />
        </div>
        <div class="sidebar-section search-section">
          <h3 class="sidebar-title">检索条件</h3>
          <el-input
            v-model="keyword"
            placeholder="关键字（标题/目录/全文）"
            clearable
            :prefix-icon="Search"
            class="search-input"
          />
          <el-input
            v-model="processFilter"
            placeholder="关联流程"
            clearable
            class="search-input"
          />
          <el-input
            v-model="planFilter"
            placeholder="关联预案"
            clearable
            class="search-input"
          />
          <el-select v-model="typeFilter" placeholder="文档类型" class="search-input">
            <el-option
              v-for="opt in typeOptions"
              :key="opt"
              :label="opt"
              :value="opt"
            />
          </el-select>
          <div class="search-actions">
            <el-button type="primary" :icon="Search" @click="handleSearch">查询</el-button>
            <el-button @click="resetSearch">重置</el-button>
          </div>
        </div>
      </aside>

      <section class="knowledge-main page-card">
        <div class="table-toolbar">
          <span class="result-count">
            共 <strong>{{ filteredData.length }}</strong> 条记录
          </span>
        </div>
        <SearchResultList
          v-if="isSearchMode"
          :items="searchDisplayList"
          :loading="loading"
          @select="openDetail"
        />
        <el-table
          v-else
          v-loading="loading"
          :data="filteredData"
          stripe
          highlight-current-row
          class="knowledge-table"
          @row-click="openDetail"
        >
          <el-table-column prop="id" label="编号" width="100" />
          <el-table-column prop="title" label="标题" min-width="220" show-overflow-tooltip />
          <el-table-column prop="type" label="类型" width="110">
            <template #default="{ row }">
              <el-tag size="small" effect="plain">{{ row.type }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="docNo" label="文号" width="180" show-overflow-tooltip />
          <el-table-column prop="process" label="关联流程" width="140" show-overflow-tooltip />
          <el-table-column prop="plan" label="关联预案" width="160" show-overflow-tooltip />
          <el-table-column prop="status" label="状态" width="100">
            <template #default="{ row }">
              <el-tag
                size="small"
                :type="row.status === '现行有效' ? 'success' : 'info'"
              >
                {{ row.status }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="90" fixed="right">
            <template #default="{ row }">
              <el-button
                type="primary"
                link
                :icon="View"
                @click.stop="openDetail(row)"
              >
                详情
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </section>
    </div>

    <ImportDialog v-model="importVisible" @success="onImportSuccess" />
    <DetailModal v-model="modalVisible" :record="currentRow" />
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/variables.scss' as *;

.knowledge-page {
  min-height: 100%;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
  gap: 16px;
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

.knowledge-body {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 16px;
  align-items: start;
}

.knowledge-sidebar {
  padding: 16px;
}

.sidebar-section + .sidebar-section {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid $color-border;
}

.sidebar-title {
  margin: 0 0 12px;
  font-size: 14px;
  font-weight: 600;
  color: $color-primary-dark;
}

.search-input {
  width: 100%;
  margin-bottom: 10px;
}

.search-actions {
  display: flex;
  gap: 8px;
  margin-top: 4px;
}

.knowledge-main {
  padding: 16px;
  min-width: 0;
}

.table-toolbar {
  margin-bottom: 12px;
}

.result-count {
  color: $color-text-secondary;
  font-size: 13px;

  strong {
    color: $color-primary;
    font-weight: 600;
  }
}

.knowledge-table {
  width: 100%;
  cursor: pointer;

  :deep(.el-table__row:hover) {
    cursor: pointer;
  }
}

@media (max-width: 1100px) {
  .knowledge-body {
    grid-template-columns: 1fr;
  }
}
</style>
