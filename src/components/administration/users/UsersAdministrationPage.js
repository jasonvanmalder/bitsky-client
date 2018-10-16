import React, { Component } from 'react'
import Navbar from '../../common/template/Navbar';
import { 
    Container, 
    Row, 
    Col, 
    Table,
    Alert,
} from 'reactstrap';
import jwtDecode from 'jwt-decode';
import RankService from '../../../services/RankService';
import AdministrationSideMenu from '../common/AdministrationSideMenu';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTh, faList, faPlus } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import qs from 'qs';
import {config} from '../../../config';
import UserThumbnail from './UserThumbnail';
import UserTableEntry from './UserTableEntry';
import _ from 'lodash';

export default class UsersAdministrationPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            session: jwtDecode(localStorage.getItem('token')),
            users: [],
            displayType: 'thumbnails'
        };
    }

    filterUsers = (action) => {
        let usersLoading = document.getElementById('users-loading');
        if(usersLoading) usersLoading.style.display = 'block';
        switch(action) {
            case 'filterThumbnails':
                this.refs.filterToList.classList.remove('active');
                this.refs.filterToThumbnails.classList.add('active');
                this.getUsers('thumbnails');
            break;

            case 'filterList':
                this.refs.filterToList.classList.add('active');
                this.refs.filterToThumbnails.classList.remove('active');
                this.getUsers('list');
            break;

            default:
                console.log('Erreur lors du filtrage: ', action);
            break;
        }
    }

    getUsers = async (displayType) => {
        this.setState({users: []});
        const response = await axios.post(`${config.API_ROOT}/get_allusers`, qs.stringify({ token: localStorage.getItem('token'), uniq_id: localStorage.getItem('id')}));
        const usersData = (response.data.success) ? response.data.users : null;
        let users = [];
        
        switch(displayType) {
            case 'thumbnails':
                this.setState({displayType: displayType})
                let i = 0;
                usersData.forEach(user => {
                    i++;
                    users.push(<UserThumbnail margin={(i > 3 ? 'margin-top-10' : null)} key={'user-'+user.id} avatar={user.avatar} firstname={user.firstname} lastname={user.lastname} uniq_id={user.uniq_id} rank={RankService.translate(user.rank)}/>);
                });
            break;

            case 'list':
                this.setState({displayType: displayType})
                usersData.forEach(user => {
                    users.push(<UserTableEntry key={'user-'+user.id} id={user.id} uid={_.truncate(user.uniq_id, {'length': 8,'separator': /,? +/})} lastname={user.lastname} firstname={user.firstname} email={user.email} rank={RankService.translate(user.rank)}/>);
                });
            break;

            default:
                console.log('Erreur lors de l\'affichage des utilisateurs: ', displayType);
            break;
        }

        this.setState({users});
        let usersLoading = document.getElementById('users-loading');
        if(usersLoading) usersLoading.style.display = 'none';
    }

    componentWillMount() {
        this.getUsers('thumbnails');
    }

    render() {
        return (
            <div>
            <Navbar />
            <Container className="main-container">
                <Row>
                    <Col md="3" className="no-margin-left no-margin-right">
                        <div className="user-container">
                            <img src={localStorage.getItem('avatar')} alt="Avatar" />
                            <h5>{ this.state.session.firstname + ' ' + this.state.session.lastname }</h5>
                            <p className="rank">{ RankService.translate(this.state.session.rank) }</p>
                            <AdministrationSideMenu />
                        </div>
                    </Col>
                    <Col md="9" className="no-margin-left no-margin-right">
                        <div className="user-container no-center admin-top-bar">
                            <Container className="no-padding-left no-padding-right">
                                <Row className="align-items-center">
                                    <Col className="text-left">
                                        <h4>Utilisateurs</h4>
                                    </Col>
                                    <Col className="text-center">
                                        <button type="button" className="btn btn-info"><FontAwesomeIcon icon={faPlus} /> Ajouter</button>
                                    </Col>
                                    <Col className="text-right">
                                        <span ref="filterToThumbnails" className="filter-button active" onClick={(e) => this.filterUsers('filterThumbnails')}><FontAwesomeIcon icon={faTh} /></span>{' '}
                                        <span ref="filterToList" className="filter-button" onClick={(e) => this.filterUsers('filterList')}><FontAwesomeIcon icon={faList} /></span>
                                    </Col>
                                </Row>
                            </Container>
                        </div>

                        <div className="user-container no-center" style={{marginTop: '15px'}}>
                            <Container className="no-padding-left no-padding-right">
                                <Alert id="users-loading" color="info" className="info-message" style={{display:'block'}}>Chargement...</Alert>
                                <Row>
                                    {this.state.displayType === 'list' && 
                                    <Table>
                                        <thead>
                                            <tr>
                                                <th>ID</th>
                                                <th>UID</th>
                                                <th>Nom</th>
                                                <th>Prénom</th>
                                                <th>Email</th>
                                                <th>Rang</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {this.state.users}
                                        </tbody>
                                    </Table>
                                    }
                                    
                                    {this.state.displayType === 'thumbnails' &&
                                        this.state.users
                                    }
                                </Row>
                            </Container>
                        </div>
                    </Col>
                </Row>
            </Container>
            </div>
        )
    }
}