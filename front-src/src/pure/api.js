// import config from '../../config'
import Signal from "./Signal";
import Item from "./item";
const { ROLES } = require("../../../web/app/constants/permissions.js");

// import { itemsToFilter } from "@/pure/tagHelpers";

class Api {
  constructor() {
    // this.onLogin = new Signal();
    this.onError = new Signal();
    this.onRedirect = new Signal();
    this.onStateChange = new Signal();

    this.state = {
      version: null,
      serverTime: Date.now(),
      isLogged: false,
      user: Api.createDefaultUser(),
      needDatabase: false,
      needAdmin: false,
    };

    this.init = this.init.bind(this);
  }

  init() {
    const options = {
      method: "get",
      headers: this._createHeaders(),
    };
    return fetch("/api", options)
      .then((response) => this.parseResponse(response))
      .then((payload) => this.parsePayload(payload))
      .then(({ global }) => {
        console.log(global);
        this._updateState(global);
      })
      .catch((error) => this.onError.dispatch(error.message));
  }

  _updateState(data) {
    const oldState = JSON.parse(JSON.stringify(this.state));
    const newState = Object.assign({}, this.state, data);
    this.state = JSON.parse(JSON.stringify(newState));
    this.onStateChange.dispatch(newState, oldState);

    if (newState.isLogged && !oldState.isLogged) {
      this.updateMe();
    }

    return newState;
  }

  /**
   * @param {String} link
   * @returns {Promise}
   */
  getDistantLink(link) {
    const options = {
      method: "get",
      headers: this._createHeaders(),
    };

    const url = encodeURIComponent(link);

    return fetch("/api/distant/" + url, options);
  }

  /**
   * @param {Response} response
   */
  parseResponse(response) {
    if (response.status === 401) {
      this._disconnect();
      this.onRedirect.dispatch({ name: "admin" });
    }

    return response.json();
  }

  parsePayload(payload) {
    if (payload.error === true) {
      this.onError.dispatch(payload.message);
      throw new Error(payload.message);
    }

    return payload;
  }

  parseItem(payload) {
    return Item.itemToObject(Item.itemFromPayload(payload));
  }

  setMe() {}

  _setUser({ email, name, role, _id }) {
    const data = {
      user: { email, name, role, id: _id },
      isLogged: role !== ROLES.GUEST,
    };
    this._updateState(data);
  }

  updateMe() {
    const options = {
      method: "get",
      headers: this._createHeaders(),
    };

    fetch("/api/users/me", options)
      .then((response) => this.parseResponse(response))
      .then((payload) => this.parsePayload(payload))
      .then(({ user }) => this._setUser(user))
      .then(console.log)
      .catch(console.error);
  }

  getThumbURL(uid) {
    return uid; // config.api.abs + '/thumbs/' + uid
  }

  getFileURL(uid) {
    return uid; // config.api.abs + '/files/' + uid
  }

  getItem(id) {
    const options = {
      method: "get",
      headers: this._createHeaders(),
    };

    return fetch("/api/items/" + id, options)
      .then((response) => response.json())
      .then(({ item }) => this.parseItem(item));
  }

  getItems() {
    const options = {
      method: "get",
      headers: this._createHeaders(),
    };

    return fetch("/api/items", options)
      .then((response) => response.json())
      .then((payload) => this.parsePayload(payload))
      .then(({ items }) => items.map((payload) => this.parseItem(payload)));
  }

  getUsers() {
    const options = {
      method: "get",
      headers: this._createHeaders(),
    };

    return fetch("/api/users", options)
      .then((response) => response.json())
      .then((payload) => this.parsePayload(payload))
      .then(({ users }) => users);
  }

  getGroups(items, { limit = 100, offset = 0 } = {}) {}

  addUser({ name, email, password, role }) {
    const body = new FormData();
    body.append("name", name);
    body.append("email", email);
    body.append("password", password);
    body.append("role", role);

    const options = {
      method: "post",
      headers: this._createHeaders(),
      body,
    };

    return fetch("/api/users", options)
      .then((response) => response.json())
      .then((payload) => this.parsePayload(payload))
      .then(({ user }) => user);
  }

