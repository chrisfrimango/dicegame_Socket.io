const express = require("express");
const router = express.Router();

const dicegameController = require("../controllers/dicegameController");

router.get("/api/users", dicegameController.getScoreBoard);
router.get("/api/users/:username", dicegameController.findUser);
router.post("/api/users/", dicegameController.addNewUser);
router.put("/api/users", dicegameController.updateScore);
router.delete("/api/users", dicegameController.deleteScoreBoard);
// router.delete("/api/users/:id", dicegameController.deleteUserById);

module.exports = router;
