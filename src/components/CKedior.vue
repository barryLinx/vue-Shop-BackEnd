<template>
  <div>
    <vue-ckeditor v-model="content" :config="config" @blur="onBlur($event)" @focus="updated" />
  </div>
</template>

<script>
import VueCkeditor from 'vue-ckeditor2';

export default {
  components: { VueCkeditor },
  props:['pcontent'],
  data () {
    return {
      content: this.pcontent,
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
    }
  },
   methods: {

     updated() {
       this.emit('updateCKEdir',this.content);
     },
    onBlur(editor) {
      console.log(editor);
    },
    onFocus(editor) {
      console.log(editor);
    }
  },
}
</script>