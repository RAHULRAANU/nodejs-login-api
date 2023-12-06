const express = require("express");
const User  = require("../Model/User");
const router = express.Router({ mergeParams : true});

const { protect, authorize } = require("../middleware/auth");
const advanceResults = require("../middleware/advancedResults");

const {   

    getUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser
    
} = require("../Controller/user");

router.use(protect);
// router.use(authorize("admin"));

router.route("/").get(advanceResults(User), getUsers);
router.route("/:id").get(getUser).put(updateUser).delete(deleteUser);
router.route("/").post(createUser);


module.exports = router;
