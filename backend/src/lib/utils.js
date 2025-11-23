function bufferToDataURI(file) {
  // file.mimetype is provided by multer
  return `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;
}
export { bufferToDataURI };
