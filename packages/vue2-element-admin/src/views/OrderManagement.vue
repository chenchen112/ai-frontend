<template>
  <div class="order-management">
    <el-card class="box-card">
      <div slot="header" class="header">
        <span>订单管理</span>
      </div>
      <div class="content">
        <el-row :gutter="20" style="margin-bottom: 20px;">
          <el-col :span="6">
            <el-input
              v-model="searchText"
              placeholder="搜索订单"
              clearable
            ></el-input>
          </el-col>
          <el-col :span="4">
            <el-button type="primary" @click="handleAddOrder" icon="el-icon-plus">
              添加订单
            </el-button>
          </el-col>
          <el-col :span="4">
            <el-button type="success" @click="handleExport" icon="el-icon-download">
              导出
            </el-button>
          </el-col>
        </el-row>
        
        <el-table
          v-loading="loading"
          :data="orderList"
          border
          stripe
          style="width: 100%"
        >
          <el-table-column prop="id" label="订单号" width="150"></el-table-column>
          <el-table-column prop="customerName" label="客户名称" width="120"></el-table-column>
          <el-table-column prop="productName" label="商品名称" width="150"></el-table-column>
          <el-table-column prop="quantity" label="数量" width="80"></el-table-column>
          <el-table-column prop="totalAmount" label="金额" width="100">
            <template #default="scope">
              <span>¥{{ scope.row.totalAmount.toFixed(2) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态" width="100">
            <template #default="scope">
              <el-tag :type="getStatusType(scope.row.status)" size="small">
                {{ getStatusText(scope.row.status) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="createdAt" label="创建时间" width="180"></el-table-column>
          <el-table-column label="操作" width="150" fixed="right">
            <template #default="scope">
              <el-button type="primary" size="small" @click="handleView(scope.row)">查看</el-button>
              <el-button type="warning" size="small" @click="handleEdit(scope.row)">编辑</el-button>
              <el-button type="danger" size="small" @click="handleDelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        
        <el-pagination
          :current-page="pagination.currentPage"
          :page-size="pagination.pageSize"
          :total="pagination.total"
          layout="total, prev, pager, next, jumper"
          @current-change="handlePageChange"
          style="margin-top: 20px; text-align: right"
        ></el-pagination>
      </div>
    </el-card>
    
    <!-- 查看/编辑订单对话框 -->
    <el-dialog
      :title="dialogTitle"
      v-model="dialogVisible"
      width="500px"
      @close="handleDialogClose"
    >
      <el-form :model="formData" :rules="formRules" ref="orderForm" label-width="100px">
        <el-form-item label="订单号" prop="id">
          <el-input v-model="formData.id" disabled></el-input>
        </el-form-item>
        <el-form-item label="客户名称" prop="customerName">
          <el-input v-model="formData.customerName" placeholder="请输入客户名称"></el-input>
        </el-form-item>
        <el-form-item label="商品名称" prop="productName">
          <el-input v-model="formData.productName" placeholder="请输入商品名称"></el-input>
        </el-form-item>
        <el-form-item label="数量" prop="quantity">
          <el-input-number v-model="formData.quantity" :min="1" :max="999"></el-input-number>
        </el-form-item>
        <el-form-item label="金额" prop="totalAmount">
          <el-input-number v-model="formData.totalAmount" :min="0" :max="999999" :precision="2" :step="0.1"></el-input-number>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="formData.status" placeholder="请选择状态" style="width: 100%">
            <el-option label="待付款" value="pending"></el-option>
            <el-option label="已付款" value="paid"></el-option>
            <el-option label="已发货" value="shipped"></el-option>
            <el-option label="已完成" value="completed"></el-option>
            <el-option label="已取消" value="cancelled"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="submitLoading">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'OrderManagement',
  data() {
    return {
      loading: false,
      searchText: '',
      orderList: [],
      pagination: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      dialogVisible: false,
      dialogTitle: '添加订单',
      formData: {
        id: '',
        customerName: '',
        productName: '',
        quantity: 1,
        totalAmount: 0,
        status: 'pending'
      },
      formRules: {
        customerName: [
          { required: true, message: '请输入客户名称', trigger: 'blur' }
        ],
        productName: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ]
      },
      submitLoading: false
    }
  },
  created() {
    this.fetchOrders()
  },
  methods: {
    fetchOrders() {
      this.loading = true
      setTimeout(() => {
        this.orderList = [
          { id: 'ORD2024010001', customerName: '张三', productName: 'iPhone 15', quantity: 1, totalAmount: 6999.00, status: 'paid', createdAt: '2024-01-15 10:30:00' },
          { id: 'ORD2024010002', customerName: '李四', productName: 'MacBook Pro', quantity: 1, totalAmount: 15999.00, status: 'shipped', createdAt: '2024-01-14 14:20:00' },
          { id: 'ORD2024010003', customerName: '王五', productName: 'iPad Air', quantity: 2, totalAmount: 8998.00, status: 'pending', createdAt: '2024-01-16 09:15:00' },
          { id: 'ORD2024010004', customerName: '赵六', productName: 'AirPods Pro', quantity: 1, totalAmount: 1999.00, status: 'completed', createdAt: '2024-01-13 16:45:00' },
          { id: 'ORD2024010005', customerName: '孙七', productName: 'Apple Watch', quantity: 1, totalAmount: 3199.00, status: 'cancelled', createdAt: '2024-01-12 11:20:00' }
        ]
        this.pagination.total = this.orderList.length
        this.loading = false
      }, 500)
    },
    getStatusType(status) {
      const types = {
        pending: 'warning',
        paid: 'success',
        shipped: 'primary',
        completed: 'success',
        cancelled: 'info'
      }
      return types[status] || 'info'
    },
    getStatusText(status) {
      const texts = {
        pending: '待付款',
        paid: '已付款',
        shipped: '已发货',
        completed: '已完成',
        cancelled: '已取消'
      }
      return texts[status] || status
    },
    handleAddOrder() {
      this.dialogTitle = '添加订单'
      this.formData = {
        id: 'ORD' + Date.now(),
        customerName: '',
        productName: '',
        quantity: 1,
        totalAmount: 0,
        status: 'pending'
      }
      this.dialogVisible = true
    },
    handleView(row) {
      this.dialogTitle = '查看订单'
      this.formData = { ...row }
      this.dialogVisible = true
    },
    handleEdit(row) {
      this.dialogTitle = '编辑订单'
      this.formData = { ...row }
      this.dialogVisible = true
    },
    handleDelete(row) {
      this.$confirm('确定要删除该订单吗？', '提示', {
        type: 'warning'
      }).then(() => {
        this.orderList = this.orderList.filter(item => item.id !== row.id)
        this.pagination.total = this.orderList.length
        this.$message.success('删除成功')
      }).catch(() => {})
    },
    handleExport() {
      this.$message.success('导出功能开发中...')
    },
    handlePageChange(page) {
      this.pagination.currentPage = page
      this.fetchOrders()
    },
    handleDialogClose() {
      this.$refs.orderForm?.resetFields()
    },
    handleSubmit() {
      this.$refs.orderForm?.validate((valid) => {
        if (valid) {
          this.submitLoading = true
          setTimeout(() => {
            if (this.formData.id.startsWith('ORD') && this.formData.id.length > 12) {
              // 新订单
              this.orderList.push({ ...this.formData, createdAt: new Date().toLocaleString() })
              this.pagination.total = this.orderList.length
            } else {
              // 编辑订单
              const index = this.orderList.findIndex(item => item.id === this.formData.id)
              if (index !== -1) {
                this.orderList[index] = { ...this.formData }
              }
            }
            this.dialogVisible = false
            this.$message.success(this.formData.id.startsWith('ORD') && this.formData.id.length > 12 ? '添加成功' : '编辑成功')
            this.submitLoading = false
          }, 500)
        }
      })
    }
  }
}
</script>

<style scoped>
.order-management {
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
