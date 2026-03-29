<template>
  <div class="home">
    <el-card class="box-card">
      <div slot="header" class="header">
        <span>欢迎使用 Vue2 Element UI 菜单多开管理后台</span>
      </div>
      <div class="content">
        <el-alert
          title="这是一个基于 Vue 2 + Element UI + Vue Router 实现的菜单多开示例"
          type="success"
          description="通过 keep-alive 实现标签页缓存，支持多个标签页同时打开"
          show-icon
        />

        <el-divider/>

        <h3>功能特性</h3>
        <el-table :data="features" style="width: 100%; margin-top: 20px">
          <el-table-column prop="name" label="功能" width="180"/>
          <el-table-column prop="description" label="描述"/>
        </el-table>

        <el-divider/>

        <h3>使用说明</h3>
        <el-steps :active="activeStep" finish-status="success">
          <el-step title="点击左侧菜单" description="点击左侧菜单项打开新标签页"/>
          <el-step title="多标签页切换" description="通过顶部标签页切换不同页面"/>
          <el-step title="标签页缓存" description="关闭标签页前内容会被缓存"/>
        </el-steps>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'Home',
  data() {
    return {
      activeStep: 2,
      features: [
        {
          name: '菜单多开',
          description: '支持同时打开多个菜单项，每个菜单项作为一个独立标签页',
        },
        {
          name: '标签页缓存',
          description: '使用 keep-alive 实现标签页内容缓存，切换时不重新渲染',
        },
        { name: '路由管理', description: '基于 Vue Router 实现路由管理和导航' },
        {
          name: 'Element UI',
          description: '使用 Element UI 组件库构建美观的界面',
        },
      ],
    };
  },
};
</script>

<style scoped>
.home {
  padding: 20px;
}

.box-card {
  max-width: 800px;
  margin: 0 auto;
}

.header {
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.content h3 {
  font-size: 18px;
  margin: 20px 0 10px 0;
  color: #333;
}

.el-alert {
  margin-bottom: 20px;
}

.el-divider {
  margin: 20px 0;
}
</style>
