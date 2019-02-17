import React, {Component} from 'react'
import {config} from '../../../config'
import DateService from '../../../services/DateService'

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {
  faTag,
  faStar as faFullStar,
  faClock,
  faTimes,
} from '@fortawesome/free-solid-svg-icons'
import {
  faStar as faEmptyStar,
  faComments,
} from '@fortawesome/free-regular-svg-icons'

import {Container, Row, Col} from 'reactstrap'
import axios from 'axios'
import qs from 'qs'
import Rank from '../../common/Rank'
import BestComments from './BestComments'
import {withRouter} from 'react-router'

class Post extends Component {
  _isMounted = false

  state = {
    favoriteFilled: this.props.favoriteFilled,
    favorites: this.props.favorites,
    comments: this.props.comments,
    date: this.props.date,
    displayedDate: DateService.timeSince(this.props.date),
  }

  constructor(props) {
    super(props)
    this.postComments = React.createRef()
  }

  isOwner() {
    if (this.props.isOwner) {
      return (
        <FontAwesomeIcon
          className="delete"
          icon={faTimes}
          onClick={this.props.handleDeleteButtonClick}
        />
      )
    }
  }

  handleFavoriteButtonClick = e => {
    this.setState({favoriteFilled: !this.state.favoriteFilled})

    if (this.state.favoriteFilled) {
      this.removeFavorite().then(() => {
        this.setState({favorites: this.state.favorites - 1})
        if (this.props.refreshTrends) this.props.refreshTrends()
        this.postComments.current.postViewer.current.toggleFavorite()
      })
    } else {
      this.addFavorite().then(() => {
        this.setState({favorites: this.state.favorites + 1})
        if (this.props.refreshTrends) this.props.refreshTrends()
        this.postComments.current.postViewer.current.toggleFavorite()
      })
    }
  }

  addFavorite = async () => {
    await axios.post(
      `${config.API_ROOT}/post_add_favorite`,
      qs.stringify({
        uniq_id: localStorage.getItem('id'),
        token: localStorage.getItem('token'),
        post_id: this.props.id,
      })
    )
  }

  removeFavorite = async () => {
    await axios.post(
      `${config.API_ROOT}/post_remove_favorite`,
      qs.stringify({
        uniq_id: localStorage.getItem('id'),
        token: localStorage.getItem('token'),
        post_id: this.props.id,
      })
    )
  }

  toggleFavorite = () => {
    if (this._isMounted) {
      this.setState({favoriteFilled: !this.state.favoriteFilled})
      if (this.state.favoriteFilled)
        this.setState({favorites: this.state.favorites + 1})
      if (!this.state.favoriteFilled)
        this.setState({favorites: this.state.favorites - 1})
    }
  }

  checkFavorite = async () => {
    const response = await axios.post(
      `${config.API_ROOT}/post_get_user_favorite`,
      qs.stringify({
        uniq_id: localStorage.getItem('id'),
        token: localStorage.getItem('token'),
        post_id: this.props.id,
      })
    )
    const {success, favorite} = response.data

    if (success && favorite && this._isMounted) {
      this.setState({favoriteFilled: true})
    }
  }

  increaseCommentCounter = () => {
    if (this._isMounted) this.setState({comments: this.state.comments + 1})
  }

  decreaseCommentCounter = () => {
    if (this._isMounted) this.setState({comments: this.state.comments - 1})
  }

  getCommentsCount = async () => {
    const response = await axios.post(
      `${config.API_ROOT}/get_commentscount`,
      qs.stringify({
        uniq_id: localStorage.getItem('id'),
        token: localStorage.getItem('token'),
        post_id: this.props.id,
      })
    )
    return await response
  }

  setCommentsCount = () => {
    this.getCommentsCount().then(response => {
      const {success, commentsCount} = response.data

      if (success && this._isMounted) {
        this.setState({comments: commentsCount})
      }
    })
  }

  getContent() {
    return {__html: this.props.content}
  }

  handleCommentCounterClick = () => {
    if (this.state.comments > 0) {
      this.postComments.current.toggle()
    } else {
      this.postComments.current.postViewer.current.toggle()
    }
  }

  getDate = () => {
    this.interval = setInterval(() => {
      let dateTime = new Date(this.state.date)
      const date =
        dateTime.getFullYear() +
        '-' +
        (dateTime.getMonth() + 1) +
        '-' +
        dateTime.getDate()
      const time =
        dateTime.getHours() +
        ':' +
        dateTime.getMinutes() +
        ':' +
        (dateTime.getSeconds() + 1)
      dateTime = date + ' ' + time

      this.setState({dateTime, displayedDate: DateService.timeSince(dateTime)})
    }, 1000)
  }

  componentDidMount = () => {
    this._isMounted = true
    this.getDate()
    this.checkFavorite()
  }

  componentWillUnmount = () => {
    this._isMounted = false
    clearInterval(this.interval)
  }

  render() {
    return (
      <div className="post-container">
        <div id={'post-' + this.props.id} className="post">
          {this.isOwner()}
          <img
            src={this.props.ownerAvatar}
            alt="Avatar"
            onClick={() =>
              this.props.history.push(`/profile/${this.props.ownerId}`)
            }
          />
          <div className="title">
            <h4>{this.props.ownerName}</h4>
            <small>
              <Rank id={this.props.ownerRank} />
            </small>
          </div>
          <p
            className="post-content"
            dangerouslySetInnerHTML={this.getContent()}
          />
          <Container className="post-details">
            <Row>
              <Col md="4" className="text-left">
                <span className="tag">
                  <FontAwesomeIcon icon={faTag} /> {this.props.tag}
                </span>
              </Col>
              <Col md="4" className="text-center counter-container">
                <span className="fav-counter">
                  <i>
                    <FontAwesomeIcon
                      icon={
                        this.state.favoriteFilled ? faFullStar : faEmptyStar
                      }
                      onClick={this.handleFavoriteButtonClick}
                    />
                  </i>{' '}
                  {this.state.favorites}
                </span>{' '}
                <span
                  className="comment-counter"
                  onClick={this.handleCommentCounterClick}
                  ref={node => (this.commentCounter = node)}
                >
                  <FontAwesomeIcon icon={faComments} /> {this.state.comments}
                </span>
              </Col>
              <Col md="4" className="text-right">
                <span className="date">
                  <FontAwesomeIcon icon={faClock} /> {this.state.displayedDate}
                </span>
              </Col>
            </Row>
          </Container>
        </div>

        <BestComments
          ref={this.postComments}
          id={this.props.id}
          toggleFavoriteFromActivityFeed={this.toggleFavorite}
          increaseCommentCounterFromActivityFeed={this.increaseCommentCounter}
          decreaseCommentCounterFromActivityFeed={this.decreaseCommentCounter}
          setCommentsCount={this.setCommentsCount}
          refreshTrends={this.props.refreshTrends}
        />
      </div>
    )
  }
}

export default withRouter(Post)
