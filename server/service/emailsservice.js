const sgMail = require("@sendgrid/mail");

// Configure SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Verify SendGrid configuration
const verifySendGrid = async () => {
  try {
    if (process.env.SENDGRID_API_KEY) {
      console.log("SendGrid API key is configured and ready to send emails");
    } else {
      console.error("SendGrid API key is not configured");
    }
  } catch (error) {
    console.error("SendGrid configuration error:", error);
  }
};

verifySendGrid();

// Helper function to format request details
function formatRequestDetails(requestData, type) {
  const fields = [
    {
      label: "User Type",
      value: String(
        requestData.userTypeName ||
          requestData.user_type ||
          requestData.userType ||
          ""
      ),
    },
    {
      label: "Selected Date / Time",
      value: String(
        requestData.date_time ||
          requestData.selectedDateTime ||
          requestData.dateTime ||
          ""
      ),
    },
    {
      label: "Image",
      value: String(
        requestData.customImageName ||
          requestData.custom_image ||
          requestData.customImage ||
          ""
      ),
    },
    {
      label: "Requested CPUs",
      value: String(
        requestData.cpuName ||
          requestData.cpu ||
          requestData.cpus ||
          requestData.requested_cpu ||
          ""
      ),
    },
    {
      label: "Requested RAM in GB",
      value: String(
        requestData.ramName ||
          requestData.ram ||
          requestData.memory ||
          requestData.requested_ram ||
          ""
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
          ""
      ),
    },
    {
      label: "GPU Vendor",
      value: String(
        requestData.gpuVendorName ||
          requestData.gpuVendor ||
          requestData.gpu_vendor_id ||
          ""
      ),
    },
    {
      label: "Work Description",
      value: String(
        requestData.work_description ||
          requestData.workDescription ||
          requestData.description ||
          ""
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
          ""
      ),
    },
    {
      label: "Selected Date / Time",
      value: String(
        requestData.date_time ||
          requestData.selectedDateTime ||
          requestData.dateTime ||
          ""
      ),
    },
    {
      label: "Image",
      value: String(
        requestData.customImageName ||
          requestData.custom_image ||
          requestData.customImage ||
          ""
      ),
    },
    {
      label: "Requested CPUs",
      value: String(
        requestData.cpuName ||
          requestData.cpu ||
          requestData.cpus ||
          requestData.requested_cpu ||
          ""
      ),
    },
    {
      label: "Requested RAM in GB",
      value: String(
        requestData.ramName ||
          requestData.ram ||
          requestData.memory ||
          requestData.requested_ram ||
          ""
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
          ""
      ),
    },
    {
      label: "GPU Vendor",
      value: String(
        requestData.gpuVendorName ||
          requestData.gpuVendor ||
          requestData.gpu_vendor_id ||
          ""
      ),
    },
    {
      label: "Work Description",
      value: String(
        requestData.work_description ||
          requestData.workDescription ||
          requestData.description ||
          ""
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
    </tr>`
    )
    .join("");

  return `
  <table style="border-collapse: collapse; width: 100%; font-family: Arial, sans-serif; font-size: 14px;">
    ${tableRows}
  </table>`;
}

// Email template generators
function generateApprovalEmailText(requestData, credentials) {
  const userName =
    `${requestData.user?.firstname || ""} ${
      requestData.user?.lastname || ""
    }`.trim() || "User";

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
  const userName =
    `${requestData.user?.firstname || ""} ${
      requestData.user?.lastname || ""
    }`.trim() || "User";

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
  const userName =
    `${requestData.user?.firstname || ""} ${
      requestData.user?.lastname || ""
    }`.trim() || "User";
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
  const userName =
    `${requestData.user?.firstname || ""} ${
      requestData.user?.lastname || ""
    }`.trim() || "User";
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
        isRevoke ? "revoke" : "rejection"
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
  const userName =
    `${requestData.user?.firstname || ""} ${
      requestData.user?.lastname || ""
    }`.trim() || "User";

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
  const userName =
    `${requestData.user?.firstname || ""} ${
      requestData.user?.lastname || ""
    }`.trim() || "User";

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

// Main email sending service functions
const sendApprovalEmail = async (request, response) => {
  try {
    const { requestData, credentials } = request.body;

    if (!requestData || !credentials) {
      return response.status(400).json({
        success: false,
        message:
          "Missing required fields: requestData and credentials are required",
      });
    }

    const msg = {
      to: requestData.user?.email_id,
      from: process.env.SENDGRID_VERIFIED_EMAIL,
      subject: `DGX Instance Request Approved (${
        requestData.admin || "Administrator"
      })`,
      text: generateApprovalEmailText(requestData, credentials),
      html: generateApprovalEmailHtml(requestData, credentials),
    };

    await sgMail.send(msg);
    console.log("Approval email sent successfully via SendGrid");

    return response.json({
      success: true,
      message: "Approval email sent successfully",
    });
  } catch (error) {
    console.error("Error sending approval email:", error);
    return response.status(500).json({
      success: false,
      message: "Failed to send approval email",
      error: error.message,
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

    const msg = {
      to: requestData.user?.email_id,
      from: process.env.SENDGRID_VERIFIED_EMAIL,
      subject: `DGX Instance Request Rejected (${
        requestData.admin || "Administrator"
      })`,
      text: generateRejectionEmailText(requestData, remarks, "rejection"),
      html: generateRejectionEmailHtml(requestData, remarks, "rejection"),
    };

    await sgMail.send(msg);
    console.log("Rejection email sent successfully via SendGrid");

    return response.json({
      success: true,
      message: "Rejection email sent successfully",
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

    const msg = {
      to: requestData.user?.email_id,
      from: process.env.SENDGRID_VERIFIED_EMAIL,
      subject: `DGX Instance Request Revoked (${
        requestData.admin || "Administrator"
      })`,
      text: generateRejectionEmailText(requestData, remarks, "revoke"),
      html: generateRejectionEmailHtml(requestData, remarks, "revoke"),
    };

    await sgMail.send(msg);
    console.log("Revoke email sent successfully via SendGrid");

    return response.json({
      success: true,
      message: "Revoke email sent successfully",
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

    const msg = {
      to: requestData.user?.email_id,
      from: process.env.SENDGRID_VERIFIED_EMAIL,
      subject: `DGX Instance Access Granted (${
        requestData.admin || "Administrator"
      })`,
      text: generateGrantAccessEmailText(requestData),
      html: generateGrantAccessEmailHtml(requestData),
    };

    await sgMail.send(msg);
    console.log("Grant access email sent successfully via SendGrid");

    return response.json({
      success: true,
      message: "Grant access email sent successfully",
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

module.exports = {
  sendApprovalEmail,
  sendRejectionEmail,
  sendRevokeEmail,
  sendGrantAccessEmail,
};