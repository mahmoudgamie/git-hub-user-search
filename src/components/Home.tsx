import React from "react";
import Search from "./Search";
import Pagination from "./Pagination";
import User from "../models/User";
import axios from "axios";
import { Subject, Subscription } from "rxjs";
import { Observable, EMPTY } from "rxjs";
import { debounceTime, distinctUntilChanged, switchMap } from "rxjs/operators";
import { from } from "rxjs";
import { Link } from "react-router-dom";
import "./Home.css";

export interface State {
  users: User[];
  paginationLink: string;
  pageCount: number;
}

class Home extends React.Component<{}, State> {
  state: State = {
    users: [],
    paginationLink: "",
    pageCount: 0
  };
  subscription$: Subscription = new Subscription();
  searchTerm$ = new Subject<string>();

  componentDidMount() {
    const cashedData = sessionStorage.getItem("data");
    const paginationLink = sessionStorage.getItem("paginationLink");
    if (cashedData) this.setState({ users: JSON.parse(cashedData)["items"] });
    if (paginationLink) this.setState({ paginationLink: paginationLink });

    this.subscription$ = this.search(this.searchTerm$).subscribe(res => {
      if (res) {
        this.setState({
          users: res.data.items,
          paginationLink: res.headers.link,
          pageCount: res.data.total_count
        });
        this.cashData(res);
      }
    });
  }

  componentWillUnmount() {
    this.subscription$.unsubscribe();
  }

  search(terms?: Observable<string>): Observable<any> {
    if (terms) {
      return terms.pipe(
        debounceTime(400),
        distinctUntilChanged(),
        switchMap(term => this.fetchData(term))
      );
    } else {
      return EMPTY;
    }
  }

  cashData(res: any) {
    sessionStorage.setItem("data", JSON.stringify(res.data));
    sessionStorage.setItem("paginationLink", res.headers.link);
  }

  fetchData(term: string, url?: string): Observable<any> {
    axios.defaults.headers = {
      Accept: "application/vnd.github.v3+json"
    };
    if (term) {
      return from(
        axios
          .get(`https://api.github.com/search/users?q=${term}`)
          .catch(err => console.log(err))
      );
    } else {
      this.setState({
        users: [],
        paginationLink: "",
        pageCount: 0
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
    return (
      <div>
        <Search searchValue={this.update} />

        <Pagination
          pageCount={this.state.pageCount}
          url={this.state.paginationLink}
          handlePagination={this.handlePagination}
        />
        <div className="container">
          {this.state.users.map(user => (
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
      </div>
    );
  }
}

export default Home;
