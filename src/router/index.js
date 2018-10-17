import Vue from 'vue'
import Router from 'vue-router'
import auth from '@/utils/auth'
import TheLayout from '@/components/Layout'
import Root from '@/pages/Root'
import notFound from './routes/notFound'
import home from './routes/home'
import articles from './routes/articles'
import products from './routes/products'
import cars from './routes/cars'
import staffs from './routes/staffs'
import olds from './routes/olds'
import families from './routes/families'
import messages from './routes/messages'
import notices from './routes/notices'
import roles from './routes/roles'
import permissions from './routes/permissions'
import settings from './routes/settings'
import videos from './routes/videos'
import comments from './routes/comments'
import login from './routes/login'
import logout from './routes/logout'
import iView from 'iview'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      component: Root,
      children: [
        {
          path: '/',
          component: TheLayout,
          children: [
            home,
            articles,
            products,
            cars,
            staffs,
            olds,
            families,
            notices,
            roles,
            permissions,
            settings,
            videos,
            comments,
            messages
          ],
          meta: {
            requiresAuth: true
          }
        },
        login,
        logout,
        notFound
      ]
    }
  ]
})

router.beforeEach((to, from, next) => {
  iView.LoadingBar.start()

  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!auth.loggedIn()) {
      next({
        path: 'login',
        query: { redirect: to.fullPath }
      })
    } else {
      next()
    }
  } else {
    next()
  }
})

router.afterEach((to, from, next) => {
  iView.LoadingBar.finish()
})

export default router
