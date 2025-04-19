const express = require("express");
const {createAppointment, getAppointmentsByDoctor, updateAppointmentStatus, hasAppointmentWithDoctor} = require( "../controller/appointmentController.js");
const  authenticateuser = require("../middlewares/authMiddleware.js");
const Appointment = require("../models/Appointment");
const router = express.Router();
router.post("/", authenticateuser, createAppointment); 
router.get("/doctor/:doctorId", authenticateuser, getAppointmentsByDoctor);
router.put("/status/:appointmentId", authenticateuser, updateAppointmentStatus);
router.get("/has-appointment/:doctorId", authenticateuser, hasAppointmentWithDoctor);

router.get('/confirmed-doctors/:patientId', async (req, res) => {
  const { patientId } = req.params;
  try {
    const confirmedAppointments = await Appointment.find({
      patientId,
      status: 'Confirmed',
    })
      .populate('doctorId', 'username specialization')
      .select('doctorId date time'); 

    const appointments = confirmedAppointments.map(app => ({
      doctor: app.doctorId,
      date: app.date,
      time: app.time,
    }));

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching appointments' });
  }
});

router.get("/patient/:patientId", authenticateuser, async (req, res) => {
    const { userId } = req.params;
    try {
      const appointments = await Appointment.find({ 
        patientId: userId 
      }).populate("doctorId", "username specialization");
      res.json(appointments);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user appointments" });
    }
  });  
module.exports = router;