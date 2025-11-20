import styled from "styled-components";
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  Chip,
  Button,
  Pagination,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { listMembers, type Member } from "../api/members";
import { NewMemberForm } from "../components/NewMemberForm";
import { useNavigate } from "react-router-dom";
import { UserAvatar } from "../components/UserAvatar";

const StyledContainer = styled(Container)`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 3rem;
  padding-bottom: 3rem;
  min-height: 100vh;
`;

const MemberCard = styled(Card)`
  margin-bottom: 1rem;
  width: 100%;
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;

const MemberHeader = styled(Box)`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 1rem;
`;

const MemberInfo = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const InfoRow = styled(Box)`
  display: flex;
  gap: 0.5rem;
  align-items: center;
`;

export const MembersList = () => {
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(1);
  const navigate = useNavigate();
  const { data, isLoading, error } = useQuery({
    queryKey: ["members", page],
    queryFn: () => listMembers({ page, limit: 4 }),
    staleTime: 1000 * 60 * 5,
  });

  console.log({ data, isLoading, error });

  if (isLoading) {
    return (
      <StyledContainer maxWidth="md">
        <Typography variant="h2" component="h1" gutterBottom>
          Members List
        </Typography>
        <Typography>Loading...</Typography>
      </StyledContainer>
    );
  }

  if (error) {
    return (
      <StyledContainer maxWidth="md">
        <Typography variant="h2" component="h1" gutterBottom>
          Members List
        </Typography>
        <Typography color="error">Error: Failed to load members</Typography>
      </StyledContainer>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusColor = (status: Member["status"]) => {
    return status === "ACTIVE" ? "success" : "warning";
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleMemberClick = (member: Member) => {
    navigate(`/members/${member.id}`);
  };

  return (
    <StyledContainer maxWidth="md">
      <Typography variant="h2" component="h1" gutterBottom sx={{ mb: 4 }}>
        Members List
      </Typography>

      <Button variant="contained" onClick={() => setOpen(true)} sx={{ mb: 2 }}>
        Add Member
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add Member</DialogTitle>
        <DialogContent>
          <NewMemberForm />
        </DialogContent>
      </Dialog>
      <Box sx={{ width: "100%" }}>
        {data?.data.map((member) => (
          <MemberCard
            key={member.id}
            sx={{ cursor: "pointer" }}
            onClick={() => handleMemberClick(member)}
          >
            <CardContent>
              <MemberHeader>
                <UserAvatar member={member} />
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h5" component="h2" gutterBottom>
                    {member.firstName} {member.lastName}
                  </Typography>
                  <Chip
                    label={member.status}
                    color={getStatusColor(member.status)}
                    size="small"
                  />
                </Box>
              </MemberHeader>

              <MemberInfo>
                <InfoRow>
                  <Typography variant="body2" color="text.secondary">
                    Date of Birth:
                  </Typography>
                  <Typography variant="body1">
                    {formatDate(member.dateOfBirth)}
                  </Typography>
                </InfoRow>

                <InfoRow>
                  <Typography variant="body2" color="text.secondary">
                    Sex:
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ textTransform: "capitalize" }}
                  >
                    {member.sex}
                  </Typography>
                </InfoRow>
              </MemberInfo>
            </CardContent>
          </MemberCard>
        ))}
      </Box>
      <Pagination
        count={data?.totalPages}
        page={page}
        onChange={(_, value) => setPage(value)}
      />
    </StyledContainer>
  );
};
