const ImageKit = require("@imagekit/nodejs");

const imageKit = new ImageKit({
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
});

async function uploadFile(buffer) {
  const result = await imageKit.files.upload({
    file: buffer.toString("base64"),
    fileName: "image.jpg",
  });
  return result;
}

async function deleteFile(fileId) {
  return await imageKit.files.delete(fileId);
}

module.exports = { uploadFile, deleteFile };
