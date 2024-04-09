const { admin } = require("../connectFirebase/connect");

exports.checkRoleAdmin = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ error: "Missing or invalid Authorization header" });
  }

  const token = authHeader.split("Bearer ")[1];
  console.log(token);
  if (!token) {
    return res.status(401).json("You're not authenticated");
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    if (decodedToken.role !== "admin") {
      return res.status(403).json("Unauthorized");
    }
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }
};

exports.checkRoleUser = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ error: "Missing or invalid Authorization header" });
  }
  const token = authHeader.split("Bearer ")[1];
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    if (decodedToken.role === "user" || decodedToken.role === "admin") {
      next();
    } else {
      res.status(403).send("Unauthorized");
    }
  } catch (error) {
    res.status(400).send(error);
  }
};
