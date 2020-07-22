import mimeTypes from "@/data/mime-types.json";
import { TYPES } from "../../../web/app/constants/items";

export const extractType = raw => {
  // https://mathiasbynens.be/demo/url-regex
  if (
    raw &&
    raw.trim().match(/^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/is) !== null
  ) {
    return TYPES.URL;
  } else if (raw && raw.trim().match(/<iframe(.+)<\/iframe>/g) !== null) {
    return TYPES.EMBED;
  }

  return TYPES.TEXT;
};

export const extractData = raw => {
  const type = extractType(raw);
  // https://mathiasbynens.be/demo/url-regex
  if (type === TYPES.URL) {
    return {
      type,
      raw: raw.trim()
    };
  } else if (type === TYPES.EMBED) {
    const regExS = /<iframe[^>]+src=["']?(.+?)["'\s>]/gi;
    const regExW = /<iframe[^>]+width=["']?(\d+%?)/gi;
    const regExH = /<iframe[^>]+height=["']?(\d+%?)/gi;

    const exS = regExS.exec(raw);
    const exW = regExW.exec(raw);
    const exH = regExH.exec(raw);

    const src = exS && exS.length > 1 ? exS[1] : null;
    const width = exW && exW.length > 1 ? exW[1] || 640 : 640;
    const height = exH && exH.length > 1 ? exH[1] || 360 : 360;

    return {
      type,
      raw: raw.trim(),
      src,
      width,
      height
    };
  } else {
    return {
      type,
      raw
    };
  }
};

export const getMimeData = mimeType => {
  const mimeData = { ext: "", mimeType: "", type: "" };
  Object.keys(mimeTypes).forEach(type => {
    mimeTypes[type].forEach(data => {
      if (mimeType === data.mimeType) {
        mimeData.ext = data.ext;
        mimeData.mimeType = data.mimeType;
        mimeData.type = type;
      }
    });
  });

  return mimeData;
};