  addItem(item, image = null, file = null) {
    const body = new FormData();
    body.append("item", JSON.stringify(item));

    if (image) {
      body.append("image", image);
    }

    if (file) {
      body.append("file", file);
    }

    const options = {
      method: "post",
      headers: this._createHeaders(),
      body,
    };

    return fetch("/api/items", options)
      .then((response) => response.json())
      .then((payload) => this.parsePayload(payload))
      .then(({ item }) => Api.parseItem(item));
  }

  databaseTest({ userName, userPassword, auth, name, host, port }) {
    const payload = {
      database: { userName, userPassword, auth, name, host, port },
    };
    const options = {
      method: "post",
      headers: this._createHeaders({ isJson: true }),
      body: JSON.stringify(payload),
    };

    return fetch("/api/database/test", options)
      .then((response) => response.json())
      .then((json) => {
        if (json.success) {
          return true;
        } else {
          throw new Error(json.message);
        }
      });
  }

  installDatabase({ userName, userPassword, auth, name, host, port }) {
    const payload = {
      database: { userName, userPassword, auth, name, host, port },
    };
    const options = {
      method: "post",
      headers: this._createHeaders({ isJson: true }),
      body: JSON.stringify(payload),
    };

    return fetch("/api/database/install", options)
      .then((response) => response.json())
      .then((payload) => this.parsePayload(payload))
      .then((json) => {
        if (json.success) {
          return this._updateState(json.global);
        } else {
          throw new Error(json.message);
        }
      })
      .then(() => true);
  }

  installUser({ name, email, password, role }) {
    const body = new FormData();
    body.append("name", name);
    body.append("email", email);
    body.append("password", password);
    body.append("role", role);

    const options = {
      method: "post",
      headers: this._createHeaders(),
      body,
    };

    return fetch("/api/install/admin", options)
      .then((response) => response.json())
      .then((json) => {
        if (json.success) {
          return this._updateState(json.global);
        } else {
          throw new Error(json.message);
        }
      })
      .then((payload) => this.parsePayload(payload))
      .then(({ user }) => user);
  }

  deleteItem(id) {
    const options = {
      method: "delete",
      headers: this._createHeaders(),
    };

    return fetch("/api/items/" + id, options).then((response) =>
      response.json()
    );
  }

  updateUser(id, payload) {
    const body = new FormData();
    body.append("user", JSON.stringify(payload));

    const options = {
      method: "post",
      headers: this._createHeaders(),
      body,
    };

    return fetch("/api/users/" + id, options)
      .then((response) => response.json())
      .then((payload) => this.parsePayload(payload))
      .then(({ user }) => user);
  }

  updateItem(id, payload, image, file) {
    const body = new FormData();
    body.append("item", JSON.stringify(payload));

    if (image) {
      body.append("image", image);
    }

    if (file) {
      body.append("file", file);
    }

    const options = {
      method: "post",
      headers: this._createHeaders(),
      body,
    };

    return fetch("/api/items/" + id, options)
      .then((response) => response.json())
      .then((payload) => this.parsePayload(payload))
      .then(({ item }) => this.parseItem(item));
  }

  _disconnect() {
    this._setUser(Api.createDefaultUser());
  }

  logout() {
    const options = {
      method: "post",
      headers: this._createHeaders(),
    };

    return fetch("/api/signout", options)
      .then((response) => this.parseResponse(response))
      .then((payload) => this.parsePayload(payload))
      .then(() => this._disconnect())
      .catch(console.error)
      .finally(() => {});
  }

  login(email, password) {
    const options = {
      method: "post",
      headers: this._createHeaders(),
      body: this._createBody({ email, password }),
    };

    return fetch("/api/signin", options)
      .then((response) => this.parseResponse(response))
      .then((payload) => this.parsePayload(payload))
      .then(({ user }) => {
        this._setUser(user);
        return user;
      });
    // .catch(console.error);
  }

  _createHeaders({ isJson = false } = {}) {
    const headers = new Headers({
      // isGetMethod ? 'application/json' : 'multipart/form-data'
    });

    if (isJson) {
      headers.append("Content-Type", "application/json");
    }

    return headers;
  }

  _createBody(data) {
    const body = new FormData();
    for (const name in data) {
      body.append(name, data[name]);
    }
    return body;
  }
}

Api.parseGroup = (payload) => {
  return payload;
};

Api.createDefaultUser = () => ({
  name: null,
  email: null,
  id: null,
  role: ROLES.GUEST,
});

const api = new Api();

export { Api };
export default api;
