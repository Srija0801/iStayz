const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload_details");
const {
  uploadDetails,
  addWishlist,
  removePicture,
  checkWishlist,
  removeWishlist,
} = require("../controllers/upload_controller");

router.post(
  "/UploadProfile/:id",
  (req, res, next) => {
    upload.single("profilePicture")(req, res, (err) => {
      if (err) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return res.status(400).json({
            status: 0,
            message: "File too large. Max size allowed is 10MB.",
          });
        }
        return res.status(400).json({ status: 0, message: err.message });
      }
      next();
    });
  },
  uploadDetails
);
router.get("/checkWishlist/:id/:hotel_id", checkWishlist);

router.delete("/DeleteProfile/:id", removePicture);

router.post("/addWishlist", addWishlist);

router.delete("/removeWishlist/:id/:hotel_id", removeWishlist);

module.exports = router;
