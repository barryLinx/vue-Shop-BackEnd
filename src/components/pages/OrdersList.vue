<template>
<div>
  <loading :active.sync="isLoading"></loading>
   
    <table class="table mt-4">
      <thead>
        <th width="120">購買時間</th>
        <th width="120">Email</th>
        <th >購買款項</th>
        <th width="120">應付金額</th>
        <th width="120">付款方式</th>
        <th width="120">是否付款</th>      
        <th >留言訊息</th>  
        <th width="120">操作</th>   
      </thead>
      <tbody>
        <tr v-for="(item,idx) in orders" :key="idx">
           <td>{{ moment(item.paid_date).format('YYYY/MM/DD') }} </td>
            <td>{{ item.user.email }} </td>
             <td  >
               <div class="" v-for="(prods, index) in item.products" :key="index">
                <p class="font-weight-bold h6">{{prods.product.title}} : <span class="text-secondary h5"> {{prods.qty}}</span> / <span class="badge badge-info">{{prods.product.unit}}</span></p> 
                <!-- <p class="h6">{{prods.qty}} / <span class="badge badge-info">{{prods.product.unit}}</span> </p>  -->
                  
               </div>             

             </td>
             <td class="text-right">
               {{ item.total |  currency }}
             </td>
             <td>
               信用卡
             </td>
                <td>
               <span v-if="item.is_paid" class="text-success">已付款</span>
               <span v-else  class="text-danger">未付款</span>
             </td>
             <td>
              <p>{{item.message}}</p> 
             </td>
             <td>
               <button class="btn btn-outline-primary btn-sm" @click="openModal(item)" >編輯</button>
              
             </td>
        </tr>
      </tbody>
    </table>
    <!-- 分頁 -->
     <pagination   :paginationObj="pagination"  @sendApiSource = "getSoruce"/>


<!-- Modal -->
<div class="modal fade " id="orderModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-lg" role="document">
    <div class="modal-content">
      <div class="modal-header bg-dark text-white">
        <h5 class="modal-title " id="exampleModalLabel">修改訂單</h5>
        <button type="button" class="close text-white" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
       <div class="row">
        
         
         <div class="col">
            <div class="form-group">
               <label for="name">客戶姓名</label>
               <input type="text" class="form-control" id="name" 
                v-model="tempOrder.user.name"
               placeholder="請輸入客戶姓名">
             </div>

              <div class="form-group">
               <label for="tel">客戶電話</label>
               <input type="text" class="form-control" id="tel" 
                v-model="tempOrder.user.tel"
               placeholder="請輸入客戶電話">
             </div>

              <div class="form-group">
               <label for="email">E-mail</label>
               <input type="text" class="form-control" id="email" 
                v-model="tempOrder.user.email"
               placeholder="請輸入信箱">
             </div>

              <div class="form-group">
               <label for="address">地址</label>
               <input type="text" class="form-control" id="address" 
                v-model="tempOrder.user.address"
               placeholder="請輸入客戶地址">
             </div>
             <div class="form-group">
               <label for="address">留言訊息</label>
               <textarea 
                 type="text" class="form-control" id="content"
                 v-model="tempOrder.message"
                  placeholder="請輸入留言訊息"> 
               </textarea>
             </div>
            <hr>
            <div class="row" >
              <div class="col-4">
                 <ol>
                    <label class="mr-3" for="title"> 購買款項</label>
                    <li class="mb-3" v-for="(prodId, index) in tempOrder.products" :key="index" >
                       <input type="text" class="form-control mr-3" disabled
                        v-model="prodId.product.title" placeholder="產品名稱">
                    </li>
                 </ol>
              </div>
              
             <div class="col-4">
                <ul>
                    <label class="mr-3" for="pay">小計</label>
                    <li class="mb-3" v-for="(prodId, index) in tempOrder.products" :key="index" >
                       <input type="text" class="form-control mr-3" disabled
                         v-model="prodId.final_total" placeholder="金額">
                    </li>
                </ul>
             </div>
             <div class="col-4">
                <ul>
                    <label class="mr-3" for="pay">數量</label>
                    <li class="mb-3" v-for="(prodId, index) in tempOrder.products" :key="index" >
                       <select class="form-control" @change="calculate(prodId)"  v-model="prodId.qty">
                         <option :value="item" v-for="(item, index) in prodId.product.num" :key="index">{{item}}</option>
                       </select>
                       <!-- <input type="number" class="form-control mr-3"  
                         v-model="prodId.qty" placeholder="數量"> -->
                    </li>
                </ul>
             </div>
               
            </div>
            
        <div class="form-group ">
          <div class="d-flex flex-row justify-content-center align-items-center">
              <label class="mr-3" for="">應付款金額</label>          
               <h3 class="text-primary">${{tempOrder.total}}</h3> 
          </div>  </div>
         
       
              <div class="form-group ">
                  <div class="form-check">
                      <div class="custom-control custom-checkbox mb-3">
                         <input type="checkbox" class="custom-control-input"
                            v-model="tempOrder.is_paid"
                            :true-value= "1"
                           :false-value= "0"
                            id="is_enabled" >
                       <label class="custom-control-label" for="is_enabled">是否付款</label>   
                    </div>                    
                  </div>     
                        
               </div>
         </div>
            
         </div>
       </div>
           <div class="modal-footer">
             <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
            <button type="button" class="btn btn-primary" @click="updateOrder">確認</button> 
          </div>
        
      </div>
     
    
    </div>
  </div>
  



