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
import Recording from '@/view/work/Recording'
import CallRecord from '@/view/work/CallRecord'
import NotDo from '@/view/NotToDo/NotDo'
import Login from '@/view/Login/Login'
import testLogin from '@/view/testLogin/testLogin'
import Blacklist from '@/view/blacklist/Blacklist'
import WareHouse from '@/view/wareHouse/WareHouse'
Vue.use(Router)

const route = new Router({
  routes: [
    { 
      path: '/',
      name: '寿险销售',
      component: Home2,
      leaf: true,//只有一个节点
      iconCls: 'el-icon-phone',
      image:'./static/images/sales.png',
      imageActive:'./static/images/sales-active.png',
      // redirect:'/Saleslist',
      meta: {requiresAuth:true},
      children:[
        {path:'/Saleslist',name:'销售列表',meta: {requiresAuth:true,title: '寿险管理>销售列表'},component:Saleslist,children:[{path:'/Saleslist/SalesDetail',name:'订单详情',component:SalesDetail,meta: {requiresAuth:true,title: '寿险管理>订单详情'}}]},
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
      meta: {requiresAuth:true},
      children:[
        {path:'/NotDo',name:'我的待办',meta: {requiresAuth:true,title: '寿险管理>我的待办'},component:NotDo,children:[{path:'/Saleslist/SalesDetail',name:'订单详情',component:SalesDetail,meta: {requiresAuth:true,title: '寿险管理>订单详情'}}]},
        // {path:'/SalesIndex',name:'销售首页',component:SalesIndex,children:[{path:'/SalesIndex/SalesDetail',name:'订单详情2',component:SalesDetail}]}
      ]
    },
      {
        path: '/',
        component: Home2,
        name: '数据统计',
        iconCls: 'el-icon-zoom-in',
        image:'./static/images/data.png',
        imageActive:'./static/images/data-active.png',
        meta: {requiresAuth:true},
        // leaf: true,//只有一个节点
        children: [
            { path: '/Statistics',meta: {requiresAuth:true,title: '寿险管理>数据统计'},component: Statistics, name: '跟进记录' },
            { path: '/Recording',meta: {requiresAuth:true,title: '寿险管理>录音质检'},component: Recording, name: '录音质检' },
            { path: '/CallRecord',meta: {requiresAuth:true,title: '寿险管理>通话统计'},component: CallRecord, name: '通话统计' }
        ]
    },
    {
      path: '/',
      component: Home2,
      name: '员工管理',
      iconCls: 'el-icon-edit-outline',
      image:'./static/images/staff.png',
      imageActive:'./static/images/staff-active.png',
      meta: {requiresAuth:true},
      leaf: true,//只有一个节点
      children: [
          { path: '/StaffManagement',meta: {requiresAuth:true,title: '员工管理'}, component: StaffManagement, name: '员工管理' }
      ]
  },
    {
      path: '/',
      component: Home2,
      name: '名单管理',
      iconCls: 'el-icon-edit-outline',
      image:'./static/images/blacklist.png',
      imageActive:'./static/images/blacklist-active.png',
      meta: {requiresAuth:true},
      leaf: true,//只有一个节点
      children: [
          { path: '/Blacklist',meta: {requiresAuth:true,title: '名单管理'}, component: Blacklist, name: '名单管理' }
      ]
  },
    {
      path: '/',
      component: Home2,
      name: '出单审核',
      iconCls: 'el-icon-edit-outline',
      image:'./static/images/cangku.png',
      imageActive:'./static/images/cangku-active.png',
      meta: {requiresAuth:true},
      leaf: true,//只有一个节点
      children: [
          { path: '/WareHouse',meta: {requiresAuth:true,title: '出单审核'}, component: WareHouse, name: '出单审核' }
      ]
  },
  {
    path: '/QrCode',
    component: QrCode,
    hidden:true,
    name: '车险报价',
    meta: {title: '车险报价'}
  },
  {
    path: '/testLogin',
    component: testLogin,
    hidden:true,
    name: '测试登录页',
    meta: {title: '测试登录页'}
  },
  {
    path: '/Login',
    component: Login,
    hidden:true,
    name: '寿险登录',
    meta: {title: '寿险登录'}
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

route.beforeEach((to, from, next) => {    
  //to即将进入的目标路由对象，from当前导航正要离开的路由， next  :  下一步执行的函数钩子
if(to.path === '/Login')  {
 var timer=null
 if(sessionStorage.getItem('userid')){
//   		alert('已登录,无需再登录');
   timer=setInterval(()=>{
     next({ path: '/' })
   },10)
 }
 next()
 }  // 如果即将进入登录路由，则直接放行
else {     //进入的不是登录路由
    if(to.meta.requiresAuth && !sessionStorage.getItem('userid')) {
       
      next({ path: '/Login' })
    } 
    //下一跳路由需要登录验证，并且还未登录，则路由定向到  登录路由
    else { next() }}  //如果不需要登录验证，或者已经登录成功，则直接放行
});
export default route
