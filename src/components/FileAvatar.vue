<template>
  <v-hover v-slot:default="{ hover }">
    <v-card
      :class="'pa-1 file-card elevation-' + (!hover ? elevation : elevationOnHover)"
      @click="openLink(file)"
      :ripple="false">
      <v-card-text>
        <div class="d-flex justify-center align-center" style="position:relative;">
          <v-img
            v-if="fileType === 'image'"
            :src="file.url"
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
            v-on="on"
            @click.prevent.stop="selectedFile=file; isConfirmationDialogOpened = true;">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </div>
        <div class=" pt-2 pl-2 pr-1" style="max-width: 150px;">
          <span class="subtitle-2">{{ file.name }}</span>
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
import ConfirmationDialog from './ConfirmationDialog.vue';

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
    width: {
      type: Number,
      default: 150,
    },
    height: {
      type: Number,
      default: 100,
    },
    elevation: {
      type: Number,
      default: 1,
    },
    elevationOnHover: {
      type: Number,
      default: 3,
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
        default:
          return 'file';
      }
    },
  },
  methods: {
    removeFile() {
      this.isConfirmationDialogOpened = false;
      this.$emit('remove', this.selectedFile);
    },
    openLink(file) {
      window.open(file.url, '_blank');
    },
  },
};
</script>
