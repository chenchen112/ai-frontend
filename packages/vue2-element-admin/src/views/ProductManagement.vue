<template>
  <div class="product-management">
    <el-card class="box-card">
      <div slot="header" class="header">
        <span>商品管理</span>
      </div>
      <div class="content">
        <el-row :gutter="20" style="margin-bottom: 20px;">
          <el-col :span="6">
            <el-input
              v-model="searchText"
              placeholder="搜索商品"
              clearable
            ></el-input>
          </el-col>
          <el-col :span="4">
            <el-button type="primary" @click="handleAddProduct" icon="el-icon-plus">
              添加商品
            </el-button>
          </el-col>
          <el-col :span="4">
            <el-button type="success" @click="handleBatchPublish" icon="el-icon-upload">
              批量上架
            </el-button>
          </el-col>
        </el-row>
        
        <el-table
          v-loading="loading"
          :data="productList"
          border
          stripe
          style="width: 100%"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="id" label="商品ID" width="100"></el-table-column>
          <el-table-column prop="name" label="商品名称" width="200"></el-table-column>
          <el-table-column prop="category" label="分类" width="120"></el-table-column>
          <el-table-column prop="price" label="价格" width="100">
            <template #default="scope">
              <span>¥{{ scope.row.price.toFixed(2) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="stock" label="库存" width="80"></el-table-column>
          <el-table-column prop="status" label="状态" width="100">
            <template #default="scope">
              <el-tag :type="scope.row.status === 'published' ? 'success' : 'info'" size="small">
                {{ scope.row.status === 'published' ? '已上架' : '未上架' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="createdAt" label="创建时间" width="180"></el-table-column>
          <el-table-column label="操作" width="150" fixed="right">
            <template #default="scope">
              <el-button type="primary" size="small" @click="handleEdit(scope.row)">编辑</el-button>
              <el-button :type="scope.row.status === 'published' ? 'info' : 'success'" size="small" @click="handleToggleStatus(scope.row)">
                {{ scope.row.status === 'published' ? '下架' : '上架' }}
              </el-button>
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
    
    <!-- 添加/编辑商品对话框 -->
    <el-dialog
      :title="dialogTitle"
      v-model="dialogVisible"
      width="500px"
      @close="handleDialogClose"
    >
      <el-form :model="formData" :rules="formRules" ref="productForm" label-width="100px">
        <el-form-item label="商品名称" prop="name">
          <el-input v-model="formData.name" placeholder="请输入商品名称"></el-input>
        </el-form-item>
        <el-form-item label="分类" prop="category">
          <el-select v-model="formData.category" placeholder="请选择分类" style="width: 100%">
            <el-option label="电子产品" value="electronics"></el-option>
            <el-option label="服装" value="clothing"></el-option>
            <el-option label="食品" value="food"></el-option>
            <el-option label="图书" value="books"></el-option>
            <el-option label="其他" value="other"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="价格" prop="price">
          <el-input-number v-model="formData.price" :min="0" :max="999999" :precision="2" :step="0.1"></el-input-number>
        </el-form-item>
        <el-form-item label="库存" prop="stock">
          <el-input-number v-model="formData.stock" :min="0" :max="99999"></el-input-number>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input
            v-model="formData.description"
            type="textarea"
            :rows="3"
            placeholder="请输入商品描述"
          ></el-input>
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
  name: 'ProductManagement',
  data() {
    return {
      loading: false,
      searchText: '',
      productList: [],
      multipleSelection: [],
      pagination: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      dialogVisible: false,
      dialogTitle: '添加商品',
      formData: {
        id: null,
        name: '',
        category: '',
        price: 0,
        stock: 0,
        description: '',
        status: 'unpublished'
      },
      formRules: {
        name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' },
          { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
        ]
      },
      submitLoading: false
    }
  },
  created() {
    this.fetchProducts()
  },
  methods: {
    fetchProducts() {
      this.loading = true
      setTimeout(() => {
        this.productList = [
          { id: 1, name: 'iPhone 15', category: 'electronics', price: 6999.00, stock: 100, status: 'published', createdAt: '2024-01-01 10:00:00' },
          { id: 2, name: 'MacBook Pro', category: 'electronics', price: 15999.00, stock: 50, status: 'published', createdAt: '2024-01-02 11:30:00' },
          { id: 3, name: 'T-Shirt', category: 'clothing', price: 99.00, stock: 500, status: 'unpublished', createdAt: '2024-01-03 09:15:00' },
          { id: 4, name: 'Apple', category: 'food', price: 8.00, stock: 1000, status: 'published', createdAt: '2024-01-04 14:20:00' },
          { id: 5, name: 'Python Book', category: 'books', price: 89.00, stock: 200, status: 'published', createdAt: '2024-01-05 16:45:00' }
        ]
        this.pagination.total = this.productList.length
        this.loading = false
      }, 500)
    },
    handleAddProduct() {
      this.dialogTitle = '添加商品'
      this.formData = {
        id: null,
        name: '',
        category: '',
        price: 0,
        stock: 0,
        description: '',
        status: 'unpublished'
      }
      this.dialogVisible = true
    },
    handleEdit(row) {
      this.dialogTitle = '编辑商品'
      this.formData = { ...row }
      this.dialogVisible = true
    },
    handleDelete(row) {
      this.$confirm('确定要删除该商品吗？', '提示', {
        type: 'warning'
      }).then(() => {
        this.productList = this.productList.filter(item => item.id !== row.id)
        this.pagination.total = this.productList.length
        this.$message.success('删除成功')
      }).catch(() => {})
    },
    handleToggleStatus(row) {
      row.status = row.status === 'published' ? 'unpublished' : 'published'
      this.$message.success(row.status === 'published' ? '上架成功' : '下架成功')
    },
    handleBatchPublish() {
      if (this.multipleSelection.length === 0) {
        this.$message.warning('请至少选择一个商品')
        return
      }
      this.multipleSelection.forEach(item => {
        item.status = 'published'
      })
      this.$message.success(`成功上架 ${this.multipleSelection.length} 个商品`)
    },
    handleSelectionChange(selection) {
      this.multipleSelection = selection
    },
    handlePageChange(page) {
      this.pagination.currentPage = page
      this.fetchProducts()
    },
    handleDialogClose() {
      this.$refs.productForm?.resetFields()
    },
    handleSubmit() {
      this.$refs.productForm?.validate((valid) => {
        if (valid) {
          this.submitLoading = true
          setTimeout(() => {
            if (this.formData.id) {
              const index = this.productList.findIndex(item => item.id === this.formData.id)
              if (index !== -1) {
                this.productList[index] = { ...this.formData }
              }
            } else {
              this.formData.id = this.productList.length + 1
              this.formData.createdAt = new Date().toLocaleString()
              this.productList.push({ ...this.formData })
              this.pagination.total = this.productList.length
            }
            this.dialogVisible = false
            this.$message.success(this.formData.id ? '编辑成功' : '添加成功')
            this.submitLoading = false
          }, 500)
        }
      })
    }
  }
}
</script>

<style scoped>
.product-management {
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
