import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import styled from "styled-components";

import { getSingleMember } from "../api/members";
import { Container, Typography } from "@mui/material";
import { EditMemberDetails } from "../components/EditMemberDetails";

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

  return (
    <StyledContainer maxWidth="md">
      <EditMemberDetails member={member} />
    </StyledContainer>
  );
};
