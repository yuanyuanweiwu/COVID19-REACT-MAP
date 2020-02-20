import React, { Component } from "react";
import styles from "./style.css";
import PropTypes from "prop-types";
export class Category extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const { title, count, addcount, color } = this.props;
    return (
      <div style={{ color: color }} className="category">
        <p>{title}</p>
        <p>{count}例</p>
        {addcount ? (
          <p>
            <span className="tip">较昨日</span>
            <span className="add">{addcount>0?'+'+addcount:addcount}</span>
          </p>
        ) : null}
      </div>
    );
  }
}
// category.propTypes = {
//     title: String,
//     count: Number,
//     addcount: Number,
//     color: String
// }
export default Category;
