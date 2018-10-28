import Vue from 'vue'
import Router from 'vue-router'
import pwnningWall from '@/components/pwnningWall'
import trends from '@/components/trends'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/pwnningwall',
      name: 'PwnningWall',
      component: pwnningWall
    },
    {
      path: '/',
      name: 'Trends',
      component: trends
    }
  ]
})
