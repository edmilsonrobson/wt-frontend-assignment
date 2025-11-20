import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import styled from "styled-components";

import { deleteMember, getSingleMember } from "../api/members";
import {
  Container,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { UserAvatar } from "../components/UserAvatar";
import { useState } from "react";

const StyledContainer = styled(Container)`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 3rem;
  padding-bottom: 3rem;
  min-height: 100vh;
`;

export const MemberDetails = () => {
  const { id = "" } = useParams<{ id: string }>();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const navigate = useNavigate();

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: deleteMember,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["members"] });
      navigate("/");
    },
  });
  const {
    data: member,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["member", id],
    queryFn: () => getSingleMember(id),
  });

  if (isLoading) {
    return (
      <StyledContainer maxWidth="md">
        <Typography variant="h2" component="h1" gutterBottom>
          Loading...
        </Typography>
      </StyledContainer>
    );
  }

  if (error || !member) {
    return (
      <StyledContainer maxWidth="md">
        <Typography variant="h2" component="h1" gutterBottom>
          Error: Failed to load member
        </Typography>
      </StyledContainer>
    );
  }

  const handleDeleteButtonClick = () => {
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteDialogClose = () => {
    setIsDeleteDialogOpen(false);
  };

  const handleDeleteConfirm = () => {
    mutation.mutate(id);
    navigate("/");
  };

  return (
    <StyledContainer maxWidth="md">
      <Typography variant="h2" component="h1" gutterBottom>
        {member.firstName} {member.lastName}
      </Typography>
      <UserAvatar member={member} />
      <Typography>Member Details {id}</Typography>

      <Button
        variant="contained"
        color="secondary"
        onClick={handleDeleteButtonClick}
      >
        Delete
      </Button>
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
