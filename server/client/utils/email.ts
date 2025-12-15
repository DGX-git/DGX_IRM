// utils/emailUtils.ts
export const sendApprovalEmail = async (requestData: any, credentials: any) => {
  try {
    const response = await fetch(process.env.NEXT_PUBLIC_DGX_API_URL + '/emails/send-approval-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'approval',
        requestData,
        credentials,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to send approval email');
    }

    const result = await response.json();
    console.log('Approval email sent successfully:', result);
    return result;
  } catch (error) {
    console.error('Error sending approval email:', error);
    throw error;
  }
};

export const sendRejectionEmail = async (requestData: any, remarks: string) => {
  try {
    const response = await fetch(process.env.NEXT_PUBLIC_DGX_API_URL + '/emails/send-rejection-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'rejection',
        requestData,
        remarks,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to send rejection email');
    }

    const result = await response.json();
    console.log('Rejection email sent successfully:', result);
    return result;
  } catch (error) {
    console.error('Error sending rejection email:', error);
    throw error;
  }
};

export const sendRevokeEmail = async (requestData: any, remarks: string) => {
  try {
    const response = await fetch(process.env.NEXT_PUBLIC_DGX_API_URL + '/emails/send-revoke-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'revoke',
        requestData,
        remarks,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to send revoke email');
    }

    const result = await response.json();
    console.log('Revoke email sent successfully:', result);
    return result;
  } catch (error) {
    console.error('Error sending revoke email:', error);
    throw error;
  }
};

export const sendGrantAccessEmail = async (requestData: any) => {
  try {
    const response = await fetch(process.env.NEXT_PUBLIC_DGX_API_URL + '/emails/send-grant-access-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'grantAccess',
        requestData,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to send grant access email');
    }

    const result = await response.json();
    console.log('Grant access email sent successfully:', result);
    return result;
  } catch (error) {
    console.error('Error sending grant access email:', error);
    throw error;
  }
};