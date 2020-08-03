<template>
  <div>
    <input
      type="file"
      @change="filesChange($event.target.files)"
      accept=".csv"
    />
    <br />
    <template v-if="ended">
      succes: <span class="green">{{ ready }}</span> /
      <strong>{{ total }}</strong
      ><br />
      errors: <span class="red">{{ errors.length }}</span
      ><br />
      time: {{ endTime }}
    </template>
    <template v-else>
      <template v-if="this.total">
        succes: <span class="green">{{ ready }}</span> /
        <strong>{{ total }}</strong
        ><br />
        errors: <span class="red">{{ errors.length }}</span
        ><br />
        percent: {{ this.percent }}%<br />
        time: {{ endTime }}<br />
      </template>
      <template v-if="restTime"> rest:{{ restTime }} </template>
    </template>
    <pre class="console">
      <div v-for="log of lastLogs" v-html="log.text" :key="log.key"></div>
    </pre>
  </div>
</template>

<script>
import Papa from "papaparse";
// import api from '@/pure/api.js'
import ItemSave from "@/pure/ItemSave";
import api from "@/pure/api";

export default {
  data() {
    return {
      startedTime: 0,
      restTime: "",
      endTime: null,
      ended: false,
      errors: [],
      total: 0,
      ready: 0,
      logs: [],
    };
  },

  computed: {
    percent() {
      return ((this.ready * 100) / this.total).toFixed(2);
    },
    lastLogs() {
      return this.logs.map((text, key) => ({ text, key }));
      // .filter((_, i) => i > this.logs.length - 10)
    },
  },

  components: {},

  methods: {
    filesChange(files) {
      const parallels = 5;
      if (files.length) {
        Papa.parse(files[0], {
          header: true,
          error: (err, file, inputElem, reason) => {
            console.log(err, file, inputElem, reason);
          },
          complete: ({ data }) => {
            this.startedTime = Date.now();
            this.total += data.length;
            const list = data.map((itemData, i) =>
              Object.assign({ id: i }, itemData)
            );

            for (let i = 0; i < parallels; i++) {
              this.runProcess(list);
            }
          },
        });
      }
    },

    msToTime(distance) {
      const hours = Math.floor(distance / 3600000);
      distance -= hours * 3600000;
      const minutes = Math.floor(distance / 60000);
      distance -= minutes * 60000;
      const seconds = Math.floor(distance / 1000);
      return `${hours}:${("0" + minutes).slice(-2)}:${("0" + seconds).slice(
        -2
      )}`;
    },

    updateEndTime() {
      this.endTime = this.msToTime(Date.now() - this.startedTime);
    },

    updateRestTime() {
      const passed = Date.now() - this.startedTime;
      const distance = (this.total * passed) / this.ready - passed;

      this.restTime = this.msToTime(distance);
    },

    runProcess(list) {
      this.updateRestTime();
      this.updateEndTime();
      if (list.length > 0) {
        const itemData = list.shift();
        const isLast = list.length < 1;

        // 13:12 -> 15:57

        const item = new ItemSave();
        item.id = Math.round(Math.random() * 0xffffffff);
        let promise = Promise.resolve();

        if (itemData.input) {
          if (itemData.input.indexOf("img/") === 0) {
            const input =
              "http://inspire.namide.com/import-files/" + itemData.input;
            promise = item.updateByInput(input);
          } else {
            const input = itemData.input;
            promise = item.updateByInput(input);
          }
        }

        promise
          .then(() => {
            if (itemData.id) {
              item.id = itemData.id;
            }
            if (itemData.content) {
              item.content = itemData.content;
            }
            if (itemData.createdAt) {
              item.createdAt = new Date(itemData.createdAt);
            }
            if (itemData.visibility) {
              item.visibility = itemData.visibility;
            }
            if (itemData.title) {
              item.title = itemData.title;
            } else {
              item.title = "";
            }
            if (itemData.description) {
              item.description = itemData.description;
            }
            if (itemData.tags) {
              item.tags = itemData.tags.split(",");
            }
          })
          .then(() => {
            // this.logs.push('✅  id:' + itemData.id)
            // this.logs.push(this.resumeItem(item.getObject()))

            const { item: payload, image, file } = item.getBody();
            console.log("payload:", payload);
            return api.addItem(payload, image, file);
          })
          .then((data) => {
            console.log("data:", data);
            this.ready++;
          })
          .catch((error) => {
            this.errors.push(itemData);
            this.logs.push("🔺  id:" + itemData.id + " " + error.message);
            this.logs.push(this.resumeItem(item.getObject()));
          })
          .finally(() => {
            item.dispose();
            if (list.length > 0) {
              requestAnimationFrame(() => this.runProcess(list));
            } else {
              this.updateEndTime();
              if (isLast) {
                this.ended = true;
              }
            }
            /* else if (this.errors.length > 0) {
              const newList = this.errors
              this.errors = []
              requestAnimationFrame(() => this.runProcess(newList))
            } */
          });
      }
    },

    resumeItem(item) {
      let str = "";
      const tab = "&nbsp;&nbsp;&nbsp;";
      if (item.title) {
        str += tab + "title:" + item.title + "<br>";
      }
      if (item.types) {
        str += tab + "types:" + item.types.join(", ") + "<br>";
      }
      if (item.tags) {
        str += tab + "tags:" + item.tags.join(", ") + "<br>";
      }
      if (item.description) {
        str += tab + "description:" + item.description + "<br>";
      }
      if (item.input) {
        str += tab + "input:" + item.input + "<br>";
      }
      str += "---------------------";
      return str;
    },
  },
};
</script>

<style lang="sass" scoped>
.console
  white-space: normal
  background: #000
  color: #DDD

.green
  color: green

.red
  color: red
</style>
