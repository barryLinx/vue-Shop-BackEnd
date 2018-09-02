<template>
  <div>

    <loading :active.sync="isLoading"></loading>
    <div class="text-right">
      <button class="btn btn-primary mt-4" @click="openModal(true)"> 建立新產品 </button>
    </div>
    <table class="table mt-4">
      <thead>
        <th width="120">分類</th>
        <th>產品名稱</th>
        <th width="120">原價</th>
        <th width="120">售價</th>
        <th width="120">是否啟用</th>
        <th width="120">操作</th>
      </thead>
      <tbody>
        <tr v-for="(item,idx) in products" :key="idx">
           <td>{{ item.category }}</td>
            <td>{{ item.title }}</td>
             <td class="text-right">
               {{ item.origin_price |  currency}}
             </td>
             <td class="text-right">
               {{ item.price |  currency }}
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

  <!-- 分頁 -->
   <pagination   :paginationObj="pagination"  @sendApiSource = "getSoruce"/>

<!-- Modal -->
<div class="modal fade " id="productModal"  role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-lg" role="document">
    <div class="modal-content">
      <div class="modal-header bg-dark text-white">
        <h5 class="modal-title " id="exampleModalLabel">新增產品</h5>
        <button type="button" class="close text-white" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
       <div class="row">
         <div class="col-sm-4">
           <div class="form-group">
              <label for="image">輸入圖片網址</label>
              <input type="text" class="form-control" id="image"
               v-model="tempProduct.imageUrl"
               placeholder="請輸入圖片連結">
           </div>
            <div class="form-group">
              <label for="Upimage">或上傳圖片
                <i class="fas fa-spinner fa-spin" v-if="status.fileUploading"></i>
              </label>
              <input type="file" class="form-control" ref="files"
               
              @change="uploadFile"
              id="Upimage" 
             
              placeholder="請輸入圖片連結">
           </div>
           <img :src="tempProduct.imageUrl"
              class="img-fluid" alt="">
         </div>
         <div class="col-sm-8">
             <div class="form-group">
               <label for="title">標題</label>
               <input type="text" class="form-control" id="title" 
                v-model="tempProduct.title"
               placeholder="請輸入標題">
             </div>

             <div class="form-row">               
                <div class="form-group col-md-6">
                  <label for="category">分類</label>
                  <input type="text" class="form-control" id="category" 
                   v-model="tempProduct.category"
                  placeholder="請輸入分類">
                </div>
                 <div class="form-group col-md-6">
                  <label for="unit">單位</label>
                  <input type="text" class="form-control" id="unit" 
                   v-model="tempProduct.unit"
                  placeholder="請輸入單位">
                </div>
             </div>

             <div class="form-row"> 

                <div class="form-group col-md-6">
                  <label for="origin_price">原價</label>
                  <input type="text" class="form-control" id="origin_price" 
                   v-model="tempProduct.origin_price"
                  placeholder="請輸入原價">
                </div>

                 <div class="form-group col-md-6">
                  <label for="price">售價</label>
                  <input type="text" class="form-control" id="price" 
                   v-model="tempProduct.price"
                  placeholder="請輸入售價">
                </div>
               

             </div>
              <hr>
              <div class="form-group ">
                  <label for="description">產品描述</label>
                  <textarea type="text" class="form-control" id="description"
                    v-model="tempProduct.description"
                   placeholder="請輸入產品描述">                     
                  </textarea>                
                </div>

                <div class="form-group ">
                    <label for="content">說明內容</label>
                    <!-- <CKedior @updateCKEdir="updateCKEdirData" :pcontent="tempProduct.content" /> -->
                    <vue-ckeditor v-model="tempProduct.content" :config="config"  />
                     <!-- <textarea type="text" class="form-control" id="content"
                      v-model="tempProduct.content"
                      placeholder="請輸入說明內容">                     
                    </textarea> -->
                </div>

                <div class="form-group ">
                  <div class="form-check">
                       <input class="form-check-input" type="checkbox" 
                        v-model="tempProduct.is_enabled"
                       :true-value= "1"
                       :false-value= "0"
                       id="is_enabled">
                     <label class="form-check-label" for="is_enabled">
                       是否啟用
                     </label>
                  </div>            
                </div>
         </div>
       </div>

        
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
        <button type="button" class="btn btn-primary" @click="updateProduct">確認</button>
      </div>
    </div>
  </div>
</div>

<!-- delete Modal -->
<div class="modal fade" id="delProductModal" tabindex="-1" role="dialog"
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
        是否刪除 <strong class="text-danger">{{ tempProduct.title }}</strong> 商品(刪除後將無法恢復)。
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-outline-secondary" data-dismiss="modal">取消</button>
        <button type="button" class="btn btn-danger" @click="reMoveItem">確認刪除</button>
      </div>
    </div>
  </div>
</div>
  </div>
</template>
<script>
import $ from "jquery";
import pagination from '@/components/pageination';
import CKedior from '@/components/CKedior';
import VueCkeditor from 'vue-ckeditor2';

