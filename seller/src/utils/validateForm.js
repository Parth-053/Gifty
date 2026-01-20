// Password: 8+ chars, uppercase, number, symbol
export const validatePassword = (password) => {
    const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return re.test(password);
};

// Indian GST Validation
export const validateGST = (gst) => {
    const re = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    return re.test(gst);
};

// Phone Number (10 Digits)
export const validatePhone = (phone) => {
    const re = /^[6-9]\d{9}$/;
    return re.test(phone);
};

// Bank IFSC Code
export const validateIFSC = (ifsc) => {
    const re = /^[A-Z]{4}0[A-Z0-9]{6}$/;
    return re.test(ifsc);
};