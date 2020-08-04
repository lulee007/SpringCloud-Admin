/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const devCentreRouter = {
  path: '/devcentre',
  component: Layout,
  redirect: '/devcentre/gen',
  name: 'devCentre',
  meta: {
    title: '研发中心',
    icon: 'list'
  },
  children: [
    {
      path: '/devcentre/gen',
      name: 'gen',
      component: () => import('@/views/gen/code/index'),
      meta: {
        title: '生成代码',
        icon: 'list'
      }
    }
  ]
}

export default devCentreRouter
