const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/auth")

const {
    register,
    updatePost,
    deletePost,
    getPostsByUser,
    getPostsByLocation,
    getPostCounts
} = require("../Controller/post");

router.route("/register").post(protect, register);
router.route("/update/:id").put(protect, updatePost);
router.route("/delete/:id").delete(protect, deletePost);
router.route("/userPost").get(protect, getPostsByUser);
router.route("/geoLocation").get(protect, getPostsByLocation);
router.route("/getPostCounts").get(protect, getPostCounts);

module.exports = router;
