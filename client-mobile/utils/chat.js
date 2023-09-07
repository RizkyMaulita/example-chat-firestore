export const generateChatId = (loginUser = {}, selectedUser = {}) => {
  const id =
    Number(loginUser.id) < Number(selectedUser.id)
      ? `userid_${loginUser.id}_and_userid_${selectedUser.id}`
      : `userid_${selectedUser.id}_and_userid_${loginUser.id}`;

  return id;
};
