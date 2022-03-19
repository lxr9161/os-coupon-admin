<template>
  <div>
    <div class="pd-20">
      <div class="yun-list-search-area mb-10">
        <el-form :inline="true" :model="search" class="demo-form-inline">
          <el-form-item>
            <el-select v-model="search.code" placeholder="广告位">
              <el-option v-for="(item, key) in positionCode" :key="key" :label="item" :value="key"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="getList">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="mb-10">
        <el-button type="primary" size="small" @click="dialogVisible = true">添加广告</el-button>
      </div>
      <el-table
        border
        header-row-class-name="yun-table-header"
        :data="tableData"
        style="width: 100%"
        v-loading="loading">
        <el-table-column
          prop="id"
          label="ID"
          width="80">
        </el-table-column>
        <el-table-column prop="position" label="位置" width="120">
          <template slot-scope="scope">
            {{ positionCode[scope.row.position] }}
          </template>
        </el-table-column>
        <el-table-column label="广告图片" width="150">
          <template slot-scope="scope">
            <img :src="host + scope.row.img_url" style="width: 120px;"/>
          </template>
        </el-table-column>
        <el-table-column label="广告链接" prop="link"></el-table-column>
        <el-table-column label="链接类型" width="80">
          <template slot-scope="scope">
            <span v-if="scope.row.type === 1" class="yun-green">小程序</span>
            <span v-if="scope.row.type === 2" class="yun-red">H5</span>
            <span v-if="scope.row.type === 3" class="yun-red">优惠券链接</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="created_at"
          label="创建时间"
          width="180">
          <template slot-scope="scope">
            {{ scope.row.created_at | date('T') }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150px">
          <template slot-scope="scope">
            <el-button type="primary" size="small" @click="edit(scope.row)">编辑</el-button>
            <el-popconfirm
              class="ml-10"
              icon="el-icon-info"
              iconColor="red"
              title="确定删除吗？"
              @confirm="del(scope.row.id)"
            >
              <el-button slot="reference" type="danger" size="small">删除</el-button>
            </el-popconfirm>
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
        :title="this.form.id ? '编辑广告' : '添加广告'"
        :visible.sync="dialogVisible"
        width="600px"
        @closed="init"
        >
        <el-form :model="form" label-width="120px">
          <el-form-item label="位置" prop="position">
            <el-select v-model="form.position">
              <el-option v-for="(item, key) in positionCode" :key="key" :label="item" :value="key"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="跳转链接类型" prop="type">
            <el-select v-model="form.type">
              <el-option :value="1" label="小程序"></el-option> 
              <el-option :value="2" label="H5"></el-option> 
              <el-option :value="3" label="跳转优惠券"></el-option> 
            </el-select>
          </el-form-item>
          <el-form-item label="优惠券id" v-show="form.type === 3">
            <el-input v-model="form.coupon_id"></el-input>
          </el-form-item>
          <el-form-item v-show="form.type === 1" label="跳转方式" prop="type">
            <el-select v-model="form.target">
              <el-option :value="0" label="内部跳转"></el-option> 
              <el-option :value="1" label="跳转到其他小程序"></el-option> 
            </el-select>
          </el-form-item>
          <el-form-item v-show="form.type === 1 && form.target ===1" label="跳转小程序appid">
            <el-input v-model="form.appid"></el-input>
          </el-form-item>
          <el-form-item v-show="form.type === 1 || form.type === 2" label="跳转链接" prop="link">
            <el-input v-model="form.link"></el-input>
          </el-form-item>
          <el-form-item label="图片" prop="img_url">
            <upload-qiniu :file.sync="form.img_url"></upload-qiniu>
          </el-form-item>
          <el-form-item label="状态">
            <el-radio v-model="form.status" :label="1">启用</el-radio>
            <el-radio v-model="form.status" :label="0">禁用</el-radio>
          </el-form-item>
          <el-form-item label="排序值">
            <el-input-number v-model="form.sort"></el-input-number>
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
import { qiniuHost } from '@/config/app'
import UploadQiniu from '@/components/UploadQiniu';

const initForm = {
  position: '',
  img_url: '',
  link: '',
  status: 1,
  sort: 0,
  type: '',
  appid: '',
  target: 0,
  coupon_id: ''
}
export default {
  components: {
    UploadQiniu
  },
  data () {
    return {
      search: {
        code: ''
      },
      loading: false,
      tableData: [],
      currentPage: 1,
      pageSize: 10,
      total: 0,
      dialogVisible: false,
      saveLoading: false,
      form: JSON.parse(JSON.stringify(initForm)),
      positionCode: {
        index: '首页banner',
        coupon: '优惠券页面顶部banner'
      },
      host: qiniuHost
    }
  },
  created () {
    this.getList()
  },
  methods: {
    getList () {
      this.loading = true
      this.$http.get('/backend/ad', { params: this.search }).then(res => {
        this.tableData = res.data.info
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
        request = this.$http.put('backend/ad/' + this.form.id, this.form)
      } else {
        this.form.meeting_id = this.meetingId
        request = this.$http.post('/backend/ad', this.form)
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
      this.dialogVisible = true
      this.form = JSON.parse(JSON.stringify(row))
    },
    del (id) {
      this.$http.delete('/backend/ad/' + id).then(res => {
        if (res.data.status === 'success') {
          this.$message({ message: res.data.info, type: 'success' })
          this.getList()
        }
      })
    },
    init () {
      JSON.parse(JSON.stringify(initForm))
    }
  }
}
</script>

<style scoped>

</style>
