<template>
  <v-row no-gutters class="drag-and-drop-editor mb-2">
    <v-col cols="12" style="margin-bottom: 0px;">
      <v-subheader :class="'subtitle-2 pl-0'" style="height: 24px;">
        {{ label }}
      </v-subheader>
    </v-col>
    <v-col v-if="!value && !disabled" cols="12">
      <vue-dropzone
        id="drop-zone"
        :options="dropzoneOptions"
        :use-custom-slot="true"
        :include-styling="false"
        :accepted-files="acceptedFiles"
        @vdropzone-file-added="startUploading"
        @vdropzone-success="successfullyUploaded"
      >
        <div class="dropzone-custom-content" :style="`height: ${height}px;`">
          <template v-if="!isLoading">
            <div style="display:flex;">
              <v-icon class="icon mr-3" style="margin-top:-2px;">
                mdi-cloud-upload-outline
              </v-icon>
              <h3 class="dropzone-custom-title">
                Перетащите сюда файл
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
    </v-col>
    <v-col cols="12">
      <v-row v-if="value">
        <v-col v-for="(file, i) in [value]" :key="i" cols="auto">
          <v-hover v-slot:default="{ hover }">
            <v-card :class="'pa-1 file-card elevation-' + (!hover ? 1 : 6)" @click="openLink(file)" @click.middle="openLink(file, true)">
              <v-img
                v-if="isImage(file.type)"
                :src="file.url"
                class="white--text align-end"
                gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
                width="150"
                height="100"
              />
              <v-img
                v-else-if="file.type === '.pdf'"
                src="https://upload.wikimedia.org/wikipedia/commons/8/87/PDF_file_icon.svg"
                class="white--text align-end"
                width="150"
                contain
                height="100"
              />
              <v-img
                v-else-if="file.type === '.doc' || file.type === '.docx'"
                src="https://upload.wikimedia.org/wikipedia/commons/f/fb/.docx_icon.svg"
                class="white--text align-end"
                width="150"
                contain
                height="100"
              />
              <v-img
                v-else
                src="https://www.svgrepo.com/show/94277/blank-file.svg"
                class="white--text align-end"
                width="150"
                contain
                height="100"
              />
              <v-card-title class=" pt-2 pl-2 pr-1" style="max-width: 150px;">
                <span class="subtitle-2">{{ file.name }}</span>
                <!-- <span class="caption">{{ formatDate(file.created) }}</span> -->
                <v-spacer />
                <v-tooltip v-if="!disabled" bottom>
                  <template #activator="{on}">
                    <v-btn class="ml-auto" icon small v-on="on" @click.prevent.stop="processedItem=file; isConfirmationDialogOpened = true;">
                      <v-icon>mdi-delete</v-icon>
                    </v-btn>
                  </template>
                  Удалить
                </v-tooltip>
              </v-card-title>
            </v-card>
          </v-hover>
        </v-col>
      </v-row>
    </v-col>
    <v-dialog
      v-model="isFileModalOpened"
      persistent
      fullscreen
    >
      <v-card v-if="processedItem" v-resize="onWindowResized">
        <v-toolbar dark color="primary" style="z-index: 1;" dense>
          <v-toolbar-title style="width: 100%;" class="ml-5">
            {{ processedItem.name }}
          </v-toolbar-title>
          <v-spacer />
          <v-btn icon dark @click="isFileModalOpened = false; processedItem = null;">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text class="pa-0 d-flex align-center justify-center" :class="{'pa-1':isImage(processedItem.type)}" :style="`height: ${windowSize.height - 50}px`">
          <v-img v-if="isImage(processedItem.type)" :src="processedItem.url" max-width="100%" max-height="100%" contain />
          <object v-else-if="processedItem.type === '.pdf'" :data="processedItem.url" type="application/pdf" width="100%" height="100%" />
          <object v-else :data="processedItem.url" width="100%" height="100%" />
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="isEditDialogOpened"
      persistent
      width="290px"
    >
      <v-card>
        <v-toolbar color="primary" dark dense>
          <v-toolbar-title class="headline font-weight-medium">
            Параметры файла
          </v-toolbar-title>
        </v-toolbar>
        <v-card-text>
          <v-form ref="editFileForm" lazy-validation @submit.prevent="saveFile">
            <v-container grid-list-md>
              <v-row no-gutters>
                <v-text-field v-model="newFileName" label="Название файла" :rules="[x => !!x || 'Введите значение']" />
              </v-row>
            </v-container>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="primary"
            @click="saveFile"
          >
            Сохранить
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <confirmation-dialog
      v-model="isConfirmationDialogOpened"
      @confirm="removeFile"
      @decline="isConfirmationDialogOpened = false"
    />
  </v-row>
