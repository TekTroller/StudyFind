const express = require("express");

const router = express.Router();
const Register = require("./controllers/register");
const Login = require("./controllers/login");
const PatientControllers = require("./controllers/patient-controllers");

//account creation routes
router.get("/", Register.test);
router.get("/get_code", Register.getCode);
router.get("/verify", Register.verify);
router.post("/register", Register.register);

//login routes
router.get("/login", Login.signIn);

//patient data routes
router.get("/patient/view", PatientControllers.viewFile);
router.post("/patient/upload_file", PatientControllers.uploadFile);
router.post("/patient/delete_file", PatientControllers.deleteFile);

module.exports = router;
