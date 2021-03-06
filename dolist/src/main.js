// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import VueRouter from 'vue-router';
import VueResource from 'vue-resource'
import goods from './components/goods/goods'
import ratings from './components/ratings/ratings.vue'
import seller from './components/seller/seller.vue'

import "common/stylus/index.styl";

Vue.config.productionTip = false;

Vue.use(VueRouter);
Vue.use(VueResource);

const routes = [
  { path: '/goods', component: goods },
  { path: '/ratings', component: ratings },
  { path: '/seller', component: seller }
]

const router = new VueRouter({
   routes, // （缩写）相当于 routes: routes
  linkActiveClass: 'active'
});

router.push('/goods');//指向特定的页面

new Vue({
  el: '#app',
  router,
  render: h => h(App)
});









