import React from "react";
import { Subject } from "rxjs";
import { Observable, EMPTY } from "rxjs";
import {
  debounceTime,
  map,
  distinctUntilChanged,
  switchMap
} from "rxjs/operators";
import { from } from "rxjs";
import axios from "axios";

class Search extends React.Component {
  state = {
    users: ""
  };

  searchTerm$ = new Subject<string>();

  update(e: any) {
    this.searchTerm$.next(e.target.value);
  }

  componentDidMount() {
    this.search(this.searchTerm$).subscribe(results => {
      if (results) {
        console.log(results.data);
      }
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
        <p>{this.state.users}</p>
      </div>
    );
  }
}

export default Search;
