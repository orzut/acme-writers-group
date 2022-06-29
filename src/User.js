import React, { Component } from "react";
import axios from "axios";
import { faker } from "@faker-js/faker";

class User extends Component {
  constructor() {
    super();
    this.state = {
      user: {},
      stories: [],
    };
    this.deleteStory = this.deleteStory.bind(this);
    this.createStory = this.createStory.bind(this);
    this.toggleFavorite = this.toggleFavorite.bind(this);
  }

  async componentDidMount() {
    let response = await axios.get(`/api/users/${this.props.userId}`);
    this.setState({ user: response.data });
    response = await axios.get(`/api/users/${this.props.userId}/stories`);
    this.setState({ stories: response.data });
  }
  async componentDidUpdate(prevProps) {
    if (prevProps.userId !== this.props.userId) {
      let response = await axios.get(`/api/users/${this.props.userId}`);
      this.setState({ user: response.data });
      response = await axios.get(`/api/users/${this.props.userId}/stories`);
      this.setState({ stories: response.data });
    }
  }
  async deleteStory(story) {
    await axios.delete(`/api/stories/${story.id}`);
    const stories = this.state.stories.filter(
      (_story) => _story.id !== story.id
    );
    this.setState({ stories });
  }
  async createStory() {
    const userId = window.location.hash.slice(1);
    const newStory = {
      title: faker.random.words(5),
      body: faker.lorem.paragraphs(5),
      favorite: faker.datatype.boolean(),
      userId: userId,
    };
    const response = await axios.post(`/api/users/${userId}/stories`, newStory);
    const stories = [...this.state.stories, response.data];
    this.setState({ stories });
  }
  async toggleFavorite(story) {
    const userId = window.location.hash.slice(1);
    story.favorite ? (story.favorite = false) : (story.favorite = true);
    await axios.put(`/api/stories/${story.id}`, story);
    const stories = (await axios.get(`/api/users/${userId}/stories`)).data;
    this.setState({ stories });
  }
  render() {
    const { user, stories } = this.state;
    const { deleteStory, createStory, toggleFavorite } = this;
    return (
      <div id="details">
        <h2>Details for {user.name}</h2>
        <h3>Bio</h3>
        <p>{user.bio}</p>
        <h3>Stories</h3>
        <button onClick={createStory}>Create a new story</button>
        <ul>
          {stories.map((story) => {
            return (
              <li id="story" key={story.id}>
                <p id="title">{story.title}</p>
                <p>{story.body}</p>
                <span
                  className={`fa-regular fa-star ${
                    story.favorite ? "favorite" : ""
                  }`}
                  id="star"
                  onClick={() => toggleFavorite(story)}
                ></span>
                <button onClick={() => deleteStory(story)}>
                  Delete the story
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
}

export default User;
