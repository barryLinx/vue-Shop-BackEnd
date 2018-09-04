<template>
  <div>
    <loading :active.sync="isLoading"></loading>
    <div class="text-right">
      <button class="btn btn-primary mt-4" @click="openModal(true)"> 建立新優惠劵 </button>
    </div>
   
    <table class="table mt-4">
      <thead>        
        <th>名稱</th>
        <th>優惠碼</th>
        <th width="120">折扣百分比</th>
        
        <th width="120">到期日</th>
        <th width="120">是否啟用</th>
        <th width="120">操作</th>
      </thead>
      <tbody>
        <tr v-for="item in coupons" :key="item.id">
          
            <td>{{ item.title }}</td>
            <td>{{ item.code }}</td>
             <td class="text-right">
               {{ item.percent}}%
             </td>
             
             <td >
               {{ moment(item.due_date).format('YYYY/MM/DD') }}
             </td>
             <td>
               <span v-if="item.is_enabled" class="text-success">啟用</span>
               <span v-else  class="text-danger">未啟用</span>
             </td>
             <td>
               <button class="btn btn-outline-primary btn-sm" @click="openModal(false,item)">編輯</button>
               <button class="btn btn-outline-danger btn-sm" @click="openRemove(item)">刪除</button>
             </td>
        </tr>
      </tbody>
    </table>
     
<div class="modal fade " id="couponModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-lg" role="document">
    <div class="modal-content">
      <div class="modal-header bg-dark text-white">
        <h5 class="modal-title " id="exampleModalLabel">新增優惠卷</h5>
        <button type="button" class="close text-white" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
      

             <div class="form-group">
               <label for="title">標題</label>
               <input type="text" class="form-control" id="title" 
                v-model="tempCoupon.title"
               placeholder="請輸入標題">
             </div>

             <div class="form-group">
               <label for="title">優惠碼</label>
               <input type="text" class="form-control" id="title" 
                v-model="tempCoupon.code"
               placeholder="請輸入優惠碼">
             </div>

             <div class="form-row">               
                <div class="form-group col-md-6">
                  <label for="percent">折扣</label>
                  <input type="number" class="form-control" 
                    id="percent" 
                   v-model="tempCoupon.percent"
                  placeholder="請輸入折扣">
                </div>
                 <div class="form-group col-md-6">
                  <label for="num">數量</label>
                  <input type="number" class="form-control" id="num" 
                   v-model="tempCoupon.num"
                  placeholder="請輸入數量">
                </div>
             </div>
            

             <div class="form-group">
               <label for="title">到期日</label>
               <DatePicker class="w-100" v-model="tempCoupon.due_date" format="YYYY-MM-DD" />
             </div>
            
              <hr>            
                <div class="form-group ">
                  <div class="form-check">
                       <input class="form-check-input" type="checkbox" 
                        v-model="tempCoupon.is_enabled"
                       :true-value= "1"
                       :false-value= "0"
                       id="is_enabled">
                     <label class="form-check-label" for="is_enabled">
                       是否啟用
                     </label>
                  </div>            
                </div>
      </div>
      
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
        <button type="button" class="btn btn-primary" @click="addCoupon">確認</button>
      </div>

    </div>
  </div>
</div>

<div class="modal fade" id="delCouponModal" tabindex="-1" role="dialog"
  aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog" role="document">
    <div class="modal-content border-0">
      <div class="modal-header bg-danger text-white">
        <h5 class="modal-title" id="exampleModalLabel">
          <span>刪除產品</span>
        </h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        是否刪除 <strong class="text-danger">{{ tempCoupon.title }}</strong> 商品(刪除後將無法恢復)。
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-outline-secondary" data-dismiss="modal">取消</button>
        <button type="button" class="btn btn-danger" @click="delCoupon">確認刪除</button>
      </div>
    </div>
  </div>
</div>


  </div>
</template>

<script>
import $ from "jquery";
import moment from "moment";
import DatePicker from 'vue2-datepicker';


export default {
  components:{
    DatePicker,
   
  },
  name:'Coupon',
  data(){
    return{
      moment:moment,
      coupons:[],
      tempCoupon:{
       percent:100
      },
      isLoading:false,
      isNew:false,
    }     
  },
  computed:{  
   
  },
  created(){
    this.getCoupon();
  },

  methods:{
    getCoupon(page = 1){
       const vm =this;
       const api = `${process.env.APIPATH}/api/${process.env.BARRYPATH}/admin/coupons?page=${page}`;
       this.$http.get(api).then((response)=>{
          //console.log(response.data);
        if (response.data.success) {    
        
            console.log(response.data.coupons);
            vm.coupons = response.data.coupons;
          // vm.getProducts();
          //vm.$bus.$emit('messsage:push',response.data.message,'success');
        }else{
          //vm.$bus.$emit('messsage:push',response.data.message,'danger');
            //console.log('新增失敗');
        }
       });
    },
    openModal(isNew,item){
       const vm =this;
      if (isNew) {             //新增新的資料
        vm.tempCoupon = {};  
        vm.isNew = true;
      }else{
        vm.tempCoupon = Object.assign({},item);                                             //  this.tempProduct = item; 必免物件參考到同一個 item的位址 ， 另外給空物件 
         vm.tempCoupon.due_date =  moment(vm.tempCoupon.due_date).format('YYYY/MM/DD');    //   new Date(timestamp); 
         vm.isNew = false;
      }       
      $("#couponModal").modal("show");
    },
     openRemove(item){
        this.tempCoupon = Object.assign({},item);               
        console.log('item',item.id);
       $('#delCouponModal').modal('show');  
    },
    addCoupon(){
       const vm = this;
       let api = `${process.env.APIPATH}/api/${process.env.BARRYPATH}/admin/coupon`;
      let httpMethod = 'post';
       // console.log('vm.tempCoupon.percent',typeof(vm.tempCoupon.percent));
       vm.tempCoupon.percent = Number( vm.tempCoupon.percent);
       vm.tempCoupon.due_date = new Date(vm.tempCoupon.due_date).getTime();
       console.log(vm.tempCoupon.due_date);
       //console.log(vm.tempCoupon.percent);
       //console.log('vm.tempCoupon.percent',typeof(vm.tempCoupon.percent));
        if (!vm.isNew) {
         api = `${process.env.APIPATH}/api/${process.env.BARRYPATH}/admin/coupon/${vm.tempCoupon.id}`;
         httpMethod = 'put';          
       }

      // //優惠碼重複
      //   if (condition) {
          
      //   }

       this.$http[httpMethod](api,{data:vm.tempCoupon}).then((response) => {
          if (response.data.success) {
             $('#couponModal').modal('hide');
             vm.getCoupon();
             vm.$bus.$emit('messsage:push',response.data.message,'success');
          }else{
            vm.$bus.$emit('messsage:push',response.data.message,'danger');
            console.log('新增失敗');
          }
      
       });
       
   
    },    
     delCoupon(){
       const vm = this;
         let api = `${process.env.APIPATH}/api/${process.env.BARRYPATH}/admin/coupon/${vm.tempCoupon.id}`;
            //console.log('coupon',coupon.id);
         this.$http.delete(api).then((response)=>{
            if (response.data.success) {
                vm.getCoupon();
                vm.$bus.$emit('messsage:push',response.data.message,'success');
                $('#delCouponModal').modal('hide');  
            }
            else{
            vm.$bus.$emit('messsage:push',response.data.message,'danger');
            console.log('刪除失敗');
          }

         });
       
     }
  },
}
</script>
