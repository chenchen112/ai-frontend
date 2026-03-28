<template>
  <div class="report-management">
    <el-card class="box-card">
      <div slot="header" class="header">
        <span>报表管理</span>
      </div>
      <div class="content">
        <el-row :gutter="20" style="margin-bottom: 20px;">
          <el-col :span="6">
            <el-date-picker
              v-model="dateRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              style="width: 100%"
            ></el-date-picker>
          </el-col>
          <el-col :span="4">
            <el-select v-model="reportType" placeholder="报表类型" style="width: 100%">
              <el-option label="销售报表" value="sales"></el-option>
              <el-option label="库存报表" value="inventory"></el-option>
              <el-option label="用户报表" value="users"></el-option>
            </el-select>
          </el-col>
          <el-col :span="4">
            <el-button type="primary" @click="handleGenerate" icon="el-icon-search">
              生成报表
            </el-button>
          </el-col>
          <el-col :span="4">
            <el-button type="success" @click="handleExport" icon="el-icon-download">
              导出
            </el-button>
          </el-col>
        </el-row>
        
        <el-tabs v-model="activeTab" @tab-click="handleTabClick">
          <el-tab-pane label="销售报表" name="sales">
            <el-table
              v-loading="loading"
              :data="salesReport"
              border
              stripe
              style="width: 100%"
            >
              <el-table-column prop="date" label="日期" width="120"></el-table-column>
              <el-table-column prop="orders" label="订单数" width="100"></el-table-column>
              <el-table-column prop="amount" label="销售额" width="120"></el-table-column>
              <el-table-column prop="avgAmount" label="平均客单价" width="140"></el-table-column>
              <el-table-column prop="growth" label="环比增长" width="100">
                <template #default="scope">
                  <span :style="{ color: scope.row.growth >= 0 ? '#67C23A' : '#F56C6C' }">
                    {{ scope.row.growth >= 0 ? '+' : '' }}{{ scope.row.growth }}%
                  </span>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          
          <el-tab-pane label="库存报表" name="inventory">
            <el-table
              v-loading="loading"
              :data="inventoryReport"
              border
              stripe
              style="width: 100%"
            >
              <el-table-column prop="category" label="分类" width="120"></el-table-column>
              <el-table-column prop="totalProducts" label="商品总数" width="120"></el-table-column>
              <el-table-column prop="totalStock" label="总库存" width="100"></el-table-column>
              <el-table-column prop="lowStock" label="低库存商品" width="120"></el-table-column>
              <el-table-column prop="value" label="库存价值" width="140"></el-table-column>
            </el-table>
          </el-tab-pane>
          
          <el-tab-pane label="用户报表" name="users">
            <el-table
              v-loading="loading"
              :data="userReport"
              border
              stripe
              style="width: 100%"
            >
              <el-table-column prop="date" label="日期" width="120"></el-table-column>
              <el-table-column prop="newUsers" label="新增用户" width="120"></el-table-column>
              <el-table-column prop="activeUsers" label="活跃用户" width="120"></el-table-column>
              <el-table-column prop="retention" label="留存率" width="100">
                <template #default="scope">
                  {{ scope.row.retention }}%
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'ReportManagement',
  data() {
    return {
      dateRange: [],
      reportType: 'sales',
      activeTab: 'sales',
      loading: false,
      salesReport: [],
      inventoryReport: [],
      userReport: []
    }
  },
  created() {
    this.generateReport()
  },
  methods: {
    generateReport() {
      this.loading = true
      setTimeout(() => {
        this.salesReport = [
          { date: '2024-01-01', orders: 120, amount: 250000, avgAmount: 2083, growth: 12 },
          { date: '2024-01-02', orders: 150, amount: 320000, avgAmount: 2133, growth: 15 },
          { date: '2024-01-03', orders: 180, amount: 380000, avgAmount: 2111, growth: 10 },
          { date: '2024-01-04', orders: 160, amount: 350000, avgAmount: 2188, growth: 8 },
          { date: '2024-01-05', orders: 200, amount: 420000, avgAmount: 2100, growth: 18 },
          { date: '2024-01-06', orders: 220, amount: 480000, avgAmount: 2182, growth: 20 },
          { date: '2024-01-07', orders: 190, amount: 400000, avgAmount: 2105, growth: 5 }
        ]
        this.inventoryReport = [
          { category: '电子产品', totalProducts: 45, totalStock: 150, lowStock: 5, value: 1500000 },
          { category: '服装', totalProducts: 30, totalStock: 500, lowStock: 10, value: 50000 },
          { category: '食品', totalProducts: 25, totalStock: 1000, lowStock: 2, value: 20000 },
          { category: '图书', totalProducts: 20, totalStock: 200, lowStock: 8, value: 30000 },
          { category: '其他', totalProducts: 10, totalStock: 50, lowStock: 3, value: 5000 }
        ]
        this.userReport = [
          { date: '2024-01-01', newUsers: 50, activeUsers: 200, retention: 85 },
          { date: '2024-01-02', newUsers: 60, activeUsers: 220, retention: 88 },
          { date: '2024-01-03', newUsers: 70, activeUsers: 250, retention: 90 },
          { date: '2024-01-04', newUsers: 55, activeUsers: 230, retention: 87 },
          { date: '2024-01-05', newUsers: 80, activeUsers: 280, retention: 92 },
          { date: '2024-01-06', newUsers: 90, activeUsers: 300, retention: 95 },
          { date: '2024-01-07', newUsers: 75, activeUsers: 270, retention: 89 }
        ]
        this.loading = false
      }, 500)
    },
    handleGenerate() {
      this.generateReport()
      this.$message.success('报表生成成功')
    },
    handleExport() {
      this.$message.success('导出功能开发中...')
    },
    handleTabClick(tab) {
      this.reportType = tab.name
    }
  }
}
</script>

<style scoped>
.report-management {
  padding: 20px;
}

.box-card {
  max-width: 1200px;
  margin: 0 auto;
}

.header {
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.content {
  padding: 20px 0;
}
</style>
