<template>
  <el-container>
    <el-aside class="yun-aside" style="width: 200px;">
      <div class="yun-logo"></div>
      <div class="yun-backend-menu">
        <el-menu
          class="el-menu-vertical-demo"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
          style="width: 200px;"
          :default-active="activeMenu"
          :router="true">
          <el-menu-item index="/dashboard">
            <i class="el-icon-location"></i>
            <span slot="title">控制台</span>
          </el-menu-item>
          <el-menu-item index="/user">
            <i class="el-icon-user-solid"></i>
            <span slot="title">用户管理</span>
          </el-menu-item>
          <el-menu-item index="/coupon">
            <i class="el-icon-s-ticket"></i>
            <span slot="title">优惠券</span>
          </el-menu-item>
          <el-menu-item index="/ad">
            <i class="el-icon-picture"></i>
            <span slot="title">广告管理</span>
          </el-menu-item>
          <el-submenu index="11">
            <template slot="title">
              <i class="el-icon-present"></i>
              <span>抽奖</span>
            </template>
            <el-menu-item index="/drawConfig">抽奖设置</el-menu-item>
          </el-submenu>
          <el-submenu index="12">
            <template slot="title">
              <i class="el-icon-s-tools"></i>
              <span>系统设置</span>
            </template>
            <el-menu-item index="/miniProgramSetting">小程序设置</el-menu-item>
          </el-submenu>
        </el-menu>
      </div>
    </el-aside>
    <el-container class="yun-main">
      <el-header class="yun-el-header">
        <el-dropdown @command="menuHandle">
          <span class="el-dropdown-link">
            {{ admin.login_name }}
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="setting">个人设置</el-dropdown-item>
            <el-dropdown-item command="logout">退出</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <span></span>
      </el-header>
      <el-main class="yun-main-container">
        <div>
          <router-view/>
        </div>
      </el-main>
      <el-backtop target=".yun-main-container" :visibility-height="20"></el-backtop>
    </el-container>
  </el-container>
</template>

<script>
import Cookies from 'js-cookie'
export default {
  name: 'layout',
  data () {
    return {
      keyword: '',
      admin: {}
    }
  },
  created () {
    this.currentAdmin()
  },
  computed: {
    activeMenu () {
      const route = this.$route
      const { meta, path } = route
      if (meta.parent) {
        return meta.parent
      }
      return path
    }
  },
  methods: {
    currentAdmin () {
      this.$http.get('/backend/me').then(res => {
        this.admin = res.data
      })
    },
    openWindow (url) {
      window.open('/#' + url)
    },
    logout () {
      this.$http.post('/backend/logout').then(res => {
        Cookies.remove('auth_token')
        this.$router.push({ name: 'login' })
      })
    },
    menuHandle (command) {
      if (command === 'logout') {
        this.logout()
      }
    }
  }
}
</script>

