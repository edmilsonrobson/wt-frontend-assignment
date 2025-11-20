import {
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Container,
  Box,
  TextField,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import { useState, useRef, type FormEvent, type ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { UserAvatar } from "./UserAvatar";
import type { Member, UpdateMemberData } from "../api/members";
import { deleteMember, updateMember, uploadPhoto } from "../api/members";
import styled from "styled-components";

const StyledContainer = styled(Container)`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const InvisibleInput = styled.input`
  display: none;
`;

interface IProps {
  member: Member;
}

export const EditMemberDetails = ({ member }: IProps) => {
  const navigate = useNavigate();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [uploadPhotoError, setUploadPhotoError] = useState<string>("");

  const [formData, setFormData] = useState<UpdateMemberData>({
    firstName: member.firstName,
    lastName: member.lastName,
    dateOfBirth: member.dateOfBirth,
    sex: member.sex,
    status: member.status,
  });

  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: deleteMember,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["members"] });
      navigate("/");
    },
  });
  const updateMutation = useMutation({
    mutationFn: (data: UpdateMemberData) => updateMember(member.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["member", member.id] });
      setIsEditMode(false);
    },
  });
  const uploadPhotoMutation = useMutation({
    mutationFn: (file: File) => uploadPhoto(member.id, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["member", member.id] });
      queryClient.invalidateQueries({ queryKey: ["members"] });
    },
  });

  const handleDeleteButtonClick = () => {
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteDialogClose = () => {
    setIsDeleteDialogOpen(false);
  };

  const handleDeleteConfirm = () => {
    deleteMutation.mutate(member.id);
    navigate("/");
  };

  const setEditMode = (bool: boolean) => {
    setIsEditMode(bool);
  };

  const handleInputChange = (field: keyof UpdateMemberData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    updateMutation.mutate(formData);
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validTypes = ["image/jpeg", "image/png", "image/webp"];
      if (!validTypes.includes(file.type)) {
        setUploadPhotoError("Only JPEG, PNG, or WEBP images are allowed.");
        return;
      }
      if (file.size > 3 * 1024 * 1024) {
        setUploadPhotoError("File size must be less than 3MB");
        return;
      }
      setUploadPhotoError("");
      uploadPhotoMutation.mutate(file);
    }
  };

  return (
    <StyledContainer>
      <Button variant="text" color="primary" onClick={() => navigate("/")}>
        Back to Members List
      </Button>
      <Typography variant="h2" component="h1" gutterBottom>
        {member.firstName} {member.lastName}
      </Typography>
      <UserAvatar
        member={member}
        onClick={handleAvatarClick}
        isEditable
        loading={uploadPhotoMutation.isPending}
      />
      {uploadPhotoError && (
        <Typography color="error">{uploadPhotoError}</Typography>
      )}
      <Typography>ID: {member.id}</Typography>

      {!isEditMode && (
        <Box sx={{ display: "flex", gap: 2, justifyContent: "center", my: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setEditMode(true)}
          >
            EDIT
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleDeleteButtonClick}
          >
            Delete
          </Button>
        </Box>
      )}

      <Box
        sx={{ width: "100%", maxWidth: 500, mt: 3 }}
        component="form"
        onSubmit={handleSubmit}
      >
        <TextField
          fullWidth
          label="First Name"
          value={formData.firstName}
          onChange={(e) => handleInputChange("firstName", e.target.value)}
          disabled={!isEditMode}
          required
          margin="normal"
        />
        <TextField
          fullWidth
          label="Last Name"
          value={formData.lastName}
          onChange={(e) => handleInputChange("lastName", e.target.value)}
          disabled={!isEditMode}
          required
          margin="normal"
        />
        <TextField
          fullWidth
          label="Date of Birth"
          value={formData.dateOfBirth}
          onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
          disabled={!isEditMode}
          required
          margin="normal"
          slotProps={{
            inputLabel: {
              shrink: true,
            },
          }}
          type="date"
        />
        <TextField
          fullWidth
          select
          label="Sex"
          value={formData.sex}
          onChange={(e) => handleInputChange("sex", e.target.value)}
          disabled={!isEditMode}
          required
          margin="normal"
        >
          <MenuItem value="male">Male</MenuItem>
          <MenuItem value="female">Female</MenuItem>
          <MenuItem value="other">Other</MenuItem>
        </TextField>
        <TextField
          fullWidth
          select
          label="Status"
          value={formData.status}
          onChange={(e) => handleInputChange("status", e.target.value)}
          disabled={!isEditMode}
          margin="normal"
          required
        >
          <MenuItem value="ACTIVE">Active</MenuItem>
          <MenuItem value="PAUSED">Paused</MenuItem>
        </TextField>

        <Box sx={{ display: "flex", gap: 2, justifyContent: "center", my: 2 }}>
          {isEditMode && (
            <>
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={updateMutation.isPending}
                fullWidth
              >
                {updateMutation.isPending ? (
                  <CircularProgress size={24} />
                ) : (
                  "Save"
                )}
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => setEditMode(false)}
              >
                Cancel
              </Button>
            </>
          )}
        </Box>
      </Box>

      <Dialog open={isDeleteDialogOpen} onClose={handleDeleteDialogClose}>
        <DialogTitle color="error">Delete Member - Danger Zone</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this member?</Typography>
        </DialogContent>

        <DialogActions>
          <Button
            variant="text"
            color="secondary"
            onClick={handleDeleteDialogClose}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleDeleteConfirm}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <InvisibleInput
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
      />
    </StyledContainer>
  );
};
