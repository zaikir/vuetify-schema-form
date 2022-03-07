<template>
  <v-row no-gutters class="drag-and-drop-editor mb-2">
    <v-col cols="12" class="mb-0">
      <v-subheader :class="'subtitle-2 pl-0'" style="height: 30px;">
        {{ label }}
      </v-subheader>
      <div v-if="caption" class="caption" v-html="caption"></div>
    </v-col>
    <v-col v-if="!disabled" cols="12" style="margin-top: -2px;">
      <dropzone-area
        :height="height"
        :accept="accept"
        :url="uploadUrl"
        :post-upload="postUpload"
        :additional-params="foreignKey ? {[foreignKey]:foreignKeyValue,...params} : params"
        @uploaded="onUploaded"/>
        <validation-message v-if="required" :value="files && files.length"/>
    </v-col>
    <v-col cols="12" >
      <draggable
        :list="files"
        group="files"
        class="row"
        :class="$vuetify.breakpoint.xsOnly ? 'd-flex justify-center' : ''"
        :disabled="loading || disabled || $vuetify.breakpoint.smAndDown"
        @change="onReordered"
      >
        <v-col v-for="(file, i) in files" :key="i" cols="auto" @click.prevent.stop="openLink(file, $event)" @click.middle.prevent.stop="openLink(file, $event)">
          <file-avatar :file="file" :disabled="disabled" @remove="removeFile" :click="false" v-bind="avatarParams"/>
        </v-col>
      </draggable>
    </v-col>
    <viewer
      v-if="images.length"
      ref="viewer"
      :images="images"
      class="viewer"
      :options="{}"
      @inited="inited"
    >
      <img v-for="src in images" :key="src" :src="src" style="display:none;">
    </viewer>
  </v-row>
</template>
<script>

import gql from 'graphql-tag';
import Draggable from 'vuedraggable';
import 'viewerjs/dist/viewer.css';
import { component as Viewer } from "v-viewer"
import DropzoneArea from './DropzoneArea.vue';
import FileAvatar from './FileAvatar.vue';
import ValidationMessage from './ValidationMessage.vue';
import fileDownload from 'js-file-download';

export default {
  components: {
    DropzoneArea,
    FileAvatar,
    ValidationMessage,
    Draggable,
    Viewer,
  },
  props: {
    foreignKey: {
      type: String,
      required: true,
    },
    foreignKeyType: {
      type: String,
      default: 'uuid!',
    },
    foreignKeyValue: {
      type: null,
      required: true,
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
    accept: {
      type: String,
      default: '*',
    },
    label: {
      type: String,
      required: false,
      default: null,
    },
    caption: {
      type: String,
      required: false,
      default: null,
    },
    required: {
      type: Boolean,
      default: false,
    },
    params: {
      type: Object,
      default: () => ({}),
    },
    avatarParams: {
      type: Object,
      default: () => ({}),
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false,
    },
    uploadUrl: {
      type: String,
      default: '/api/uploads',
    },
    postUpload: {
      type: Function,
      default: () => {},
    }
  },
  apollo: {
    files: {
      query() {
        return gql`query GetFiles ($where: ${this.source}_bool_exp) { 
          ${this.source} (where: $where, order_by: {sort: asc} ) { 
            id name type created_at url
          } 
        }`;
      },
      update(data) {
        if (data[this.source]) {
          return data[this.source];
        }
      },
      variables() {
        if (this.foreignKeyValue) {
          return {
            [this.foreignKey]: {
              _eq: this.foreignKeyValue
            }
          }
        }

        return {
          id: { _in: this.uploadedFiles.map(x => x.id) }
        }
      },
    },
  },
  data() {
    return {
      files: [],
      loadingIds: [],
      loading: false,
      processedItem: null,
      isFileModalOpened: false,
      uploadedFiles: []
    };
  },
  computed: {
    images() {
      return this.files.filter((x) => this.isImage(x.type)).map((x) => x.url);
    },
  },
  methods: {
    inited(viewer) {
      this.$viewer = viewer;
    },
    async openLink(file) {
      if (this.isImage(file.type)) {
        const imageId = this.images.findIndex((x) => x === file.url);
        for (let i = 0; i < this.$viewer.index+1; i += 1) {
          this.$viewer.prev();
        }
        for (let i = 0; i < imageId; i += 1) {
          this.$viewer.next();
        }

        this.$viewer.show();
      } else if (this.isDoc(file.type)) {
        const blob = await this.$axios.$get(file.url, { responseType: 'blob' });
        fileDownload(blob, file.name);
      } else {
        window.open(`${file.url}?type=${file.type}`, '_blank');
      }
    },
    isImage(type) {
      return type === '.png' || type === '.jpg' || type === '.jpeg' || type === '.gif';
    },
    isDoc(type) {
      return type === '.doc' || type === '.docx' || type === '.xls' || type === '.xlxs';
    },
    onReordered(event = {}) {
      const { moved } = event;
      if (!moved) {
        return;
      }

      const buildUpdateFileMutation = (id) => `update${id}: update_${this.source}(where: {id: {_eq: $id${id}}}, _set: {sort: ${id}}) {
        affected_rows
      }`;

      const definition = this.files.map((f, id) => `$id${id}: ${this.foreignKeyType}`).join(',');
      this.$apollo.mutate({
        mutation: gql`mutation RemoveFile(${definition}) {
           ${this.files.reduce((acc, item, id) => acc + buildUpdateFileMutation(id), '')}
        }`,
        variables: Object.assign({}, ...this.files.map((f, id) => ({
          [`id${id}`]: f.id,
        }))),
      });
    },
    async refreshQuery() {
      const apollo = this.$apollo.provider.defaultClient;
      Object.keys(apollo.cache.data.data).forEach((key) => {
        apollo.cache.data.delete(key);
      });

      this.$apollo.queries.files.refetch();
    },
    async onUploaded(file) {
      this.$emit('uploaded', file);
      this.uploadedFiles = [
        ...this.uploadedFiles,
        file
      ]
      console.log(this.uploadedFiles)
      
      await this.refreshQuery();
    },
    async removeFile(file) {
      await this.$apollo.mutate({
        mutation: gql`mutation RemoveFile($id: uuid) {
          update_${this.source}(where: {id: {_eq: $id}}, _set: {isRemoved: true}) {
            affected_rows
          }
        }`,
        variables: {
          id: file.id,
        },
      });

      await this.refreshQuery();
    },
  },
};
</script>
<style>
 .drag-and-drop-editor .dz-preview,
 .drag-and-drop-editor .dz-processing,
 .drag-and-drop-editor .dz-image-preview,
 .drag-and-drop-editor .dz-success,
 .drag-and-drop-editor .dz-success {
   display: none;
 }

  .drag-and-drop-editor .v-card--reveal {
    width: 100%;
  }

  .file-card {
    cursor: pointer;
  }

  .drag-and-drop-editor .caption {
    font-size: 10px; 
    line-height: 1.2; 
    margin-bottom: 7px;
  }
</style>
