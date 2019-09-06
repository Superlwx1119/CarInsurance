// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import $ from 'jquery'
import axios from 'axios'
import store from '@/store'
import '@/assets/css/font_ptepfdxni4l/iconfont.css';
import '@/assets/css/font_ygwxot8zhld/iconfont.css';
import html2canvas from 'html2canvas'
import Qs from 'qs'
import QRCode from 'qrcodejs2'
import getUrl from '@/assets/js/getUrl.js';
import Vant from 'vant';
import 'vant/lib/index.css';
import echarts from 'echarts'
import '@/assets/css/font_fpw4b5xnse9/iconfont.css';

Vue.use(Vant);
Vue.config.productionTip = false
Vue.prototype.$html2canvas = html2canvas 
Vue.prototype.$axios = axios 
Vue.prototype.$store = store 
Vue.prototype.$getUrl = getUrl 
Vue.prototype.$Qs = Qs 
Vue.prototype.$echarts = echarts
Vue.use(ElementUI);
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
