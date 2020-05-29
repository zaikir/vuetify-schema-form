
<template>
  <div>
    <v-subheader :class="'subtitle-2 pl-0'" style="height: 30px;">
      {{ label }}
    </v-subheader>
    <editor v-if="!disabled" ref="editor" v-model="content" class="html-editor" :init="options" />
    <div v-else class="html-editor" v-html="content"></div>
    <validation-message v-if="required && isMounted" :value="content && content.replace(emptyString, '').length"/>
  </div>
</template>

<script>
import Editor from '@tinymce/tinymce-vue';
import Vue from 'vue';
import ValidationMessage from './ValidationMessage.vue';

export default {
  components: {
    Editor,
    ValidationMessage,
  },
  props: {
    value: {
      type: String,
      required: false,
      default: '',
    },
    label: {
      type: String,
      required: false,
      default: null,
    },
    required: {
      type: Boolean,
      default: false,
    },
    height: {
      type: Number,
      required: false,
      default: 600,
    },
    language: {
      type: String,
      required: false,
      default: 'ru',
    },
    uploadUrl: {
      type: String,
      required: false,
      default: '/api/uploads',
    },
    uploadFileHandler: {
      type: Function,
      required: false,
      default: (result) => result.url,
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false,
    },
    verifyHtml: {
      type: Boolean,
      default: true,
    },
    styles: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      emptyString: `<!DOCTYPE html>
<html>
<head>
</head>
<body>

</body>
</html>`,
      isMounted: false,
      content: '',
      options: {
        language: this.language,
        language_url: `https://cdn.jsdelivr.net/npm/tinymce-lang@0.0.1/langs/${this.language}.js`,
        plugins: 'fullpage paste importcss searchreplace autolink autosave save directionality code visualblocks visualchars fullscreen image link media codesample table charmap hr pagebreak nonbreaking anchor toc insertdatetime advlist lists wordcount imagetools textpattern noneditable help charmap quickbars emoticons',
        imagetools_cors_hosts: ['picsum.photos'],
        menubar: 'edit view insert format tools table',
        toolbar: 'undo redo | bold italic underline strikethrough | fontselect fontsizeselect formatselect | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist | forecolor backcolor removeformat | pagebreak | charmap emoticons | fullscreen  preview save print | insertfile image media link anchor codesample | ltr rtl',
        toolbar_sticky: true,
        autosave_ask_before_unload: true,
        autosave_interval: '30s',
        autosave_prefix: '{path}{query}-{id}-',
        autosave_restore_when_empty: false,
        autosave_retention: '2m',
        image_advtab: true,
        verify_html: this.verifyHtml,
        // forced_root_block: '',
        content_css: [
          ...((Vue.$schemaForm || {}).html || {}).styles || [],
          ...this.styles,
        ],
        images_upload_url: this.uploadUrl,
        automatic_uploads: false,
        file_picker_callback(cb) {
          const input = document.createElement('input');
          input.setAttribute('type', 'file');

          const that = this;
          input.onchange = () => {
            const file = this.files[0];

            const formData = new FormData();
            formData.append('file', file, file.name);

            const xhr = new XMLHttpRequest();
            xhr.withCredentials = false;
            xhr.open('POST', that.uploadUrl);

            xhr.onload = () => {
              if (xhr.status !== 200) {
                throw new Error('HTTP error');
              }

              cb(that.uploadFileHandler(JSON.parse(xhr.responseText)), {
                title: file.name,
                text: file.name,
                alt: file.name,
                target: '_blank',
              });
            };

            xhr.send(formData);
          };

          input.click();
        },
        images_upload_handler: (blobInfo, success, failure) => {
          const xhr = new XMLHttpRequest();
          xhr.withCredentials = false;
          xhr.open('POST', this.uploadUrl);

          xhr.onload = () => {
            if (xhr.status !== 200) {
              failure(`HTTP Error: ${xhr.status}`);
              return;
            }

            success(this.uploadFileHandler(JSON.parse(xhr.responseText)));
          };

          const formData = new FormData();
          formData.append('file', blobInfo.blob(), blobInfo.filename());

          xhr.send(formData);
        },
        image_caption: true,
        quickbars_selection_toolbar: 'bold italic | quicklink h2 h3 blockquote quickimage quicktable',
        contextmenu: 'link image imagetools table',
        height: this.height,
      },
    };
  },
  computed: {
    rules() {
      return [];
    },
  },
  watch: {
    content(val) {
      this.$emit('input', val);
      this.$emit('change', val);
    },
    value(val) {
      if (this.content !== val) {
        this.content = val;
      }
    },
  },
  mounted() {
    this.content = this.value;
    setTimeout(() => {
      this.isMounted = true;
    }, 1000);
  },
};
</script>
<style>
.html-editor {
  height: 100%;
  color: initial;
  font-size: initial;
  line-height: initial;
  letter-spacing: initial;
  pointer-events: initial;
  font-family: initial !important;
  margin-bottom: 20px;
}

.tox-notification.tox-notification--in {
  display: none !important;
}

</style>
