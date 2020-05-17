// import config from '../../config'

import Signal from "./Signal";
import Item from "./Item";
const { ROLES } = require("../../../server/app/constants/permissions.js");

// import { itemsToFilter } from "@/pure/tagHelpers";

const parseItem = payload => {
  const item = new Item();
  const object = item.fromPayload(payload).getObject();
  item.dispose();
  return object;
};

const parseGroup = payload => {
  return payload;
};

class Api {
  constructor() {
    // this.onLogin = new Signal();
    this.onError = new Signal();
    this.onRedirect = new Signal();

    this.$state = {
      isLogged: false,
      user: {
        name: null,
        email: null,
        id: null,
        role: ROLES.GUEST
      }
    };

    try {
      this.token = localStorage.getItem("token") || null;
    } catch (error) {
      this.token = null;
      console.error(error.message);
    }

    this.init();

    // if (this.token) {
    //   this.updateMe();
    // }
  }

  createHeaders(isGet = true) {
    const headers = new Headers({
      // isGetMethod ? 'application/json' : 'multipart/form-data'
    });

    if (this.token) {
      headers.append("Authorization", "Bearer " + this.token);
      // headers.append("Content-Type", undefined); // "multipart/form-data");
    }

    return headers;
  }

  createBody(data) {
    const body = new FormData();
    for (const name in data) {
      body.append(name, data[name]);
    }
    return body;
  }

  parsePayload(payload) {
    if (payload.error === true) {
      this.onError.dispatch(payload.message);
      return Promise.reject(payload.message);
    }

    return Promise.resolve(payload);
  }

  setMe() {}

  init() {
    const options = {
      method: "get",
      headers: this.createHeaders()
    };

    fetch("/api", options)
      .then(response => response.json())
      .then(payload => this.parsePayload(payload))
      .then(({ isLogged, version, serverTime, needInstall }) => {
        console.log({ isLogged, version, serverTime, needInstall });
        this.$state = Object.assign(this.$state, { isLogged });
        if (isLogged) {
          this.updateMe();
        }
        if (needInstall) {
          this.onRedirect.dispatch({ name: "install" });
        }
      })
      .catch(console.error);
  }

  setUser({ email, name, role, _id }, isLogged = false) {
    this.$state = Object.assign(this.$state, {
      user: { email, name, role, id: _id },
      isLogged
    });
  }

  updateMe() {
    const options = {
      method: "get",
      headers: this.createHeaders()
    };

    fetch("/api/users/me", options)
      .then(response => response.json())
      .then(payload => this.parsePayload(payload))
      .then(({ user }) => this.setUser(user, true))
      .then(console.log)
      .catch(console.error);
  }

  getThumbURL(uid) {
    return uid; // config.api.abs + '/thumbs/' + uid
  }

  getFileURL(uid) {
    return uid; // config.api.abs + '/files/' + uid
  }

  getItems() {
    // const options = {
    //   filter: {
    //     id: {
    //       eq: id
    //     }
    //   },
    //   fields: ["*", "image.*", "file.*"]
    // };

    return fetch("/api/items")
      .then(response => response.json())
      .then(({ items }) => items.map(parseItem))
      .then(console.log)
      .catch(console.error);
    // return this.directus
    //   .getItems("items", options)
    //   .then(({ data }) => data.map(parseItem))
    //   .then(data => data[0])
    //   .catch(console.error);
  }

  // getItems(items, { limit = 100, offset = 0 } = {}) {
  //   const { tags, noTags, types, noTypes } = itemsToFilter(items);
  //   const options = {
  //     // depth: 1,
  //     limit,
  //     offset,
  //     filter: {
  //       tags: {},
  //       types: {}
  //     },
  //     fields: ["*", "image.*", "file.*"]
  //     /* filter: {
  //       runtime: {
  //         eq: 200
  //         gt: 200
  //       }
  //     } */
  //   };

  //   if (tags.length > 0) {
  //     options.filter.tags.contains = tags.join(",");
  //   }
  //   if (noTags.length > 0) {
  //     options.filter.tags.ncontains = noTags.join(",");
  //   }
  //   if (types.length > 0) {
  //     options.filter.types.contains = types.join(",");
  //   }
  //   if (noTypes.length > 0) {
  //     options.filter.types.ncontains = noTypes; // noTypes.join(',')
  //   }

  //   return this.directus
  //     .getItems("items", options)
  //     .then(({ data }) => data.map(parseItem))
  //     .catch(console.error);
  // }

  getGroups(items, { limit = 100, offset = 0 } = {}) {
    const options = {
      // depth: 1,
      limit,
      offset,
      fields: ["*", "image.*"]
      /* filter: {
        runtime: {
          eq: 200
          gt: 200
        }
      } */
    };

    return this.directus
      .getItems("groups", options)
      .then(({ data }) => data.map(parseGroup));
    // .catch(console.error)
  }

  // isLoggedIn() {
  //   return this.directus.isLoggedIn().then(data => {
  //     if (data === true) {
  //       this.getMe().then(data => this.onLogin.dispatch(data));
  //     } else {
  //       this.onLogin.dispatch(false);
  //     }
  //   });
  // }

  logout() {
    return this.directus
      .logout()
      .then(data => {
        // this.isLogged = false
        // this.onLogin.dispatch(false);
        // sessionStorage.removeItem('inspire_token')
        return data;
      })
      .catch(error => {
        console.log(error);
      });
  }

  login(email, password) {
    const options = {
      method: "post",
      headers: this.createHeaders(false),
      body: this.createBody({ email, password })
    };

    return fetch("/api/signin", options)
      .then(response => response.json())
      .then(payload => this.parsePayload(payload))
      .then(({ user, token }) => {
        try {
          localStorage.setItem("token", token);
        } catch (error) {
          console.error(error.message);
        }
        this.token = token;
        this.setUser(user, true);
      })
      .catch(console.error);
  }
}

const api = new Api();

export { Api };
export default api;
