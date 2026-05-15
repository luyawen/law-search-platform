<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Search } from '@element-plus/icons-vue'

const router = useRouter()
const searchText = ref('')
const activeTag = ref('')

const tagRows = [
  [
    '海警职责',
    '非法入侵',
    '检查船舶',
    '海上突发事件处置',
    '海上生产作业',
    '海洋渔业管理',
    '海洋生态环境保护',
  ],
  [
    '海洋资源开采',
    '海上安保',
    '海上警戒',
    '海上行政案件',
    '海上刑事案件',
    '海上犯罪侦查',
    '海上反恐',
    '国际合作',
  ],
]

function goSearch(keyword) {
  const q = (keyword ?? searchText.value).trim()
  if (!q) return
  router.push({ path: '/knowledge', query: { q } })
}

function onTagClick(tag) {
  activeTag.value = tag
  searchText.value = tag
  goSearch(tag)
}
</script>

<template>
  <div class="home-page">
    <div class="home-center">
      <header class="home-header">
        <span class="home-logo" aria-hidden="true">
          <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="8" y="10" width="32" height="26" rx="4" stroke="url(#g1)" stroke-width="2" />
            <path d="M16 20h16M16 26h10" stroke="url(#g1)" stroke-width="2" stroke-linecap="round" />
            <circle cx="36" cy="14" r="4" fill="url(#g2)" />
            <defs>
              <linearGradient id="g1" x1="8" y1="10" x2="40" y2="36">
                <stop stop-color="#2b7cd3" />
                <stop offset="1" stop-color="#6366f1" />
              </linearGradient>
              <linearGradient id="g2" x1="32" y1="10" x2="40" y2="18">
                <stop stop-color="#22d3ee" />
                <stop offset="1" stop-color="#3b82f6" />
              </linearGradient>
            </defs>
          </svg>
        </span>
        <h1 class="home-title">查询你需要的法律法规</h1>
      </header>

      <div class="search-wrap">
        <input
          v-model="searchText"
          type="text"
          class="search-input"
          placeholder="关键字搜索"
          @keyup.enter="goSearch()"
        />
        <button type="button" class="search-btn" aria-label="搜索" @click="goSearch()">
          <el-icon :size="22"><Search /></el-icon>
        </button>
      </div>

      <div class="tag-section">
        <div v-for="(row, rowIndex) in tagRows" :key="rowIndex" class="tag-row">
          <button
            v-for="tag in row"
            :key="tag"
            type="button"
            class="tag-chip"
            :class="{ 'tag-chip--active': activeTag === tag }"
            @click="onTagClick(tag)"
          >
            {{ tag }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.home-page {
  min-height: calc(100vh - 56px);
  margin: -20px -24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: radial-gradient(ellipse at 50% 0%, #e8f2fc 0%, #f4f8fc 45%, #fafbfd 100%);
  padding: 48px 24px 80px;
}

.home-center {
  width: 100%;
  max-width: 920px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.home-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 36px;
}

.home-logo {
  width: 44px;
  height: 44px;
  flex-shrink: 0;

  svg {
    width: 100%;
    height: 100%;
    filter: drop-shadow(0 2px 8px rgba(43, 124, 211, 0.25));
  }
}

.home-title {
  margin: 0;
  font-size: 32px;
  font-weight: 700;
  letter-spacing: 0.02em;
  background: linear-gradient(90deg, #1a5fb4 0%, #2563a8 40%, #3b6ea5 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.search-wrap {
  position: relative;
  width: 100%;
  max-width: 720px;
  display: flex;
  align-items: center;
  padding: 6px 6px 6px 28px;
  background: #fff;
  border-radius: 999px;
  border: 1px solid rgba(43, 124, 211, 0.35);
  box-shadow:
    0 0 0 1px rgba(99, 102, 241, 0.08),
    0 4px 24px rgba(26, 75, 140, 0.1),
    0 0 40px rgba(43, 124, 211, 0.12);
  transition: box-shadow 0.25s ease, border-color 0.25s ease;

  &:focus-within {
    border-color: rgba(43, 124, 211, 0.55);
    box-shadow:
      0 0 0 1px rgba(99, 102, 241, 0.15),
      0 6px 32px rgba(26, 75, 140, 0.14),
      0 0 48px rgba(99, 102, 241, 0.18);
  }
}

.search-input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 16px;
  color: #1e293b;
  background: transparent;
  min-width: 0;

  &::placeholder {
    color: #94a3b8;
  }
}

.search-btn {
  flex-shrink: 0;
  width: 52px;
  height: 52px;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  background: linear-gradient(135deg, #2563eb 0%, #4f46e5 50%, #6366f1 100%);
  box-shadow: 0 4px 14px rgba(37, 99, 235, 0.45);
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: scale(1.04);
    box-shadow: 0 6px 20px rgba(37, 99, 235, 0.5);
  }

  &:active {
    transform: scale(0.98);
  }
}

.tag-section {
  margin-top: 28px;
  width: 100%;
  max-width: 900px;
}

.tag-row {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px 12px;
  margin-bottom: 12px;

  &:last-child {
    margin-bottom: 0;
  }
}

.tag-chip {
  padding: 8px 18px;
  border-radius: 999px;
  border: 1px solid #e2e8f0;
  background: rgba(255, 255, 255, 0.85);
  color: #475569;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;

  &:hover {
    border-color: #93c5fd;
    color: #1a4b8c;
    background: #fff;
    box-shadow: 0 2px 8px rgba(26, 75, 140, 0.08);
  }

  &--active {
    background: linear-gradient(135deg, #1a4b8c, #2563a8);
    border-color: transparent;
    color: #fff;
    box-shadow: 0 4px 12px rgba(26, 75, 140, 0.25);
  }
}

@media (max-width: 768px) {
  .home-title {
    font-size: 24px;
  }

  .home-header {
    flex-direction: column;
    text-align: center;
    margin-bottom: 28px;
  }

  .search-wrap {
    padding-left: 20px;
  }

  .search-btn {
    width: 46px;
    height: 46px;
  }
}
</style>
