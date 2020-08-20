<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button v-if="organization_resource_select" class="search-btn" type="primary" icon="el-icon-search" @click="handleSearch">查询</el-button>
      <el-button v-if="organization_resource_add" class="search-btn" type="primary" icon="el-icon-plus" @click="handleAdd">添加</el-button>
      <el-button v-if="organization_resource_select" class="search-btn" :autofocus="true" icon="el-icon-refresh" @click="refreshHandle">刷新</el-button>
    </div>

    <tree-table :data="data" :expand-all="expandAll" :columns="columns" border>
      <el-table-column label="类型" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.type == 0">
            <svg-icon icon-class="panda-menu" />&nbsp;菜单
          </span>
          <span v-if="scope.row.type == 1">
            <svg-icon icon-class="panda-button" />&nbsp;按钮
          </span>
        </template>
      </el-table-column>
      <el-table-column label="资源链接" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.path | formatText }}</span>
        </template>
      </el-table-column>
      <el-table-column label="资源权限" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.permission }}</span>
        </template>
      </el-table-column>
      <el-table-column label="请求url" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.url | formatText }}</span>
        </template>
      </el-table-column>
      <el-table-column label="请求方法" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.method }}</span>
        </template>
      </el-table-column>
      <el-table-column label="组件路径">
        <template slot-scope="scope" align="center">
          <span>{{ scope.row.component }}</span>
        </template>
      </el-table-column>
      <el-table-column label="资源图标" align="center">
        <template slot-scope="scope" align="center">
          <span>
            <svg-icon :icon-class="scope.row.icon" />
            <span v-if="scope.row.icon == '' || scope.row.icon == null">-</span>
          </span>
        </template>
      </el-table-column>
      <el-table-column v-if="organization_resource_add || organization_resource_update || organization_resource_delete" label="操作" align="center" width="200">
        <template slot-scope="scope">
          <el-button v-if="scope.row.type == 0 && organization_resource_add" type="primary" size="mini" class="mb5" icon="el-icon-plus" @click="openDialog(scope.row.id)" />
          <el-button v-if="organization_resource_update" type="success" size="mini" class="ml10" icon="el-icon-edit" @click="openEditDialog(scope.row.id)" />
          <el-button v-if="organization_resource_delete" type="danger" size="mini" icon="el-icon-delete" @click="deleteHandle(scope.row.id)" />
        </template>
      </el-table-column>
    </tree-table>

    <div v-show="!listLoading" class="footer">
      <el-pagination :current-page.sync="listQuery.current" :page-size="listQuery.size" :page-sizes="[10, 40, 80, 100]" layout="total, sizes, prev, pager, next, jumper" :total="total" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>
<!--    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">-->
<!--      <el-form ref="form" :model="form" :rules="rules" label-width="100px">-->
<!--        <el-form-item label="资源code" prop="code">-->
<!--          <el-input-->
<!--            v-model="form.code"-->
<!--            placeholder="请输入资源code"-->
<!--          />-->
<!--        </el-form-item>-->
<!--        <el-form-item label="资源类型" prop="type">-->
<!--          <el-input-->
<!--            v-model="form.type"-->
<!--            placeholder="请输入资源类型"-->
<!--          />-->
<!--        </el-form-item>-->
<!--        <el-form-item label="资源名称" prop="name">-->
<!--          <el-input-->
<!--            v-model="form.name"-->
<!--            placeholder="请输入资源名称"-->
<!--          />-->
<!--        </el-form-item>-->
<!--        <el-form-item label="资源url" prop="url">-->
<!--          <el-input-->
<!--            v-model="form.url"-->
<!--            placeholder="请输入资源url"-->
<!--          />-->
<!--        </el-form-item>-->
<!--        <el-form-item label="资源方法" prop="method">-->
<!--          <el-input-->
<!--            v-model="form.method"-->
<!--            placeholder="请输入资源方法"-->
<!--          />-->
<!--        </el-form-item>-->
<!--        <el-form-item label="简介" prop="description">-->
<!--          <el-input-->
<!--            v-model="form.description"-->
<!--            placeholder="请输入简介"-->
<!--          />-->
<!--        </el-form-item>-->
<!--        <el-form-item label="创建时间" prop="createdTime">-->
<!--          <el-input-->
<!--            v-model="form.createdTime"-->
<!--            placeholder="请输入创建时间"-->
<!--          />-->
<!--        </el-form-item>-->
<!--        <el-form-item label="更新时间" prop="updatedTime">-->
<!--          <el-input-->
<!--            v-model="form.updatedTime"-->
<!--            placeholder="请输入更新时间"-->
<!--          />-->
<!--        </el-form-item>-->
<!--        <el-form-item label="创建人" prop="createdBy">-->
<!--          <el-input-->
<!--            v-model="form.createdBy"-->
<!--            placeholder="请输入创建人"-->
<!--          />-->
<!--        </el-form-item>-->
<!--        <el-form-item label="更新人" prop="updatedBy">-->
<!--          <el-input-->
<!--            v-model="form.updatedBy"-->
<!--            placeholder="请输入更新人"-->
<!--          />-->
<!--        </el-form-item>-->
<!--      </el-form>-->
<!--      <div slot="footer" class="dialog-footer">-->
<!--        <el-button @click="cancel('form')">取 消</el-button>-->
<!--        <el-button v-if="dialogStatus=='create'" type="primary" @click="create('form')">确 定</el-button>-->
<!--        <el-button v-else type="primary" @click="update('form')">确 定</el-button>-->
<!--      </div>-->
<!--    </el-dialog>-->

  </div>
