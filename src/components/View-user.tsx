import React from "react";
import { RouteComponentProps } from "react-router-dom";
import axios from "axios";
import IRepo from "../models/IRepo";
import IStarredRepo from "../models/IStarredRepo";
import "./View-user.css";
import IError from "../models/IError";
import IUserExtended from "../models/IUserExtended";
import Spinner from "./Spinner";

export interface IViewUserProps
  extends RouteComponentProps<{ username: string }> {}

export interface IVeiwUserState {
  username: string;
  repos: IRepo[];
  avatar: string;
  name: string;
  followers: number | null;
  location: string;
  lastStarred: IStarredRepo[];
  error: IError;
  lastStarredError: IError;
  reposError: IError;
  activateSpinner: boolean;
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
      lastStarred: [],
      error: {
        status: null,
        statusText: ""
      },
      lastStarredError: {
        status: null,
        statusText: ""
      },
      reposError: {
        status: null,
        statusText: ""
      },
      activateSpinner: false
    };
  }

  componentDidMount() {
    this.fetchUser();
  }

  fetchUser() {
    this.setState({ activateSpinner: true });
    axios
      .get(`https://api.github.com/users/${this.state.username}`)
      .then(res => {
        const data: IUserExtended = res.data;
        this.setState({
          name: data.name,
          avatar: data.avatar_url,
          location: data.location,
          followers: data.followers,
          activateSpinner: false
        });
        this.fetchRepos();
        this.fetchStarred();
      })
      .catch(err => {
        this.setState({
          error: err.response,
          activateSpinner: false
        });
      });
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
      .catch(err => {
        this.setState({ reposError: err.response });
      });
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
        this.setState({ lastStarredError: err.response });
      });
  }

  render() {
    const {
      repos,
      name,
      avatar,
      followers,
      location,
      lastStarred,
      error,
      lastStarredError,
      reposError,
      activateSpinner
    } = this.state;
    return (
      <React.Fragment>
        <Spinner activate={activateSpinner} />
        {(!error.status || !error.status) &&
          (!activateSpinner && (
            <section className="main-container">
              <div className="details-container">
                <h3 className="main-title">General Info:</h3>
                <ul>
                  <li>
                    <span className="info-title">
                      Name: <span>{name}</span>
                    </span>
                  </li>
                  <li>
                    <span className="info-title">
                      Location: <span>{location}</span>
                    </span>
                  </li>
                  <li>
                    <span className="info-title">
                      Number Of Followers: <span>{followers}</span>
                    </span>
                  </li>
                </ul>
                <h3 className="main-title">Last 5 Repos:</h3>
                <ul>
                  {(!reposError.status || !reposError.status) &&
                    repos.map(repo => (
                      <li key={repo.id}>
                        <span>{repo.full_name}</span>
                      </li>
                    ))}
                </ul>
                <div className="error-container">
                  {(reposError.status || reposError["statusText"]) && (
                    <div>
                      <hr />
                      <p>Error Code:{reposError.status}</p>
                      <p>{reposError["statusText"]}</p>
                    </div>
                  )}
                </div>
                <h3 className="main-title">Last 5 Starred Repos:</h3>
                <ul>
                  {(!lastStarredError.status ||
                    !lastStarredError["statusText"]) &&
                    lastStarred.map(starred => (
                      <li key={starred.repo.id}>
                        <span>{starred.repo.full_name}</span>
                      </li>
                    ))}
                </ul>
                <div className="error-container">
                  {(lastStarredError.status ||
                    lastStarredError["statusText"]) && (
                    <div>
                      <hr />
                      <p>Error Code:{lastStarredError.status}</p>
                      <p>{lastStarredError["statusText"]}</p>
                    </div>
                  )}
                </div>
              </div>
              <div className="img-container">
                <img
                  width="100%"
                  height="100%"
                  className="img"
                  src={avatar}
                  alt={name}
                />
              </div>
            </section>
          ))}

        <section className="error-container">
          {(this.state.error.status || this.state.error["statusText"]) && (
            <div>
              <hr />
              <p>Error Code:{this.state.error.status}</p>
              <p>{this.state.error["statusText"]}</p>
            </div>
          )}
        </section>
      </React.Fragment>
    );
  }
}

export default ViewUser;
