import React, { FormEvent } from "react";
import "./Search.css";

export interface ISearchState {
  username: string;
}

export interface ISearchProps {
  searchValue: (e: FormEvent<HTMLInputElement>) => void;
  value: string;
}

class Search extends React.Component<ISearchProps, ISearchState> {
  state = {
    username: ""
  };

  setUsername = (e: FormEvent<HTMLInputElement> | any) => {
    this.setState({ username: e.currentTarget.value });
    if (e.key === "Enter") {
      window.location.href = `https://github.com/${e.currentTarget.value}`;
    }
  };

  render() {
    const { username } = this.state;
    const { value, searchValue } = this.props;
    return (
      <div className="search-container">
        <div className="field-control">
          <label>
            Search User
            <input
              className="search-input"
              type="text"
              placeholder="Search..."
              defaultValue={value}
              onKeyUp={e => searchValue(e)}
            />
          </label>
        </div>
        <div className="field-control">
          <label>
            Go To User Profile
            <div className="search-box-wrapper">
              <input
                type="text"
                className="search-box-input"
                placeholder="Type in a username"
                onKeyUp={e => this.setUsername(e)}
              />
              <button
                className="search-box-btn"
                onClick={() =>
                  (window.location.href = `https://github.com/${username}`)
                }
              >
                &#128269;
              </button>
            </div>
          </label>
        </div>
      </div>
    );
  }
}

export default Search;
