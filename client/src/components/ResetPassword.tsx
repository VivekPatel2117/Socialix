import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  OutlinedInput,
} from "@mui/material";
import { toast } from "react-toastify";
import { gql, useMutation } from "@apollo/client";
import Spinner from "./Spinner";
import { useNavigate } from "react-router-dom";

const RESET_PASSWORD_MUTATION = gql`
  mutation resetPassword($newPassword: String!) {
    resetPassword(newPassword: $newPassword) {
      message
      isCreated
    }
  }
`;

const VERIFY_OTP_MUTATION = gql`
  mutation verifyOtp($otp: String!) {
    verifyOtp(otp: $otp) {
      message
      isCreated
    }
  }
`;

export default function ResetPassword() {
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [verifyOtp, { loading: verifyOtpLoading }] = useMutation(
    VERIFY_OTP_MUTATION,
    {
      onCompleted: (data) => {
        if (data.verifyOtp.isCreated) {
          toast.success(data.verifyOtp.message);
          setIsOtpVerified(true);
        } else {
          toast.error(data.verifyOtp.message);
        }
      },
      onError: () => {
        toast.error("Error occurred while verifying OTP.");
      },
    }
  );

  const [resetFunc, { loading: resetLoading }] = useMutation(
    RESET_PASSWORD_MUTATION,
    {
      onCompleted: (data) => {
        if (data.resetPassword.isCreated) {
          toast.success(data.resetPassword.message);
          navigate("/");
        } else {
          toast.error(data.resetPassword.message);
        }
      },
      onError: () => {
        toast.error("Error occurred while resetting password.");
      },
    }
  );

  const handleOtpSubmit = () => {
    if (otp.length === 6) {
      verifyOtp({ variables: { otp } });
    } else {
      toast.error("Please enter a valid 6-digit OTP.");
    }
  };

  const handlePasswordReset = (event: React.FormEvent) => {
    event.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Passwords don't match. Please try again.");
      return;
    }
    resetFunc({ variables: { newPassword } });
  };

  return (
    <>
      {isOtpVerified ? (
        <Box
          component="form"
          onSubmit={handlePasswordReset}
          sx={{
            width: "100%",
            maxWidth: 400,
            margin: "auto",
            padding: 3,
            display: "flex",
            flexDirection: "column",
            gap: 2,
            boxShadow: 3,
            borderRadius: 2,
            mt: 4,
          }}
        >
          <Typography variant="h5" component="h1" textAlign="center">
            Reset Password
          </Typography>
          <TextField
            required
            label="New Password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            fullWidth
          />
          <TextField
            required
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            fullWidth
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={resetLoading}
            sx={{ mt: 2 }}
          >
            {resetLoading ? <CircularProgress size={24} /> : "Submit"}
          </Button>
        </Box>
      ) : (
        <div>
          <DialogTitle>Enter OTP</DialogTitle>
          <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <DialogContentText>
              Please enter the 6-digit OTP sent to your email.
            </DialogContentText>
            <OutlinedInput
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
              fullWidth
              sx={{ textAlign: "center", fontSize: "18px" }}
            />
          </DialogContent>
          <DialogActions sx={{ pb: 3, px: 3 }}>
            <Button onClick={() => navigate("/")}>Cancel</Button>
            <Button
              variant="contained"
              disabled={verifyOtpLoading || otp.length !== 6}
              onClick={handleOtpSubmit}
            >
              {verifyOtpLoading ? <CircularProgress size={24} /> : "Verify OTP"}
            </Button>
          </DialogActions>
        </div>
      )}
    </>
  );
}
