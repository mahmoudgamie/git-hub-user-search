import React from "react";
import { Subject } from "rxjs";
import { Observable, EMPTY } from "rxjs";
import { debounceTime, distinctUntilChanged, switchMap } from "rxjs/operators";
import { from } from "rxjs";
import axios from "axios";

class Search extends React.Component {
  state: { users: any[] } = {
    users: []
  };

  searchTerm$ = new Subject<string>();

  update(e: any) {
    this.searchTerm$.next(e.target.value);
  }

  componentDidMount() {
    this.search(this.searchTerm$).subscribe(results => {
      this.setState({ users: results.data.items });
    });
  }

  search(terms: Observable<string>) {
    return terms.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      switchMap(term => this.searchEntries(term))
    );
  }

  searchEntries(term: string) {
    if (term) {
      return from(axios.get("https://api.github.com/search/users?q=" + term));
    } else {
      this.setState({ users: [] });
      return EMPTY;
    }
  }

  render() {
    return (
      <div>
        <label>
          Search User
          <input type="text" onKeyUp={this.update.bind(this)} />
        </label>
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
