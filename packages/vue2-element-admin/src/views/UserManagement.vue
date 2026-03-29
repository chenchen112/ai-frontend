<template>
  <div class="user-management">
    <el-card class="box-card">
      <div slot="header" class="header">
        <span>用户管理</span>
      </div>
      <div class="content">
        <el-row :gutter="20" style="margin-bottom: 20px">
          <el-col :span="6">
            <el-input v-model="searchText" placeholder="搜索用户" clearable :maxlength="50"/>
          </el-col>
          <el-col :span="4">
            <el-button type="primary" @click="handleAddUser" icon="el-icon-plus"> 添加用户 </el-button>
          </el-col>
          <el-col :span="4">
            <el-button type="danger" @click="handleBatchDelete" icon="el-icon-delete"> 批量删除 </el-button>
          </el-col>
        </el-row>

        <el-table
          v-loading="loading"
          :data="userList"
          border
          stripe
          style="width: 100%"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55"/>
          <el-table-column prop="id" label="ID" width="80"/>
          <el-table-column prop="username" label="用户名" width="120"/>
          <el-table-column prop="email" label="邮箱" width="200"/>
          <el-table-column prop="role" label="角色" width="100"/>
          <el-table-column prop="status" label="状态" width="80">
            <template #default="scope">
              <el-tag :type="scope.row.status === 'active' ? 'success' : 'info'" size="small">
                {{ scope.row.status === 'active' ? '启用' : '禁用' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150" fixed="right">
            <template #default="scope">
              <el-button type="primary" size="small" @click="handleEdit(scope.row)">编辑</el-button>
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
        />
      </div>
    </el-card>

    <!-- 添加/编辑用户对话框 -->
    <el-dialog :title="dialogTitle" v-model="dialogVisible" width="500px" @close="handleDialogClose">
      <el-form :model="formData" ref="userForm" label-width="100px" :rules="{}">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="formData.username" placeholder="请输入用户名" :maxlength="50"/>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="formData.email" placeholder="请输入邮箱" :maxlength="50"/>
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-select v-model="formData.role" placeholder="请选择角色" style="width: 100%">
            <el-option label="管理员" value="admin"/>
            <el-option label="普通用户" value="user"/>
            <el-option label="访客" value="guest"/>
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="formData.status">
            <el-radio label="active">启用</el-radio>
            <el-radio label="inactive">禁用</el-radio>
          </el-radio-group>
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
  name: 'UserManagement',
  data() {
    return {
      loading: false,
      searchText: '',
      userList: [],
      multipleSelection: [],
      pagination: {
        currentPage: 1,
        pageSize: 10,
        total: 0,
      },
      dialogVisible: false,
      dialogTitle: '添加用户',
      formData: {
        id: null,
        username: '',
        email: '',
        role: '',
        status: 'active',
      },
      formRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          {
            min: 3,
            max: 20,
            message: '长度在 3 到 20 个字符',
            trigger: 'blur',
          },
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          {
            pattern: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
            message: '邮箱格式不正确',
            trigger: 'blur',
          },
        ],
      },
      submitLoading: false,
    };
  },
  created() {
    this.fetchUsers();
  },
  methods: {
    fetchUsers() {
      this.loading = true;
      // 模拟获取用户数据
      setTimeout(() => {
        this.userList = [
          {
            id: 1,
            username: 'admin',
            email: 'admin@example.com',
            role: 'admin',
            status: 'active',
          },
          {
            id: 2,
            username: 'user1',
            email: 'user1@example.com',
            role: 'user',
            status: 'active',
          },
          {
            id: 3,
            username: 'user2',
            email: 'user2@example.com',
            role: 'user',
            status: 'inactive',
          },
          {
            id: 4,
            username: 'guest',
            email: 'guest@example.com',
            role: 'guest',
            status: 'active',
          },
          {
            id: 5,
            username: 'manager',
            email: 'manager@example.com',
            role: 'admin',
            status: 'active',
          },
        ];
        this.pagination.total = this.userList.length;
        this.loading = false;
      }, 500);
    },
    handleAddUser() {
      this.dialogTitle = '添加用户';
      this.formData = {
        id: null,
        username: '',
        email: '',
        role: '',
        status: 'active',
      };
      this.dialogVisible = true;
    },
    handleEdit(row) {
      this.dialogTitle = '编辑用户';
      this.formData = { ...row };
      this.dialogVisible = true;
    },
    handleDelete(row) {
      this.$confirm('确定要删除该用户吗？', '提示', {
        type: 'warning',
      })
        .then(() => {
          this.userList = this.userList.filter((item) => item.id !== row.id);
          this.pagination.total = this.userList.length;
          this.$message.success('删除成功');
        })
        .catch(() => {});
    },
    handleBatchDelete() {
      if (this.multipleSelection.length === 0) {
        this.$message.warning('请至少选择一个用户');
        return;
      }
      this.$confirm(`确定要删除选中的 ${this.multipleSelection.length} 个用户吗？`, '提示', {
        type: 'warning',
      })
        .then(() => {
          const ids = this.multipleSelection.map((item) => item.id);
          this.userList = this.userList.filter((item) => !ids.includes(item.id));
          this.pagination.total = this.userList.length;
          this.multipleSelection = [];
          this.$message.success('批量删除成功');
        })
        .catch(() => {});
    },
    handleSelectionChange(selection) {
      this.multipleSelection = selection;
    },
    handlePageChange(page) {
      this.pagination.currentPage = page;
      this.fetchUsers();
    },
    handleDialogClose() {
      this.$refs.userForm?.resetFields();
    },
    handleSubmit() {
      this.$refs.userForm?.validate((valid) => {
        if (valid) {
          this.submitLoading = true;
          setTimeout(() => {
            if (this.formData.id) {
              // 编辑
              const index = this.userList.findIndex((item) => item.id === this.formData.id);
              if (index !== -1) {
                this.userList[index] = { ...this.formData };
              }
            } else {
              // 添加
              this.formData.id = this.userList.length + 1;
              this.userList.push({ ...this.formData });
              this.pagination.total = this.userList.length;
            }
            this.dialogVisible = false;
            this.$message.success(this.formData.id ? '编辑成功' : '添加成功');
            this.submitLoading = false;
          }, 500);
        }
      });
    },
  },
};
</script>

<style scoped>
.user-management {
  padding: 20px;
}

.box-card {
  max-width: 1000px;
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
