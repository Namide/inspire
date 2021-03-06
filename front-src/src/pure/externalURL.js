import api from "@/pure/api";
const EXTERNALS = require.context("@/data/urls", false, /.*\.js$/);
const LIST = EXTERNALS.keys()
  .map((key) => EXTERNALS(key).default)
  .flat();

/**
 * @param {URL}       url
 * @param {DOMParser} doc
 */
const process = (url, doc) => {
  const data = LIST.find(({ regexList }) =>
    regexList.find((regex) => regex.test(url.href))
  );

  return new Promise((resolve, reject) => {
    if (data) {
      resolve(data.process(url, { doc, api }));
    } else {
      reject(new Error("Not in the hosts list"));
    }
  });
};

export default process;
