<template>
  <vue-dropzone
    id="drop-zone"
    :options="dropzoneOptions"
    :use-custom-slot="true"
    :include-styling="false"
    @vdropzone-file-added="startUploading"
    @vdropzone-success="successfullyUploaded"
    @vdropzone-sending="onSending"
    @vdropzone-upload-progress="onProgressUpdated"
  >
    <div class="dropzone-custom-content" :style="`height: ${height}px; position: relative;`">
      <div class="d-flex align-center justify-center" style="position: absolute; width: 100%; height: 100%; padding: 20px;">
        <template v-if="loadingCount === 0">
          <div class="d-flex align-center justify-center">
            <v-icon large class="icon mr-4" style="margin-top:-2px;">
              mdi-cloud-upload-outline
            </v-icon>
            <h3 class="dropzone-custom-title">
              {{ dropzoneOptions.dictDefaultMessage }}
            </h3>
          </div>
        </template>
        <template v-else>
          <v-progress-circular
            :size="36"
            :width="3"
            color="primary"
            indeterminate
          >
            <span class="caption">{{currentSentSize}}</span>
          </v-progress-circular>
        </template>
      </div>
    </div>
  </vue-dropzone>
</template>
<script>
import VueDropzone from 'nuxt-dropzone';
import { translate } from '../utils';
import { prettySize } from 'pretty-size';

export default {
  components: {
    VueDropzone,
  },
  props: {
    url: {
      type: String,
      default: '/api/uploads',
    },
    height: {
      type: Number,
      required: false,
      default: 100,
    },
    accept: {
      type: String,
      default: '*',
    },
    additionalParams: {
      type: Object,
      default: () => ({}),
    },
    postUpload: {
      type: Function,
      default: () => {},
    },
  },
  data() {
    return {
      currentSentSize: '',
      loadingCount: 0,
      isLoading: false,
      isConfirmationDialogOpened: false,
      processedItem: null,
      newFileName: '',
      isEditDialogOpened: false,
      isFileModalOpened: false,
      windowSize: {},
    };
  },
  computed: {
    dropzoneOptions() {
      return {
        dictDefaultMessage: translate(this.$vuetify, 'upload', 'Upload'),
        url: this.url,
        thumbnailWidth: 100,
        accept: (file, done) => {
          if (file && file.type && (this.accept === '*' || new RegExp(this.accept).test(file.type))) {
            // eslint-disable-next-line vue/no-side-effects-in-computed-properties
            this.isLoading = true;
            return done();
          }

          this.$emit('error', translate(this.$vuetify, 'wrongFileType', 'Wrong file type'));
          return done('Wrong file type');
        },
      };
    },
  },
  mounted() {
    this.windowSize = { width: window.innerWidth, height: window.innerHeight };

    if (window) {
      window.addEventListener('dragover', (e) => {
        e.preventDefault();
      }, false);
      window.addEventListener('drop', (e) => {
        e.preventDefault();
      }, false);
    }
  },
  methods: {
    onProgressUpdated(file, progress, bytesSent) {
      this.currentSentSize = prettySize(bytesSent)
      console.log(file, progress, bytesSent)
    },
    onSending(file, xhr, formData) {
      Object.entries(this.additionalParams).forEach(([key, value]) => {
        formData.append(key, value);
      });
    },
    startUploading(obj) {
      this.loadingCount += 1
    },
    async successfullyUploaded(file, response) {
      await this.postUpload(response)

      this.$emit('uploaded', response);
      this.loadingCount = 0
    },
  },
};
</script>
<style>
  .dropzone-custom-content {
    cursor: pointer;
    border: thin dashed rgb(168, 167, 167);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .v-application:not(.theme--dark) .dropzone-custom-content:hover {
    /* background: rgb(245, 245, 245); */
    border: thin dashed #1976d2;;
    /* border: thin dashed #1976d2; */
  }

  .v-application.theme--dark .dropzone-custom-content:hover {
    border: thin solid rgb(155, 155, 155);
  }

  .dropzone-custom-content .dropzone-custom-title {
    font-weight: normal;
  }

  .dropzone-custom-content:hover .icon {
    color: #1976d2;
  }
</style>
