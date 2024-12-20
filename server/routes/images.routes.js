// This route handles images

const router = require("express").Router();
const ImageModel = require("../models/Image.model");

//Post an image
router.post("/create", async (req, res, next) => {
  try {
    const newImage = await ImageModel.create({
      photo_id: req.body.photo_id,
      photo_url: req.body.photo_url,
      photo_image_url: req.body.photo_image_url,
      photo_submitted_at: req.body.photo_submitted_at,
      photo_featured: req.body.photo_featured,
      photo_width: req.body.photo_width,
      photo_height: req.body.photo_height,
      photo_aspect_ratio: req.body.photo_aspect_ratio,
      photo_description: req.body.photo_description,
      photographer_username: req.body.photographer_username,
      photographer_first_name: req.body.photographer_first_name,
      photographer_last_name: req.body.photographer_last_name,
      exif_camera_make: req.body.exif_camera_make,
      exif_camera_model: req.body.exif_camera_model,
      exif_iso: req.body.exif_iso,
      exif_aperture_value: req.body.exif_aperture_value,
      exif_focal_length: req.body.exif_focal_length,
      exif_exposure_time: req.body.exif_exposure_time,
      photo_location_name: req.body.photo_location_name,
      photo_location_latitude: req.body.photo_location_latitude,
      photo_location_longitude: req.body.photo_location_longitude,
      photo_location_country: req.body.photo_location_country,
      photo_location_city: req.body.photo_location_city,
      stats_views: req.body.stats_views,
      stats_downloads: req.body.stats_downloads,
      ai_description: req.body.ai_description,
      ai_primary_landmark_name: req.body.ai_primary_landmark_name,
      ai_primary_landmark_latitude: req.body.ai_primary_landmark_latitude,
      ai_primary_landmark_longitude: req.body.ai_primary_landmark_longitude,
      ai_primary_landmark_confidence: req.body.ai_primary_landmark_confidence,
      blur_hash: req.body.blur_hash,
      colors: req.body.colors,
      keywords: req.body.keywords,
      comments: req.body.comments,
      userImage: req.body.collection,
    });
    res.status(200).json(newImage);
    console.log("New Image was created", newImage);
  } catch (err) {
    next(err);
  }
});

//Get 10 random images
router.get("/random", async (req, res, next) => {
  try {
    const randomImages = await ImageModel.aggregate([
      { $sample: { size: 10 } },
    ]);

    if (!randomImages || randomImages.length === 0) {
      return res.status(404).json({ message: "No images found" });
    }

    res.json(randomImages);
  } catch (err) {
    next(err);
  }
});

//Get an image on its id
router.get("/:id", (req, res) => {
  ImageModel.findById(req.params.id).then((oneImage) => {
    res.status(200).json(oneImage);
  });
});

module.exports = router;
