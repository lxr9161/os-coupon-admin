<template>
  <div>
    <el-upload
      ref="upload"
      :action="action"
      :accept="acceptTypes.join(',')"
      :limit="1"
      :before-upload="beforeUpload"
      :on-progress="onProgress"
      :on-success="onSuccess"
      :on-error="onError"
      :headers="headers"
      name="file"
      :show-file-list="false"
      >
      <el-button size="small" type="primary">点击上传</el-button>
      <div slot="tip" class="el-upload__tip nl-upload_tip">只能上传jpg/png文件，且不超过3mb</div>
    </el-upload>
    <div class="nl_upload-img">
      <img v-if="img" :src="img" class="nl_upload-img"/>
    </div>
  </div>
</template>

<script>
import Cookies from 'js-cookie'
import { host } from '@/config/app'
export default {
  props: ['file'],
  data () {
    return {
      headers: {
        'Authorization': 'bearer ' + Cookies.get('auth_token')
      },
      acceptTypes: ['image/png', 'image/jpeg'],
      action: '/api/backend/upload',
      img: '',
      host: host,
      loading: false
    }
  },
  mounted () {
    if (this.file) {
      this.img = this.host + this.file
    }
  },
  watch: {
    'file' (val) {
      if (val) {
        this.img = this.host + val
      } else {
        this.img = val
      }
    }
  },
  methods: {
    beforeUpload () {
      if (this.loading) {
        return false
      }
      this.loading = true
    },
    onProgress () {},
    onSuccess (response) {
      if (response.status === 'success') {
        this.$emit('update:file', response.info)
        this.img = this.host + response.info
      } else {
        this.$message({ message: response.info, type: 'error'})
      }
      this.loading = false
      this.$refs.upload.clearFiles()
    },
    onError () {
      this.loading = false
      this.$refs.upload.clearFiles()
      this.$message({ message: '上传图片失败', type: 'error' })
    }
  }
}
</script>

<style>
.nl_upload-img {
  line-height: 1;
  margin-top: 10px;
}
.nl_upload-img img {
  display: block;
  height: 100px;
  width: auto;
}
.el-upload__tip.nl-upload_tip {
  display: inline-block;
  line-height: 24px;
  margin-top: 0;
  margin-left: 10px;
  color: #909399;
}
</style>