const { getStorage } = require("firebase-admin/storage");
const bucket = getStorage().bucket();

async function main(srcFileName, destFileName) {
  // renames the file
  await bucket.file(srcFileName).rename(destFileName);

  return getStorage().objects.get(destFileName);
}

module.exports = main;
