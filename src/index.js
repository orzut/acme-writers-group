import React, { Component } from "react";
import { render } from "react-dom";
import axios from "axios";
import Users from "./Users";
import User from "./User";
import { faker } from "@faker-js/faker";

class App extends Component {
  constructor() {
    super();
    this.state = {
      users: [],
      userId: "",
    };
    this.deleteUser = this.deleteUser.bind(this);
    this.createUser = this.createUser.bind(this);
  }
  async componentDidMount() {
    try {
      const userId = window.location.hash.slice(1);
      this.setState({ userId });
      const response = await axios.get("/api/users");
      this.setState({ users: response.data });
      window.addEventListener("hashchange", () => {
        const userId = window.location.hash.slice(1);
        this.setState({ userId });
      });
    } catch (ex) {
      console.log(ex);
    }
  }
  async deleteUser(user) {
    const userId = window.location.hash.slice(1);
    await axios.delete(`/api/users/${user.id}`);
    if (typeof window !== "undefined" && +userId === user.id) {
      window.location.href = window.location.origin;
    } else {
      const users = this.state.users.filter((_user) => _user.id !== user.id);
      this.setState({ users });
    }
  }
  async createUser() {
    const newUser = {
      name: `${faker.name.firstName()} ${faker.name.lastName()}`,
      bio: faker.lorem.paragraph(),
    };
    const response = await axios.post("api/users", newUser);
    const users = [...this.state.users, response.data];
    this.setState({ users });
    window.location.href = window.location.origin + `/#${response.data.id}`;
  }
  
  render() {
    const { users, userId } = this.state;
    const { deleteUser, createUser} = this;
    return (
      <div>
        <h1>Acme Writers Group ({users.length})</h1>
        <button onClick={createUser}>Add a User</button>
        <main>
          <Users users={users} userId={userId} deleteUser={deleteUser} />
          {userId ? <User userId={userId} /> : null}
        </main>
      </div>
    );
  }
}

const root = document.querySelector("#root");
render(<App />, root);
