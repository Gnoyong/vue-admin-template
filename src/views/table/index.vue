<template>
  <div class="app-container">
    <el-row>
      <el-button type="primary">+新增员工</el-button>
      <el-button type="primary">-批量删除</el-button>
    </el-row>
    <el-divider />
    <el-table v-loading="listLoading" :data="list" element-loading-text="Loading" border fit highlight-current-row
      @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" />
      <el-table-column align="center" label="ID" width="95">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column label="Title" min-width="100">
        <template slot-scope="scope">
          {{ scope.row.username }}
        </template>
      </el-table-column>
      <el-table-column label="Author" min-width="100" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.fullName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Pageviews" min-width="100" align="center">
        <template slot-scope="scope">
          {{ scope.row.gender }}
        </template>
      </el-table-column>
      <el-table-column label="Pageviews" min-width="100" align="center">
        <template slot-scope="scope">
          {{ scope.row.position }}
        </template>
      </el-table-column>
      <el-table-column label="Pageviews" min-width="100" align="center">
        <template slot-scope="scope">
          {{ scope.row.entryDate }}
        </template>
      </el-table-column>
      <el-table-column label="Pageviews" min-width="100" align="center">
        <template slot-scope="scope">
          {{ scope.row.lastDate }}
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="100" align="center">
        <template slot-scope="scope">
          <el-button type="text" @click="edit(scope.row.id)">编辑</el-button>
          <el-button type="text" @click="remove(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination background layout="total, sizes, prev, pager, next" :total="page.total" :page-size="page.size"
      :page-sizes="[10, 20, 30, 40, 50]" :current-page="page.current" @current-change="handleCurrentChange"
      @size-change="handleSizeChange" />
  </div>
</template>

<script>
import { getList } from '@/api/table'

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
      }
    }
  },
  created() {
    this.fetchData(this.page)
  },
  methods: {
    fetchData(param) {
      this.listLoading = true
      getList(param).then((response) => {
        this.list = response.data.records
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
    handleSelectionChange() { },
    remove(id) {
      console.log(id)
      deleteOne(id).then((response) => {
        this.$message({
          message: '恭喜你，这是一条成功消息',
          type: 'success'
        })
      })
    },
    edit(id) {
      console.log(id)
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
