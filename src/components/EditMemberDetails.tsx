import {
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Container,
  Box,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { UserAvatar } from "./UserAvatar";
import type { Member, UpdateMemberData } from "../api/members";
import { deleteMember, updateMember } from "../api/members";
import styled from "styled-components";

const StyledContainer = styled(Container)`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

interface IProps {
  member: Member;
}

export const EditMemberDetails = ({ member }: IProps) => {
  const navigate = useNavigate();

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

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

  return (
    <StyledContainer>
      <Typography variant="h2" component="h1" gutterBottom>
        {member.firstName} {member.lastName}
      </Typography>
      <UserAvatar member={member} />
      <Typography>Member Details {member.id}</Typography>

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
    </StyledContainer>
  );
};
