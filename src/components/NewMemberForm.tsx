import { useState } from "react";
import type { FormEvent } from "react";
import {
  Box,
  TextField,
  Button,
  MenuItem,
  Stack,
  Alert,
  CircularProgress,
} from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createMember } from "../api/members";
import type { Sex, Status } from "../api/members";

interface FormData {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  sex: Sex;
  status: Status;
}

const defaultFormData: FormData = {
  firstName: "",
  lastName: "",
  dateOfBirth: "",
  sex: "female",
  status: "ACTIVE",
};

export const NewMemberForm = () => {
  const [formData, setFormData] = useState<FormData>(defaultFormData);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createMember,
    onSuccess: () => {
      setFormData(defaultFormData);
      queryClient.invalidateQueries({ queryKey: ["members"] });
    },
  });

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Stack spacing={3}>
        {mutation.isError && (
          <Alert severity="error">"Failed to create member</Alert>
        )}
        {mutation.isSuccess && (
          <Alert severity="success">Member created successfully!</Alert>
        )}

        <TextField
          label="First Name"
          value={formData.firstName}
          onChange={(e) => handleChange("firstName", e.target.value)}
          required
          fullWidth
        />

        <TextField
          label="Last Name"
          value={formData.lastName}
          onChange={(e) => handleChange("lastName", e.target.value)}
          required
          fullWidth
        />

        <TextField
          label="Date of Birth"
          type="date"
          value={formData.dateOfBirth}
          onChange={(e) => handleChange("dateOfBirth", e.target.value)}
          required
          fullWidth
          InputLabelProps={{ shrink: true }}
        />

        <TextField
          label="Sex"
          select
          value={formData.sex}
          onChange={(e) => handleChange("sex", e.target.value as Sex)}
          required
          fullWidth
        >
          <MenuItem value="female">Female</MenuItem>
          <MenuItem value="male">Male</MenuItem>
          <MenuItem value="other">Other</MenuItem>
        </TextField>

        <TextField
          label="Status"
          select
          value={formData.status}
          onChange={(e) => handleChange("status", e.target.value as Status)}
          required
          fullWidth
        >
          <MenuItem value="ACTIVE">Active</MenuItem>
          <MenuItem value="PAUSED">Paused</MenuItem>
        </TextField>

        <Button
          type="submit"
          variant="contained"
          size="large"
          disabled={mutation.isPending}
          fullWidth
        >
          {mutation.isPending ? (
            <CircularProgress size={24} />
          ) : (
            "Create Member"
          )}
        </Button>
      </Stack>
    </Box>
  );
};
