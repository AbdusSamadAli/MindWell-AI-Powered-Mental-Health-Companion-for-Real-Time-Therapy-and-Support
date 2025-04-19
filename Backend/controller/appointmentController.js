const Appointment = require("../models/Appointment");
const User = require("../models/User");
const sendEmail = require("../utils/sendEmail"); 

const createAppointment = async (req, res) => {
  try {
    const { doctorId, patientName, contact, date, time } = req.body;

    const newAppointment = new Appointment({
      doctorId,
      patientId: req.user.id,
      patientName,
      contact,
      date,
      time,
    });

    await newAppointment.save();
    const doctor = await User.findById(doctorId);
    if (doctor && doctor.email) {
      const subject = "📅 New Appointment Booked";
      const text = `Hi Dr. ${doctor.name},\n\nA new appointment has been booked by ${req.user.name} (${req.user.email}) on ${date} at ${time}.\n\nContact: ${contact}\n\nMindWell Team`;

      await sendEmail(doctor.email, subject, text);
      console.log("📧 Email sent to doctor:", doctor.email);
    }

    res.status(201).json({ message: "Appointment created and email sent!" });
  } catch (err) {
    console.error("❌ Error in createAppointment:", err);
    res.status(500).json({ message: "Failed to create appointment" });
  }
};

const getAppointmentsByDoctor = async (req, res) => {
  try {
    const doctorId = req.params.doctorId;

    const appointments = await Appointment.find({ doctorId }).sort({
      date: 1,
      time: 1,
    });

    res.status(200).json(appointments);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch appointments" });
  }
};

const updateAppointmentStatus = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const { status } = req.body;

    if (!["Confirmed", "Cancelled"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const updated = await Appointment.findByIdAndUpdate(
      appointmentId,
      { status },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    res.status(200).json({ message: `Appointment ${status.toLowerCase()}!`, appointment: updated });
  } catch (err) {
    console.error("Error updating appointment status:", err);
    res.status(500).json({ message: "Failed to update status" });
  }
};

const hasAppointmentWithDoctor = async (req, res) => {
  try {
    const userName = req.user.name;
    const doctorId = req.params.doctorId;

    const appointment = await Appointment.findOne({
      doctorId,
      patientName: userName,
      status: "Confirmed",
    });
    if (appointment) {
      return res.status(200).json({ allowed: true });
    } else {
      return res.status(200).json({ allowed: false });
    }
  } catch (err) {
    console.error("Error checking appointment access:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createAppointment,getAppointmentsByDoctor,updateAppointmentStatus,hasAppointmentWithDoctor
};
