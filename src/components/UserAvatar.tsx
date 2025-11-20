import type { Member } from "../api/members";
import { Avatar, Box, CircularProgress, Typography } from "@mui/material";

interface IProps {
  member: Member;
  onClick?: () => void;
  isEditable?: boolean;
  loading?: boolean;
}

export const UserAvatar = ({
  member,
  onClick,
  isEditable = false,
  loading = false,
}: IProps) => {
  const initials = `${member.firstName[0]}${member.lastName[0]}`;
  const src = member.photoUrl || undefined;

  return (
    <Box
      sx={{
        position: "relative",
        width: 80,
        height: 80,
        "&:hover .avatar-overlay": isEditable
          ? {
              opacity: 1,
            }
          : {},
        "&:hover .avatar-image": isEditable
          ? {
              opacity: 0.3,
            }
          : {},
      }}
      onClick={onClick}
    >
      <Avatar
        src={src}
        alt={`${member.firstName} ${member.lastName}`}
        className="avatar-image"
        sx={{
          width: 80,
          height: 80,
          cursor: isEditable ? "pointer" : "default",
          transition: "opacity 0.2s ease-in-out",
        }}
      >
        {!src && initials}
      </Avatar>
      {isEditable && (
        <Box
          className="avatar-overlay"
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: 0,
            transition: "opacity 0.2s ease-in-out",
            pointerEvents: "none",
            borderRadius: "50%",
          }}
        >
          <Typography
            sx={{
              color: "rgba(0, 0, 0, 0.87)",
              fontWeight: 600,
              fontSize: 14,
            }}
          >
            EDIT
          </Typography>
        </Box>
      )}
      {loading && (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: 0.5,
            transition: "opacity 0.2s ease-in-out",
            pointerEvents: "none",
            borderRadius: "50%",
          }}
        >
          <CircularProgress size={24} />
        </Box>
      )}
    </Box>
  );
};
