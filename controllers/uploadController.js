const uploadImages = (req, res) => {
  if (!req.files) {
    return res.status(400).json({ message: "No images uploaded" });
  }

  const urls = req.files.map((file) => file.path);

  res.status(201).json({
    message: "Images uploaded successfully",
    urls,
  });
};

module.exports = { uploadImages };
