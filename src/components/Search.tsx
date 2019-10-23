import React from "react";
import { Subject } from "rxjs";
import { Observable, EMPTY } from "rxjs";
import { debounceTime, distinctUntilChanged, switchMap } from "rxjs/operators";
import { from } from "rxjs";
import axios from "axios";
import User from "../models/User";
import Pagination from "./Pagination";

export interface State {
  users: User[];
  paginationLink: string;
  pageCount: number;
}

class Search extends React.Component {
  state: State = {
    users: [],
    paginationLink: "",
    pageCount: 0
  };

  searchTerm$ = new Subject<string>();

  update(e: any) {
    this.searchTerm$.next(e.target.value);
  }

  componentDidMount() {
    this.search(this.searchTerm$).subscribe(res => {
      this.setState({
        users: res.data.items,
        paginationLink: res.headers.link,
        pageCount: res.data.total_count
      });
    });
  }

  search(terms: Observable<string>): Observable<any> {
    return terms.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      switchMap(term => this.fetchData(term))
    );
  }

  fetchData(term: string, url?: string): Observable<any> {
    axios.defaults.headers = {
      Accept: "application/vnd.github.v3+json"
    };
    if (term) {
      return from(axios.get(`https://api.github.com/search/users?q=${term}`));
    } else {
      this.setState({ users: [] });
      return EMPTY;
    }
  }

  handlePagination = (url: string) => {
    axios.get(url).then(res => {
      this.setState({ paginationLink: res.headers.link });
      this.setState({ users: res.data.items });
    });
  };

  render() {
    return (
      <div>
        <label>
          Search User
          <input type="text" onKeyUp={this.update.bind(this)} />
        </label>
        <Pagination
          pageCount={this.state.pageCount}
          url={this.state.paginationLink}
          handlePagination={this.handlePagination}
        />
        <table>
          <thead>
            <tr>
              <th>Username</th>
              <th>Avatar</th>
            </tr>
          </thead>
          <tbody>
            {this.state.users.map(user => (
              <tr key={user.id}>
                <td>{user.login}</td>
                <td>
                  <img src={user.avatar_url} alt="" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}

export default Search;
