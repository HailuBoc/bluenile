import { Property } from "../models/propertyModel.js";
import { transporter } from "../config/email.js";
import crypto from "crypto";

// Create Property with Email Verification
export const createProperty = async (req, res) => {
  try {
    const image = req.file ? `/uploads/${req.file.filename}` : null;

    const {
      listingType,
      serviceType,
      propertyName,
      address,
      price,
      userEmail,
      facilities,
      description,
    } = req.body;

    if (!listingType || !propertyName || !address || !price || !userEmail) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    let facilitiesArr = [];
    if (facilities) {
      try {
        facilitiesArr = Array.isArray(facilities)
          ? facilities
          : JSON.parse(facilities);
      } catch {
        return res
          .status(400)
          .json({ error: "Facilities must be an array or JSON string" });
      }
    }

    const verificationToken = crypto.randomBytes(32).toString("hex");

    const newProperty = new Property({
      listingType,
      serviceType,
      propertyName,
      address,
      price,
      userEmail,
      facilities: facilitiesArr,
      description,
      imageUrl: image,
      status: "unverified",
      verificationToken,
    });

    await newProperty.save();

    // Email notifications
    if (transporter) {
      // Admin email
      const adminMailOptions = {
        from: `"Property Listing" <${process.env.EMAIL_USER}>`,
        to: process.env.ADMIN_EMAIL,
        subject: `New Property/Service Submitted (Awaiting User Verification) - ${propertyName}`,
        html: `
          <h2>New Listing Submitted</h2>
          <p><strong>Property/Service:</strong> ${propertyName}</p>
          <p><strong>Service Type:</strong> ${serviceType}</p>
          <p><strong>Listing Type:</strong> ${listingType}</p>
          <p><strong>Address:</strong> ${address}</p>
          <p><strong>Price:</strong> ${price} birr</p>
          <p><strong>User Email:</strong> ${userEmail}</p>
          <p><strong>Status:</strong> Awaiting user verification</p>
        `,
      };

      // User email
      const verificationUrl = `${process.env.FRONTEND_URL}/verify-property?token=${verificationToken}`;
      const userMailOptions = {
        from: `"Property Listing" <${process.env.EMAIL_USER}>`,
        to: userEmail,
        subject: `Verify Your Listing - ${propertyName}`,
        html: `
          <h2>Email Verification Required</h2>
          <p>You submitted the following listing. Please verify your email:</p>
          <ul>
            <li><strong>Property/Service:</strong> ${propertyName}</li>
            <li><strong>Service Type:</strong> ${serviceType}</li>
            <li><strong>Listing Type:</strong> ${listingType}</li>
            <li><strong>Address:</strong> ${address}</li>
            <li><strong>Price:</strong> ${price} birr</li>
          </ul>
          <a href="${verificationUrl}" target="_blank" style="color:blue;">Verify My Listing</a>
          <hr/>
          <p><em>This is an automated email. Do not reply.</em></p>
        `,
      };

      await Promise.all([
        transporter.sendMail(adminMailOptions),
        transporter.sendMail(userMailOptions),
      ]);
    }

    res.status(201).json({
      message:
        "Listing submitted. Please check your email to verify before it goes for admin approval.",
      property: newProperty,
    });
  } catch (err) {
    console.error("Property create error:", err);
    res
      .status(500)
      .json({ error: "Failed to post property", details: err.message });
  }
};

// Verify property token
export const verifyProperty = async (req, res) => {
  try {
    const { token } = req.query;

    const property = await Property.findOne({ verificationToken: token });
    if (!property) return res.status(400).json({ error: "Invalid token" });

    property.status = "pending";
    property.verificationToken = undefined;
    await property.save();

    res.json({ message: "Property verified successfully!", property });
  } catch (err) {
    console.error("Verification error:", err);
    res.status(500).json({ error: "Failed to verify property" });
  }
};

// Get properties (filter by status)
export const getProperties = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};
    const properties = await Property.find(filter);
    res.json(properties);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch properties" });
  }
};

// Update status (approve/reject)
export const updatePropertyStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const property = await Property.findById(id);
    if (!property) return res.status(404).json({ error: "Property not found" });

    property.status = status;
    await property.save();

    res.json({ message: `Property ${status} successfully`, property });
  } catch (err) {
    res.status(500).json({ error: "Failed to update status" });
  }
};

// Delete property
export const deleteProperty = async (req, res) => {
  try {
    const { id } = req.params;
    await Property.findByIdAndDelete(id);
    res.json({ message: "Property deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete property" });
  }
};
