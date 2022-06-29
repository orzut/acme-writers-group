import React from "react";

const Users = ({ users, userId, deleteUser }) => {
  return (
    <ul id="users-list">
      <li className={!userId ? "selected" : ""}>
        <a href="#">Users</a>
      </li>
      {users.map((user) => {
        return (
          <li
            id="users"
            className={user.id === userId * 1 ? "selected" : ""}
            key={user.id}
          >
            <a href={`#${user.id}`}>{user.name}</a>
            <button onClick={() => deleteUser(user)}>X</button>
          </li>
        );
      })}
    </ul>
  );
};

export default Users;
