import React, { Component } from "react";
import PropTypes from "prop-types";
import "./Log.css";

class Log extends Component {
  render() {
    const { name } = this.props.currentMountainLog;
    let singleLog = [...this.props.currentMountainLog].reverse().map(log => {
      return (
        <div className="comment" key={log.id}>
          {log.attributes.image_url && (
            <img
              className="user-image"
              alt="user"
              src={log.attributes.image_url}
            />
          )}
          <h4>{log.attributes.name}</h4>
          <h4>{log.attributes.hometown}</h4>
          <h4>{log.attributes.comments} </h4>
          <h4>{log.attributes.sign_time}</h4>
        </div>
      );
    });

    if (!singleLog.length) {
      singleLog = (
        <section className="empty-log-msg">
          <h2>No entries found</h2>
        </section>
      );
    }

    return (
      <div className="Log">
        <h1>{name}</h1>
        <section className="comment-container">{singleLog}</section>
      </div>
    );
  }
}

Log.propTypes = {
  currentMountainLog: PropTypes.array
};

export default Log;
