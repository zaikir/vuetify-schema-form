<template>
  <v-row no-gutters class="drag-and-drop-editor mb-2">
    <v-col cols="12" class="mb-0">
      <v-subheader :class="'subtitle-2 pl-0'" style="height: 30px;">
        {{ label }}
      </v-subheader>
    </v-col>
    <v-col v-if="!file && !disabled" cols="12" style="margin-top: -2px;">
      <dropzone-area
        :height="height"
        :accepted-files="acceptedFiles"
        :additional-params="params"
        @uploaded="onUploaded"/>
    </v-col>
    <v-col cols="12" style="margin-top: -14px;">
      <v-row v-if="file">
        <v-col cols="auto">
          <file-avatar :file="file" @remove="removeFile"/>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>
<script>

import moment from 'moment';
import gql from 'graphql-tag';
import DropzoneArea from './DropzoneArea.vue';
import FileAvatar from './FileAvatar.vue';

export default {
  components: {
    DropzoneArea,
    FileAvatar,
  },
  props: {
    value: {
      type: String,
    },
    source: {
      type: String,
      default: 'File',
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
    label: {
      type: String,
      required: false,
      default: null,
    },
    rules: {
      type: Array,
      required: false,
      default: () => [],
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  apollo: {
    file: {
      query() {
        return gql`query GetFile ($id: uuid!) { 
          ${this.source} (where: { id: {_eq: $id} }, limit: 1 ) { 
            id name type created_at url
          } 
        }`;
      },
      update(data) {
        return data[this.source][0];
      },
      variables() {
        return { id: this.value };
      },
      skip() {
        return !this.value;
      },
    },
  },
  data() {
    return {
      file: null,
      isConfirmationDialogOpened: false,
      processedItem: null,
      newFileName: '',
      isEditDialogOpened: false,
      isFileModalOpened: false,
    };
  },
  computed: {
    dropzoneOptions() {
      return {
        dictDefaultMessage: 'Перетащите сюда файл',
        url: this.url,
        thumbnailWidth: 150,
      };
    },
  },
  methods: {
    onUploaded({ id }) {
      this.$emit('change', id);
      this.$emit('input', id);
    },
    async removeFile(file) {
      await this.$apollo.mutate({
        mutation: gql`mutation RemoveFile($id: uuid) {
          update_File(where: {id: {_eq: $id}}, _set: {isRemoved: true}) {
            affected_rows
          }
        }`,
        variables: {
          id: file.id,
        },
      });

      this.file = null;
      this.$emit('input', null);
    },
    openLink(file, modal) {
      if (!modal) {
        this.processedItem = file;
        this.isFileModalOpened = true;
      } else {
        window.open(file.url, '_blank');
      }
    },
    isImage(type) {
      return type === '.png' || type === '.jpg' || type === '.jpeg' || type === '.gif';
    },
    saveFile() {
      if (!this.$refs.editFileForm.validate()) {
        return;
      }

      this.$emit('input', {
        ...this.response,
        name: this.newFileName,
        created: moment().toDate(),
      });
      this.isEditDialogOpened = false;
    },
    successfullyUploaded(file, response) {
      this.$emit('input', {
        ...response,
        name: file.name,
        created: moment().toDate(),
      });
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

 .drag-and-drop-editor .dz-preview,
 .drag-and-drop-editor .dz-processing,
 .drag-and-drop-editor .dz-image-preview,
 .drag-and-drop-editor .dz-success,
 .drag-and-drop-editor .dz-success {
   display: none;
 }

  .drag-and-drop-editor .v-card--reveal {
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
