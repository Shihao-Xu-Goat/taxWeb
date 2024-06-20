import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import Home from '@/components/Home'
import ArticleList from '@/components/ArticleList'
import CateMana from '@/components/CateMana'
import DataCharts from '@/components/DataCharts'
import PostArticle from '@/components/PostArticle'
import DocUpload from "../components/DocUpload";
import UserMana from '@/components/UserMana'
import BlogDetail from '@/components/BlogDetail'
import {getRequest} from "../utils/api";

Vue.use(Router)

//const router = new Router({
export default new Router({
  routes: [
    {
      path: '/',
      name: 'Login',
      hidden: true,
      component: Login
    }, {
      path: '/home',
      name: '',
      component: Home,
      hidden: true
    }, {
      path: '/home',
      component: Home,
      name: 'Doc Management',
      iconCls: 'fa fa-file-text-o',
      children: [
        {
          path: '/articleList',
          name: 'Doc List',
          component: ArticleList,
          meta: {
            keepAlive: true
          }
        }, {
          path: '/postArticle',
          name: 'Post Doc',
          component: PostArticle,
          meta: {
            keepAlive: false
          }
        }, {
          path: '/docUpload',
          name: 'Doc upload',
          component: DocUpload,
          meta: {
            keepAlive: false
          }
        },{
          path: '/blogDetail',
          name: '博客详情',
          component: BlogDetail,
          hidden: true,
          meta: {
            keepAlive: false
          }
        }, {
          path: '/editBlog',
          name: '编辑博客',
          component: PostArticle,
          hidden: true,
          meta: {
            keepAlive: false
          }
        }
      ]
    }, {
      path: '/home',
      component: Home,
      name: 'User Management',
      children: [
        {
          path: '/user',
          iconCls: 'fa fa-user-o',
          name: 'User Management',
          component: UserMana,
          meta: { requiresAdmin: false }
        }
      ]
    }, {
      path: '/home',
      component: Home,
      name: 'Category Management',
      children: [
        {
          path: '/cateMana',
          iconCls: 'fa fa-reorder',
          name: 'Category Management',
          component: CateMana
        }
      ]
    }, {
      path: '/home',
      component: Home,
      name: 'statistics',
      iconCls: 'fa fa-bar-chart',
      children: [
        {
          path: '/charts',
          iconCls: 'fa fa-bar-chart',
          name: 'statistics',
          component: DataCharts
        }
      ]
    }
  ]
})

// router.beforeEach((to, from, next) => {
//   const isAdmin = checkAdminPermission();
//   const requiresAdmin = to.matched.some(record => record.meta.requiresAdmin);
// });
//
// function checkAdminPermission() {
//   let isAdmin = false;
//   getRequest("/isAdmin").then(resp=> {
//     if (resp.status == 200) {
//       isAdmin = resp.data;
//     }
//   })
//   return isAdmin;
// }
// export default router;
