import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import OutlinedInput from "@mui/material/OutlinedInput";
import { gql, useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
interface ForgotPasswordProps {
  open: boolean;
  handleClose: () => void;
}

const OTP_MUTATION = gql`
  mutation sendOtpForUserAuth($email: String!) {
    SendOtp(email: $email) {
      message
      isSent
    }
  }
`;

export default function ForgotPassword({
  open,
  handleClose,
}: ForgotPasswordProps) {
  const [email, setEmail] = React.useState("");
  const [sendOtpForUserAuth, { loading, error, data }] =
    useMutation(OTP_MUTATION);
  const navigate = useNavigate();

  const handleSendOtp = () => {
    if (email.trim() === "") {
      toast.error("Email address is required");
      return;
    }
    sendOtpForUserAuth({ variables: { email } });
  };

  React.useEffect(() => {
    if (data) {
      if (data.SendOtp.isSent) {
        navigate("/reset");
      } else {
        toast.error(
          "Error occurred: No user with the provided email address is registered"
        );
      }
    }
  }, [data, navigate]);

  return (
    
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{
        sx: { backgroundImage: "none" },
      }}
    >
      <DialogTitle>Reset Password</DialogTitle>
      <DialogContent
        sx={{ display: "flex", flexDirection: "column", gap: 2, width: "100%" }}
      >
        <DialogContentText>
          Enter your account&apos;s email address, and we&apos;ll send you an
          OTP to reset your password.
        </DialogContentText>
        {error && (
          <DialogContentText color="error">
            Error occurred while sending OTP. Please try again later.
          </DialogContentText>
        )}
        <OutlinedInput
          autoFocus
          required
          margin="dense"
          id="email"
          name="email"
          placeholder="Email address"
          type="email"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </DialogContent>
      <DialogActions sx={{ pb: 3, px: 3 }}>
        <Button onClick={handleClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSendOtp} disabled={loading}>
          {loading ? (
          <Box sx={{ display: "flex" }}>
            <CircularProgress />
          </Box>
          ): (
            "Proceed"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
