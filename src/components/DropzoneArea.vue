<template>
  <vue-dropzone
    id="drop-zone"
    :options="dropzoneOptions"
    :use-custom-slot="true"
    :include-styling="false"
    :accepted-files="acceptedFiles"
    @vdropzone-file-added="startUploading"
    @vdropzone-success="successfullyUploaded"
    @vdropzone-sending="onSending"
  >
    <div class="dropzone-custom-content" :style="`height: ${height}px;`">
      <template v-if="!isLoading">
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
          :size="30"
          :width="3"
          color="primary"
          indeterminate
        />
      </template>
    </div>
  </vue-dropzone>
</template>
<script>
import VueDropzone from 'nuxt-dropzone';
import { translate } from '../utils';

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
    acceptedFiles: {
      type: String,
      required: false,
      default: '*',
    },
    additionalParams: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
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
        thumbnailWidth: 150,
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
    onSending(file, xhr, formData) {
      Object.entries(this.additionalParams).forEach(([key, value]) => {
        formData.append(key, value);
      });
    },
    startUploading() {
      this.isLoading = true;
    },
    successfullyUploaded(file, response) {
      this.isLoading = false;
      this.$emit('uploaded', response);
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
    background: rgb(245, 245, 245);
    border: thin solid rgb(155, 155, 155);
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
