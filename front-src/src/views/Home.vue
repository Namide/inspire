<template>
  <div>
    <Tags :filter="filter" @change="items => (filter = items)" />
    <Items :filter="filter" />
  </div>
</template>

<script>
import Items from "@/components/Items.vue";
import Tags from "@/components/Tags.vue";

export default {
  components: {
    Items,
    Tags
  },

  data() {
    return {
      filter: []
    };
  }
};
</script>
