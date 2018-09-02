import Vue from 'vue'
import Router from 'vue-router'

import Dashboard from '@/components/Dashboard'
import Login from '@/components/pages/Login'
import Products from '@/components/pages/Products'
import CustomerOrder from '@/components/pages/CustomerOrders'
import  Coupon from '@/components/pages/coupon' 
import  CustomerCheckout from '@/components/pages/CustomerCheckout' 
import  OrderList from '@/components/pages/OrdersList' 

Vue.use(Router)

export default new Router({
  routes: [
    {
      path:'*',
      redirect:'signin',
    },
    // {
    //   path: '/',
    //   name: 'HelloWorld',
    //   component: HelloWorld,
    //   meta:{ requiresAuth: true}  //進入需要驗證
    // },
    {
      path:'/signin',
      name: 'Login',
      component:Login,
    },
    {
      path:'/admin',
      name:'Dashboard',
      component: Dashboard,
      meta:{ requiresAuth: true},  //進入需要驗證
      children:[
        {
          path:'products',
          name:'products',
          component: Products,
          meta:{ requiresAuth: true,  }
        },
        {
          path:'coupons',
          name:'Coupon',
          component: Coupon,
          meta:{ requiresAuth: true,  }
        },
        {
          path:'orderslist',
          name:'OrderList',
          component: OrderList,
          meta:{ requiresAuth: true,  }
        }      
      ],
    },
    // {
    //   path:'/',
    //   name:'Dashboard',
    //   component: Dashboard,
    //   //  meta:{ requiresAuth: true},  //進入需要驗證
    //   children:[
    //     {
    //       path:'customer_order',
    //       name:'CustomerOrder',
    //       component: CustomerOrder,
         
    //     },
    //     {
    //       path:'customer_check/:orderId',
    //       name:'CustomerCheckout',
    //       component: CustomerCheckout,
         
    //     },
        
    //   ],
    // }

  ]
})
