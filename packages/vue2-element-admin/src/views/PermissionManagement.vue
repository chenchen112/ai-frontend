<template>
  <div class="permission-management">
    <el-card class="box-card">
      <div slot="header" class="header">
        <span>权限管理</span>
      </div>
      <div class="content">
        <el-row :gutter="20" style="margin-bottom: 20px">
          <el-col :span="6">
            <el-input v-model="searchText" placeholder="搜索权限" clearable :maxlength="50"/>
          </el-col>
          <el-col :span="4">
            <el-button type="primary" @click="handleAddPermission" icon="el-icon-plus"> 添加权限 </el-button>
          </el-col>
        </el-row>

        <el-table v-loading="loading" :data="permissionList" border stripe style="width: 100%">
          <el-table-column prop="id" label="ID" width="80"/>
          <el-table-column prop="name" label="权限名称" width="150"/>
          <el-table-column prop="code" label="权限编码" width="200"/>
          <el-table-column prop="type" label="类型" width="100">
            <template #default="scope">
              <el-tag v-if="scope.row.type === 'menu'" type="primary" size="small">菜单</el-tag>
              <el-tag v-else-if="scope.row.type === 'button'" type="warning" size="small">按钮</el-tag>
              <el-tag v-else type="info" size="small">其他</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="description" label="描述"/>
          <el-table-column label="操作" width="150" fixed="right">
            <template #default="scope">
              <el-button type="primary" size="small" @click="handleEdit(scope.row)">编辑</el-button>
              <el-button type="danger" size="small" @click="handleDelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>

    <!-- 添加/编辑权限对话框 -->
    <el-dialog :title="dialogTitle" v-model="dialogVisible" width="500px" @close="handleDialogClose">
      <el-form :model="formData" :rules="formRules" ref="permissionForm" label-width="100px">
        <el-form-item label="权限名称" prop="name">
          <el-input v-model="formData.name" placeholder="请输入权限名称" :maxlength="50"/>
        </el-form-item>
        <el-form-item label="权限编码" prop="code">
          <el-input v-model="formData.code" placeholder="请输入权限编码" :maxlength="50"/>
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-radio-group v-model="formData.type">
            <el-radio label="menu">菜单</el-radio>
            <el-radio label="button">按钮</el-radio>
            <el-radio label="other">其他</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input
            v-model="formData.description"
            type="textarea"
            :rows="3"
            placeholder="请输入描述"
            :maxlength="50"
          />
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
  name: 'PermissionManagement',
  data() {
    return {
      loading: false,
      searchText: '',
      permissionList: [],
      dialogVisible: false,
      dialogTitle: '添加权限',
      formData: {
        id: null,
        name: '',
        code: '',
        type: 'menu',
        description: '',
      },
      formRules: {
        name: [
          { required: true, message: '请输入权限名称', trigger: 'blur' },
          {
            min: 2,
            max: 20,
            message: '长度在 2 到 20 个字符',
            trigger: 'blur',
          },
        ],
        code: [
          { required: true, message: '请输入权限编码', trigger: 'blur' },
          {
            pattern: /^[a-zA-Z0-9_]+$/,
            message: '只能包含字母、数字和下划线',
            trigger: 'blur',
          },
        ],
      },
      submitLoading: false,
    };
  },
  created() {
    this.fetchPermissions();
  },
  methods: {
    fetchPermissions() {
      this.loading = true;
      setTimeout(() => {
        this.permissionList = [
          {
            id: 1,
            name: '用户管理',
            code: 'user:manage',
            type: 'menu',
            description: '用户管理菜单',
          },
          {
            id: 2,
            name: '添加用户',
            code: 'user:add',
            type: 'button',
            description: '添加用户按钮',
          },
          {
            id: 3,
            name: '编辑用户',
            code: 'user:edit',
            type: 'button',
            description: '编辑用户按钮',
          },
          {
            id: 4,
            name: '删除用户',
            code: 'user:delete',
            type: 'button',
            description: '删除用户按钮',
          },
          {
            id: 5,
            name: '角色管理',
            code: 'role:manage',
            type: 'menu',
            description: '角色管理菜单',
          },
          {
            id: 6,
            name: '权限管理',
            code: 'permission:manage',
            type: 'menu',
            description: '权限管理菜单',
          },
        ];
        this.loading = false;
      }, 500);
    },
    handleAddPermission() {
      this.dialogTitle = '添加权限';
      this.formData = {
        id: null,
        name: '',
        code: '',
        type: 'menu',
        description: '',
      };
      this.dialogVisible = true;
    },
    handleEdit(row) {
      this.dialogTitle = '编辑权限';
      this.formData = { ...row };
      this.dialogVisible = true;
    },
    handleDelete(row) {
      this.$confirm('确定要删除该权限吗？', '提示', {
        type: 'warning',
      })
        .then(() => {
          this.permissionList = this.permissionList.filter((item) => item.id !== row.id);
          this.$message.success('删除成功');
        })
        .catch(() => {});
    },
    handleDialogClose() {
      this.$refs.permissionForm?.resetFields();
    },
    handleSubmit() {
      this.$refs.permissionForm?.validate((valid) => {
        if (valid) {
          this.submitLoading = true;
          setTimeout(() => {
            if (this.formData.id) {
              const index = this.permissionList.findIndex((item) => item.id === this.formData.id);
              if (index !== -1) {
                this.permissionList[index] = { ...this.formData };
              }
            } else {
              this.formData.id = this.permissionList.length + 1;
              this.permissionList.push({ ...this.formData });
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
.permission-management {
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
