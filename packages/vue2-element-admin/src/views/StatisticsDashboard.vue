<template>
  <div class="statistics-dashboard">
    <el-card class="box-card">
      <div slot="header" class="header">
        <span>数据看板</span>
      </div>
      <div class="content">
        <el-row :gutter="20" style="margin-bottom: 20px">
          <el-col :span="6">
            <el-card shadow="hover" class="stat-card">
              <div class="stat-icon" style="background: #409eff">
                <i class="el-icon-user"/>
              </div>
              <div class="stat-info">
                <div class="stat-value">{{ statistics.totalUsers }}</div>
                <div class="stat-label">总用户数</div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card shadow="hover" class="stat-card">
              <div class="stat-icon" style="background: #67c23a">
                <i class="el-icon-bag"/>
              </div>
              <div class="stat-info">
                <div class="stat-value">{{ statistics.totalOrders }}</div>
                <div class="stat-label">总订单数</div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card shadow="hover" class="stat-card">
              <div class="stat-icon" style="background: #f56c6c">
                <i class="el-icon-money"/>
              </div>
              <div class="stat-info">
                <div class="stat-value">¥{{ statistics.totalRevenue }}</div>
                <div class="stat-label">总销售额</div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card shadow="hover" class="stat-card">
              <div class="stat-icon" style="background: #e6a23c">
                <i class="el-icon-goods"/>
              </div>
              <div class="stat-info">
                <div class="stat-value">{{ statistics.totalProducts }}</div>
                <div class="stat-label">商品总数</div>
              </div>
            </el-card>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-card shadow="hover" class="chart-card">
              <div slot="header" class="chart-header">
                <span>订单趋势</span>
              </div>
              <div class="chart-content">
                <el-table :data="orderTrend" style="width: 100%">
                  <el-table-column prop="date" label="日期" width="100"/>
                  <el-table-column prop="orders" label="订单数" width="100"/>
                  <el-table-column prop="amount" label="金额" width="120"/>
                </el-table>
              </div>
            </el-card>
          </el-col>
          <el-col :span="12">
            <el-card shadow="hover" class="chart-card">
              <div slot="header" class="chart-header">
                <span>商品分类分布</span>
              </div>
              <div class="chart-content">
                <el-table :data="categoryDistribution" style="width: 100%">
                  <el-table-column prop="category" label="分类" width="120"/>
                  <el-table-column prop="count" label="数量" width="100"/>
                  <el-table-column prop="percentage" label="占比" width="100">
                    <template #default="scope"> {{ scope.row.percentage }}% </template>
                  </el-table-column>
                </el-table>
              </div>
            </el-card>
          </el-col>
        </el-row>

        <el-row :gutter="20" style="margin-top: 20px">
          <el-col :span="24">
            <el-card shadow="hover" class="chart-card">
              <div slot="header" class="chart-header">
                <span>最近订单</span>
              </div>
              <div class="chart-content">
                <el-table :data="recentOrders" style="width: 100%">
                  <el-table-column prop="id" label="订单号" width="150"/>
                  <el-table-column prop="customerName" label="客户名称" width="150"/>
                  <el-table-column prop="productName" label="商品名称"/>
                  <el-table-column prop="amount" label="金额" width="120">
                    <template #default="scope"> ¥{{ scope.row.amount.toFixed(2) }} </template>
                  </el-table-column>
                  <el-table-column prop="status" label="状态" width="100">
                    <template #default="scope">
                      <el-tag :type="getStatusType(scope.row.status)" size="small">
                        {{ getStatusText(scope.row.status) }}
                      </el-tag>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'StatisticsDashboard',
  data() {
    return {
      statistics: {
        totalUsers: 1234,
        totalOrders: 5678,
        totalRevenue: 98765.43,
        totalProducts: 234,
      },
      orderTrend: [
        { date: '周一', orders: 120, amount: 25000 },
        { date: '周二', orders: 150, amount: 32000 },
        { date: '周三', orders: 180, amount: 38000 },
        { date: '周四', orders: 160, amount: 35000 },
        { date: '周五', orders: 200, amount: 42000 },
        { date: '周六', orders: 220, amount: 48000 },
        { date: '周日', orders: 190, amount: 40000 },
      ],
      categoryDistribution: [
        { category: '电子产品', count: 45, percentage: 35 },
        { category: '服装', count: 30, percentage: 25 },
        { category: '食品', count: 25, percentage: 20 },
        { category: '图书', count: 20, percentage: 15 },
        { category: '其他', count: 10, percentage: 5 },
      ],
      recentOrders: [
        {
          id: 'ORD2024010001',
          customerName: '张三',
          productName: 'iPhone 15',
          amount: 6999.0,
          status: 'paid',
        },
        {
          id: 'ORD2024010002',
          customerName: '李四',
          productName: 'MacBook Pro',
          amount: 15999.0,
          status: 'shipped',
        },
        {
          id: 'ORD2024010003',
          customerName: '王五',
          productName: 'iPad Air',
          amount: 8998.0,
          status: 'pending',
        },
        {
          id: 'ORD2024010004',
          customerName: '赵六',
          productName: 'AirPods Pro',
          amount: 1999.0,
          status: 'completed',
        },
        {
          id: 'ORD2024010005',
          customerName: '孙七',
          productName: 'Apple Watch',
          amount: 3199.0,
          status: 'cancelled',
        },
      ],
    };
  },
  methods: {
    getStatusType(status) {
      const types = {
        pending: 'warning',
        paid: 'success',
        shipped: 'primary',
        completed: 'success',
        cancelled: 'info',
      };
      return types[status] || 'info';
    },
    getStatusText(status) {
      const texts = {
        pending: '待付款',
        paid: '已付款',
        shipped: '已发货',
        completed: '已完成',
        cancelled: '已取消',
      };
      return texts[status] || status;
    },
  },
};
</script>

<style scoped>
.statistics-dashboard {
  padding: 20px;
}

.box-card {
  max-width: 1400px;
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

.stat-card {
  display: flex;
  align-items: center;
  padding: 20px;
  cursor: pointer;
  transition: transform 0.3s;
}

.stat-card:hover {
  transform: translateY(-5px);
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20px;
}

.stat-icon i {
  color: white;
  font-size: 30px;
}

.stat-info {
  flex: 1;
}

.stat-value {
  font-size: 28px;
  font-weight: bold;
  color: #333;
  margin-bottom: 5px;
}

.stat-label {
  font-size: 14px;
  color: #999;
}

.chart-card {
  margin-bottom: 20px;
}

.chart-header {
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.chart-content {
  padding: 10px 0;
}
</style>
