<template>
  <div class="role-management">
    <el-card class="box-card">
      <div slot="header" class="header">
        <span>角色管理</span>
      </div>
      <div class="content">
        <el-row :gutter="20" style="margin-bottom: 20px">
          <el-col :span="6">
            <el-input v-model="searchText" placeholder="搜索角色" clearable :maxlength="50"/>
          </el-col>
          <el-col :span="4">
            <el-button type="primary" @click="handleAddRole" icon="el-icon-plus"> 添加角色 </el-button>
          </el-col>
        </el-row>

        <el-table v-loading="loading" :data="roleList" border stripe style="width: 100%">
          <el-table-column prop="id" label="ID" width="80"/>
          <el-table-column prop="name" label="角色名称" width="150"/>
          <el-table-column prop="code" label="角色编码" width="150"/>
          <el-table-column prop="description" label="描述"/>
          <el-table-column prop="status" label="状态" width="80">
            <template #default="scope">
              <el-tag :type="scope.row.status === 'active' ? 'success' : 'info'" size="small">
                {{ scope.row.status === 'active' ? '启用' : '禁用' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200" fixed="right">
            <template #default="scope">
              <el-button type="primary" size="small" @click="handleEdit(scope.row)">编辑</el-button>
              <el-button type="warning" size="small" @click="handlePermission(scope.row)">分配权限</el-button>
              <el-button type="danger" size="small" @click="handleDelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>

    <!-- 添加/编辑角色对话框 -->
    <el-dialog :title="dialogTitle" v-model="dialogVisible" width="500px" @close="handleDialogClose">
      <el-form :model="formData" :rules="formRules" ref="roleForm" label-width="100px">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="formData.name" placeholder="请输入角色名称" :maxlength="50"/>
        </el-form-item>
        <el-form-item label="角色编码" prop="code">
          <el-input v-model="formData.code" placeholder="请输入角色编码" :maxlength="50"/>
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

    <!-- 分配权限对话框 -->
    <el-dialog title="分配权限" v-model="permissionDialogVisible" width="600px">
      <el-tree
        ref="permissionTree"
        :data="permissionTreeData"
        :props="defaultProps"
        show-checkbox
        node-key="id"
        default-expand-all
      />
      <template #footer>
        <el-button @click="permissionDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handlePermissionSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'RoleManagement',
  data() {
    return {
      loading: false,
      searchText: '',
      roleList: [],
      dialogVisible: false,
      dialogTitle: '添加角色',
      formData: {
        id: null,
        name: '',
        code: '',
        description: '',
        status: 'active',
      },
      formRules: {
        name: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          {
            min: 2,
            max: 20,
            message: '长度在 2 到 20 个字符',
            trigger: 'blur',
          },
        ],
        code: [
          { required: true, message: '请输入角色编码', trigger: 'blur' },
          {
            pattern: /^[a-zA-Z0-9_]+$/,
            message: '只能包含字母、数字和下划线',
            trigger: 'blur',
          },
        ],
      },
      submitLoading: false,
      permissionDialogVisible: false,
      permissionTreeData: [
        {
          id: 1,
          label: '系统管理',
          children: [
            { id: 11, label: '用户管理' },
            { id: 12, label: '角色管理' },
            { id: 13, label: '权限管理' },
          ],
        },
        {
          id: 2,
          label: '业务管理',
          children: [
            { id: 21, label: '订单管理' },
            { id: 22, label: '商品管理' },
          ],
        },
        {
          id: 3,
          label: '数据管理',
          children: [
            { id: 31, label: '数据看板' },
            { id: 32, label: '报表管理' },
          ],
        },
      ],
      defaultProps: {
        children: 'children',
        label: 'label',
      },
    };
  },
  created() {
    this.fetchRoles();
  },
  methods: {
    fetchRoles() {
      this.loading = true;
      setTimeout(() => {
        this.roleList = [
          {
            id: 1,
            name: '系统管理员',
            code: 'admin',
            description: '拥有系统所有权限',
            status: 'active',
          },
          {
            id: 2,
            name: '业务经理',
            code: 'manager',
            description: '负责业务运营管理',
            status: 'active',
          },
          {
            id: 3,
            name: '普通员工',
            code: 'employee',
            description: '日常业务操作人员',
            status: 'active',
          },
          {
            id: 4,
            name: '访客',
            code: 'guest',
            description: '只读权限',
            status: 'inactive',
          },
        ];
        this.loading = false;
      }, 500);
    },
    handleAddRole() {
      this.dialogTitle = '添加角色';
      this.formData = {
        id: null,
        name: '',
        code: '',
        description: '',
        status: 'active',
      };
      this.dialogVisible = true;
    },
    handleEdit(row) {
      this.dialogTitle = '编辑角色';
      this.formData = { ...row };
      this.dialogVisible = true;
    },
    handleDelete(row) {
      this.$confirm('确定要删除该角色吗？', '提示', {
        type: 'warning',
      })
        .then(() => {
          this.roleList = this.roleList.filter((item) => item.id !== row.id);
          this.$message.success('删除成功');
        })
        .catch(() => {});
    },
    handlePermission(row) {
      this.currentRole = row;
      this.$nextTick(() => {
        this.$refs.permissionTree.setCheckedKeys(row.permissions || []);
      });
      this.permissionDialogVisible = true;
    },
    handlePermissionSubmit() {
      const checkedKeys = this.$refs.permissionTree.getCheckedKeys();
      this.roleList = this.roleList.map((item) => {
        if (item.id === this.currentRole.id) {
          return { ...item, permissions: checkedKeys };
        }
        return item;
      });
      this.permissionDialogVisible = false;
      this.$message.success('权限分配成功');
    },
    handleDialogClose() {
      this.$refs.roleForm?.resetFields();
    },
    handleSubmit() {
      this.$refs.roleForm?.validate((valid) => {
        if (valid) {
          this.submitLoading = true;
          setTimeout(() => {
            if (this.formData.id) {
              const index = this.roleList.findIndex((item) => item.id === this.formData.id);
              if (index !== -1) {
                this.roleList[index] = { ...this.formData };
              }
            } else {
              this.formData.id = this.roleList.length + 1;
              this.roleList.push({ ...this.formData });
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
.role-management {
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
