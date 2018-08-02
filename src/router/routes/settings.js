export default {
  path: ':prefix/settings',
  component: resolve => require(['@/modules/Settings'], resolve),
  children: [
    {
      path: 'index',
      component: resolve => require(['@/modules/Settings/Form'], resolve)
    }
  ]
}
