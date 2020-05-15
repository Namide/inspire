<template>
  <div>
    <label><input type="checkbox" v-model="isFile" />File</label>

    <div v-if="state === 0">
      <AdminFileLoader
        v-if="input.image || input.file"
        @change="fileChange"
        :image="input.image || input.file"
        :colors="input.colors"
        :only-img="false"
      />
      <template v-else>
        <InputTextarea
          @submit="validContent"
          :value="input.input"
          @change="val => $set(input, 'input', val)"
          placeholder="Content (URL, markdown, HTML, embed...)"
        />
        <!-- <Content :json="contentJson"></Content> -->
      </template>
      <button @click="validContent">Ok</button>
    </div>
    <div v-else-if="state === 1">
      <input type="datetime-local" v-model="input.date" class="date" />
      <input
        type="text"
        v-model="input.title"
        placeholder="title"
        class="title"
      />
      <InputTextarea
        :value="input.description"
        @change="val => $set(input, 'description', val)"
        placeholder="Description"
      />
      <Tags
        :tags="input.tags ? input.tags : []"
        @change="val => (input.tags = val)"
        placeholder="Tags (separated by comas)"
      />

      <span>Types:</span>
      <ul class="types">
        <li
          type="text"
          v-for="type of input.types"
          v-html="type"
          :key="type"
        ></li>
      </ul>

      <Tabs :labels="['Content', 'Thumb', 'Initial']">
        <template slot="Content">
          <Content v-if="input" :item="input" />
        </template>

        <template slot="Thumb">
          <AdminFileLoader
            @change="fileChange"
            :image="input.image"
            :colors="input.colors"
            :only-img="false"
          />
        </template>

        <template slot="Initial">
          <InputTextarea
            @submit="validContent"
            :value="input.input"
            @change="val => (input.input = val)"
            placeholder="Content (URL, markdown, HTML, embed...)"
          />
        </template>
      </Tabs>

      <!-- :info="content"  -->
      <!-- <AdminFileLoader @file="fileChange" :src="getFileSrc() || ''" :only-img="false"></AdminFileLoader> -->

      <!-- <InputTextarea :value="inputinput" @change="argValue => inputinput = argValue" placeholder="Content (URL, markdown, HTML, embed...)"></InputTextarea>
      <Content :data="content"></Content> -->

      <select v-model="input.status">
        <option value="public">Public</option>
        <option value="protected">Protected</option>
        <option value="private">Private</option>
        <option value="draft">Draft</option>
        <option value="deleted">Deleted</option>
      </select>

      <button @click="save" v-html="create ? 'Create' : 'Update'"></button>
      <button v-if="!create" @click="deleteItem">Delete</button>
      <button @click="cancel">Cancel changes</button>
    </div>
  </div>
</template>

<script>
import apiSave from "@/pure/apiSave";
// import api from '../pure/api'
import AdminFileLoader from "@/admin/AdminFileLoader.vue";
import Tags from "@/components/Tags";
import Content from "@/components/Content.vue";
import InputTextarea from "@/components/InputTextarea.vue";
import ItemSave from "@/pure/ItemSave";
import Tabs from "@/components/Tabs";

// const copy = obj => JSON.parse(JSON.stringify(obj))

