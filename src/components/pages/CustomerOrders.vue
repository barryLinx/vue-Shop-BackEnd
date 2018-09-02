<template>
  <div>
     <loading :active.sync="isLoading"></loading>
<div class="row mt-4">
  <div class="col-md-4 mb-4" v-for="item in products" :key="item.id">
   <div class="card border-0 shadow-sm">
      <div style="height: 150px; background-size: cover; background-position: center"
      :style="{backgroundImage: `url(${item.imageUrl})`}" >
  </div>
    <div class="card-body">
      <span class="badge badge-secondary float-right ml-2">{{item.category}}</span>
      <h5 class="card-title">
        <a href="#" class="text-dark">{{item.title}}</a>
      </h5>
      <p class="card-text">{{item.description}}</p>
      <div class="d-flex justify-content-between align-items-baseline">
        <!-- <div class="h5">2,800 元</div> -->
        <!-- 僅顯示原價 -->
         <div class="h5" v-if="!item.price"> {{item.origin_price}} 元</div>
         <!-- 僅顯示原價 + 優惠價 -->
        <del class="h6" v-if="item.price">原價 {{item.origin_price}} 元</del>       
        <div class="h5" v-if="item.price">售價 {{item.price}} 元</div>
      </div>
    </div>
    <div class="card-footer d-flex">
      <button type="button" class="btn btn-outline-secondary btn-sm"
        @click="getProduct(item.id)"
      >
        <i class="fas fa-spinner fa-spin" v-if="status.loadingItem === item.id"></i>
        查看更多
      </button>
      <button type="button" class="btn btn-outline-danger btn-sm ml-auto"
        @click="addtoCart(item.id)" >
        <i class="fas fa-spinner fa-spin" v-if="status.loadingItem === item.id"></i>
        加到購物車
      </button>
    </div>
  </div>
 </div>
</div>
<!-- productModal-->

<div class="modal fade " id="productModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-lg" role="document">
    <div class="modal-content">
      <div class="modal-header bg-dark text-white">
        <h5 class="modal-title " id="exampleModalLabel">{{ product.title}}</h5>
        <button type="button" class="close text-white" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>

      <div class="modal-body">
          <img :src="product.imageUrl" class="img-fluid" alt="">
            <blockquote class="blockquote mt-3">
              <p class="mb-0" >{{ product.content }}</p>
              <footer class="blockquote-footer text-right">{{ product.description }}</footer>
            </blockquote>
            <div class="d-flex justify-content-between align-items-baseline">
              <div class="h4" v-if="!product.price">{{ product.origin_price }} 元</div>
              <del class="h6" v-if="product.price">原價 {{ product.origin_price }} 元</del>
              <div class="h4" v-if="product.price">現在只要 {{ product.price }} 元</div>
            </div>
            <select name="" class="form-control mt-3" v-model="product.num">
              <option :value="num" v-for="num in 10" :key="num">
                選購 {{num}} {{product.unit}}
              </option>
            </select>
       </div> 
         <div class="modal-footer">
         <div class="text-muted text-nowrap mr-3">
              小計 <strong>{{ product.num * product.price }}</strong> 元
            </div>
            <button type="button" class="btn btn-primary"
              @click="addtoCart(product.id, product.num)">
              <i class="fas fa-spinner fa-spin" v-if="product.id === status.loadingItem"></i>
               加到購物車
             </button>
      </div>       
      </div>

    
    </div>
  </div>
 
     <table class="table">
  <thead>
    <th></th>
    <th>品名</th>
    <th>數量</th>
    <th>單價</th>
  </thead>
  <tbody>
    <tr v-for="item in cart.carts" :key="item.id">
      <td class="align-middle">
        <button type="button" class="btn btn-outline-danger btn-sm"
          @click="removeCartItem(item.id)"
        >
          <i class="far fa-trash-alt"></i>
        </button>
      </td>
      <td class="align-middle">
        {{ item.product.title }}
        <div class="text-success" v-if="item.coupon">
          已套用優惠券
        </div>
      </td>
      <td class="align-middle">{{ item.qty }}/{{ item.product.unit }}</td>
      <td class="align-middle text-right">{{ item.final_total|currency }}</td>
    </tr>
  </tbody>
  <tfoot>
    <tr>
      <td colspan="3" class="text-right">總計</td>
      <td class="text-right">{{ cart.total|currency  }}</td>
    </tr>
    <tr v-if="cart.final_total !==  cart.total">
      <td colspan="3" class="text-right text-success">折扣價</td>
      <td class="text-right text-success">{{ cart.final_total|currency }}</td>
    </tr>
  </tfoot>
