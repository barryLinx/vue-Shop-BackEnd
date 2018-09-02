<template>
  <div>
    <nav aria-label="Page navigation example">
  <ul class="pagination">
    <li class="page-item" :class="{'disabled':!paginationObj.has_pre}">
      <a class="page-link" href="#"
       @click.prevent="sendApiSource(paginationObj.current_page - 1)"
       aria-label="Previous">
        <span aria-hidden="true">&laquo;</span>
        <span class="sr-only">Previous</span>
      </a>
    </li>
    <li class="page-item" v-for="(page,idx ) in paginationObj.total_pages" :key="idx"
       :class="{'acive':paginationObj.current_page === page}" >
      <a class="page-link" href="#" @click.prevent = "sendApiSource(page)">
        {{ page }}
      </a>
    </li>
   
    <li class="page-item" :class="{'disabled':!paginationObj.has_next}">
      <a class="page-link" href="#" 
       @click.prevent="sendApiSource(paginationObj.current_page + 1)"
       aria-label="Next">
        <span aria-hidden="true">&raquo;</span>
        <span class="sr-only">Next</span>
      </a>
    </li>
  </ul>
</nav>
  </div>
</template>

<script>
export default {
  props:['paginationObj'],
  methods:{
    sendApiSource(page){
      this.$emit('sendApiSource',page);
    }
  },

  
}
</script>

