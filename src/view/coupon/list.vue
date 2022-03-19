<template>
  <div>
    <div class="pd-20">
      <div class="mb-10">
        <el-button type="primary" size="small" @click="dialogVisible = true">添加优惠券</el-button>
      </div>
      <el-table
        border
        header-row-class-name="yun-table-header"
        :data="tableData"
        style="width: 100%"
        v-loading="loading">
        <el-table-column prop="id" label="ID" width="80"></el-table-column>
        <el-table-column prop="name" label="优惠券名称"></el-table-column>
        <el-table-column label="icon" width="120">
          <template slot-scope="scope">
            <img :src="host + scope.row.icon" style="width: 80px;"/>
          </template>
        </el-table-column>
        <el-table-column label="排序" prop="sort" width="100"></el-table-column>
        <el-table-column label="状态" width="80">
          <template slot-scope="scope">
            <span class="yun-red" v-if="scope.row.status === 0">禁用</span>
            <span class="yun-green" v-if="scope.row.status === 1">启用</span>
          </template>
        </el-table-column>
        <el-table-column prop="created_at" label="时间" width="230">
          <template slot-scope="scope">
            <div>创建时间: {{ scope.row.created_at | date('T') }}</div>
            <div>更新时间: {{ scope.row.updated_at | date('T') }}</div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150px">
          <template slot-scope="scope">
            <el-button type="primary" size="small" @click="edit(scope.row)">编辑</el-button>
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
      <el-dialog
        :title="this.form.id ? '编辑优惠券' : '添加优惠券'"
        :visible.sync="dialogVisible"
        width="800px"
        @closed="init"
        >
        <el-form :model="form" label-width="140px">
          <el-form-item label="优惠券名称" prop="name">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item label="icon">
            <upload-qiniu :file.sync="form.icon"></upload-qiniu>
          </el-form-item>
          <el-form-item label="优惠券封面">
            <upload-qiniu :file.sync="form.cover"></upload-qiniu>
          </el-form-item>
           <el-form-item label="跳转地址">
            <el-input v-model="form.link"></el-input>
          </el-form-item>
          <el-form-item label="跳转小程序appid">
            <el-input v-model="form.appid"></el-input>
          </el-form-item>
          <el-form-item label="优惠价价值">
            <el-input v-model="form.price"></el-input>
          </el-form-item>
          <el-form-item label="子标题">
            <el-input v-model="form.sub_title"></el-input>
          </el-form-item>
          <el-form-item label="排序值">
            <el-input v-model="form.sort"></el-input>
          </el-form-item>
          <el-form-item label="分享按钮">
            <el-switch v-model="form.share_btn" :inactive-value="0" :active-value="1" active-text="显示" inactive-text="隐藏"></el-switch>
          </el-form-item>
          <el-form-item label="分享页面文案">
            <el-input type="textarea" v-model="form.share_text" rows="5"></el-input>
          </el-form-item>
          <el-form-item label="是否首页展示">
            <el-switch v-model="form.index_show" :inactive-value="0" :active-value="1" active-text="是" inactive-text="否"></el-switch>
          </el-form-item>
          <el-form-item label="是否跳转领取页面">
            <el-switch v-model="form.jump_get_page" :inactive-value="0" :active-value="1" active-text="是" inactive-text="否"></el-switch>
          </el-form-item>
          <el-form-item label="状态">
            <el-radio v-model="form.status" :label="1">启用</el-radio>
            <el-radio v-model="form.status" :label="0">禁用</el-radio>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="save">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>

import UploadQiniu from '@/components/UploadQiniu'
import { qiniuHost } from '@/config/app'

const initForm = {
  name: '',
  icon: '',
  cover: '',
  price: 0,
  sort: 0,
  share_btn: 0,
  index_show: 0,
  jump_get_page: 0,
  status: 1,
  link: '',
  appid: '',
  share_text: '',
  sub_title: ''
}
export default {
  components: {
    UploadQiniu
  },
  data () {
    return {
      host: qiniuHost,
      loading: false,
      tableData: [],
      config: [],
      currentPage: 1,
      pageSize: 10,
      total: 0,
      dialogVisible: false,
      saveLoading: false,
      form: JSON.parse(JSON.stringify(initForm))
    }
  },
  created () {
    this.getList()
  },
  methods: {
    getList () {
      this.loading = true
      this.$http.get(
        '/backend/coupon',
        {
          params: {
            page: this.currentPage
          }
        }).then(res => {
        this.tableData = res.data.data
        this.currentPage = res.data.current_page
        this.total = res.data.total
        this.pageSize = res.data.per_page
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    save () {
      if (this.saveLoading) {
        return
      }
      this.saveLoading = true
      let request = null
      if (this.form.id) {
        request = this.$http.put('backend/coupon/' + this.form.id, this.form)
      } else {
        request = this.$http.post('/backend/coupon', this.form)
      }
      request.then(res => {
        if (res.data.status === 'success') {
          this.$message({ message: res.data.info, type: 'success' })
          this.getList()
          this.init()
          this.dialogVisible = false
        }
        this.saveLoading = false
      }).catch(() => {
        this.saveLoading = false
      })
    },
    edit (row) {
      this.saveLoading = true
      this.dialogVisible = true
      this.$http.get('/backend/coupon/' + row.id).then(res => {
        this.saveLoading = false
        if (res.data.info) {
          this.form = res.data.info
        } else {
          this.dialogVisible = false
          this.$message({ message: '未找到记录', type: 'error' })
        }
      }).catch(() => {
        this.dialogVisible = false
          this.$message({ message: '未找到记录', type: 'error' })
      })
    },
    del (id) {
      this.$http.delete('/backend/admin/' + id).then(res => {
        if (res.data.status === 'success') {
          this.$message({ message: res.data.info, type: 'success' })
          this.getList()
        }
      })
    },
    init () {
      this.form = JSON.parse(JSON.stringify(initForm))
    }
  }
}
</script>

<style scoped>

</style>
