<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button v-if="organization_resource_select" class="search-btn" type="primary" icon="el-icon-search" @click="handleSearch">查询</el-button>
      <el-button v-if="organization_resource_add" class="search-btn" type="primary" icon="el-icon-plus" @click="handleAdd">添加</el-button>
      <el-button v-if="organization_resource_select" class="search-btn" :autofocus="true" icon="el-icon-refresh" @click="refreshHandle">刷新</el-button>
    </div>

    <el-table  v-loading="listLoading" :data="list" :default-sort="{prop : 'id' }" border highlight-current-row fit>
      <el-table-column align="center" type="index" width="50" />

      <el-table-column align="center" label="id" width="65" prop="id" />
      <el-table-column align="center" label="资源code" width="200px" prop="code" />
      <el-table-column align="center" label="资源类型" width="200px" prop="type" />
      <el-table-column align="center" label="资源名称" width="200px" prop="name" />
      <el-table-column align="center" label="资源url" width="200px" prop="url" />
      <el-table-column align="center" label="资源方法" width="200px" prop="method" />
      <el-table-column align="center" label="简介" width="200px" prop="description" />
      <el-table-column align="center" label="创建时间" width="200px" prop="createdTime" />
      <el-table-column align="center" label="更新时间" width="200px" prop="updatedTime" />
      <el-table-column align="center" label="创建人" width="200px" prop="createdBy" />
      <el-table-column align="center" label="更新人" width="200px" prop="updatedBy" />
      <el-table-column v-if="organization_resource_update || organization_resource_delete " align="center" label="操作" width="180">
        <template slot-scope="scope">
          <el-button v-if="organization_resource_update" size="mini" type="primary" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button v-if="organization_resource_delete" size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>

    </el-table>

    <div v-show="!listLoading" class="footer">
      <el-pagination :current-page.sync="listQuery.current" :page-size="listQuery.size" :page-sizes="[10, 40, 80, 100]" @size-change="handleSizeChange" layout="total, sizes, prev, pager, next, jumper" @current-change="handleCurrentChange" :total="total" />
    </div>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="资源code" prop="code">
          <el-input
            v-model="form.code"
            placeholder="请输入资源code"
          />
        </el-form-item>
        <el-form-item label="资源类型" prop="type">
          <el-input
            v-model="form.type"
            placeholder="请输入资源类型"
          />
        </el-form-item>
        <el-form-item label="资源名称" prop="name">
          <el-input
            v-model="form.name"
            placeholder="请输入资源名称"
          />
        </el-form-item>
        <el-form-item label="资源url" prop="url">
          <el-input
            v-model="form.url"
            placeholder="请输入资源url"
          />
        </el-form-item>
        <el-form-item label="资源方法" prop="method">
          <el-input
            v-model="form.method"
            placeholder="请输入资源方法"
          />
        </el-form-item>
        <el-form-item label="简介" prop="description">
          <el-input
            v-model="form.description"
            placeholder="请输入简介"
          />
        </el-form-item>
        <el-form-item label="创建时间" prop="createdTime">
          <el-input
            v-model="form.createdTime"
            placeholder="请输入创建时间"
          />
        </el-form-item>
        <el-form-item label="更新时间" prop="updatedTime">
          <el-input
            v-model="form.updatedTime"
            placeholder="请输入更新时间"
          />
        </el-form-item>
        <el-form-item label="创建人" prop="createdBy">
          <el-input
            v-model="form.createdBy"
            placeholder="请输入创建人"
          />
        </el-form-item>
        <el-form-item label="更新人" prop="updatedBy">
          <el-input
            v-model="form.updatedBy"
            placeholder="请输入更新人"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel('form')">取 消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="create('form')">确 定</el-button>
        <el-button v-else type="primary" @click="update('form')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

import { queryResource, deleteResource, getResource, createResource } from '@/api/organization/resource'
import { mapGetters } from 'vuex'

export default {
  name: 'Organization',
  data() {
    return {
      form: {
      },
      rules: {
      },
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        current: 1,
        size: 10,
        username: undefined
      },
      dialogFormVisible: false,
      dialogStatus: '',
      organization_resource_select: false,
      organization_resource_update: false,
      organization_resource_delete: false,
      organization_resource_add: false,
      organization_resource_view: false,
      textMap: {
        update: '编辑',
        create: '创建'
      },
      tableKey: 0
    }
  },
  mounted() {
    this.getList()
    this.organization_resource_select = this.permissions['resource_manager:query']
    this.organization_resource_update = this.permissions['resource_manager:edit']
    this.organization_resource_delete = this.permissions['resource_manager:del']
    this.organization_resource_add = this.permissions['resource_manager:add']
    this.organization_resource_view = this.permissions['resource_manager:view']
  },
  computed: {
    ...mapGetters([
      'permissions'
    ])
  },
  methods: {
    getList() {
      console.log('this.permissions')
      console.log(this.permissions)
      this.listLoading = true
      queryResource(this.listQuery)
        .then(response => {
          console.log(response)
          this.list = response.data.records
          this.total = response.data.total
          this.listLoading = false
        })
    },
    handleFilter() {
      this.getList()
    },
    handleSizeChange(val) {
      this.listQuery.limit = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getList()
    },
    handleAdd() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
    },
    handleUpdate(row) {
      getResource(row.id)
        .then(response => {
          this.form = response.data
          this.dialogFormVisible = true
          this.dialogStatus = 'update'
        })
    },
    handleDelete(row) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteResource(row.id)
            .then(() => {
              this.$notify({
                title: '成功',
                message: '删除成功',
                type: 'success',
                duration: 2000
              })
              const index = this.list.indexOf(row)
              this.list.splice(index, 1)
            })
        })
    },
    create(formName) {
      const set = this.$refs
      set[formName].validate(valid => {
        if (valid) {
          createResource(this.form)
            .then(() => {
              this.dialogFormVisible = false
              this.getList()
              this.$notify({
                title: '成功',
                message: '创建成功',
                type: 'success',
                duration: 2000
              })
            })
        } else {
          return false
        }
      })
    },
    cancel(formName) {
      this.dialogFormVisible = false
      const set = this.$refs
      set[formName].resetFields()
    },
    update(formName) {
      const set = this.$refs
      set[formName].validate(valid => {
        if (valid) {
          this.dialogFormVisible = false
          this.form.password = undefined
          updateResource(this.form.id, this.form).then(() => {
            this.dialogFormVisible = false
            this.getList()
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
          })
        } else {
          return false
        }
      })
    },
    resetTemp() {
      this.form = {
        username: undefined,
        name: undefined,
        sex: '男',
        password: undefined,
        description: undefined
      }
    }
  }
}
</script>
