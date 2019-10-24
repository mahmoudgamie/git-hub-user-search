import React from "react";
import { Link } from "react-router-dom";

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
      <div>
        <label>
          Search User
          <input type="text" onKeyUp={e => this.props.searchValue(e)} />
        </label>

        <label>
          Type in a user name
          <input type="text" onKeyUp={e => this.setUsername(e)} />
        </label>
        <Link to={`/view-user/${this.state.username}`}>Go to user Details</Link>
      </div>
    );
  }
}

export default Search;
