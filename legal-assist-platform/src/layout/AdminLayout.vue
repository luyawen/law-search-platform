<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  HomeFilled,
  Document,
  Operation,
  UserFilled,
  Bell,
} from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()

const menuItems = [
  { path: '/', title: '首页', icon: HomeFilled },
  { path: '/knowledge', title: '法律法规知识库', icon: Document },
  { path: '/process', title: '标准流程工具', icon: Operation },
]

const navTabs = [
  { path: '/', title: '首页' },
  { path: '/knowledge', title: '法律法规知识库' },
  { path: '/process', title: '标准流程工具' },
]

const activeMenu = computed(() => {
  if (route.path === '/' || route.name === 'Home') return '/'
  return route.path
})

const activeNavTab = computed(() => activeMenu.value)

function navigate(path) {
  router.push(path)
}
</script>

<template>
  <el-container class="admin-layout">
    <el-aside width="240px" class="admin-aside">
      <div class="brand">
        <div class="brand-icon">法</div>
        <div class="brand-text">
          <span class="brand-title">法律法规辅助平台</span>
          <span class="brand-sub">Legal Compliance Hub</span>
        </div>
      </div>
      <el-menu
        :default-active="activeMenu"
        class="aside-menu"
        background-color="transparent"
        text-color="#b8cce8"
        active-text-color="#ffffff"
        @select="navigate"
      >
        <el-menu-item
          v-for="item in menuItems"
          :key="item.path"
          :index="item.path"
        >
          <el-icon><component :is="item.icon" /></el-icon>
          <span>{{ item.title }}</span>
        </el-menu-item>
      </el-menu>
      <div class="aside-footer">
        <span>原型演示 v1.0</span>
      </div>
    </el-aside>

    <el-container class="admin-main-wrap">
      <el-header class="admin-header" height="56px">
        <div class="header-left">
          <nav class="header-nav">
            <router-link
              v-for="tab in navTabs"
              :key="tab.path"
              :to="tab.path"
              class="nav-tab"
              :class="{ 'nav-tab--active': activeNavTab === tab.path }"
            >
              {{ tab.title }}
            </router-link>
          </nav>
        </div>
        <div class="header-right">
          <el-badge :value="3" :max="9" class="notify-badge">
            <el-button :icon="Bell" circle text />
          </el-badge>
          <el-dropdown trigger="click">
            <div class="user-block">
              <el-avatar :size="32" :icon="UserFilled" class="user-avatar" />
              <span class="user-name">管理员</span>
              <span class="user-role">安全合规部</span>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>个人中心</el-dropdown-item>
                <el-dropdown-item divided>退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>

      <el-main class="admin-main" :class="{ 'admin-main--home': route.name === 'Home' }">
        <router-view v-slot="{ Component }">
          <transition name="fade-slide" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<style lang="scss" scoped>
@use '@/styles/variables.scss' as *;

.admin-layout {
  height: 100vh;
  overflow: hidden;
}

.admin-aside {
  background: linear-gradient(180deg, $color-primary-dark 0%, #163a6e 100%);
  display: flex;
  flex-direction: column;
  border-right: 1px solid rgba(255, 255, 255, 0.08);
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 20px 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.brand-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: linear-gradient(135deg, $color-accent, #4a9de8);
  color: #fff;
  font-size: 18px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.brand-text {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.brand-title {
  color: #fff;
  font-size: 15px;
  font-weight: 600;
  line-height: 1.3;
}

.brand-sub {
  color: rgba(255, 255, 255, 0.45);
  font-size: 11px;
  margin-top: 2px;
}

.aside-menu {
  border-right: none;
  flex: 1;
  padding: 12px 8px;

  :deep(.el-menu-item) {
    border-radius: 6px;
    margin-bottom: 4px;
    height: 44px;

    &.is-active {
      background: rgba(43, 124, 211, 0.35) !important;
      font-weight: 600;
    }

    &:hover {
      background: rgba(255, 255, 255, 0.08) !important;
    }
  }
}

.aside-footer {
  padding: 16px;
  color: rgba(255, 255, 255, 0.35);
  font-size: 12px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.admin-main-wrap {
  background: $color-bg;
  min-width: 0;
}

.admin-header {
  background: $color-bg-card;
  border-bottom: 1px solid $color-border;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  box-shadow: 0 1px 2px rgba(15, 45, 84, 0.04);
  gap: 16px;
}

.header-left {
  display: flex;
  align-items: center;
  min-width: 0;
}

.header-nav {
  display: flex;
  align-items: center;
  gap: 4px;
}

.nav-tab {
  padding: 6px 14px;
  font-size: 14px;
  color: $color-text-secondary;
  text-decoration: none;
  border-radius: 6px;
  transition: color 0.2s, background 0.2s;
  white-space: nowrap;

  &:hover {
    color: $color-primary;
    background: rgba(26, 75, 140, 0.06);
  }

  &--active {
    color: $color-primary;
    font-weight: 600;
    background: rgba(26, 75, 140, 0.1);
  }
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.user-block {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 6px;
  transition: background 0.2s;

  &:hover {
    background: $color-bg;
  }
}

.user-avatar {
  background: $color-primary;
}

.user-name {
  font-weight: 500;
  color: $color-text;
}

.user-role {
  font-size: 12px;
  color: $color-text-secondary;
  padding-left: 4px;
  border-left: 1px solid $color-border;
  margin-left: 4px;
}

.admin-main {
  padding: 20px 24px;
  overflow: auto;

  &--home {
    padding: 0;
    overflow: hidden;
  }
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(8px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
