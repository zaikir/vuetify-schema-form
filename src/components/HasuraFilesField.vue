<template>
  <v-row no-gutters class="drag-and-drop-editor mb-2">
    <v-col cols="12" class="mb-0">
      <v-subheader :class="'subtitle-2 pl-0'" style="height: 30px;">
        {{ label }}
      </v-subheader>
    </v-col>
    <v-col v-if="!disabled" cols="12" style="margin-top: -2px;">
      <dropzone-area
        :height="height"
        :accepted-files="acceptedFiles"
        :additional-params="{[foreignKey]:foreignKeyValue,...params}"
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
        <v-col v-for="(file, i) in files" :key="i" cols="auto">
          <file-avatar :file="file" :disabled="disabled" @remove="removeFile"/>
        </v-col>
      </draggable>
    </v-col>
  </v-row>
</template>
<script>

import gql from 'graphql-tag';
import Draggable from 'vuedraggable';
import DropzoneArea from './DropzoneArea.vue';
import FileAvatar from './FileAvatar.vue';
import ValidationMessage from './ValidationMessage.vue';

export default {
  components: {
    DropzoneArea,
    FileAvatar,
    ValidationMessage,
    Draggable,
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
    required: {
      type: Boolean,
      default: false,
    },
    params: {
      type: Object,
      default: () => ({}),
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  apollo: {
    files: {
      query() {
        return gql`query GetFiles ($foreignKeyValue: ${this.foreignKeyType}) { 
          ${this.source} (where: { ${this.foreignKey}: {_eq: $foreignKeyValue} }, order_by: {sort: asc} ) { 
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
        return { foreignKeyValue: this.foreignKeyValue };
      },
      skip() {
        return !this.foreignKeyValue;
      },
    },
  },
  data() {
    return {
      files: [],
      loadingIds: [],
      loading: false,
    };
  },
  methods: {
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
    async onUploaded() {
      await this.refreshQuery();
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
</style>
