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
      :data="uploadData"
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
import { qiniuHost, qiniuUploadHost } from '@/config/app'
export default {
  props: ['file'],
  data () {
    return {
      headers: {
        'Authorization': 'bearer ' + Cookies.get('auth_token')
      },
      acceptTypes: ['image/png', 'image/jpeg'],
      action: qiniuUploadHost,
      img: '',
      host: qiniuHost,
      loading: false,
      uploadData: {
        token: '',
				key: '',
      }
    }
  },
  mounted () {
    if (this.file) {
      this.img = this.host + this.file
    }
    this.getUploadToken()
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
    getUploadToken () {
      this.$http.get('/backend/getQiniuUploadToken').then(res => {
        if (res.data.status === 'success') {
          this.uploadData.token = res.data.info.token
        }
      })
    },
    generateFileName (file) {
      let ext = this.getExt(file)
      return 'images/' + this.randomNumber(1) + Date.parse(new Date()) + this.randomNumber(4) + ext
    },
    randomNumber (len) {
      let str = ''
      for (let i = 1; i <= len; i++) {
        str += parseInt(Math.random() * 10)
      }
      return str
    },
    getExt (fileName) {
      var result = /\.[^.]+/.exec(fileName)
      return result
    },
    beforeUpload (file) {
      if (this.loading) {
        return false
      }
      if (!this.uploadData.token) {
        return false
      }
      this.uploadData.key = this.generateFileName(file.name)
      console.log(this.uploadData)
      this.loading = true
    },
    onProgress () {},
    onSuccess (response) {
      if (response.key) {
        this.$emit('update:file', response.key)
        this.img = this.host + response.key
      } else {
        this.$message({ message: '上传图片失败', type: 'error'})
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