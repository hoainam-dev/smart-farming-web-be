const { admin } = require("../connectFirebase/connect");

exports.getAllUsers = async (req, res) => {
  try {
    const listUsersResult = await admin.auth().listUsers();
    const users = listUsersResult.users.map((userRecord) =>
      userRecord.toJSON()
    );
    res.status(200).json({ success: true, users });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error listing users", error });
  }
};

exports.updateUserRole = async (req, res) => {
  const { uid, role, name } = req.body;

  try {
    await admin.auth().setCustomUserClaims(uid, { role: role, name: name });
    res
      .status(200)
      .json({ success: true, message: "User role updated successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error updating user role", error });
  }
};