</template>

<script>

import { queryResource, deleteResource, updateResource, getResource, createResource, queryAllResource, getAllReourceTree } from '@/api/organization/resource'
import { mapGetters } from 'vuex'
import treeTable from '@/components/TreeTable'

export default {
  name: 'Organization',
  components: {
    treeTable
  },
  filters: {
    formatText(value) {
      if (!value || value === '') {
        return '-'
      }
      return value
    }
  },
  data() {
    return {
      expandAll: false,
      columns: [
        {
          text: '菜单名称',
          value: 'name',
          width: '400px'
        }
      ],
      data: [],
      dialog: {
        title: '添加资源信息',
        show: false,
        data: {
          id: null,
          name: '',
          type: null,
          path: '',
          permission: '',
          component: '',
          icon: '',
          sort: 100,
          parentId: -1
        },
        rules: {
          name: [
            {
              required: true,
              message: '资源名称不能为空',
              trigger: 'blur'
            }
          ],
          type: [
            {
              required: true,
              message: '资源类型不能为空',
              trigger: 'change'
            }
          ]
        }
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
      tableKey: 0,
      listLoading: true,
      listQuery: {
        current: 1,
        size: 10
      }
    }
  },
  computed: {
    ...mapGetters([
      'permissions'
    ]),
    successMessage() {
      if (this.dialog.data.id) {
        return '修改成功！'
      } else {
        return '添加成功'
      }
    },
    failMessage() {
      if (this.dialog.data.id) {
        return '修改失败！'
      } else {
        return '添加失败'
      }
    },
    ...mapGetters(['permissions'])
  },
  mounted() {
    this.listLoading = true
    this.getData()
    this.organization_resource_select = this.permissions['resource_manager:query']
    this.organization_resource_update = this.permissions['resource_manager:edit']
    this.organization_resource_delete = this.permissions['resource_manager:del']
    this.organization_resource_add = this.permissions['resource_manager:add']
    this.organization_resource_view = this.permissions['resource_manager:view']
  },
  methods: {
    async getData() {
      this.listLoading = true
      const response = await getAllReourceTree()
      this.data = response.data
    },
    async openEditDialog(id) {
      this.dialog.title = '编辑资源信息'
      // 清除dialog中的数据
      this.clearDialogData()
      const res = await getResource(id)
      if (res.code === 0) {
        this.dialog.data = res.data
        this.dialog.data.id = res.data.id
      } else {
        this.$message.error('数据载入失败')
      }
      this.dialog.show = true
    },
    submitHandle() {
      this.$refs['resourceForm'].validate(async valid => {
        if (valid) {
          let res = null
          // 存在id 更新操作 否则就是 新增
          if (this.dialog.data.id) {
            res = await updateResource(this.dialog.data)
          } else {
            res = await createResource(this.dialog.data)
          }
          if (res.code === 0) {
            this.$message({
              message: this.successMessage,
              type: 'success'
            })
            // todo: 重刷router  有bug 需修复
            // this.$store.dispatch('GetMenu').then(data => {
            //   initMenu(this.$router, data)
            // })
            this.dialog.show = false
            // 重新刷新表格
            this.getData()
            // 清除dialog中的数据
            this.clearDialogData()
            // 重置表单校验状态
            this.$refs['resourceForm'].resetFields()
          } else {
            this.$message.error(this.failMessage)
          }
        } else {
          return false
        }
      })
    },
    deleteHandle(id) {
      this.$confirm('此操作将一并删除其子节点资源，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        const res = await deleteResource(id)
        if (res.code === 0) {
          this.$message({
            message: '删除成功！',
            type: 'success'
          })
          // 重新刷新表格
          this.getData()
        } else {
          this.$message.error('删除失败！')
        }
      })
    },
    closeHandle(done) {
      done()
    },
    async openDialog(id) {
      this.dialog.title = '添加资源信息'
      // 清除dialog中的数据
      this.clearDialogData()
      if (id === '' || id === undefined || id === undefined) {
        // 代表顶级目录 所以父节点为 -1
        this.dialog.data.parentId = -1
        this.dialog.show = true
      } else {
        const res = await getResourceById(id)
        if (res.code === 0) {
          this.dialog.data.parentId = res.data.id
          this.dialog.data.component = res.data.component
          this.dialog.data.permission = res.data.permission
        } else {
          this.$message.error('数据载入失败')
        }
      }
      this.dialog.show = true
    },
    clearDialogData() {
      this.dialog.data.id = null
      this.dialog.data.name = null
      this.dialog.data.type = null
      this.dialog.data.path = null
      this.dialog.data.permission = null
      this.dialog.data.component = null
      this.dialog.data.icon = null
      this.dialog.data.sort = 1
      this.dialog.data.parentId = -1
    }
  }
}
</script>