</table>
<div class="input-group mb-3 input-group-sm">
  <input type="text" class="form-control" placeholder="請輸入優惠碼"
    v-model="coupon_code"
  >
  <div class="input-group-append">
    <button class="btn btn-outline-secondary" type="button"
       @click="addcoupon"
     >
      套用優惠碼
    </button>
  </div>
</div>

<div class="my-5 row justify-content-center">
  <form class="col-md-6" @submit.prevent="createOrder">
    <div class="form-group">
      <label for="useremail">Email</label>
      <input type="email" class="form-control" name="email" id="useremail"
        v-model="form.user.email"  v-validate="'required|email'" placeholder="請輸入 Email" >
      <span class="text-danger" v-if="errors.has('email')" >
        {{errors.first('email')}}
      </span>
    </div>
  
    <div class="form-group">
      <label for="username">收件人姓名</label>
      <input type="text" class="form-control" name="name" id="username"
        v-model="form.user.name" 
        v-validate="'required'" 
        :class="{'is-invalid':errors.has('name')}"
        placeholder="輸入姓名">
      <span class="text-danger" v-if="errors.has('name')">姓名必需輸入</span>
    </div>
  
    <div class="form-group">
      <label for="usertel">收件人電話</label>
      <input type="tel" class="form-control" id="usertel" name="tel"
         v-validate="'required'" 
        :class="{'is-invalid':errors.has('tel')}"
        v-model="form.user.tel" placeholder="請輸入電話">
        <span class="text-danger"  v-if="errors.has('tel')">電話不得留空</span>
    </div>
  
    <div class="form-group">
      <label for="useraddress">收件人地址</label>
      <input type="address" class="form-control" name="address" id="useraddress"
       v-model="form.user.address"
       v-validate="'required'"
        :class="{'is-invalid':errors.has('address')}"
        placeholder="請輸入地址">
      <span class="text-danger"  v-if="errors.has('address')">地址欄位不得留空</span>
    </div>
  
    <div class="form-group">
      <label for="useraddress">留言</label>
      <textarea name="" id="" class="form-control" cols="30" rows="10" v-model="form.message"></textarea>
    </div>
    <div class="text-right">
      <button class="btn btn-danger">送出訂單</button>
    </div>
  </form>
</div>

<p>
  <a class="btn btn-primary  dropdown-toggle" data-toggle="collapse" href="#multiCollapseExample1" role="button" aria-expanded="false" aria-controls="multiCollapseExample1">Toggle first element</a>
  <button class="btn btn-primary" type="button" data-toggle="collapse" data-target="#multiCollapseExample2" aria-expanded="false" aria-controls="multiCollapseExample2">Toggle second element</button>
  <button class="btn btn-primary" type="button" data-toggle="collapse" data-target=".multi-collapse" aria-expanded="false" aria-controls="multiCollapseExample1 multiCollapseExample2">Toggle both elements</button>
</p>
<div class="row">
  <div class="col">
    <div class="collapse multi-collapse" id="multiCollapseExample1">
      <div class="card card-body">
        Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident.
      </div>
    </div>
  </div>
  <div class="col">
    <div class="collapse multi-collapse" id="multiCollapseExample2">
      <div class="card card-body">
        Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident.
      </div>
    </div>
  </div>
</div>

 <div class="card">
            <div class="card-header" id="headingOne">
              <div class="mb-0 d-flex justify-content-end ">
                <button class="btn btn-link mr-auto   dropdown-toggle" type="button" data-toggle="collapse" data-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                  顯示購物車細節     
                </button>
                <span class="h3 ml-auto font-weight-bold">${{cart.total}}</span>            
              </div>                
              </div>                
          </div>
          <div id="collapseOne" class="collapse show" aria-labelledby="headingOne" data-parent="#accordion">        
              <table class="table table-sm">
                  <thead>
                      <tr>
                       <th width="30"><button class="btn btn-danger" @click.prevent="removeAll">全部清空</button></th>
                       <th width="100"></th>
                       <th>商品名稱</th>
                       <th width="100">數量</th>
                       <th width="80">小計</th> 
                      </tr>
                    </thead>
                  <tbody>
                    <tr v-for="(item, index) in cart.carts" :key="index">
                      <td class="text-center align-middle">
                        <a href="#" @click.prevent="removeCartItem(item.id)" class="text-dark" data-toggle="modal" data-target="#exampleModal" data-goodsname="金牌西裝" data-count="1" data-moeny="632">
                          <i class="fas fa-trash"></i></a>                         
                      </td>
                      <td><img class="image-wh" :src="item.product.imageUrl" alt=""> </td>                    
                      <td class="align-middle">{{item.product.title}}</td>
                      <td class="align-middle">{{item.qty}}/{{item.product.unit}}</td>
                      <td class="align-middle text-right">${{item.total}}</td>
                    </tr>
                  
                  </tbody>
                  <tfoot>
                  
                    <tr>
                        <td class="text-right font-weight-bold" colspan="4">總金額</td>
                        <td class="font-weight-bold text-right">${{cart.total}}</td>
                      </tr>
                      <tr v-if="cart.final_total !==  cart.total">
                        <td colspan="3" class="text-right text-success">折扣價</td>
                         <td class="text-right text-success">{{ cart.final_total|currency }}</td>
                     </tr>
                  </tfoot>
                </table>
          </div>

