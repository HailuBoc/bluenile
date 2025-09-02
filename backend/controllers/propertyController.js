import { Property } from "../models/propertyModel.js";
import { transporter } from "../config/email.js";
import dotenv from "dotenv";

dotenv.config();

export const createProperty = async (req, res) => {
  try {
    const propertyData = req.body;

    // Check required fields
    const requiredFields = [
      "listingType",
      "propertyName",
      "address",
      "price",
      "userEmail",
    ];
    for (const field of requiredFields) {
      if (!propertyData[field]) {
        return res
          .status(400)
          .json({ error: `Missing required field: ${field}` });
      }
    }

    // Ensure facilities is an array of strings
    if (propertyData.facilities && !Array.isArray(propertyData.facilities)) {
      return res
        .status(400)
        .json({ error: "Facilities must be an array of strings" });
    }

    // Save property to DB
    const newProperty = new Property(propertyData);
    await newProperty.save();

    const adminEmail = process.env.ADMIN_EMAIL;
    if (!adminEmail)
      throw new Error("Admin email not defined in environment variables");

    // === Admin Email ===
    const adminMailOptions = {
      from: `"Property Listing" <${process.env.EMAIL_USER}>`,
      to: adminEmail,
      subject: `New Property Listed - ${propertyData.propertyName}`,
      html: `
        <h2>New Property Listing Submitted</h2>
        <p><strong>Property:</strong> ${propertyData.propertyName}</p>
        <p><strong>Listing Type:</strong> ${propertyData.listingType}</p>
        <p><strong>Address:</strong> ${propertyData.address}</p>
        <p><strong>Price:</strong> ${propertyData.price} birr</p>
        <p><strong>User Email:</strong> ${propertyData.userEmail}</p>
        ${
          propertyData.facilities?.length
            ? `<p><strong>Facilities:</strong> ${propertyData.facilities.join(
                ", "
              )}</p>`
            : ""
        }
      `,
    };

    // === User Email ===
    const userMailOptions = {
      from: `"Property Listing" <${process.env.EMAIL_USER}>`,
      to: propertyData.userEmail,
      subject: `Your Property Listing - ${propertyData.propertyName}`,
      html: `
        <h2>Listing Confirmed!</h2>
        <p>Dear user,</p>
        <p>Your property listing has been submitted successfully:</p>
        <ul>
          <li><strong>Property:</strong> ${propertyData.propertyName}</li>
          <li><strong>Listing Type:</strong> ${propertyData.listingType}</li>
          <li><strong>Address:</strong> ${propertyData.address}</li>
          <li><strong>Price:</strong> ${propertyData.price} birr</li>
        </ul>
        ${
          propertyData.facilities?.length
            ? `<p><strong>Facilities:</strong> ${propertyData.facilities.join(
                ", "
              )}</p>`
            : ""
        }
        <p>Our team will contact you if needed.</p>
        <hr/>
        <p><em>This is an automated confirmation email. Do not reply.</em></p>
      `,
    };

    // Send both emails
    await Promise.all([
      transporter.sendMail(adminMailOptions),
      transporter.sendMail(userMailOptions),
    ]);

    res.status(201).json({
      message: "Property posted successfully and emails sent!",
      property: newProperty,
    });
  } catch (err) {
    console.error("Property post error:", err);
    res
      .status(500)
      .json({ error: "Failed to post property", details: err.message });
  }
};

export const getProperties = async (req, res) => {
  try {
    const properties = await Property.find();
    res.json(properties);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch properties" });
  }
};
