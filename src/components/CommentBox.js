// CommentBox

import React, { Component } from 'react';
import axios from 'axios';
import CommentList from './CommentList';
import CommentForm from './CommentForm';

import 'bulma/css/bulma.css';

class CommentBox extends Component {

  constructor(props) {
    super(props);
    this.state = { data: [] };

    this.loadCommentsFromServer = this.loadCommentsFromServer.bind(this);
    this.handleCommentSubmit = this.handleCommentSubmit.bind(this);
    this.handleCommentDelete = this.handleCommentDelete.bind(this);

  }

  loadCommentsFromServer() {
    axios.get(this.props.url).then( res => {
      this.setState({ data: res.data });
    })
  }

  handleCommentSubmit(comment) {
    let comments = this.state.data;
    comment._id = Date.now();
    let newComments = comments.concat([comment]);
    this.setState({ data: newComments });

    axios.post(this.props.url, comment)
      .catch(err => {
        console.error(err);
      });
  }

  handleCommentDelete(id) {

    let comments = this.state.data;

    // comments.splice(0, 1);
    let newComments = comments.filter( (t) => {
      return t._id !== id 
    });

    this.setState({ data: newComments });

    axios.delete(`${this.props.url}/${id}`)
      .then(res => {
        console.log('Comment deleted');
      })
      .catch( err => {
        console.error(err);
      })
  }

  componentDidMount() {
    this.loadCommentsFromServer();
    setInterval(this.loadCommentsFromServer, this.props.pollInterval);
  }

  render() {
    return (
      <section className="section">
        <div className="container">

        <CommentList 
          data={ this.state.data }
          onCommentDelete={ this.handleCommentDelete }
        />
        <hr/>
        <CommentForm 
          onCommentSubmit={ this.handleCommentSubmit }
        />
        </div>
      </section>
    )
  }
}

export default CommentBox;