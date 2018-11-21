import fs from 'fs';

export const fileUpload = (node, filePath) => {
  const file = fs.readFileSync(filePath);
  return new Promise(function(resolve, reject) {
    node.files.add(file, (err, files) => {
      if (err) return reject(err)
      else resolve(files)
    })
  })
}

export const uploadFileAndSend = async (node, file, sendFn) => {
  const { name, path, type } = file;
  const files = await fileUpload(node, path);
  const { hash } = files[0];
  const text = `/ipfs/${hash}`;
  sendFn(text);
}

export const getFile = (node, CID) => {
  return new Promise(function(resolve, reject) {
    node.files.get(CID, function (err, files) {
      if (err) reject(err)
      else resolve(files)
    })
  })
}
