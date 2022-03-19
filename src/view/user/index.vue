<template>
  <div>
    <div class="yun-list-search-area">
      <el-form :inline="true" :model="search" class="demo-form-inline">
        <el-form-item>
          <el-input placeholder="用户ID" v-model="search.user_id" clearable  @keyup.enter.native="onSearch"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input placeholder="微信openid" v-model="search.openid" clearable  @keyup.enter.native="onSearch"></el-input>
        </el-form-item>
        <el-form-item>
          <el-date-picker
            type="datetime"
            v-model="search.start_time"
            placeholder="开始时间"
            clearable
            value-format="yyyy-MM-dd HH:mm:ss">
          </el-date-picker>
          -
          <el-date-picker
            type="datetime"
            v-model="search.end_time"
            placeholder="结束时间"
            clearable
            value-format="yyyy-MM-dd HH:mm:ss">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSearch">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="pd-20">
      <el-table
        border
        header-row-class-name="yun-table-header"
        :data="tableData"
        style="width: 100%"
        v-loading="loading">
        <el-table-column prop="id" label="ID" width="80"></el-table-column>
        <el-table-column prop="openid" label="微信openid" width="230"></el-table-column>
        <el-table-column prop="nickname" label="昵称"></el-table-column>
        <el-table-column label="头像">
          <template slot-scope="scope">
            <img :src="scope.row.avatar" style="display: block;width: 50px;height: auto"/>
          </template>
        </el-table-column>
        <el-table-column label="性别">
          <template slot-scope="scope">
            <span v-if="scope.row.gender === 1">男</span>
            <span v-else-if="scope.row.gender === 2">女</span>
          </template>
        </el-table-column>
        <el-table-column label="时间" width="235">
          <template slot-scope="scope">
            <div>创建时间: {{ scope.row.created_at | date('T') }}</div>
            <div>更新时间: {{ scope.row.updated_at | date('T') }}</div>
          </template>
        </el-table-column>
        <el-table-column label="设为管理" width="80">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.is_admin" @change="setAdmin(scope.row.id, $event)" :inactive-value="0" :active-value="1"></el-switch>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        :current-page.sync="currentPage"
        :page-size="pageSize"
        layout="prev, pager, next, jumper"
        :total="total"
        @current-change="getList"
        hide-on-single-page>
      </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      search: {
        user_id: '',
        openid: '',
        start_time: '',
        end_time: ''
      },
      loading: false,
      tableData: [],
      userInfo: {},
      currentPage: 1,
      pageSize: 10,
      total: 0
    }
  },
  created () {
    this.getList()
  },
  methods: {
    setAdmin (userId, event) {
      console.log(userId)
      console.log(event)
      this.$http.post('/backend/setAdmin', {user_id: userId, is_admin: event}).then(res => {
        if (res.data.status === 'success') {
          this.$message({ message: res.data.info, type: 'success' })
        }
      })
    },
    // 搜索
    onSearch () {
      this.currentPage = 1
      this.getList()
    },
    getList () {
      this.loading = true
      this.$http.get(
        '/backend/getUserList',
        {
          params: {
            page: this.currentPage,
            ...this.search
          }
        }).then(res => {
        this.tableData = res.data.info.data
        this.currentPage = res.data.info.current_page
        this.total = res.data.info.total
        this.pageSize = res.data.info.per_page
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style>

</style>
