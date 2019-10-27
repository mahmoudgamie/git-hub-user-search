import React from "react";
import { Link } from "react-router-dom";
import "./Search.css";

export interface ISearchState {
  username: string;
}

export interface ISearchProps {
  searchValue: any;
}

class Search extends React.Component<ISearchProps, ISearchState> {
  state = {
    username: ""
  };

  setUsername = (e: any) => {
    this.setState({ username: e.target.value });
  };

  render() {
    return (
      <div className="search-container">
        <div className="field-control">
          <label>
            Search User
            <input
              className="search-input"
              type="text"
              placeholder="Search..."
              onKeyUp={e => this.props.searchValue(e)}
            />
          </label>
        </div>
        <form>
          <div className="field-control">
            <label>
              Go to user
              <div className="search-box-wrapper">
                <input
                  type="text"
                  className="search-box-input"
                  placeholder="Type in a username"
                  onKeyUp={e => this.setUsername(e)}
                />
                <Link className="link" to={`/view-user/${this.state.username}`}>
                  <button className="search-box-btn" type="submit">
                    &#128269;
                  </button>
                </Link>
              </div>
            </label>
          </div>
        </form>
      </div>
    );
  }
}

export default Search;
