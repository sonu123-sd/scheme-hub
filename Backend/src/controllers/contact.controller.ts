const Contact = require("../models/Contact.model");

const createContact = async (req: any, res: any) => {
  try {
    const { fullName, email, phone, subject, message } = req.body;

    if (!fullName || !email || !subject || !message) {
      return res.status(400).json({
        message: "Required fields missing",
      });
    }

    const contact = new Contact({
      fullName,
      email,
      phone,
      subject,
      message,
    });

    await contact.save();

    return res.status(201).json({
      message: "Contact message submitted successfully",
    });
  } catch (error) {
    console.error("Contact error:", error);
    return res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = { createContact };
