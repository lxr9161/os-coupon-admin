<template>
  <div class="pd-20">
    <el-table
      border
      header-row-class-name="yun-table-header"
      :data="config"
      style="width: 100%"
      v-loading="loading"
      row-key="row">
      <el-table-column prop="title" label="奖品名称">
        <template slot-scope="scope">
          <el-input v-model="scope.row.title" size="small"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="图片">
        <template slot-scope="scope">
          <upload-qiniu :file.sync="scope.row.img_url"></upload-qiniu>
        </template>
      </el-table-column>
      <el-table-column label="奖品类型">
        <template slot-scope="scope">
          <el-select v-model="scope.row.type" size="small">
            <el-option :value="1" label="贝壳"></el-option>
            <el-option :value="2" label="真实奖品"></el-option>
            <el-option :value="3" label="代金券"></el-option>
            <el-option :value="4" label="未中奖"></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="数量">
        <template slot-scope="scope">
          <el-input v-if="scope.row.type === 1 || scope.row.type === 3" v-model="scope.row.reward_price" size="small"></el-input>
          <div class="yun-form-note" v-if="scope.row.type === 3">单位分</div>
        </template>
      </el-table-column>
      <el-table-column label="抽奖概率">
        <template slot-scope="scope">
          <el-input-number v-model="scope.row.probability" size="small"></el-input-number>
        </template>
      </el-table-column>
      <el-table-column label="排序">
        <template slot-scope="scope">
          <el-input-number v-model="scope.row.sort" size="small"></el-input-number>
        </template>
      </el-table-column>
    </el-table>
    <div class="mt-10">
      <el-button type="primary" size="small" @click="save">保存</el-button>
    </div>
  </div>
</template>

<script>
import UploadQiniu from '@/components/UploadQiniu';

export default {
  components: {
    UploadQiniu
  },
  data () {
    return {
      loading: false,
      config: []
    }
  },
  mounted () {
    this.getDrawConfig()
  },
  methods: {
    getDrawConfig () {
      this.$http.get('/backend/getDrawConfig').then(res => {
        if (res.data.status === 'success') {
          this.config = res.data.info
        }
      })
    },
    // 保存
    save () {
      if (this.loading) {
        return
      }
      this.loading = true
      this.$http.post('/backend/saveDrawConfig', { config: this.config }).then(res => {
        if (res.data.status === 'success') {
          this.$message({ type: 'success', message: '保存成功' })
        }
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