import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Home2 from '@/view/Home2'
import Saleslist from '@/view/sales/Saleslist'
import MoneyList from '@/view/money/MoneyList'
import MoneyDetail from '@/view/money/MoneyDetail'
import OrderList from '@/view/editOrder/OrderList'
import OrderDetail from '@/view/editOrder/OrderDetail'
import SalesIndex from '@/view/sales/SalesIndex'
import SalesDetail from '@/view/sales/SalesDetail'
import QrCode from '@/view/sales/QrCode'
import StaffManagement from '@/view/staff/StaffManagement'
import Statistics from '@/view/work/Statistics'
import GetData from '@/view/work/GetData'
import NotDo from '@/view/NotToDo/NotDo'
Vue.use(Router)

const route = new Router({
  routes: [
    { 
      path: '/',
      name: '车险销售',
      component: Home2,
      leaf: true,//只有一个节点
      iconCls: 'el-icon-phone',
      image:'./static/images/sales.png',
      imageActive:'./static/images/sales-active.png',
      // redirect:'/Saleslist',
      children:[
        {path:'/Saleslist',name:'销售列表',meta: {title: '车险管理>销售列表'},component:Saleslist,children:[{path:'/Saleslist/SalesDetail',name:'订单详情',component:SalesDetail,meta: {title: '车险管理>订单详情'}}]},
        // {path:'/SalesIndex',name:'销售首页',component:SalesIndex,children:[{path:'/SalesIndex/SalesDetail',name:'订单详情2',component:SalesDetail}]}
      ]
    },
    { 
      path: '/',
      name: '我的待办',
      component: Home2,
      leaf: true,//只有一个节点
      iconCls: 'el-icon-phone',
      image:'./static/images/notDo.png',
      imageActive:'./static/images/notDo-active.png',
      // redirect:'/Saleslist',
      children:[
        {path:'/NotDo',name:'我的待办',meta: {title: '车险管理>我的待办'},component:NotDo,children:[{path:'/Saleslist/SalesDetail',name:'订单详情',component:SalesDetail,meta: {title: '车险管理>订单详情'}}]},
        // {path:'/SalesIndex',name:'销售首页',component:SalesIndex,children:[{path:'/SalesIndex/SalesDetail',name:'订单详情2',component:SalesDetail}]}
      ]
    },
    { 
      path: '/',
      name: '系统录单',
      component: Home2,
      leaf: true,//只有一个节点
      iconCls: 'el-icon-printer',
      image:'./static/images/order.png',
      imageActive:'./static/images/order-active.png',
      children:[
        {path:'/OrderList',name:'录单列表',meta: {title: '车险管理>录单列表'},component:OrderList,children:[{path:'/OrderList/OrderDetail',name:'录单详情',component:OrderDetail,meta: {title: '车险管理>录单详情'}}]},
      ]
    },
    { 
      path: '/',
      name: '打款操作',
      component: Home2,
      leaf: true,//只有一个节点
      iconCls: 'el-icon-edit-outline',
      image:'./static/images/money.png',
      imageActive:'./static/images/money-active.png',
      children:[
        {path:'/MoneyList',name:'打款列表',meta: {title: '车险管理>打款列表'},component:MoneyList,children:[{path:'/MoneyList/MoneyDetail',name:'打款详情',component:MoneyDetail,meta: {title: '车险管理>打款详情'}}]},
      ]
    },
      {
        path: '/',
        component: Home2,
        name: '数据统计',
        iconCls: 'el-icon-zoom-in',
        image:'./static/images/data.png',
        imageActive:'./static/images/data-active.png',
        // leaf: true,//只有一个节点
        children: [
            { path: '/Statistics',meta: {title: '车险管理>数据统计'},component: Statistics, name: '跟进记录' },
            { path: '/GetData',meta: {title: '车险管理>数据统计'},component: GetData, name: '数据指数' }
        ]
    },
    {
      path: '/',
      component: Home2,
      name: '员工管理',
      iconCls: 'el-icon-edit-outline',
      image:'./static/images/staff.png',
      imageActive:'./static/images/staff-active.png',
      leaf: true,//只有一个节点
      children: [
          { path: '/StaffManagement',meta: {title: '员工管理'}, component: StaffManagement, name: '员工管理' }
      ]
  },
  
  {
    path: '/QrCode',
    component: QrCode,
    hidden:true,
    name: '车险报价',
    meta: {title: '车险报价'}
  }
  ]
}
)
import getUrl from '@/assets/js/getUrl.js';
import axios from 'axios'
import Qs from 'qs'
import store from '@/store'
route.beforeEach((to, from, next) => {
  /* 路由发生变化修改页面title */
  
  
  
  if (to.meta.title) {
    document.title = to.meta.title
  }
  next()
})
export default route
