<template>
  <div id="app">
    <el-container style="height: 100vh;">
      <!-- 侧边栏菜单 -->
      <el-aside width="200px" style="background-color: #545c64;">
        <div class="menu-header">
          <h3 style="color: white; text-align: center; padding: 20px 0; margin: 0;">
            菜单多开示例
          </h3>
        </div>
        <el-menu
          :default-openeds="['1', '2']"
          class="el-menu-vertical-demo"
          @select="handleMenuSelect"
        >
          <!-- 系统管理 -->
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-setting"></i>
              <span>系统管理</span>
            </template>
            <el-menu-item index="/user-management">
              <i class="el-icon-user"></i>
              <span>用户管理</span>
            </el-menu-item>
            <el-menu-item index="/role-management">
              <i class="el-icon-key"></i>
              <span>角色管理</span>
            </el-menu-item>
            <el-menu-item index="/permission-management">
              <i class="el-icon-lock"></i>
              <span>权限管理</span>
            </el-menu-item>
          </el-submenu>

          <!-- 业务管理 -->
          <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-office"></i>
              <span>业务管理</span>
            </template>
            <el-menu-item index="/order-management">
              <i class="el-icon-shopping-cart-2"></i>
              <span>订单管理</span>
            </el-menu-item>
            <el-menu-item index="/product-management">
              <i class="el-icon-goods"></i>
              <span>商品管理</span>
            </el-menu-item>
          </el-submenu>

          <!-- 数据统计 -->
          <el-submenu index="3">
            <template slot="title">
              <i class="el-icon-data-line"></i>
              <span>数据统计</span>
            </template>
            <el-menu-item index="/statistics-dashboard">
              <i class="el-icon-s-data"></i>
              <span>数据看板</span>
            </el-menu-item>
            <el-menu-item index="/report-management">
              <i class="el-icon-document"></i>
              <span>报表管理</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>

      <!-- 主内容区 -->
      <el-container>
        <!-- 顶部导航 -->
        <el-header style="background-color: #fff; padding: 0; box-shadow: 0 1px 4px rgba(0,21,41,.08);">
          <div class="top-nav">
            <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb">
              <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
              <el-breadcrumb-item v-for="item in breadcrumbs" :key="item.path">{{ item.name }}</el-breadcrumb-item>
            </el-breadcrumb>
            <div class="user-info">
              <el-dropdown>
                <span class="el-dropdown-link">
                  <i class="el-icon-user"></i>
                  管理员
                  <i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item>个人中心</el-dropdown-item>
                  <el-dropdown-item divided @click.native="logout">退出登录</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </div>
        </el-header>

        <!-- 内容区域 -->
        <el-main style="padding: 10px; background-color: #f3f4f5;">
          <!-- 标签页导航 -->
          <el-tabs
            v-model="activeTab"
            type="card"
            @tab-click="handleTabClick"
            @tab-remove="handleTabRemove"
            class="tabs-nav"
          >
            <el-tab-pane
              v-for="tab in openedTabs"
              :key="tab.path"
              :label="tab.title"
              :name="tab.path"
              :closable="tab.path !== '/'"
            >
              <div style="display: none;"></div>
            </el-tab-pane>
          </el-tabs>

          <!-- 路由视图 -->
          <keep-alive :include="cachedViews">
            <router-view :key="routerKey" style="margin-top: 10px;"></router-view>
          </keep-alive>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      activeTab: '/',
      openedTabs: [
        {
          path: '/',
          title: '首页',
          name: '首页'
        }
      ],
      cachedViews: ['Home']
    }
  },
  computed: {
    routerKey() {
      return this.$route.fullPath
    },
    breadcrumbs() {
      const breadcrumbs = []
      this.openedTabs.forEach(tab => {
        if (tab.path !== '/') {
          breadcrumbs.push({
            path: tab.path,
            name: tab.title
          })
        }
      })
      return breadcrumbs
    }
  },
  methods: {
    handleMenuSelect(index) {
      // 添加标签页
      this.addTab(index)
      // 路由跳转
      this.$router.push(index)
    },
    addTab(path) {
      // 检查标签是否已存在
      const exists = this.openedTabs.some(tab => tab.path === path)
      if (!exists) {
        // 获取路由名称
        const route = this.$router.options.routes.find(r => r.path === path)
        let title = path.split('/').filter(Boolean).join(' - ')
        
        if (route && route.meta && route.meta.title) {
          title = route.meta.title
        }
        
        this.openedTabs.push({
          path,
          title,
          name: path.split('/').filter(Boolean).pop() || '首页'
        })
        
        // 添加到缓存视图
        const viewName = path.split('/').filter(Boolean).join('-') || 'Home'
        if (!this.cachedViews.includes(viewName)) {
          this.cachedViews.push(viewName)
        }
      }
    },
    handleTabClick(tab) {
      this.$router.push(tab.name)
    },
    handleTabRemove(targetName) {
      if (targetName === '/') return
      
      const tabs = this.openedTabs
      let activeName = this.activeTab
      
      if (activeName === targetName) {
        tabs.forEach((tab, index) => {
          if (tab.path === targetName) {
            const nextTab = tabs[index + 1] || tabs[index - 1]
            if (nextTab) {
              activeName = nextTab.path
              this.$router.push(activeName)
            }
          }
        })
      }
      
      this.openedTabs = tabs.filter(tab => tab.path !== targetName)
      
      // 从缓存中移除
      const viewName = targetName.split('/').filter(Boolean).join('-')
      this.cachedViews = this.cachedViews.filter(view => view !== viewName)
    },
    logout() {
      this.$message.success('退出登录成功')
      this.openedTabs = [{ path: '/', title: '首页', name: '首页' }]
      this.activeTab = '/'
      this.$router.push('/')
    }
  },
  watch: {
    '$route'(to) {
      // 路由变化时更新 activeTab
      this.activeTab = to.path
    }
  }
}
</script>

<style scoped>
#app {
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.menu-header h3 {
  font-size: 14px;
  font-weight: bold;
}

.el-menu-vertical-demo {
  border-right: none;
}

.top-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  height: 100%;
}

.breadcrumb {
  padding: 10px 0;
}

.user-info {
  display: flex;
  align-items: center;
}

.user-info .el-dropdown-link {
  display: flex;
  align-items: center;
  cursor: pointer;
  color: #606266;
}

.user-info .el-dropdown-link:hover {
  color: #409eff;
}

.tabs-nav {
  margin-bottom: 10px;
}

.el-main {
  padding: 10px;
  background-color: #f3f4f5;
  min-height: calc(100vh - 60px);
}
</style>