</div>
 
</template>

<script>

import $ from 'jquery';

export default {
  data(){
    return{
      products:[],
      product:[],
      cart:[],
      form:{
        user:{
          name:'',
          email:'',
          tel:'',
          address:'',
        },
        message:'',
      },
      status:{
        loadingItem:'', //哪個元素正在讀取中
      },
      isLoading:false,//讀取效果
      coupon_code:'',
    };
  },
  created(){
    this.getProducts();
    this.getCart();
  },
  methods:{
    getProducts(page){
      const vm = this;
      const url = `${process.env.APIPATH}/api/${process.env.BARRYPATH}/products?page=${page}`;
      vm.isLoading = true ;
      this.$http.get(url).then((res)=>{
        console.log(res.data);
        vm.products = res.data.products;
        vm.isLoading = false ;
      });
    },
    getProduct(id){
      const vm = this;
      const url = `${process.env.APIPATH}/api/${process.env.BARRYPATH}/product/${id}`;
      vm.status.loadingItem = id ;
      this.$http.get(url).then((res)=>{
        $('#productModal').modal('show');
        vm.product = res.data.product;
         console.log(res.data.product);
        vm.status.loadingItem = '' ; //讀取動畫歸零
      });
    },
    addcoupon(){
      const vm = this;
      const url = `${process.env.APIPATH}/api/${process.env.BARRYPATH}/coupon`;
     
      const coupon ={
        code : vm.coupon_code        
      };
      vm.isLoading = true;
      this.$http.post(url,{data:coupon}).then((res)=>{          
         console.log(res);         
         vm.getCart(); //取回購物車狀態
         vm.isLoading = false;
      });
    },
    addtoCart(id,qty = 1){
      const vm = this;
      const url = `${process.env.APIPATH}/api/${process.env.BARRYPATH}/cart`;
      vm.status.loadingItem = id ;
      const cart ={
        product_id : id,
        qty
      };
      this.$http.post(url,{data:cart}).then((res)=>{          
         console.log(res);
          vm.status.loadingItem = '' ; //讀取完歸零
          vm.getCart(); //取回購物車狀態
          $('#productModal').modal('hide');
      });
    },
    getCart(){
      const vm = this ;
      const url =`${process.env.APIPATH}/api/${process.env.BARRYPATH}/cart`;
       this.$http.get(url).then((res)=>{
        //$('#productModal').modal('show');         
          console.log(res);
          vm.cart = res.data.data;
        
          vm.isLoading = false ; //讀取完歸零
         
      });
    },
    removeCartItem(id){
       const vm = this ;
      const url =`${process.env.APIPATH}/api/${process.env.BARRYPATH}/cart/${id}`;
      vm.isLoading = true ; //讀取完歸零
       this.$http.delete(url).then((res)=>{         
          console.log(res);        
          vm.getCart();  
          vm.isLoading = false ; //讀取完歸零
         
      });

    },
    createOrder(){
      const vm = this;
      const url = `${process.env.APIPATH}/api/${process.env.BARRYPATH}/order`;
      const order= vm.form;
      vm.isLoading = true;
    
       this.$validator.validate().then((result) => { //vee-validate 驗證
        if (result) {
          // do stuff if not valid.
          this.$http.post(url,{data: order}).then((res)=>{
               console.log('訂單已建立',res);      
               if (res.data.success) {
                 vm.$router.push(`/customer_check/${res.data.orderId}`);
                  vm.isLoading = false ; //讀取完歸零
               }  
                       
           });
        }else{
           console.log('欄位不完整');  
           vm.isLoading = false ; //讀取完歸零   
        }
      });
      
    },
  }
}
</script>
