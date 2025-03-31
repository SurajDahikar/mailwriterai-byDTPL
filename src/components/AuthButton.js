import { signInWithGoogle, logout } from "../utils/auth";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

export default function AuthButton({ user }) {
  return (
    <Box sx={{ textAlign: "center", mt: 2 }}>
      {user ? (
        <Button
          variant="contained"
          color="error"
          onClick={logout}
          sx={{
            px: 4,
            py: 1,
            borderRadius: "8px",
            textTransform: "none",
            fontWeight: "bold",
            fontSize: "16px",
            "&:hover": {
              backgroundColor: "#d32f2f",
            },
          }}
        >
          Logout
        </Button>
      ) : (
        <Button
          variant="contained"
          color="primary"
          onClick={signInWithGoogle}
          sx={{
            px: 4,
            py: 1,
            borderRadius: "8px",
            textTransform: "none",
            fontWeight: "bold",
            fontSize: "16px",
            "&:hover": {
              backgroundColor: "#1565c0",
            },
          }}
        >
          Sign In with Google
        </Button>
      )}
    </Box>
  );
}
