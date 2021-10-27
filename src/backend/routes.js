const express = require("express");

const router = express.Router();
const Register = require("./controllers/register");
const Login = require("./controllers/login");
const PatientControllers = require("./controllers/patient-controllers");
const ProfessionalControllers = require("./controllers/professional-controllers");

//account creation routes
router.get("/", Register.test);
router.get("/get_code", Register.getCode);
router.get("/verify", Register.verify);
router.post("/register", Register.register);

//login routes
router.get("/login", Login.signIn);

//patient data routes
router.get("/patient/get_profile", PatientControllers.getProfile);
router.get("/patient/view", PatientControllers.viewFile);
router.post("/patient/upload_file", PatientControllers.uploadFile);
router.post("/patient/delete_file", PatientControllers.deleteFile);
router.post("/patient/change_filename", PatientControllers.changeFileName);
router.post("/patient/process_request", PatientControllers.processRequest);
router.post("/patient/ban_professional", PatientControllers.banProfessional);
router.get("/patient/get_pending_requests", PatientControllers.getPendingRequests);
router.get("/patient/get_authorized_professionals", PatientControllers.getAuthorizedProfessionals);

//professonal data routes
router.get("/professional/get_profile", ProfessionalControllers.getProfile);
router.get("/professional/view_patient_file", ProfessionalControllers.viewPatientFile);
router.get("/professional/request_access", ProfessionalControllers.requestAccess);
router.get("/professional/get_pending_requests", ProfessionalControllers.getPendingRequests);


module.exports = router;
