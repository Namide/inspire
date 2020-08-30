<template>
  <div>
    <label><input type="checkbox" v-model="isFile" />File</label>

    <div v-if="state === 0">
      <AdminFileLoader
        v-if="
          (input.image && input.image.src) || (input.file && input.file.src)
        "
        @change="fileChange"
        :image="input.image || input.file"
        :only-img="false"
      />
      <template v-else>
        <InputTextarea
          v-model="input.input"
          @submit="validContent"
          placeholder="Content (URL, markdown, HTML, embed...)"
        />
        <!-- <Content :json="contentJson"></Content> -->
      </template>
      <button @click="validContent">Ok</button>
    </div>
    <div v-else-if="state === 1">
      <input type="datetime-local" v-model="input.createdAt" class="date" />
      <input
        type="text"
        v-model="input.title"
        placeholder="title"
        class="title"
      />
      <InputTextarea
        :value="input.description"
        @change="(val) => $set(input, 'description', val)"
        placeholder="Description"
      />
      <Tags
        :tags="input.tags ? input.tags : []"
        @change="(val) => (input.tags = val)"
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
          <EditContent v-if="input" :item="input" />
        </template>

        <template slot="Thumb">
          <AdminFileLoader
            @change="fileChange"
            :image="input.image"
            :only-img="false"
          />
        </template>

        <template slot="Initial">
          <InputTextarea
            v-model="input.input"
            @submit="validContent"
            placeholder="Content (URL, markdown, HTML, embed...)"
          />
        </template>
      </Tabs>

      <!-- :info="content"  -->
      <!-- <AdminFileLoader @file="fileChange" :src="getFileSrc() || ''" :only-img="false"></AdminFileLoader> -->

      <!-- <InputTextarea :value="inputinput" @change="argValue => inputinput = argValue" placeholder="Content (URL, markdown, HTML, embed...)"></InputTextarea>
      <Content :data="content"></Content> -->

      <select v-model="input.visibility">
        <option
          :value="visibility.value"
          :key="visibility.value"
          v-for="visibility in visibilities"
          v-html="visibility.label"
        ></option>
        <!-- <option value="public">Public</option>
        <option value="protected">Protected</option>
        <option value="private">Private</option>
        <option value="draft">Draft</option>
        <option value="deleted">Deleted</option> -->
      </select>

      <button @click="save" v-html="create ? 'Create' : 'Update'"></button>
      <button v-if="!create" @click="deleteItem">Delete</button>
      <button @click="cancel">Cancel changes</button>
    </div>
  </div>
</template>

<script>
import api from "@/pure/api";
// import api from '../pure/api'
import AdminFileLoader from "@/admin/AdminFileLoader.vue";
import Tags from "@/components/Tags";
import EditContent from "@/admin/EditContent.vue";
import InputTextarea from "@/admin/InputTextarea.vue";
import Item from "@/pure/item";
import ItemSave from "@/pure/item-save";
import Tabs from "@/components/Tabs";
import { VISIBILITY } from "../../../web/app/constants/permissions";

// const copy = obj => JSON.parse(JSON.stringify(obj))

export default {
  components: {
    AdminFileLoader,
    EditContent,
    InputTextarea,
    Tags,
    Tabs,
  },

  props: {
    item: {
      type: Object,
      default() {
        return {};
      },
    },
    create: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      isFile: false,
      input: null,
      visibilities: Object.values(VISIBILITY).map((value) => ({
        value,
        label: value[0].toUpperCase() + value.slice(1),
      })),
      state: 0,
    };
  },

  watch: {
    "input.createdAt"(val) {
      this.itemSave.createdAt = new Date(val);
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
    "input.visibility"(val) {
      this.itemSave.visibility = val;
    },
    "input.input"(val) {
      this.itemSave.input = val;
    },
  },

  computed: {},

  created() {
    // this.itemContent = new ItemContent()

    this.itemSave = Item.createItem();

    if (!this.create) {
      this.itemSave = Item.itemFromObject(this.itemSave);
      this.state = 1;
    }

    this.input = Item.itemToObject(this.itemSave);
    this.inputFile = null;

    window.addEventListener("keyup", this.keyUp);
  },

  destroyed() {
    window.removeEventListener("keyup", this.keyUp);
  },

  methods: {
    validContent() {
      ItemSave.updateItemByInput(this.itemSave, this.input.input).then(() => {
        this.input = Item.itemToObject(this.itemSave);
        this.isFile =
          this.input.types.indexOf("image") > -1 ||
          this.input.types.indexOf("file") > -1;
        this.state++;
      });
    },

    deleteItem() {
      const item = ItemSave.itemFromObject(this.itemSave);

      api
        .deleteItem(item.id)
        .then(() => this.$emit("cancel"))
        .catch((error) => console.error(error));
    },

    save() {
      const { item, image, file } = ItemSave.itemToBody(this.itemSave);
      if (this.create) {
        api.addItem(item, image, file).catch((error) => {
          console.log(error);
        });
        this.cancel();
      } else {
        const oldItem = ItemSave.itemToObject(this.itemSave);
        api.updateItem(oldItem.id, item, image, file);

        this.cancel();
      }
    },

    cancel() {
      this.$emit("cancel");
    },

    keyUp(keyEvent) {
      if (keyEvent.keyCode === 27) {
        this.close();
      }
    },

    fileChange(file) {
      if (file) {
        ItemSave.updateItemByFile(this.itemSave, file).then((itemSave) => {
          this.input = itemSave.getObject();
        });
      } else {
        ItemSave.removeItemFile(this.itemSave).then((itemSave) => {
          this.input = itemSave.getObject();
        });
      }
    },
  },
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
