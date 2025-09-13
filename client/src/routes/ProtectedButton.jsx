import React from "react";

const ProtectedButton = ({ roles = [], orgId = null, children, ...props }) => {
  const userStr = localStorage.getItem("user");
  const orgRolesStr = localStorage.getItem("orgRoles");
  if (!userStr) return null;

  const user = JSON.parse(userStr);
  const orgRoles = orgRolesStr ? JSON.parse(orgRolesStr) : {};

  // prioritize orgId if provided
  const allowed = orgId
    ? roles.includes(orgRoles[orgId])
    : roles.includes(user.globalRole);

  if (!allowed) return null;

  return <button {...props}>{children}</button>;
};

export default ProtectedButton;