export default {
  components: {
    AdminFileLoader,
    Content,
    InputTextarea,
    Tags,
    Tabs
  },

  props: {
    item: {
      type: Object,
      default() {
        return {};
      }
    },
    create: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      isFile: false,
      input: null,
      state: 0
    };
  },

  watch: {
    "input.date"(val) {
      this.itemSave.date = new Date(val);
    },
    "input.title"(val) {
      this.itemSave.title = val;
    },
    "input.description"(val) {
      this.itemSave.description = val;
    },
    "input.types"(val) {
      this.itemSave.types = val;
    },
    "input.content"(val) {
      this.itemSave.content = val;
    },
    "input.tags"(val) {
      this.itemSave.tags = val;
    },
    "input.status"(val) {
      this.itemSave.status = val;
    },
    "input.input"(val) {
      this.itemSave.input = val;
    }
  },

  computed: {},

  created() {
    // this.itemContent = new ItemContent()

    this.itemSave = new ItemSave();

    if (!this.create) {
      this.itemSave.fromObject(this.item);
      this.state = 1;
    }

    this.input = this.itemSave.getObject();
    this.inputFile = null;

    window.addEventListener("keyup", this.keyUp);
  },

  destroyed() {
    window.removeEventListener("keyup", this.keyUp);
    this.itemSave.dispose();
  },

  methods: {
    validContent() {
      this.itemSave.updateByInput(this.input.input).then(() => {
        this.input = this.itemSave.getObject();
        this.isFile =
          this.input.types.indexOf("image") > -1 ||
          this.input.types.indexOf("file") > -1;
        this.state++;
      });
    },

    deleteItem() {
      const item = new ItemSave();
      item.fromObject(this.item);
      apiSave
        .deleteItem(item.getPayload())
        .then(() => this.$emit("cancel"))
        .catch(error => console.error(error))
        .finally(() => item.dispose());

      // this.$store.dispatch('deleteItem', { id: this.item.id })
      /* api.deleteItem(data =>
      {
          if (data.success)
              this.$store.commit('deleteItem', data.data.uid)

          this.cancel()
      }, this.item.uid) */
    },

    save() {
      const payload = this.itemSave.getPayload();
      console.log(this.itemSave);
      console.log(payload);
      if (this.create) {
        apiSave.addItem(payload).catch(error => {
          console.log(error);
        });
        this.cancel();
      } else {
        const oldItem = new ItemSave();
        oldItem.fromObject(this.item);

        apiSave.updateItem(payload, oldItem.getPayload());

        // .catch(error => {
        //   console.log(error)
        // })
        this.cancel();
      }

      /* if (this.create) {
        this.$store.dispatch('addItem', { item: data })
        this.cancel()
      } else {
        this.$store.dispatch('updateItem', { uid: this.item.uid, data: data })
        this.cancel()
      } */
    },

    cancel() {
      // this.init()
      // this.$nextTick(this.close)
      this.$emit("cancel");
    },

    keyUp(keyEvent) {
      if (keyEvent.keyCode === 27) {
        this.close();
      }
    },

    fileChange(file) {
      if (file) {
        this.itemSave.updateByFile(file).then(itemSave => {
          this.input = itemSave.getObject();
          // console.log(itemSave)
        });
      } else {
        this.itemSave.removeFile().then(itemSave => {
          this.input = itemSave.getObject();
          // console.log(itemSave)
        });
      }

      /* if (!file) {
        this.content = null
        this.contentFormat = []
        this._modified.file = null
        this._modified.content = null
        this._modified.contentFormat = []
      }

      const contentFormat = ['file', ...file.type.split('/').map(type => type.toLowerCase())]
      const content = {
        name: file.name,
        size: file.size,
        type: file.type
      }

      this.contentFormat = copy(contentFormat)
      this.content = copy(content)
      this._modified.contentFormat = contentFormat
      this._modified.content = content
      this._modified.file = file

      // this.file = file
      // this._modified.content_file = file

      const types = file.type ? file.type.split('/') : []
      if (types.length > 0 && this.types.indexOf(types[0]) < 0) { this.types.push(types[0]) }

      if (file.name && file.name !== '' && this.title === '') {
        const arr = file.name.trim().split('.')
        arr.pop()

        const title = arr.join(' ')
          .split('_').join(' ')
          .split('-').join(' ')

        if (title.length > 0) { this.title = title.charAt(0).toUpperCase() + title.slice(1) }
      } */
    }
  }
};
</script>

<style lang="sass" scoped>
input
  // border: none

.types
  list-style: none
  padding: 0
  margin: 0
  display: inline-block

  li
    display: inline-block

    &:before
     content: ", "

    &:first-child
      &:before
        display: none

.date
  margin-left: auto
  display: block

.title
  font-size: 1.25em
  padding: 0.5em
  display: block
  width: 100%
</style>
