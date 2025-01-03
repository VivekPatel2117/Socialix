declare const _default: {
    sendOtpForAuthentication: (recipientEmail: string) => Promise<void>;
    validateOtp: (otpInput: string) => boolean;
    getOtp: () => unknown;
    getEmail: () => unknown;
};
export default _default;