</template>
<script>

import VueDropzone from 'nuxt-dropzone'
import moment from 'moment'
import ConfirmationDialog from './ConfirmationDialog'

export default {
  components: {
    VueDropzone,
    ConfirmationDialog
  },
  props: {
    value: {
      type: Object,
      required: false,
      default: null
    },
    url: {
      type: String,
      required: true
    },
    height: {
      type: Number,
      required: false,
      default: 100
    },
    acceptedFiles: {
      type: String,
      required: false,
      default: '*'
    },
    label: {
      type: String,
      required: false,
      default: null
    },
    rules: {
      type: Array,
      required: false,
      default: () => []
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false
    },
    outlined: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data () {
    return {
      isLoading: false,
      isConfirmationDialogOpened: false,
      processedItem: null,
      newFileName: '',
      isEditDialogOpened: false,
      isFileModalOpened: false,
      windowSize: {}
    }
  },
  computed: {
    dropzoneOptions () {
      return {
        dictDefaultMessage: 'Перетащите сюда файл',
        url: this.url,
        thumbnailWidth: 150
      }
    }
  },
  mounted () {
    this.windowSize = { width: window.innerWidth, height: window.innerHeight }
  },
  methods: {
    onWindowResized () {
      this.windowSize = { width: window.innerWidth, height: window.innerHeight }
    },
    formatDate (date) {
      return date ? moment(date).format('DD.MM.YYYY') : ''
    },
    removeFile () {
      this.processedItem.isRemoved = true
      this.isConfirmationDialogOpened = false

      this.$emit('input', null)
    },
    openLink (file, modal) {
      if (!modal) {
        this.processedItem = file
        this.isFileModalOpened = true
      } else {
        window.open(file.url, '_blank')
      }
    },
    isImage (type) {
      return type === '.png' || type === '.jpg' || type === '.jpeg' || type === '.gif'
    },
    startUploading (file, response) {
      this.isLoading = true
    },
    saveFile () {
      if (!this.$refs.editFileForm.validate()) {
        return
      }

      this.isLoading = false
      this.$emit('input', {
        ...this.response,
        name: this.newFileName,
        created: moment().toDate()
      })
      this.isEditDialogOpened = false
    },
    successfullyUploaded (file, response) {
      // this.response = response
      // this.newFileName = file.name
      // this.isEditDialogOpened = true

      this.$emit('input', {
        ...response,
        name: file.name,
        created: moment().toDate()
      })
    }
  }
}
</script>
<style>
  .dropzone-custom-content {
    cursor: pointer;
    border: thin dashed rgb(168, 167, 167);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .dropzone-custom-content:hover {
    background: rgb(245, 245, 245);
    border: thin solid rgb(155, 155, 155);
    /* border: thin dashed #1976d2; */
  }

  .dropzone-custom-content .dropzone-custom-title {
    font-weight: normal;
  }

  .dropzone-custom-content:hover .icon {
    color: #1976d2;
  }

  .drag-and-drop-editor .v-sheet {
    /* border: thin solid rgba(165, 165, 165, 0.671);
    border-radius: 6px !important; */
  }

 .drag-and-drop-editor .dz-preview,
 .drag-and-drop-editor .dz-processing,
 .drag-and-drop-editor .dz-image-preview,
 .drag-and-drop-editor .dz-success,
 .drag-and-drop-editor .dz-success {
   display: none;
 }

  .v-card--reveal {
    /* align-items: center;
    bottom: 0;
    justify-content: center;
    opacity: .2;
    position: absolute; */
    width: 100%;
  }

  .file-card {
    cursor: pointer;
  }
</style>
