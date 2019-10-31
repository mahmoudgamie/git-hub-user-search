import * as React from "react";
import "./Spinner.css";

export interface ISpinnerProps {
  activate: boolean;
}

const Spinner: React.SFC<ISpinnerProps> = props => {
  return (
    <React.Fragment>
      {props.activate && (
        <div className="spinner-container">
          <div className="lds-ring">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
      )}
    </React.Fragment>
  );
};

export default Spinner;
