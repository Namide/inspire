import api from "@/pure/api";

export default {
  props: {
    filter: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  data() {
    return {
      items: [],
      loading: false
    };
  },
  watch: {
    filter: {
      immediate: true,
      handler(filter) {
        this.loading = true;
        api
          .getItems(filter)
          .then(items => {
            this.items = items;
          })
          .catch(console.error)
          .finally(() => {
            this.loading = false;
          });
      }
    }
  }
};
