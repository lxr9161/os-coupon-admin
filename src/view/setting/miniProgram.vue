<template>
  <div>
    <div class="pd-20">
      <el-form :model="form" label-width="150px">
        <el-form-item label="抽奖开关">
          <el-switch :active-value="1" active-text="开启" :inactive-value="0" inactive-text="关闭" v-model="form.draw_status"></el-switch>
        </el-form-item>
        <el-form-item label="个人中心优惠券入口">
          <el-switch :active-value="1" active-text="显示" :inactive-value="0" inactive-text="隐藏" v-model="form.center_coupon_enter"></el-switch>
        </el-form-item>
        <el-form-item label="首页红包">
          <el-switch :active-value="1" active-text="显示" :inactive-value="0" inactive-text="隐藏" v-model="form.index_coupon_display"></el-switch>
        </el-form-item>
        <el-form-item label="首页更多红包入口">
          <el-switch :active-value="1" active-text="显示" :inactive-value="0" inactive-text="隐藏" v-model="form.index_coupon_more"></el-switch>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="save">保存</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
const initForm = {
  withdrawal_limit: 2,
  wx_service: '',
  rule: ''
}
export default {
  data () {
    return {
      form: JSON.parse(JSON.stringify(initForm)),
      loading: false
    }
  },
  mounted () {
    this.getConfig()
  },
  methods: {
    // 获取配置
    getConfig () {
      this.$http.get('/backend/miniProgramSetting').then(res => {
        if (res.data.status === 'success') {
          this.form = res.data.info;
        }
      })
    },
    // 保存设置
    save () {
      if (this.loading) {
        return
      }
      this.loading = true
      let postData = {
        id: 1,
        config: JSON.stringify(this.form)
      }
      this.$http.post('/backend/saveSetting', postData).then(res => {
        if (res.data.status === 'success') {
          this.$message({ message: res.data.info, type: 'success' })
        }
        this.loading = false
      })
    }
  }
}
</script>

<style>

</style>