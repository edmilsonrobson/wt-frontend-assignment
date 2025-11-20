import type { Member } from "../api/members";
import { Avatar } from "@mui/material";

interface IProps {
  member: Member;
  isEditable?: boolean;
}

export const UserAvatar = ({ member, isEditable = false }: IProps) => {
  const initials = `${member.firstName[0]}${member.lastName[0]}`;
  const src = member.photoUrl || undefined;

  return (
    <Avatar
      src={src}
      alt={`${member.firstName} ${member.lastName}`}
      sx={{ width: 80, height: 80 }}
    >
      {!src && initials}
    </Avatar>
  );
};
