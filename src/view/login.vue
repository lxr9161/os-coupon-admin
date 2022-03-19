<template>
  <div>
    <div class="yun-login-page">
      <div class="yun-login-form text-center" v-loading="loading">
        <div class="yun-login-field">
          <input v-model="form.login_name" placeholder="用户名"/>
          <i class="el-icon-user"></i>
        </div>
        <div class="yun-login-field">
          <input v-model="form.password" type="password" placeholder="密码"/>
          <i class="el-icon-lock"></i>
        </div>
        <div class="mb-20 relative">
          <div class="yun-login-error">
            <transition name="fade">
              <div v-show="error">{{ errorMsg }}</div>
            </transition>
          </div>
          <div class="yun-login-btn" @click="login">登 录</div>
        </div>
        <el-row>
          <el-col :span="12" class="text-left">
            <el-switch
              v-model="form.remember"
              :active-value="1"
              :inactive-value="0"
              active-color="#fe5656"
            ></el-switch>
            <span class="ml-10 yun-login-remember" @click="remember">记住密码</span>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
import Cookies from 'js-cookie'
export default {
  data () {
    return {
      form: {
        login_name: '',
        password: '',
        remember: 0
      },
      loading: false,
      logo: require('../assets/images/logo_blue_big.png'),
      error: false,
      errorMsg: '账号密码错误，请重新输入'
    }
  },
  created () {
  },
  beforeRouteEnter (to, from, next) {
    let token = Cookies.get('auth_token')
    if (token) {
      next({ name: 'index' })
      return
    }
    next()
  },
  methods: {
    login () {
      if (this.form.login_name === '' || this.form.password === '') {
        this.error = true
        return
      }
      if (this.loading) {
        return
      }
      this.loading = true
      this.$http.post('/backend/login', this.form).then(res => {
        this.loading = true
        if (res.data.status === 'success') {
          // 把token存放入cookie
          Cookies.set('auth_token', res.data.access_token, { expires: res.data.expires_in })
          this.$router.push('/')
        }
      }).catch(() => {
        this.loading = false
      })
    },
    remember () {
      this.form.remember = this.form.remember === 1 ? 0 : 1
    }
  }
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
.yun-login-error {
  position: absolute;
  top: -20px;
  left: 0;
  right: 0;
  text-align: center;
  color: red;
}
.yun-login-remember {
  vertical-align: -2px;
  cursor: pointer;
}
.yun-login-page {
  padding-top: 120px;
  font-size: 14px;
}
.yun-login-logo {
  margin-bottom: 35px;
}
.yun-login-logo img {
  width: 260px;
  height: auto;
}
.yun-login-form {
  width: 400px;
  margin: 0 auto;
  padding: 30px;
  border-radius: 10px;
  background: #FFF;
  box-shadow: 1px 2px 6px #a9a5a5;
}
.yun-login-field {
  position: relative;
  margin-bottom: 28px;
}
.yun-login-field input {
  box-sizing: border-box;
  display: block;
  width: 100%;
  border: none;
  padding: 10px 10px 10px 55px;
  outline:none;
  height: 50px;
  line-height: 50px;
  background-color: rgba(255, 255, 255, .7);
  border-radius: 50px;
  border: 1px solid #f1f1f1;
}
.yun-login-field i {
  position: absolute;
  top: 14px;
  left: 22px;
  font-size: 20px;
  color: #C0C4CC
}
.yun-login-btn {
  box-sizing: border-box;
  background: #fe5656;
  color: #fff;
  border-radius: 50px;
  line-height: 50px;
  letter-spacing: 5px;
  cursor: pointer;
}
.yun-login-forget {
  cursor: pointer;
}
</style>
