import * as React from "react";

export interface Props {
  pageCount: number;
  url: string;
  handlePagination: any;
}

class Pagination extends React.Component<Props> {
  getPaginationLinks(link: string) {
    const links: string[] = link.split(",");
    return links.map(a => {
      return {
        url: a
          .split(";")[0]
          .replace(">", "")
          .replace("<", ""),
        title: a.split(";")[1]
      };
    });
  }
  // state = { :  }
  render() {
    const { pageCount, url, handlePagination } = this.props;
    const btns = this.getPaginationLinks(url);
    return (
      <div>
        {btns.map(
          (b, i) =>
            b.title && (
              <button onClick={() => handlePagination(b.url)} key={i}>
                {b.title}
              </button>
            )
        )}
      </div>
    );
  }
}

export default Pagination;
