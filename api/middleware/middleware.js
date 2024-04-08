exports.checkRoleAdmin = async (req, res, next) => {
  const idToken = req.body.idToken;
  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    if (decodedToken.role === "admin") {
      next();
    } else {
      res.status(403).send("Unauthorized");
    }
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.checkRoleUser = async (req, res, next) => {
    const idToken = req.body.idToken;
    try {
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      if (decodedToken.role === "admin") {
        next();
      } else {
        res.status(403).send("Unauthorized");
      }
    } catch (error) {
      res.status(400).send(error);
    }
  };
  