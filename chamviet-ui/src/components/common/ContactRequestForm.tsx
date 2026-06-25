import { useState } from "react";

import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import { submitContactRequest } from "../../services/contactService";
import { yupEmail, yupName } from "../../utils/Validation";
import type { ContactRequestType } from "../../types/contact";

interface ContactRequestFormProps {
  requestType: ContactRequestType;
  submitLabel: string;
  successMessage: string;
  accent?: "primary" | "light";
}

interface FormValues {
  name: string;
  email: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

const INITIAL_VALUES: FormValues = {
  name: "",
  email: "",
  message: "",
};

export default function ContactRequestForm({
  requestType,
  submitLabel,
  successMessage,
  accent = "primary",
}: ContactRequestFormProps) {
  const [values, setValues] = useState<FormValues>(INITIAL_VALUES);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  async function validateForm(nextValues: FormValues): Promise<FormErrors> {
    const nextErrors: FormErrors = {};

    try {
      await yupName.validate(nextValues.name);
    } catch (error) {
      nextErrors.name = error instanceof Error ? error.message : "Vui lòng nhập họ tên.";
    }

    try {
      await yupEmail.validate(nextValues.email);
    } catch (error) {
      nextErrors.email = error instanceof Error ? error.message : "Vui lòng nhập email hợp lệ.";
    }

    const message = nextValues.message.trim();
    if (message.length < 10) {
      nextErrors.message = "Nội dung cần ít nhất 10 ký tự.";
    } else if (message.length > 2000) {
      nextErrors.message = "Nội dung tối đa 2000 ký tự.";
    }

    return nextErrors;
  }

  function handleChange(field: keyof FormValues, value: string) {
    setValues((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
    setSubmitError(null);
    setSubmitSuccess(null);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors = await validateForm(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      await submitContactRequest({
        ...values,
        name: values.name.trim(),
        email: values.email.trim(),
        message: values.message.trim(),
        type: requestType,
      });

      setSubmitSuccess(successMessage);
      setValues(INITIAL_VALUES);
      setErrors({});
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Không gửi được thông tin. Vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const lightAccent = accent === "light";
  const inputSx = lightAccent
    ? {
        "& .MuiOutlinedInput-root": {
          borderRadius: "12px",
          backgroundColor: "rgba(255, 255, 255, 0.96)",
        },
        "& .MuiOutlinedInput-input": {
          py: 1.55,
        },
      }
    : {
        "& .MuiOutlinedInput-root": {
          borderRadius: "10px",
          backgroundColor: "white",
        },
        "& .MuiOutlinedInput-input": {
          py: 1.45,
        },
      };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Stack spacing={1.8}>
        <TextField
          label="Họ và tên"
          value={values.name}
          onChange={(event) => handleChange("name", event.target.value)}
          error={Boolean(errors.name)}
          helperText={errors.name}
          disabled={isSubmitting}
          fullWidth
          sx={inputSx}
        />
        <TextField
          label="Email"
          type="email"
          value={values.email}
          onChange={(event) => handleChange("email", event.target.value)}
          error={Boolean(errors.email)}
          helperText={errors.email}
          disabled={isSubmitting}
          fullWidth
          sx={inputSx}
        />
        <TextField
          label="Nội dung"
          value={values.message}
          onChange={(event) => handleChange("message", event.target.value)}
          error={Boolean(errors.message)}
          helperText={errors.message || "Để lại nhu cầu hoặc câu hỏi để Chạm Việt phản hồi."}
          disabled={isSubmitting}
          multiline
          minRows={3}
          fullWidth
          sx={inputSx}
        />

        <Button
          type="submit"
          variant="contained"
          disableElevation
          disabled={isSubmitting}
          sx={{
            minHeight: 50,
            borderRadius: "10px",
            textTransform: "none",
            fontWeight: 900,
            alignSelf: "flex-start",
            px: 3,
            backgroundColor: lightAccent ? "#ffffff" : "primary.main",
            color: lightAccent ? "primary.main" : "#ffffff",
            transition: "background-color 180ms ease, color 180ms ease, transform 180ms ease, box-shadow 180ms ease",
            "&:hover": {
              backgroundColor: lightAccent ? "#fff7df" : "primary.dark",
              transform: "translateY(-2px)",
              boxShadow: lightAccent
                ? "0 12px 24px rgba(255, 255, 255, 0.18)"
                : "0 16px 28px rgba(168, 50, 50, 0.22)",
            },
            "&:focus-visible": {
              outline: lightAccent
                ? "3px solid rgba(255, 255, 255, 0.55)"
                : "3px solid rgba(168, 50, 50, 0.28)",
              outlineOffset: 2,
            },
          }}
        >
          {isSubmitting ? "Đang gửi..." : submitLabel}
        </Button>

        {submitSuccess && <Alert severity="success">{submitSuccess}</Alert>}
        {submitError && <Alert severity="error">{submitError}</Alert>}

        {!submitError && !submitSuccess && (
          <Typography sx={{ color: "var(--text-sub)", fontSize: 13.5, lineHeight: 1.7 }}>
            Gửi xong là đội ngũ Chạm Việt sẽ nhận được thông tin để phản hồi cho bạn.
          </Typography>
        )}
      </Stack>
    </Box>
  );
}
