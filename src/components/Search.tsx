import React from "react";

export interface Props {
  searchValue: any;
}

class Search extends React.Component<Props> {
  render() {
    return (
      <div>
        <label>
          Search User
          <input type="text" onKeyUp={e => this.props.searchValue(e)} />
        </label>
      </div>
    );
  }
}

export default Search;
