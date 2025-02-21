const jwt = require("jsonwebtoken");

const authentication = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.userID = decoded.userID;

    next();
  } catch (error) {
    console.log("Error while authenticate : " + error.message);
  }
};

module.exports = { authentication };
