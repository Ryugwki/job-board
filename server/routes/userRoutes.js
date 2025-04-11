import express from "express";
import {
  getUserProfile,
  updateUserProfile,
  setUserAdminStatus,
  getAllUsers,
} from "../controller/userController.js";

const router = express.Router();

router.get("/check-auth", (req, res) => {
  if (req.oidc.isAuthenticated()) {
    return res.status(200).json({
      isAuthenticated: true,
      user: req.oidc.user,
    });
  } else {
    return res.status(200).json(false);
  }
});
router.get("/users", getAllUsers);
router.get("/user/:id", getUserProfile);
router.put("/user/:id", updateUserProfile);
router.put("/user/admin/:id", setUserAdminStatus);
export default router;
