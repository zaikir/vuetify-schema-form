<template>
  <v-hover v-slot:default="{ hover }">
    <v-card
      :style="block ? `width: 100%`: ``"
      :class="'pa-1 file-card elevation-' + (!hover ? elevation : elevationOnHover)"
      @click="openLink(file)"
      :ripple="false">
      <v-card-text>
        <div v-if="!loading" class="d-flex justify-center align-center" style="position:relative;">
          <v-img
            v-if="fileType === 'image'"
            :src="transformation ? file.url.replace('/uploads/', `/uploads/${transformation}/`) : file.url"
            class="white--text align-end"
            gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
            :width="width"
            :height="height"
          />
          <v-img
            v-else-if="fileType === 'pdf'"
            src="https://upload.wikimedia.org/wikipedia/commons/8/87/PDF_file_icon.svg"
            class="white--text align-end"
            contain
            :width="width"
            :height="height"
          />
          <v-img
            v-else-if="fileType === 'mp3'"
            src="https://www.svgrepo.com/show/255824/mp3.svg"
            class="white--text align-end"
            contain
            :width="width"
            :height="height"
          />
           <v-img
            v-else-if="fileType === 'wav'"
            src="https://www.svgrepo.com/show/255824/mp3.svg"
            class="white--text align-end"
            contain
            :width="width"
            :height="height"
          />
          <v-img
            v-else-if="fileType === 'word'"
            src="https://upload.wikimedia.org/wikipedia/commons/f/fb/.docx_icon.svg"
            class="white--text align-end"
            contain
            :width="width"
            :height="height"
          />
          <v-img
            v-else-if="fileType === 'file'"
            src="https://www.svgrepo.com/show/94277/blank-file.svg"
            class="white--text align-end"
            contain
            :width="width"
            :height="height"
          />
          <v-btn
            v-if="!disabled"
            style="position:absolute; top:-22px; right:-22px;"
            icon
            small
            @click.prevent.stop="selectedFile=file; isConfirmationDialogOpened = true;">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </div>
        <v-progress-circular
          v-else
          :size="30"
          :width="3"
          color="primary"
          indeterminate
        />
        <div class="pt-2 px-2" :class="{'text-center': block}" :style="`max-width: ${block ? `${100}%` : `${width}px`};`">
          <span class="subtitle-2">{{ file.name }}</span>
          <v-tooltip bottom v-if="download">
            <template #activator="{on}">
              <v-btn class="ml-auto" icon small v-on="on" :href="`${file.url}?type=${fileType}`" target="_blank" @click.prevent.stop="()=>{}">
                <v-icon>mdi-download</v-icon>
              </v-btn>
            </template>
            {{ translate('fileAvatar', 'Download') }}
          </v-tooltip>
        </div>
      </v-card-text>
      <confirmation-dialog
        v-model="isConfirmationDialogOpened"
        @confirm="removeFile"
        @decline="isConfirmationDialogOpened = false"
      />
    </v-card>
  </v-hover>
</template>
<script>
import fileDownload from 'js-file-download';
import ConfirmationDialog from './ConfirmationDialog.vue';
import { translate } from '../utils';

export default {
  props: {
    file: {
      type: Object,
      required: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    width: {
      type: Number,
      default: 120,
    },
    transformation: {
      type: String,
      default: null,
    },
    height: {
      type: Number,
      default: 80,
    },
    elevation: {
      type: Number,
      default: 1,
    },
    elevationOnHover: {
      type: Number,
      default: 3,
    },
    download: {
      type: Boolean,
      default: true,
    },
    click: {
      type: Boolean,
      default: true,
    },
    block: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    ConfirmationDialog,
  },
  data() {
    return {
      isConfirmationDialogOpened: false,
      selectedFile: null,
    };
  },
  computed: {
    fileType() {
      switch (this.file.type) {
        case '.png':
        case '.jpg':
        case '.jpeg':
        case '.gif':
          return 'image';
        case '.pdf':
          return 'pdf';
        case '.doc':
        case '.docx':
          return 'word';
        case '.mp3':
        case '.wav':
          return 'mp3';
        default:
          return 'file';
      }
    },
  },
  methods: {
    translate(key, defaultValue) {
      return translate(this.$vuetify, key, defaultValue);
    },
    removeFile() {
      this.isConfirmationDialogOpened = false;
      this.$emit('remove', this.selectedFile);
    },
    openLink(file) {
      if (this.click) {
        window.open(file.url, '_blank');
      }
    },
    async downloadFile(file) {
      const blob = await this.$axios.$get(file.url, { responseType: 'blob' });
      fileDownload(blob, file.name);
    },
  },
};
</script>
