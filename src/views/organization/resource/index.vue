<template>
  <div class="app-container">

    <div class="filter-container">
      <el-input
        v-model="listQuery.type"
        style="width: 200px;"
        class="filter-item"
        placeholder="资源类型"
        @keyup.enter.native="handleFilter"
      />
      <el-input
        v-model="listQuery.method"
        style="width: 200px;"
        class="filter-item"
        placeholder="资源请求方法"
        @keyup.enter.native="handleFilter"
      />
      <el-input
        v-model="listQuery.url"
        style="width: 200px;"
        class="filter-item"
        placeholder="资源URL"
        @keyup.enter.native="handleFilter"
      />
      <el-input
        v-model="listQuery.name"
        style="width: 200px;"
        class="filter-item"
        placeholder="资源名称"
        @keyup.enter.native="handleFilter"
      />

      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >
        搜索
      </el-button>

      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >
        新增
      </el-button>
    </div>

    <el-table
      v-loading.body="listLoading"
      :data="list.records"
      border
      fit
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column
        type="index"
        width="50"
        align="center"
        label="序列"
      />

      <el-table-column
        width="180px"
        align="left"
        label="资源id"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.code }}</span>
        </template>
      </el-table-column>

      <el-table-column
        width="180px"
        align="left"
        label="资源名称"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>

      <el-table-column
        width="250px"
        align="left"
        label="url路径"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.url }}</span>
        </template>
      </el-table-column>

      <el-table-column
        width="100px"
        align="left"
        label="类型"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.type }}</span>
        </template>
      </el-table-column>

      <el-table-column
        width="100px"
        align="left"
        label="请求方法"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.method }}</span>
        </template>
      </el-table-column>

      <el-table-column
        align="center"
        label="描述"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.description }}</span>
        </template>
      </el-table-column>

      <el-table-column
        width="160px"
        align="center"
        label="修改时间"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.updatedTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>

      <el-table-column
        width="85"
        align="center"
        label="修改人"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.updatedBy }}</span>
        </template>
      </el-table-column>

      <el-table-column
        width="160px"
        align="center"
        label="创建时间"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.createdTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>

      <el-table-column
        width="85"
        align="center"
        label="创建人"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.createdBy }}</span>
        </template>
      </el-table-column>

      <el-table-column
        align="center"
        label="操作"
        width="150"
      >
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="mini"
            @click="handleUpdate(scope.row)"
          >
            修改
          </el-button>
          <el-button
            type="danger"
            size="mini"
            @click="deleteResource(scope.row.id)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--翻页工具条-->
    <div class="pagination-container">
      <el-pagination
        background
        :current-page="listQuery.current"
        :page-sizes="[10, 20, 30, 50]"
        :page-size="listQuery.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <!--添加或编辑对话框-->
    <el-dialog
      title="新增/修改"
      :visible.sync="dialogFormVisible"
      width="65%"
    >
      <el-row>
        <el-col
          :span="14"
          style="margin-top:15px;"
        >

          <el-form
            ref="dataForm"
            :rules="rules"
            :model="temp"
            label-position="right"
            label-width="120px"
            status-icon
            style="width: 80%; margin-left:30px;"
          >

            <el-form-item prop="code">
              <span slot="label">
                资源id <el-tooltip
                  class="item"
                  effect="dark"
                  content="规则:资源名称_manager:btn_[增删改查],如:user_manager:btn_add"
                  placement="top"
                ><i class="el-icon-info" /> </el-tooltip>
              </span>

              <el-input
                v-model="temp.code"
                placeholder="请输入资源id"
              />
            </el-form-item>
            <el-form-item
              label="资源名称"
              prop="name"
            >
              <el-input
                v-model="temp.name"
                placeholder="请输入资源名称"
              />
            </el-form-item>

            <el-form-item
              label="url路径"
              prop="url"
            >
              <el-input
                v-model="temp.url"
                placeholder="请输入uri路径,如:/api/v1/xxx"
              />
            </el-form-item>
            <el-form-item
              label="资源类型"
              prop="type"
            >
              <el-input
                v-model="temp.type"
                placeholder="请输入资源类型"
              />
            </el-form-item>
            <el-form-item
              label="资源请求方法"
              prop="method"
            >
              <el-input
                v-model="temp.method"
                placeholder="请输入资源请求方法,如:GET,POST"
              />
            </el-form-item>
            <el-form-item
              label="描述"
              prop="description"
            >
              <el-input
                v-model="temp.description"
                type="textarea"
                :rows="3"
                placeholder="请输入描述内容"
              />
            </el-form-item>
          </el-form>
        </el-col>
        <el-col
          :span="10"
          style="margin-top:15px;"
        >
          <el-card class="box-card">
            <el-tree
              class="filter-tree"
              node-key="id"
              highlight-current
              lazy
              accordion
              :load="loadNode"
              :data="treeData"
              :props="defaultProps"
              :filter-node-method="filterNode"
              @node-click="getNodeData"
            />
          </el-card>
        </el-col>
      </el-row>
      <!--对话框动作按钮-->
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="cleanUpTemp">清空</el-button>
        <el-button @click="dialogFormVisible=false">取消</el-button>
        <el-button
          v-if="dialogStatus=='create'"
          type="primary"
          @click="createData"
        >创建</el-button>
        <el-button
          v-else
          type="primary"
          @click="updateData"
        >修改</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import waves from '@/directive/waves'
