<template>
  <div class="app-container">
    <el-row>
      <el-button type="primary" @click="toCreate">+新增员工</el-button>
      <el-button type="primary" @click="batchRemove">-批量删除</el-button>
    </el-row>
    <el-divider />
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column label="用户名" min-width="100" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.fullName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="姓名" min-width="100">
        <template slot-scope="scope">
          {{ scope.row.username }}
        </template>
      </el-table-column>
      <el-table-column label="性别" min-width="100" align="center">
        <template slot-scope="scope">
          {{ scope.row.gender }}
        </template>
      </el-table-column>
      <el-table-column label="职位" min-width="100" align="center">
        <template slot-scope="scope">
          {{ scope.row.position }}
        </template>
      </el-table-column>
      <el-table-column label="入职日期" min-width="100" align="center">
        <template slot-scope="scope">
          {{ scope.row.entryDate }}
        </template>
      </el-table-column>
      <el-table-column label="最后操作时间" min-width="100" align="center">
        <template slot-scope="scope">
          {{ scope.row.lastDate }}
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="100" align="center">
        <template slot-scope="scope">
          <el-button type="text" @click="toEdit(scope.row.id)">编辑</el-button>
          <el-button type="text" @click="doRemove(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      layout="total, sizes, prev, pager, next"
      :total="page.total"
      :page-size="page.size"
      :page-sizes="[10, 20, 30, 40, 50]"
      :current-page="page.current"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    />
    <el-dialog :title="dialogMode === 0 ? '编辑员工' : '新建员工'" :visible.sync="dialogVisible" width="500px" @closed="dialogClosed">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px" :inline="false" size="normal">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" placeholder="请输入用户名，2-20字符，不可重复" />
        </el-form-item>
        <el-form-item label="员工姓名" prop="fullName">
          <el-input v-model="form.fullName" placeholder="请输入员工姓名，2-10个字" />
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-select v-model="form.gender" value-key="" placeholder="请选择" clearable filterable>
            <el-option
              v-for="item in genderOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="职位" required>
          <el-select v-model="form.position" value-key="" placeholder="请选择" clearable filterable>
            <el-option
              v-for="item in positionOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>

        </el-form-item>
        <el-form-item label="入职日期" required>
          <el-date-picker v-model="form.entryDate" type="date" size="normal" placeholder="选择日期时间" />
        </el-form-item>
        <el-form-item label="归属部门" required>
          <el-select v-model="form.departmentId" value-key="" placeholder="请选择" clearable filterable>
            <el-option
              v-for="item in departmentOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>

        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button type="primary" @click="doSave">保存</el-button>
        <el-button @click="dialogVisible = false">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { insert, update, get, getList, remove } from '@/api/table'
import { options } from 'runjs'

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      list: null,
      listLoading: true,
      page: {
        total: 0,
        current: 0,
        size: 10
      },
      selection: [],
      dialogVisible: false,
      dialogMode: 0,
      form: {
        'id': '',
        'username': '',
        'fullName': '',
        'gender': '',
        'position': '',
        'entryDate': '',
        'lastDate': '',
        'departmentId': 0
      },
      genderOptions: [{ label: '男', value: 0 }, { label: '女', value: 1 }],
      positionOptions: [{ label: '教授', value: 1 }, { label: '讲师', value: 2 }, { label: '班主任', value: 3 }],
      departmentOptions: [{ label: '学工部', value: 0 }],
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 2, max: 20, message: '请输入用户名，2-20字符，不可重复', trigger: 'blur' }
        ],
        fullName: [
          { required: true, message: '请输入员工姓名', trigger: 'blur' },
          { min: 2, max: 10, message: '请输入员工姓名，2-10个字', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.fetchData(this.page)
  },
  methods: {
    doSave() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (this.dialogMode === 0) {
            this.doUpdate()
          } else {
            this.doCreate()
          }
        }
      })
    },
    toCreate() {
      this.dialogVisible = true
      this.dialogMode = 1
    },
    dialogClosed() {
      for (const atribute in this.form) {
        this.form[atribute] = ''
      }
    },
    fetchOne(id) {
      get(id).then((response) => {
        for (const atribute in response.data) {
          this.form[atribute] = response.data[atribute]
        }
      })
    },
    toEdit(id) {
      this.dialogVisible = true
      this.dialogMode = 0
      this.fetchOne(id)
    },
    fetchData(param) {
      this.listLoading = true
      getList(param).then((response) => {
        this.list = response.data.records.map(item => {
          const getLabel = (value, options) => {
            const item = options.find(element => element.value === value)
            return item && item.label
          }
          item.gender = getLabel(item.gender, this.genderOptions)
          item.position = getLabel(item.position, this.positionOptions)
          item.departmentId = getLabel(item.departmentId, this.departmentOptions)
          return item
        })
        this.page.total = response.data.total
        this.page.current = response.data.current
        this.page.size = response.data.size
        this.listLoading = false
      })
    },
    handleCurrentChange(newPage) {
      this.page.current = newPage
      this.listLoading = true
      this.fetchData(this.page)
    },
    handleSizeChange(newSize) {
      this.page.size = newSize
      this.listLoading = true
      this.fetchData(this.page)
    },
    handleSelectionChange(selection) {
      this.selection = selection.flatMap((item) => item.id)
      console.log(this.selection)
    },
    doRemove(ids) {
      remove({ idList: ids }).then((response) => {
        this.$message({
          message: '删除成功',
          type: 'success'
        })
        this.fetchData(this.page)
      })
    },
    doUpdate(id) {
      update(this.form).then((response) => {
        if (response.code === 20000) {
          this.$message({
            type: 'success',
            message: '保存成功'
          })
          this.dialogVisible = false
        }
        this.fetchData(this.page)
      })
    },
    doCreate() {
      insert(this.form).then((response) => {
        if (response.code === 20000) {
          this.$message({
            type: 'success',
            message: '保存成功'
          })
          this.dialogVisible = false
        }
        this.fetchData(this.page)
      })
    },
    batchRemove() {
      this.selection.length > 0 && this.doRemove(this.selection)
    }
  }
}
</script>
<style scoped lang="css">
.el-pagination {
  margin-top: 1em;
  margin-bottom: 1em;
  float: right;
}
</style>
