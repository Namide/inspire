// import config from '../../config'

import Signal from "./Signal";
import Item from "./Item";
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
    this.onLogin = new Signal();
    this.state = {
      isLogged: false,
      user: {
        name: null,
        email: null,
        id: null
      }
    };

    this.updateMe();
  }

  updateMe() {
    fetch("/api/users/me")
      .then(response => response.json())
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
      .then(({ data }) => data.map(parseItem))
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

  isLoggedIn() {
    return this.directus.isLoggedIn().then(data => {
      if (data === true) {
        this.getMe().then(data => this.onLogin.dispatch(data));
      } else {
        this.onLogin.dispatch(false);
      }
    });
  }

  getMe() {
    return fetch("/api/users/me")
      .then(response => response.json())
      .then(({ user }) => console.log(user));

    /* return this.directus
      .getMe({
        fields: [
          "id",
          "avatar",
          "email",
          "first_name",
          "last_name",
          "locale",
          // 'role',
          "avatar.*"
        ]
      })
      .then(({ data }) => {
        let avatar = null;
        if (data.avatar) {
          const img = data.avatar.data.thumbnails.find(
            ({ dimension }) => dimension === "300x300"
          );
          if (img) {
            const src = API_DIR + img.relative_url.substring(1);
            avatar = {
              src,
              width: img.width,
              height: img.height
            };
          }
        }

        return {
          avatar,
          firstName: data.first_name,
          lastName: data.last_name,
          email: data.email,
          locale: data.locale
        };
      }); */
  }

  logout() {
    return this.directus
      .logout()
      .then(data => {
        // this.isLogged = false
        this.onLogin.dispatch(false);
        // sessionStorage.removeItem('inspire_token')
        return data;
      })
      .catch(error => {
        console.log(error);
      });
  }

  login(email, password) {
    return this.directus
      .login({
        email,
        password
      })
      .then(data => {
        // sessionStorage.setItem('inspire_token', data.token)
        // this.isLogged = data
        if (data === true) {
          this.getMe().then(this.onLogin.dispatch);
        } else {
          this.onLogin.dispatch(false);
        }
      })
      .catch(error => {
        // this.isLogged = false
        this.onLogin.dispatch(false);
        throw error;
      });
  }
}

const api = new Api();

export { Api };
export default api;
