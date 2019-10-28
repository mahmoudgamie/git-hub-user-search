import React from "react";
import { RouteComponentProps } from "react-router-dom";
import axios from "axios";
import "./View-user.css";

export interface IViewUserProps
  extends RouteComponentProps<{ username: string }> {}

export interface IVeiwUserState {
  username: string;
  repos: any[];
  avatar: string;
  name: string;
  followers: number | null;
  location: string;
  lastStarred: any[];
}

class ViewUser extends React.Component<IViewUserProps, IVeiwUserState> {
  constructor(props: IViewUserProps) {
    super(props);
    this.state = {
      username: this.props.match.params.username,
      repos: [],
      name: "",
      avatar: "",
      followers: null,
      location: "",
      lastStarred: []
    };
  }

  componentDidMount() {
    this.fetchUser();
  }

  fetchUser() {
    axios
      .get(`https://api.github.com/users/${this.state.username}`)
      .then(res => {
        const data = res.data;
        this.setState({
          name: data.name,
          avatar: data.avatar_url,
          location: data.location,
          followers: data.followers
        });
        this.fetchRepos();
        this.fetchStarred();
      })
      .catch(err => console.log(err));
  }

  fetchRepos() {
    axios
      .get(`https://api.github.com/users/${this.state.username}/repos`, {
        params: {
          per_page: 5,
          sort: "created"
        }
      })
      .then(res => {
        this.setState({ repos: res.data });
      })
      .catch(err => console.log(err));
  }

  fetchStarred() {
    axios.defaults.headers = {
      Accept: "application/vnd.github.v3.star+json"
    };
    axios
      .get(`https://api.github.com/users/${this.state.username}/starred`, {
        params: {
          per_page: 5,
          sort: "starred_at"
        }
      })
      .then(res => {
        this.setState({ lastStarred: res.data });
      })
      .catch(err => {
        console.log(err);
      });
  }

  render() {
    return (
      <section className="main-container">
        <div className="details-container">
          <h3 className="main-title">General Info:</h3>
          <ul>
            <li>
              <span className="info-title">
                Name: <span>{this.state.name}</span>
              </span>
            </li>
            <li>
              <span className="info-title">
                Location: <span>{this.state.location}</span>
              </span>
            </li>
            <li>
              <span className="info-title">
                Number Of Followers: <span>{this.state.followers}</span>
              </span>
            </li>
          </ul>
          <h3 className="main-title">Last 5 Repos:</h3>
          <ul>
            {this.state.lastStarred.map(starred => (
              <li key={starred.repo.id}>
                <span>{starred.repo.full_name}</span>
              </li>
            ))}
          </ul>
          <h3 className="main-title">Last 5 Starred Repos:</h3>
          <ul>
            {this.state.repos.map(repo => (
              <li key={repo.id}>
                <span>{repo.full_name}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="img-container">
          <img
            width="100%"
            height="100%"
            className="img"
            src={this.state.avatar}
            alt={this.state.name}
          />
        </div>
      </section>
    );
  }
}

export default ViewUser;
