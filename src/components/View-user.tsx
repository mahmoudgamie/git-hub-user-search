import React from "react";
import { RouteComponentProps } from "react-router-dom";
import axios from "axios";

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
      <div>
        <p>{this.state.name}</p>
        <p>{this.state.location}</p>
        <p>{this.state.followers}</p>
        <img src={this.state.avatar} alt={this.state.name} />
        <ul>
          {this.state.lastStarred.map(starred => (
            <li key={starred.repo.id}>{starred.repo.full_name}</li>
          ))}
        </ul>
        <ul>
          {this.state.repos.map(repo => (
            <li key={repo.id}>{repo.full_name}</li>
          ))}
        </ul>
      </div>
    );
  }
}

export default ViewUser;
