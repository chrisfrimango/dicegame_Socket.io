const dicegameModel = require("../models/dicegameModel");

exports.getScoreBoard = async (req, res) => {
  try {
    const scores = await dicegameModel.find();
    return res.status(200).json(scores);
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
};

//Add new user POST/CREATE
exports.addNewUser = async (req, res) => {
  const { userName } = req.body;
  try {
    const newUser = new dicegameModel({
      userName: userName,
    });
    const insertUser = await newUser.save();
    return res.status(201).json(insertUser);
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
};

// Check if username exists
exports.findUser = async (req, res) => {
  const { username } = req.params;
  try {
    const user = await dicegameModel.findOne({ userName: username });
    if (user) {
      return res.status(200).json({
        exists: true,
        message: "Username is taken, please choose another one.",
      });
    } else {
      return res.status(200).json({ exists: false });
    }
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
};

// Update Score
exports.updateScore = async (req, res) => {
  const { userName, score } = req.body;

  try {
    const user = await dicegameModel.findOne({ userName: userName });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (score > user.score) {
      await dicegameModel.updateOne({ userName: userName }, { score: score });
    }

    const updateScore = await dicegameModel.findOne({
      userName: userName,
    });
    return res
      .status(200)
      .json({ score: updateScore.score, message: "New record, Score updated" });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
};

// Delete scoreBoard
exports.deleteScoreBoard = async (req, res) => {
  try {
    const deletedScoreBoard = await dicegameModel.deleteMany({});
    return res.status(200).json(deletedScoreBoard);
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
};

// Delete user by id
// exports.deleteUserById = async (req, res) => {
//   const { id } = req.body;
//   try {
//     const deletedUser = await dicegameModel.findByIdAndDelete(id);
//     return res.status(200).json(deletedUser);
//   } catch (error) {
//     return res.status(500).json({
//       error: error.message,
//     });
//   }
// };
