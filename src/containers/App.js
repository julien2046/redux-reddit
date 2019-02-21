import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { selectSubreddit, fetchPostsIfNeeded, invalideSubreddit } from '../actions';
import Picker from '../components/Picker';
import Posts from '../components/Posts';

class App extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleRefresClick = this.handleRefresClick.bind(this);
  }

  componentDidMount() {
    const { dispatch, selectSubreddit } = this.props;
    dispatch(fetchPostsIfNeeded(selectSubreddit));
  }

  componentDidUpdate(prevProps) {
    if (this.props.selectSubreddit !== prevProps.selectSubreddit) {
      const { dispatch, selectSubreddit } = this.props;
      dispatch(fetchPostsIfNeeded(selectSubreddit))
    }
  }

  handleChange(nextSubreddit) {
    this.props.dispatch(selectSubreddit(nextSubreddit));
    this.props.dispatch(fetchPostsIfNeeded(nextSubreddit));
  }

  handleRefresClick(e) {
    e.preventDefault();

    const { dispatch, selectSubreddit } = this.props;
    dispatch(invalideSubreddit(selectSubreddit));
    dispatch(fetchPostsIfNeeded(selectSubreddit));
  }

  render() {
    const { selectSubreddit, posts, isFetching, lastUpdated } = this.props;

    return (
      <div>
        <Picker value={selectSubreddit} onChange={this.handleChange} options={['reactjs', 'frontend']} />
        <p>
          {lastUpdated && (
            <span>
              Last updated at {new Date(lastUpdated).toLocaleTimeString()}.{' '}
            </span>
          )}
          {!isFetching && (
            <button onClick={this.handleRefresClick}>Refresh</button>
          )}
        </p>
        {isFetching && posts.length === 0 && <h2>Loading...</h2>}
        {!isFetching && posts.length === 0 && <h2>Empty.</h2>}
        {posts.length > 0 && (
          <div style={{ opacity: isFetching ? 0.5 : 1}}>
            <Posts posts={posts} />
          </div>
        )}
      </div>
    );
  }
}

App.propTypes = {
  selectSubreddit: PropTypes.string.isRequired,
  posts: PropTypes.array.isRequired,
  isFetching: PropTypes.bool.isRequired,
  lastUpdated: PropTypes.number,
  dispatch: PropTypes.func.isRequired
};

function mapStateToProps(state) {
  const { selectSubreddit, postsBySubreddit } = state;
  const { isFetching, lastUpdated, items: posts} = postsBySubreddit[selectSubreddit]
                                                      ||
                                                   {isFetching: true, items: []}

  return {
    selectSubreddit,
    posts,
    isFetching,
    lastUpdated
  }
}

export default connect(mapStateToProps)(App);