</div>



</template>

<script>
import $ from "jquery";
import moment from "moment";
import pagination from '@/components/pageination';
export default {
   components:{
     pagination,   
  },
  data(){
    return{
      moment:moment,
      orders:[],
      isLoading:false,
       pagination:{},
       tempOrder:{
        
         user:{}
       }
    };
  },
  computed:{
   
  },
  methods:{
    getSoruce(page = 1){
       const vm =this;
       const api = `${process.env.APIPATH}/api/${process.env.BARRYPATH}/admin/orders?page=${page}`;
       vm.isLoading = true;
       this.$http.get(api).then((response)=>{
          console.log(response);
        if (response.data.success) {            
            console.log(response.data);
            vm.isLoading = false;
            vm.orders = response.data.orders;   
             vm.pagination = response.data.pagination;     
             //找出object.keys()
             //vm.$bus.$emit('messsage:push',response.data.message,'success');
          }
       });
    },
    openModal(item){  
        const vm = this;
        vm.tempOrder = Object.assign({},item); //  this.tempOrder = item; 必免物件參考到同一個 item的位址 ， 另外給空物件 
        console.log('tempOrder', vm.tempOrder);
        $("#orderModal").modal("show");
    },
    updateOrder(){
      const vm = this;
      let api = `${process.env.APIPATH}/api/${process.env.BARRYPATH}/admin/order/${vm.tempOrder.id}`;
       console.log('送出');
      this.$http.put(api,{data: vm.tempOrder}).then(response =>{
         console.log(response.data);
         if (response.data.success) {
            vm.getSoruce();
             $('#orderModal').modal('hide');
            console.log(response.data);
             vm.$bus.$emit('messsage:push',response.data.message,'success');
         }
       
      })
    },
     calculate(prodId){
       const vm = this;
       let calcTotal = 0;
     
        if (prodId.hasOwnProperty('coupon')) {
          console.log('yes');
           prodId.total =  prodId.qty *  prodId.product.price;
           prodId.final_total =  prodId.total * (prodId.coupon.percent/100); 

           console.log(' vm.tempOrder.products', vm.tempOrder.products);
            
        }else{
           prodId.total =  prodId.qty *  prodId.product.price;
            prodId.final_total = prodId.total;
           console.log('No');
        }

         if (vm.tempOrder.user !== {}) {
                Object.keys(vm.tempOrder.products).map(function(objectKey, index) {
                   let prod = vm.tempOrder.products[objectKey];
                   calcTotal += prod.final_total;
                   //console.log('value',value);
              });
           }       
           vm.tempOrder.total = calcTotal
    
       

    }
  },
  computed:{
     calcTotal(){
         const vm = this;
         let calcTotal = 0;
         if (vm.tempOrder.user !== {}) {
             Object.keys(vm.tempOrder.products).map(function(objectKey, index) {
                let prod = vm.tempOrder.products[objectKey];
               calcTotal += prod.final_total;
                //console.log('value',value);
           });
         }       
          return calcTotal;
     }
  },
  created(){
    this.getSoruce();

  },
}
</script>

<style scoped>
 
</style>




