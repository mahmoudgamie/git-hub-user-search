import * as React from "react";
import "./Pagination.css";

export interface Props {
  pageCount: number | null;
  url: string;
  handlePagination: any;
}

class Pagination extends React.Component<Props> {
  getPaginationLinks(link: string) {
    if (link) {
      const links: string[] = link.split(",");
      return links
        .map(a => {
          return {
            url: a
              .split(";")[0]
              .replace(">", "")
              .replace("<", ""),
            title: a.split(";")[1]
          };
        })
        .map((btn, i) => {
          if (btn.title.includes("first")) {
            return (
              <button
                className="pagination-btn"
                type="button"
                key={i}
                onClick={() => this.props.handlePagination(btn.url)}
              >
                First
              </button>
            );
          }
          if (btn.title.includes("next")) {
            return (
              <button
                className="pagination-btn"
                type="button"
                key={i}
                onClick={() => this.props.handlePagination(btn.url)}
              >
                Next
              </button>
            );
          }
          if (btn.title.includes("prev")) {
            return (
              <button
                className="pagination-btn"
                type="button"
                key={i}
                onClick={() => this.props.handlePagination(btn.url)}
              >
                Prev
              </button>
            );
          }
          if (btn.title.includes("last")) {
            return (
              <button
                className="pagination-btn"
                type="button"
                key={i}
                onClick={() => this.props.handlePagination(btn.url)}
              >
                Last
              </button>
            );
          }
        });
    }
  }

  render() {
    const { pageCount, url, handlePagination } = this.props;
    let btns = this.getPaginationLinks(url);
    //reording buttons
    if (btns && btns.length === 4) {
      btns = [btns[3], btns[1], btns[0], btns[2]];
    }

    return <div className="pagination-container">{btns}</div>;
  }
}

export default Pagination;
