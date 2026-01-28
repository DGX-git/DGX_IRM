const sequelize = require("../config/sequelize.config");
const nodemailer = require("nodemailer");
const cron = require("node-cron");
const Status = require("../model/status.model");
const moment = require("moment-timezone");

const transporter = nodemailer.createTransport({
  host: "smtp.zoho.in",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

// Verify transporter configuration
transporter.verify((error, success) => {
  if (error) {
    console.error("Email transporter verification failed:", error);
  } else {
    console.log("Email transporter is ready to send emails");
  }
});

// Helper function to format request details
function formatRequestDetails(requestData, type) {
  const fields = [
    {
      label: "User Type",
      value: String(
        requestData.userTypeName ||
          requestData.user_type ||
          requestData.userType ||
          "",
      ),
    },
    {
      label: "Selected Date / Time",
      value: String(
        requestData.date_time ||
          requestData.selectedDateTime ||
          requestData.dateTime ||
          "",
      ),
    },
    {
      label: "Image",
      value: String(
        requestData.customImageName ||
          requestData.custom_image ||
          requestData.customImage ||
          "",
      ),
    },
    {
      label: "Requested CPUs",
      value: String(
        requestData.cpuName ||
          requestData.cpu ||
          requestData.cpus ||
          requestData.requested_cpu ||
          "",
      ),
    },
    {
      label: "Requested RAM in GB",
      value: String(
        requestData.ramName ||
          requestData.ram ||
          requestData.memory ||
          requestData.requested_ram ||
          "",
      ),
    },
    {
      label: "Number of GPU",
      value: String(
        requestData.gpuPartitionName ||
          requestData.gpu ||
          requestData.gpus ||
          requestData.gpu_count ||
          requestData.number_of_gpu ||
          "",
      ),
    },
    {
      label: "GPU Vendor",
      value: String(
        requestData.gpuVendorName ||
          requestData.gpuVendor ||
          requestData.gpu_vendor_id ||
          "",
      ),
    },
    {
      label: "Work Description",
      value: String(
        requestData.work_description ||
          requestData.workDescription ||
          requestData.description ||
          "",
      ),
    },
  ];

  const userName = requestData.loggedInUserName || "User";

  // Add action-specific field
  if (type === "approval") {
    fields.push({ label: "Approved By", value: userName });
  } else if (type === "rejection") {
    fields.push({ label: "Rejected By", value: userName });
  } else if (type === "revoke") {
    fields.push({ label: "Revoked By", value: userName });
  } else if (type === "grantAccess") {
    fields.push({ label: "Access Granted By", value: userName });
  }

  // Format for plain text
  const maxLabelLength = Math.max(...fields.map((field) => field.label.length));
  const colonPosition = maxLabelLength + 3;

  return fields
    .map((field) => {
      const spacesNeeded = colonPosition - field.label.length;
      const spaces = " ".repeat(spacesNeeded);
      return `${field.label}${spaces}: ${field.value}`;
    })
    .join("\n");
}

// Helper function to format request details as HTML table
function formatRequestDetailsHtml(requestData, type) {
  const fields = [
    {
      label: "User Type",
      value: String(
        requestData.userTypeName ||
          requestData.user_type ||
          requestData.userType ||
          "",
      ),
    },
    {
      label: "Selected Date / Time",
      value: String(
        requestData.date_time ||
          requestData.selectedDateTime ||
          requestData.dateTime ||
          "",
      ),
    },
    {
      label: "Image",
      value: String(
        requestData.customImageName ||
          requestData.custom_image ||
          requestData.customImage ||
          "",
      ),
    },
    {
      label: "Requested CPUs",
      value: String(
        requestData.cpuName ||
          requestData.cpu ||
          requestData.cpus ||
          requestData.requested_cpu ||
          "",
      ),
    },
    {
      label: "Requested RAM in GB",
      value: String(
        requestData.ramName ||
          requestData.ram ||
          requestData.memory ||
          requestData.requested_ram ||
          "",
      ),
    },
    {
      label: "Number of GPU",
      value: String(
        requestData.gpuPartitionName ||
          requestData.gpu ||
          requestData.gpus ||
          requestData.gpu_count ||
          requestData.number_of_gpu ||
          "",
      ),
    },
    {
      label: "GPU Vendor",
      value: String(
        requestData.gpuVendorName ||
          requestData.gpuVendor ||
          requestData.gpu_vendor_id ||
          "",
      ),
    },
    {
      label: "Work Description",
      value: String(
        requestData.work_description ||
          requestData.workDescription ||
          requestData.description ||
          "",
      ),
    },
  ];

  const userName = requestData.loggedInUserName || "User";

  // Add action-specific field
  if (type === "approval") {
    fields.push({ label: "Approved By", value: userName });
  } else if (type === "rejection") {
    fields.push({ label: "Rejected By", value: userName });
  } else if (type === "revoke") {
    fields.push({ label: "Revoked By", value: userName });
  } else if (type === "grantAccess") {
    fields.push({ label: "Access Granted By", value: userName });
  }

  const tableRows = fields
    .map(
      (field) =>
        `<tr>
      <td style="padding: 4px 0; font-weight: bold; width: 200px; vertical-align: top; font-family: Arial, sans-serif;">${field.label}</td>
      <td style="padding: 1px 1px; vertical-align: top; font-family: Arial, sans-serif;">:</td>
      <td style="padding: 4px 0; vertical-align: top; font-family: Arial, sans-serif;">${field.value}</td>
    </tr>`,
    )
    .join("");

  return `
  <table style="border-collapse: collapse; width: 100%; font-family: Arial, sans-serif; font-size: 14px;">
    ${tableRows}
  </table>`;
}

// Email template generators
function generateApprovalEmailText(requestData, credentials) {
  const userName = requestData.fullName || "User";

  return `Dear ${userName},

This is to acknowledge the successful technical approval of your DGX H200 instance request Id ${
    requestData.instance_request_id
  }. The details of your request are as follows:

${formatRequestDetails(requestData, "approval")}

Kindly use the credentials and link below to log in DGX H200 instance:

Link: 45.120.59.148:32243
User ID: ${credentials.loginId}
Password: ${credentials.password}
 
${
  credentials.additionalInfo
    ? `Additional Information:
${credentials.additionalInfo}
`
    : ""
}Best regards,
DGX Administration Team`;
}

function generateApprovalEmailHtml(requestData, credentials) {
  const userName = requestData.fullName || "User";

  return `
  <html>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <p>Dear <strong>${userName}</strong>,</p>
      
      <p>This is to acknowledge the successful technical approval of your DGX H200 instance request Id <strong>${
        requestData.instance_request_id
      }</strong>. The details of your request are as follows:</p>

      ${formatRequestDetailsHtml(requestData, "approval")}

      <p>Kindly use the credentials below to login to DGX H200 instance:</p>
      
        <p><strong>Link: 45.120.59.148:32243</strong></p>
        <p><strong>User ID:</strong> ${credentials.loginId}</p>
        <p><strong>Password:</strong> ${credentials.password}</p>
        ${
          credentials.additionalInfo
            ? `<p><strong>Additional Information:</strong><br>${credentials.additionalInfo}</p>`
            : ""
        }
      
      <p>Best regards,<br>
      <strong>DGX Administration Team</strong></p>
    </body>
  </html>`;
}

function generateRejectionEmailText(requestData, remarks, type) {
  const userName = requestData.fullName || "User";
  const isRevoke = type === "revoke";
  const admin = requestData.admin || "Administrator";

  return `Dear ${userName},

${
  isRevoke
    ? `This is to inform you that your technical access to the DGX H200 instance has been revoked for request Id ${requestData.instance_request_id}. The details of your request are as follows:`
    : `This is to inform you that your request for a DGX H200 instance (Request Id ${requestData.instance_request_id}) could not be approved at this time by the ${admin} Admin. The details of your request are as follows:`
}

${formatRequestDetails(requestData, type)}

${
  isRevoke
    ? `Unfortunately, due to ${remarks}, your access has been revoked.`
    : `Unfortunately, due to ${remarks}, we are unable to accommodate your request at the moment.

You may consider resubmitting the request for a different time slot or adjusting the resource requirements. For further assistance, feel free to contact the system administrator or the resource allocation team.`
}

Best regards,
DGX Administration Team`;
}

function generateRejectionEmailHtml(requestData, remarks, type) {
  const userName = requestData.fullName || "User";
  const isRevoke = type === "revoke";
  const admin = requestData.admin || "Administrator";

  return `
  <html>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <p>Dear <strong>${userName}</strong>,</p>
      
      <p>${
        isRevoke
          ? `This is to inform you that your technical access to the DGX H200 instance has been revoked for request Id ${requestData.instance_request_id}. The details of your request are as follows:`
          : `This is to inform you that your request for a DGX H200 instance request Id ${requestData.instance_request_id} could not be approved at this time by the ${admin} Admin. The details of your request are as follows:`
      }</p>

      ${formatRequestDetailsHtml(
        requestData,
        isRevoke ? "revoke" : "rejection",
      )} 

      <p><strong>${
        isRevoke ? "Reason for Revocation:" : "Reason for Rejection:"
      }</strong></p>
      <p>${remarks}</p>

      ${
        !isRevoke
          ? `<p>You may consider resubmitting the request for a different time slot or adjusting the resource requirements. For further assistance, feel free to contact the system administrator or the resource allocation team.</p>`
          : ""
      }
      
      <p>Best regards,<br>
      <strong>DGX Administration Team</strong></p>
    </body>
  </html>`;
}

function generateGrantAccessEmailText(requestData) {
  const userName = requestData.fullName || "User";
  return `Dear ${userName},

This is to inform you that technical access has been granted for your DGX H200 instance request Id ${
    requestData.instance_request_id
  }. The details of your request are as follows:

${formatRequestDetails(requestData, "grantAccess")}

Your access to the DGX H200 instance has been successfully granted. You can now use your previously provided credentials to access the system.

Best regards,
DGX Administration Team`;
}

function generateGrantAccessEmailHtml(requestData) {
  const userName = requestData.fullName || "User";

  return `
  <html>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <p>Dear <strong>${userName}</strong>,</p>
      
      <p>This is to inform you that technical access has been granted for your DGX H200 instance request Id <strong>${
        requestData.instance_request_id
      }</strong>. The details of your request are as follows:</p>
      
      ${formatRequestDetailsHtml(requestData, "grantAccess")}
      
      <p><strong>Access Granted!</strong></p>
      <p>Your access to the DGX H200 instance has been successfully granted. You can now use your previously provided credentials to access the system.</p>
     
      <p>Best regards,<br>
      <strong>DGX Administration Team</strong></p>
    </body>
  </html>`;
}

// Internal function to send approval email
const sendApprovalEmailInternal = async (requestData, credentials) => {
  if (!requestData || !credentials) {
    throw new Error("requestData and credentials are required");
  }

  const mailOptions = {
    from: {
      name: "DGX Administrator",
      address: process.env.EMAIL_USER,
    },
    to: requestData.user?.email_id,
    subject: `DGX Instance Request Approved (${
      requestData.admin || "Administrator"
    })`,
    text: generateApprovalEmailText(requestData, credentials),
    html: generateApprovalEmailHtml(requestData, credentials),
  };

  return transporter.sendMail(mailOptions);
};

// NEW: Endpoint to trigger approval email from frontend
const sendApprovalEmail = async (request, response) => {
  try {
    const { requestData, credentials } = request.body;

    await sendApprovalEmailInternal(requestData, credentials);

    return response.json({
      success: true,
      message: "Approval email sent successfully",
    });
  } catch (error) {
    console.error("Approval email error:", error);
    return response.status(500).json({
      success: false,
      message: "Failed to send approval email",
    });
  }
};

const sendRejectionEmail = async (request, response) => {
  try {
    const { requestData, remarks } = request.body;

    if (!requestData || !remarks) {
      return response.status(400).json({
        success: false,
        message:
          "Missing required fields: requestData and remarks are required",
      });
    }

    const mailOptions = {
      from: {
        name: "DGX Administrator",
        address: process.env.EMAIL_USER,
      },
      to: requestData.user?.email_id,
      subject: `DGX Instance Request Rejected (${
        requestData.admin || "Administrator"
      })`,
      text: generateRejectionEmailText(requestData, remarks, "rejection"),
      html: generateRejectionEmailHtml(requestData, remarks, "rejection"),
    };

    const result = await transporter.sendMail(mailOptions);
    console.log("Rejection email sent successfully:", result.messageId);

    return response.json({
      success: true,
      message: "Rejection email sent successfully",
      data: { messageId: result.messageId },
    });
  } catch (error) {
    console.error("Error sending rejection email:", error);
    return response.status(500).json({
      success: false,
      message: "Failed to send rejection email",
      error: error.message,
    });
  }
};

const sendRevokeEmail = async (request, response) => {
  try {
    const { requestData, remarks } = request.body;

    if (!requestData || !remarks) {
      return response.status(400).json({
        success: false,
        message:
          "Missing required fields: requestData and remarks are required",
      });
    }

    const mailOptions = {
      from: {
        name: "DGX Administrator",
        address: process.env.EMAIL_USER,
      },
      to: requestData.user?.email_id,
      subject: `DGX Instance Request Revoked (${
        requestData.admin || "Administrator"
      })`,
      text: generateRejectionEmailText(requestData, remarks, "revoke"),
      html: generateRejectionEmailHtml(requestData, remarks, "revoke"),
    };

    const result = await transporter.sendMail(mailOptions);
    console.log("Revoke email sent successfully:", result.messageId);

    return response.json({
      success: true,
      message: "Revoke email sent successfully",
      data: { messageId: result.messageId },
    });
  } catch (error) {
    console.error("Error sending revoke email:", error);
    return response.status(500).json({
      success: false,
      message: "Failed to send revoke email",
      error: error.message,
    });
  }
};

const sendGrantAccessEmail = async (request, response) => {
  try {
    const { requestData } = request.body;

    if (!requestData) {
      return response.status(400).json({
        success: false,
        message: "Missing required field: requestData is required",
      });
    }

    const mailOptions = {
      from: {
        name: "DGX Administrator",
        address: process.env.EMAIL_USER,
      },
      to: requestData.user?.email_id,
      subject: `DGX Instance Access Granted (${
        requestData.admin || "Administrator"
      })`,
      text: generateGrantAccessEmailText(requestData),
      html: generateGrantAccessEmailHtml(requestData),
    };

    const result = await transporter.sendMail(mailOptions);
    console.log("Grant access email sent successfully:", result.messageId);

    return response.json({
      success: true,
      message: "Grant access email sent successfully",
      data: { messageId: result.messageId },
    });
  } catch (error) {
    console.error("Error sending grant access email:", error);
    return response.status(500).json({
      success: false,
      message: "Failed to send grant access email",
      error: error.message,
    });
  }
};

// Email template functions for functional approval (sent to admin)

function generateFunctionalApprovalEmailText(requestData) {
  const userName = requestData.fullName || "User";

  return `Dear Admin,

This is to inform you that the DGX H200 instance request from ${userName} (Request Id ${requestData.instance_request_id}) has been successfully approved by the functional administrator.

The details of the user's request are as follows:

${formatRequestDetails(requestData, "approval")}

This request requires technical review and approval. Please take the necessary action.

Best regards,
DGX Administration Team`;
}

function generateFunctionalApprovalEmailHtml(requestData) {
  const userName = requestData.fullName || "User";

  return `
  <html>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <p>Dear <strong>Admin</strong>,</p>
      
      <p>This is to inform you that the DGX H200 instance request from <strong>${userName}</strong> (Request Id <strong>${requestData.instance_request_id}</strong>) has been successfully approved by the functional administrator.</p>
      
      <p>The details of the user's request are as follows:</p>

      ${formatRequestDetailsHtml(requestData, "approval")}

      <p>This request requires technical review and approval. Please take the necessary action.</p>
      
      <p>Best regards,<br>
      <strong>DGX Administration Team</strong></p>
    </body>
  </html>`;
}

// Internal function to send functional approval email to admin
const sendFunctionalApprovalEmailInternal = async (requestData) => {
  if (!requestData) {
    throw new Error("requestData is required");
  }

  const mailOptions = {
    from: {
      name: "DGX Administrator",
      address: process.env.EMAIL_USER,
    },
    to: process.env.EMAIL_ADMIN,
    subject: `DGX Instance Request Approved (${
      requestData.admin || "Administrator"
    })`,
    text: generateFunctionalApprovalEmailText(requestData),
    html: generateFunctionalApprovalEmailHtml(requestData),
  };

  return transporter.sendMail(mailOptions);
};

// Endpoint to trigger functional approval email from frontend
const sendFunctionalApprovalEmail = async (request, response) => {
  try {
    const { requestData } = request.body;

    if (!requestData) {
      return response.status(400).json({
        success: false,
        message: "Missing required field: requestData is required",
      });
    }

    await sendFunctionalApprovalEmailInternal(requestData);

    return response.json({
      success: true,
      message: "Functional approval email sent successfully to admin",
    });
  } catch (error) {
    console.error("Functional approval email error:", error);
    return response.status(500).json({
      success: false,
      message: "Failed to send functional approval email",
    });
  }
};

const DATABASE_TIMEZONE = "Asia/Kolkata"; // IST (UTC+5:30)

cron.schedule("* * * * *", async () => {
  try {
    const now = new Date();

    const approvedTechStatus = await Status.findOne({
      where: { status_name: "Approved-Technical" },
    });

    if (!approvedTechStatus) return;

    // ✅ Fetch ALL necessary data including master tables
    const requests = await sequelize.query(
      `
      SELECT 
        ir.instance_request_id,
        ir.user_id,
        ir.login_id,
        ir.password,
        ir.additional_information,
        ir.technical_approval_email_sent,
        ir.cpu_id,
        ir.ram_id,
        ir.gpu_id,
        ir.image_id,
        ir.gpu_partition_id,
        ir.work_description,
        ir.user_type_id,
        ir.updated_by,
        uts.selected_date,
        ts.time_slot,
        ts.time_slot_id,
        du.first_name,
        du.last_name,
        du.email_id,
        c.number_of_cpu,
        r.ram,
        g.gpu_vendor,
        i.image_name,
        gp.gpu_partition,
        ut.user_type,
        updater.first_name as updater_first_name,
        updater.last_name as updater_last_name
      FROM instance_request ir
      JOIN dgx_user du 
        ON du.user_id = ir.user_id
      JOIN user_time_slot uts 
        ON uts.instance_request_id = ir.instance_request_id
      JOIN time_slot ts 
        ON ts.time_slot_id = uts.time_slot_id
      LEFT JOIN cpu c ON c.cpu_id = ir.cpu_id
      LEFT JOIN ram r ON r.ram_id = ir.ram_id
      LEFT JOIN gpu g ON g.gpu_id = ir.gpu_id
      LEFT JOIN image i ON i.image_id = ir.image_id
      LEFT JOIN gpu_partition gp ON gp.gpu_partition_id = ir.gpu_partition_id
      LEFT JOIN user_type ut ON ut.user_type_id = ir.user_type_id
      LEFT JOIN dgx_user updater ON updater.user_id = ir.updated_by
      WHERE ir.status_id = :statusId
        AND ir.technical_approval_email_sent = false
      ORDER BY uts.selected_date ASC, ts.time_slot ASC
      `,
      {
        replacements: { statusId: approvedTechStatus.status_id },
        type: sequelize.QueryTypes.SELECT,
      },
    );

    console.log(
      `\n📧 CRON JOB RUNNING - Checking ${requests.length} approval requests...`,
    );
    console.log(`📍 Database Timezone: ${DATABASE_TIMEZONE}`);

    // ✅ Group requests by instance_request_id and collect all time slots
    const groupedRequests = {};

    for (const req of requests) {
      if (!groupedRequests[req.instance_request_id]) {
        groupedRequests[req.instance_request_id] = {
          ...req,
          timeSlots: [],
        };
      }
      // Collect all time slots for this request
      groupedRequests[req.instance_request_id].timeSlots.push({
        selected_date: req.selected_date,
        time_slot: req.time_slot,
        time_slot_id: req.time_slot_id,
      });
    }

    for (const [requestId, req] of Object.entries(groupedRequests)) {
      try {
        // Get the earliest time slot to determine when to send email
        const earliestSlot = req.timeSlots[0];

        let dateString;
        if (earliestSlot.selected_date.includes("T")) {
          dateString = earliestSlot.selected_date.split("T")[0];
        } else {
          dateString = earliestSlot.selected_date.toString().split(" ")[0];
        }

        const timeString = earliestSlot.time_slot.toString().trim().split(":");
        const hours = parseInt(timeString[0]);
        const minutes = parseInt(timeString[1]);

        const startDateTime = moment
          .tz(
            `${dateString} ${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:00`,
            "YYYY-MM-DD HH:mm:ss",
            DATABASE_TIMEZONE,
          )
          .toDate();

        const emailTime = new Date(startDateTime.getTime() - 5 * 60 * 1000);
        const nowUTC = new Date();

        console.log(`\n${"=".repeat(80)}`);
        console.log(`🔍 REQUEST ID: ${req.instance_request_id}`);
        console.log(`${"=".repeat(80)}`);

        const timeDiff = nowUTC - emailTime;
        const isTimeToSend = timeDiff >= 0 && timeDiff < 60 * 1000;

        if (isTimeToSend) {
          console.log(`   ✅ SENDING EMAIL NOW!`);

          try {
            // ✅ Format all time slots for this request
            const formattedDateTime = formatTimeSlots(req.timeSlots);

            // ✅ Prepare complete email data
            const fullName =
              `${req.first_name || ""} ${req.last_name || ""}`.trim();
            const updaterName =
              `${req.updater_first_name || ""} ${req.updater_last_name || ""}`.trim();

            const emailData = {
              instance_request_id: req.instance_request_id,
              fullName: fullName,
              user: {
                email_id: req.email_id,
              },
              cpuName: req.number_of_cpu,
              ramName: req.ram,
              gpuVendorName: req.gpu_vendor,
              gpuPartitionName: req.gpu_partition,
              customImageName: req.image_name,
              userTypeName: req.user_type,
              date_time: formattedDateTime, // ✅ Formatted time slots
              work_description: req.work_description,
              admin: "Technical",
              loggedInUserName: updaterName,
            };

            const credentials = {
              loginId: req.login_id,
              password: req.password,
              additionalInfo: req.additional_information,
            };

            // Send the approval email
            await sendApprovalEmailInternal(emailData, credentials);
            console.log(`   📨 Email sent successfully!`);

            // Mark as sent
            await sequelize.query(
              `UPDATE instance_request 
               SET technical_approval_email_sent = true, updated_timestamp = NOW()
               WHERE instance_request_id = ?`,
              {
                replacements: [req.instance_request_id],
                type: sequelize.QueryTypes.UPDATE,
              },
            );
            console.log(`   ✅ Database flag updated!`);
          } catch (sendError) {
            console.error(`   ❌ Error:`, sendError.message);
          }
        }
        console.log(`${"=".repeat(80)}`);
      } catch (processingError) {
        console.error(
          `❌ Error processing request ${req.instance_request_id}:`,
          processingError.message,
        );
      }
    }

    console.log(`\n✅ Cron job cycle completed\n`);
  } catch (error) {
    console.error("❌ CRON JOB ERROR:", error.message);
  }
});

// ✅ Helper function to format time slots (same logic as frontend)
function formatTimeSlots(timeSlots) {
  if (!timeSlots || timeSlots.length === 0) {
    return "No time slots available";
  }

  // Group by date
  const groupedDetails = {};

  for (const slot of timeSlots) {
    const date = slot.selected_date;
    const timeSlotValue = slot.time_slot;

    if (date) {
      const formattedDate = new Date(date).toLocaleDateString("en-GB");

      if (!groupedDetails[formattedDate]) {
        groupedDetails[formattedDate] = [];
      }
      groupedDetails[formattedDate].push(timeSlotValue);
    }
  }

  // Sort dates
  const sortedDates = Object.keys(groupedDetails).sort((a, b) => {
    const [dayA, monthA, yearA] = a.split("/").map(Number);
    const [dayB, monthB, yearB] = b.split("/").map(Number);
    return (
      new Date(yearA, monthA - 1, dayA).getTime() -
      new Date(yearB, monthB - 1, dayB).getTime()
    );
  });

  // Helper functions
  const extractStartTime = (timeSlotStr) => {
    if (!timeSlotStr) return "";
    if (timeSlotStr.includes("-")) return timeSlotStr.split("-")[0].trim();
    if (timeSlotStr.includes(" to "))
      return timeSlotStr.split(" to ")[0].trim();
    return timeSlotStr.trim();
  };

  const timeToMinutes = (timeStr) => {
    const cleanTime = extractStartTime(timeStr);
    const [hours, minutes] = cleanTime.split(":").map(Number);
    return hours * 60 + minutes;
  };

  const formatTimeRanges = (times) => {
    if (times.length === 0) return "No time slots";

    const timeObjects = times
      .map((time) => ({
        original: extractStartTime(time),
        minutes: timeToMinutes(time),
      }))
      .sort((a, b) => a.minutes - b.minutes);

    const ranges = [];
    let currentRangeStart = timeObjects[0];
    let currentRangeEnd = timeObjects[0];

    for (let i = 1; i < timeObjects.length; i++) {
      const currentTime = timeObjects[i];
      if (currentTime.minutes - currentRangeEnd.minutes === 30) {
        currentRangeEnd = currentTime;
      } else {
        ranges.push(
          currentRangeStart.minutes === currentRangeEnd.minutes
            ? currentRangeStart.original
            : `${currentRangeStart.original} - ${currentRangeEnd.original}`,
        );
        currentRangeStart = currentTime;
        currentRangeEnd = currentTime;
      }
    }

    ranges.push(
      currentRangeStart.minutes === currentRangeEnd.minutes
        ? currentRangeStart.original
        : `${currentRangeStart.original} - ${currentRangeEnd.original}`,
    );

    return ranges.join(" , ");
  };

  // Build formatted output
  let formattedOutput = "";

  for (let i = 0; i < sortedDates.length; i++) {
    const date = sortedDates[i];
    const times = groupedDetails[date];

    const formattedDate = date.replace(/\//g, "-");
    const formattedTimeRanges =
      times && times.length > 0 ? formatTimeRanges(times) : "No time slots";

    formattedOutput += `${formattedDate}\n[${formattedTimeRanges}]`;
    if (i < sortedDates.length - 1) formattedOutput += "\n";
  }

  return formattedOutput;
}

module.exports = {
  sendApprovalEmail,
  sendApprovalEmailInternal,
  sendRejectionEmail,
  sendRevokeEmail,
  sendGrantAccessEmail,
  sendFunctionalApprovalEmail, // ✅ Add this
  sendFunctionalApprovalEmailInternal, // ✅ Add this
};