import {
  queryResource,
  createResource,
  deleteResource,
  updateResource
} from '@/api/organization/resource'

import {
  getAllApiDocs,
  getApiDocsByServerUrl
} from '@/api/organization/gateway'
export default {
  name: 'OrganizationResource',
  directives: {
    waves
  },
  props: {},
  data() {
    return {
      list: [],
      total: 0,
      listLoading: true,
      listQuery: {
        current: 1,
        size: 10
      },
      downloadLoading: false,
      dialogStatus: 'create',
      dialogFormVisible: false,
      rules: {
        code: [{ required: true, message: '资源id必填', trigger: 'blur' }],
        name: [{ required: true, message: '资源名称必填', trigger: 'blur' }],
        url: [{ required: true, message: 'url路径必填', trigger: 'blur' }],
        method: [
          { required: true, message: '资源请求方法必填', trigger: 'blur' }
        ],
        type: [{ required: true, message: '资源类型必填', trigger: 'blur' }]
      },
      temp: {
        resourceId: '',
        name: '',
        url: '',
        type: '',
        method: '',
        description: ''
      },
      // 树数据
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'name',
        isLeaf: 'leaf'
      }
    }
  },
  created() {
    this.queryResource()
  },
  mounted() {},
  methods: {
    /**
     * 查询资源列表
     */
    queryResource() {
      this.listLoading = true
      queryResource(this.listQuery).then(res => {
        this.list = res.data
        this.total = res.data.total
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.current = 1
      this.queryResource()
    },
    /**
     * 修改每页显示条数
     */
    handleSizeChange(val) {
      this.listQuery.size = val
      this.queryResource()
    },
    /**
     * 跳转到指定页
     */
    handleCurrentChange(val) {
      this.listQuery.current = val
      this.queryResource()
    },
    handleCreate() {
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    cleanUpTemp() {
      for (const key in this.temp) {
        if (this.temp.hasOwnProperty(key)) {
          this.temp[key] = ''
        }
      }
      this.queryResource()
    },
    createData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          createResource(this.temp).then(() => {
            this.dialogFormVisible = false
            this.$notify({
              title: '创建成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
            this.queryResource()
          })
        }
      })
    },
    handleUpdate(row) {
      this.dialogStatus = 'edit'
      this.temp = Object.assign({}, row) // copy obj
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    /**
     * 更新资源
     */
    updateData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          updateResource(this.temp).then(() => {
            this.dialogFormVisible = false
            this.$notify({
              title: '编辑成功',
              message: '编辑成功',
              type: 'success',
              duration: 2000
            })
            this.queryResource()
          })
        }
      })
    },
    deleteResource(id) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteResource(id).then(() => {
          this.$notify({
            title: '删除成功',
            message: '删除成功',
            type: 'success',
            duration: 2000
          })
          this.queryResource()
        })
      })
    },

    /**
     * 加载树数据
     * @param node 树节点
     * @param resolve
     *
     */
    loadNode(node, resolve) {
      if (node.level === 0) {
        getAllApiDocs().then(response => {
          resolve(
            response.filter(api => {
              return !api.name.startsWith('auth')
            })
          )
        })
      } else if (node.level === 1) {
        getApiDocsByServerUrl(node.data.url).then(response => {
          const children = []
          for (const path in response.paths) {
            for (const m in response.paths[path]) {
              children.push({
                url: path,
                method: m,
                name: response.paths[path][m].summary + ' ' + path,
                description: response.paths[path][m].description,
                type: path,
                code: path,
                leaf: true
              })
            }
          }
          resolve(children)
        })
      } else {
        return resolve([])
      }
    },
    /**
     * 获取节点数据
     * @param data
     */
    getNodeData(data) {
      // if (!this.formEdit) {
      //   this.formStatus = 'update'
      // }
      // console.log(data)
      if (data.leaf) {
        this.temp = JSON.parse(JSON.stringify(data))
      }
    },
    /**
     * 搜索node节点
     */
    filterNode() {}
  }
}
</script>

<style lang="scss" scoped>
</style>
