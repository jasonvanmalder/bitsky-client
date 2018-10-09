import React, { Component } from 'react';
import avatar from '../../assets/img/avatar.png';
import { config } from '../../config';
import TextareaAutosize from 'react-autosize-textarea';
import $ from 'jquery';
import jwtDecode from 'jwt-decode';
import Post from '../common/post/Post';
import RankService from '../../services/RankService';
import Navbar from '../common/template/Navbar';
import axios from 'axios';
import qs from 'qs';

import { 
    Container, 
    Row, 
    Col,
    Button,
    Modal,
    ModalBody,
    ModalFooter,
    Label,
    Input 
} from 'reactstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { 
    faClipboardList, 
    faCamera, 
    faPencilAlt, 
    faTimes,
    faPaperPlane
} from '@fortawesome/free-solid-svg-icons';

export default class ActivityFeedPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isOpen: false,
            session: jwtDecode(localStorage.getItem('token')),
            postModal: false,
            posts: []
        };
    }

    toggleNavbar = (e) => {
        this.setState({
            isOpen: !this.state.isOpen
        });
    }

    openTextArea() {
        $('#post-content').prop("disabled", false);
        $('.main-container .publish-container .icons').slideUp(function(){
            $('.main-container .publish-container .remove-box').slideDown();
        });
        $('#post-content').focus();
    }

    closeTextArea = (e) => {
        $('#post-content').val('');
        $('#post-content').css('height', '');
        $('#post-content').prop("disabled", true);
        $('.main-container .publish-container .remove-box').slideUp(function(){
            $('.main-container .publish-container .icons').slideDown();
        });
    }

    adjustPublishContainer() {
        // Height
        let postContentContent = $('#post-content').val();
        
        if(!postContentContent) {
            $('#post-content').height('24px');
            $('.publish-button').hide();
        }else
        {
            $('.publish-button').show();
        }

        $('.publish-container').height($('#post-content').height());
    }

    handlePictureButtonClick = (e) => {
        this.refs.fileUploader.click();
    }

    handlePublishButtonClick = (e) => {
        let content = $('#post-content');
        let tag = $('#post-tag');

        let isContentFilled = $.trim(content.val()).length > 0;
        let isTagFilled = $.trim(tag.val()).length > 0;

        if(isContentFilled && isTagFilled)
        {
            axios.post(`${config.API_ROOT}/store_post`, qs.stringify({ token: localStorage.getItem('token'), owner_uniq_id: localStorage.getItem('id'), content: content.val(),  tag: tag.val() }))
            .then(function(response) {
                response = response.data;
                if(response.success) {
                    let posts = this.state.posts;
                    let newPost = (
                        <Post 
                            id={response.postId} 
                            key={"post-" + response.postId}
                            ownerName={this.state.session.firstname + " " + this.state.session.lastname}
                            ownerRank={RankService.translate(response.ownerRank)}
                            content={content.val()}
                            tag={tag.val()}
                            filled={false}
                            favorites={0}
                            comments={0}
                            date={new Date()}
                        />
                    );
                    posts.unshift(newPost);
                    this.setState({posts: posts});
                    this.closeTextArea();
                    this.adjustPublishContainer();
                    this.togglePostModal();
                }
            }.bind(this));
        }
    }

    togglePostModal = (e) => {
        // Checking if textarea's content is not empty
        if(this.state.postModal || /\S/.test($('#post-content').val())) {
            this.setState({
                postModal: !this.state.postModal
            });
        }
    }

    componentWillMount() {
        // Checking firsttime
        axios.post(`${config.API_ROOT}/get_firsttime`, qs.stringify({ uniq_id: localStorage.getItem('id'), token: localStorage.getItem('token') }))
          .then(function(response) {
            response = response.data;
            if(response.success) {
              let firstTime = Boolean(parseInt(response.message, 10));
              localStorage.setItem('firsttime', firstTime);
              if(firstTime) this.props.history.push('/register_confirmation');
            }
        }.bind(this));

        // Retrieving posts
        axios.post(`${config.API_ROOT}/get_allposts`, qs.stringify({ uniq_id: localStorage.getItem('id'), token: localStorage.getItem('token') }))
        .then(function(response) {
            response = response.data;
            if(response.success) {
                let posts = response.posts;
                let statePosts = this.state.posts;
                
                posts.forEach((post) => {
                    statePosts.push(<Post 
                        id={post.id} 
                        key={"post-" + post.id}
                        ownerName={post.owner.firstname + " " + post.owner.lastname}
                        ownerRank={RankService.translate(post.owner.rank)}
                        content={post.content}
                        tag={post.tag}
                        filled={false}
                        favorites={post.favorites}
                        comments={post.comments}
                        date={post.created_at}
                        isOwner={(post.owner.firstname + " " + post.owner.lastname) === (this.state.session.firstname + " " + this.state.session.lastname)}
                    />);
                });
                this.setState({posts: statePosts});
            }else {
                console.log("Failed loading posts: " + response.message);
            }
        }.bind(this));
    }

    componentDidMount() {
        $('#post-content').parent().height($('#post-content').outerHeight());
    }

    render() {
        return (
            <div>
                <Modal isOpen={this.state.postModal} toggle={this.togglePostModal} className={this.props.className}>
                    <ModalBody>
                        <Label for="post-tag">Veuillez indiquer le sujet de votre publication</Label>
                        <Input type="text" name="post-tag" id="post-tag" placeholder="Sujet de la publication" />
                    </ModalBody>
                    <ModalFooter>
                        <Button className="modal-choice" color="primary" onClick={this.handlePublishButtonClick}><FontAwesomeIcon icon={ faPaperPlane } /></Button>{' '}
                        <Button className="modal-choice" color="secondary" onClick={this.togglePostModal}><FontAwesomeIcon icon={ faTimes }/></Button>
                    </ModalFooter>
                </Modal>

                <Navbar isOpen={this.state.isOpen} user={{firstname: this.state.session.firstname, lastname: this.state.session.lastname}}/>

                <Container className="main-container">
                <Row>
                    <Col md="3" className="no-margin-left no-margin-right">
                        <div className="user-container">
                            <img src={avatar} alt="Avatar" />
                            <h5>{ this.state.session.firstname + ' ' + this.state.session.lastname }</h5>
                            <p className="rank">{ RankService.translate(this.state.session.rank) }</p>
                            <hr/>
                            <p className="text-left">Activité</p>
                            <div className="badge pink text-left">
                                <span><strong>174</strong></span>
                                <span>Publications postées</span>
                            </div>
                            <div className="badge blue text-left">
                                <span><strong>225</strong></span>
                                <span>Fichiers téléchargés</span>
                            </div>
                        </div>
                    </Col>
                    <Col md="5" className="no-margin-left no-margin-right">
                        <div className="publish-container">
                            <input type="file" id="file" ref="fileUploader" style={{display: "none"}}/>
                            <TextareaAutosize id="post-content" placeholder="Poster une publication" onKeyUp={this.adjustPublishContainer} disabled></TextareaAutosize>
                            <div className="icons">
                                <span><FontAwesomeIcon icon={faClipboardList} /></span>
                                <span onClick={this.handlePictureButtonClick}><FontAwesomeIcon icon={faCamera} /></span>
                                <span onClick={this.openTextArea}><FontAwesomeIcon icon={faPencilAlt} /></span>
                            </div>
                            <div className="remove-box">
                                <span onClick={this.closeTextArea}><FontAwesomeIcon icon={ faTimes }  /></span>
                            </div>
                            <span className="publish-button" onClick={this.togglePostModal}><FontAwesomeIcon icon={faPaperPlane} /></span>
                        </div>
                        <div className="posts-container">
                            { this.state.posts }
                        </div>
                    </Col>
                    <Col md="4" className="no-margin-left no-margin-right">
                        <div className="user-container right-container">
                            <h5>Sujets du moment</h5>
                            <hr/>
                            <p>Famille</p>
                            <div>
                                <p>Lorem LoremLoremLoremLorem Loremvv LoremLorem Lorem...</p>
                                <small>Par <a href={null}>Sylvain Urbain</a></small>
                            </div>
                            <Button color="info" className="see-more-button">Voir plus</Button>{' '}
                            <p>Anniversaire de Rara</p>
                            <div>
                                <p>Lorem LoremLoremLoremLorem Loremvv LoremLorem Lorem...</p>
                                <small>Par <a href={null}>Sylvain Urbain</a></small>
                            </div>
                            <Button color="info" className="see-more-button">Voir plus</Button>{' '}
                        </div>
                    </Col>
                </Row>
                </Container>
            </div>
        );
    }
  
}