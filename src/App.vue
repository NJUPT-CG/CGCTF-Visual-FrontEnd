<template>
  <div id="app">
    <!--<el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">-->
      <!--<el-menu-item index="1">Contest Manager</el-menu-item>-->
      <!--<el-menu-item index="2">Challenge Manager</el-menu-item>-->
      <!--<el-menu-item index="3">Team manager</el-menu-item>-->
    <!--</el-menu>-->
    <!--<div class="line"></div>-->
    <!--<div style="margin-bottom: 100px;"></div>-->
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 0px;
}
</style>