export default {
  components:{
     pagination,
     CKedior,
     VueCkeditor
  },
  data() {
    return {
      products: [],
      pagination:{},
      tempProduct:{
        
      },
      isNew:false,
      isdelete:false,
      isLoading:false, //讀取校效果
      status:{
        fileUploading: false,
      },
      config: {
        toolbar: [
           [ 'Source', '-', 'Save', 'NewPage', 'Preview', 'Print', '-', 'Templates' ],
          [ 'Cut', 'Copy', 'Paste', 'PasteText', 'PasteFromWord', '-', 'Undo', 'Redo' ],
          [ 'Find', 'Replace', '-', 'SelectAll', '-', 'Scayt' ],
          [ 'Form', 'Checkbox', 'Radio', 'TextField', 'Textarea', 'Select', 'Button', 'ImageButton', 'HiddenField' ],
          [ 'Bold', 'Italic', 'Underline', 'Strike', 'Subscript', 'Superscript', '-', 'CopyFormatting', 'RemoveFormat' ],
          [ 'NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', 'Blockquote', 'CreateDiv', '-', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock', '-', 'BidiLtr', 'BidiRtl', 'Language' ],
          [ 'Link', 'Unlink', 'Anchor' ],
          [ 'Image', 'Flash', 'Youtube', 'Table', 'HorizontalRule', 'Smiley', 'SpecialChar', 'PageBreak', 'Iframe' ] ,
          [ 'Styles', 'Format', 'Font', 'FontSize' ],
          [ 'TextColor', 'BGColor' ] ,
          [ 'Maximize', 'ShowBlocks' ] ,
        
        ],
        height: 300
      }
    };
  },
  methods: {
    getSoruce(page = 1) {
      const api = `${process.env.APIPATH}/api/${ process.env.BARRYPATH }/admin/products?page=${page}`;
      const vm = this;
      vm.isLoading = true
      this.$http.get(api).then(response => {
        console.log(response.data);
        vm.isLoading = false;
        vm.products = response.data.products;
        vm.pagination = response.data.pagination;
      });
    },
    openModal(isNew,item) {  
      
      if (isNew) {             //新增新的資料
        this.tempProduct = {};  
        this.isNew = true;
      }else{
        this.tempProduct = Object.assign({},item); //  this.tempProduct = item; 必免物件參考到同一個 item的位址 ， 另外給空物件 
         this.isNew = false;
      }
        $("#productModal").modal("show");
    },
    openRemove(item){
        this.tempProduct = Object.assign({},item);               

       $('#delProductModal').modal('show');  
    },
    updateProduct(){
      let api = `${process.env.APIPATH}/api/${
        process.env.BARRYPATH
      }/admin/product`;
      let httpMethod = 'post';
      const vm = this;
      
      //共用Modal 
      if(!vm.isNew){
        api = `${process.env.APIPATH}/api/${process.env.BARRYPATH}/admin/product/${vm.tempProduct.id}`;
        httpMethod ='put';
      }

      this.$http[httpMethod](api,{data: vm.tempProduct}).then(response => {
        console.log(response.data);
        if (response.data.success) {
          $('#productModal').modal('hide');
          vm.getSoruce();
          vm.$bus.$emit('messsage:push',response.data.message,'success');
        }else{
          vm.$bus.$emit('messsage:push',response.data.message,'danger');
            //console.log('新增失敗');
        }
        
      });
    },
    
    reMoveItem(){
      const vm = this;
      const api = `${process.env.APIPATH}/api/${
                  process.env.BARRYPATH
                  }/admin/product/${vm.tempProduct.id}`;
             
     
      this.$http.delete(api).then(response => {
   
        if (response.data.success) { 
            $('#delProductModal').modal('hide');          
          // vm.getSoruce();       
          // vm.$bus.$emit('messsage:push',response.data.message,'success');
          console.log(response.data);
        }else{
            console.log('刪除失敗');
              vm.$bus.$emit('messsage:push',response.data.message,'danger');
        }
        
      });
    },
    uploadFile(){
      console.log(this);
      const vm= this;
      const uploadFile = this.$refs.files.files[0];
      const formData = new FormData(); //上傳用 物件
      formData.append('file-to-upload',uploadFile);
      //定義路徑
      const url = `${process.env.APIPATH}/api/${process.env.BARRYPATH }/admin/upload`;  

      vm.status.fileUploading = true;

      this.$http.post(url,formData,{
        headers:{
          'Content-Type':'multipart/form-data',
        },
      }).then((response)=>{
         //console.log(response.data);
         vm.status.fileUploading = false;
        if (response.data.success) {           
          //vm.tempProduct.imageUrl = response.data.imageUrl;
          //console.log(vm.tempProduct);          
           vm.$set(vm.tempProduct,'imageUrl',response.data.imageUrl);
          
        }else{
           vm.$bus.$emit('messsage:push',response.data.message,'danger');
        }
      });
    },
    updateCKEdirData(content){
      const vm =this;
      vm.tempProduct.content = content;

    }
  },
  created() {
    this.getSoruce();
  },
  mounted() {
   
    
  },
};


  //  $(document).ready(function(){

  //   $.fn.modal.Constructor.prototype.enforceFocus = function () {
  //      modal_this = this
  //      $(document).on('focusin.modal', function (e) {
  //         if (modal_this.$element[0] !== e.target && !modal_this.$element.has(e.target).length
  //         // add whatever conditions you need here:
  //         &&
  //         !$(e.target.parentNode).hasClass('cke_dialog_ui_input_select') && !$(e.target.parentNode).hasClass('cke_dialog_ui_input_text')) {
  //             modal_this.$element.focus()
  //         }
  //     })
  //  };

  //  });


  //  var $modalElement = this.$element;
  //   $(document).on('focusin.modal', function (e) {
  //       var $parent = $(e.target.parentNode);
  //       if ($modalElement[0] !== e.target && !$modalElement.has(e.target).length
  //               add whatever conditions you need here:
  //           &&
  //           !$parent.hasClass('cke_dialog_ui_input_select') && !$parent.hasClass('cke_dialog_ui_input_text')) {
  //           $modalElement.focus()
  //       }
  //   })

</script>

