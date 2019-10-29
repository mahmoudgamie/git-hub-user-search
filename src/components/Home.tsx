import React from "react";
import Search from "./Search";
import Pagination from "./Pagination";
import IUser from "../models/IUser";
import IError from "../models/IError";
import axios from "axios";
import { Subject, Subscription } from "rxjs";
import { Observable, EMPTY } from "rxjs";
import {
  debounceTime,
  distinctUntilChanged,
  switchMap,
  map
} from "rxjs/operators";
import { from } from "rxjs";
import { Link } from "react-router-dom";
import "./Home.css";

export interface State {
  users: IUser[];
  paginationLink: string;
  pageCount: number | null;
  error: IError;
}

class Home extends React.Component<{}, State> {
  state: State = {
    users: [],
    paginationLink: "",
    pageCount: null,
    error: {
      status: null,
      statusText: ""
    }
  };
  subscription$: Subscription = new Subscription();
  searchTerm$ = new Subject<string>();

  componentDidMount() {
    const cashedData = sessionStorage.getItem("data");
    const paginationLink = sessionStorage.getItem("paginationLink");
    if (cashedData) this.setState({ users: JSON.parse(cashedData)["items"] });
    if (paginationLink) this.setState({ paginationLink: paginationLink });

    this.subscription$ = this.search(this.searchTerm$).subscribe(
      (users: IUser[]) => {
        if (users) {
          this.setState({
            users: users,
            error: {
              status: 0,
              statusText: ""
            }
          });
        }
      }
    );
  }

  componentWillUnmount() {
    this.subscription$.unsubscribe();
  }

  search(terms?: Observable<string>): Observable<IUser[]> {
    if (terms) {
      return terms.pipe(
        debounceTime(400),
        distinctUntilChanged(),
        switchMap(term => this.fetchData(term)),
        map(res => {
          if (res) {
            this.setState({
              paginationLink: res.headers.link,
              pageCount: res.data.total_count
            });
            this.cashData(res);
            return res.data.items;
          }
        })
      );
    } else {
      return EMPTY;
    }
  }

  cashData(res: any) {
    sessionStorage.setItem("data", JSON.stringify(res.data));
    sessionStorage.setItem("paginationLink", res.headers.link);
  }

  uncashData() {
    sessionStorage.removeItem("data");
    sessionStorage.removeItem("paginationLink");
  }

  fetchData(term: string): Observable<any> {
    axios.defaults.headers = {
      Accept: "application/vnd.github.v3+json"
    };
    if (term) {
      return from(
        axios
          .get(`https://api.github.com/search/users?q=${term}`)
          .catch(err => {
            if (err.response) {
              this.setState({
                users: [],
                paginationLink: "",
                pageCount: 0,
                error: {
                  status: err.response.status,
                  statusText: err.response.statusText
                }
              });
              this.uncashData();
            }
          })
      );
    } else {
      this.setState({
        users: [],
        paginationLink: "",
        pageCount: 0,
        error: {
          status: 0,
          statusText: ""
        }
      });
      return EMPTY;
    }
  }

  update = (e: any) => {
    this.searchTerm$.next(e.target.value);
  };

  handlePagination = (url: string) => {
    axios
      .get(url)
      .then(res => {
        this.setState({ paginationLink: res.headers.link });
        this.setState({ users: res.data.items });
        this.cashData(res);
      })
      .catch(err => console.log(err));
  };

  render() {
    const { users, paginationLink, pageCount, error } = this.state;
    return (
      <section>
        <Search searchValue={this.update} />
        <Pagination
          pageCount={pageCount}
          url={paginationLink}
          handlePagination={this.handlePagination}
        />
        <div className="container">
          {users.map(user => (
            <Link key={user.id} to={`/view-user/${user.login}`}>
              <div className="card">
                <div className="card-image">
                  <img
                    width="100%"
                    height="100%"
                    className="img"
                    src={user.avatar_url}
                    alt=""
                  />
                </div>
                <div className="card-text">{user.login}</div>
              </div>
            </Link>
          ))}
        </div>
        <div className="error-container">
          {(error.status || error["statusText"]) && (
            <div>
              <hr />
              <p>Error Code:{error.status}</p>
              <p>{error["statusText"]}</p>
            </div>
          )}
        </div>
      </section>
    );
  }
}

export default Home;
