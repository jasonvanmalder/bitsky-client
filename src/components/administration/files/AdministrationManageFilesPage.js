import React, {useState, useEffect} from 'react'
import {
  Container,
  Row,
  Col,
  InputGroup,
  Input,
  InputGroupAddon,
  Button,
} from 'reactstrap'
import AdministrationSideMenu from '../common/AdministrationSideMenu'
import Navbar from '../../common/template/Navbar'
import Rank from '../../common/Rank'
import jwtDecode from 'jwt-decode'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faSearch, faUpload, faSort} from '@fortawesome/free-solid-svg-icons'
import styled from 'styled-components'
import posed from 'react-pose'
import AdministrationFileViewer from './common/AdministrationFileViewer'
import AdministrationFileRowTable from './common/AdministrationFileRowTable'
import _ from 'lodash'

const ContentLabel = posed.label({
  up: {
    top: '-21px',
    left: '2px',
    transform: 'scale(1.1)',
    'font-size': '13px',
    color: 'rgb(97, 97, 97)',
    transition: {duration: 400},
  },
  down: {
    top: '7px',
    left: '10px',
    transform: 'scale(1)',
    'font-size': '18px',
    color: 'rgb(160, 160, 160)',
    transition: {duration: 400},
  },
})

const AnimatedLabel = styled(ContentLabel)`
  position: absolute;
  font-size: 15px;
  z-index: 5;
`
const UploadButton = styled(Button)`
    background-color: rgb(131, 178, 224);
    border-color: rgb(131, 178, 224);
    padding: 3px 12px 3px 12px;
    font-size: 14px;
`

const SearchContainer = styled.div`
  padding: 25px !important;
`

const ColContainer = styled(Col)`
  align-self: center;
`

const SearchInput = styled(Input)`
    border-radius: 5px 0px 0px 5px !important;
`

const FileHeaderTableContainer = styled.div`
  margin-top: 30px;
  box-shadow: 0px 4px 34px -18px #222;
  font-weight: 500;
  
  && {
    padding-top: 20px !important;
  }
`

const Text = styled(Col)`
  text-align: left;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const TextHeader = styled.span`
  :hover {
    cursor: pointer;
  }
`

const NoFile = styled.span`
  display: block;
  margin: 10px;
`

const AdministrationManageFilesPage = () => {

  const [session] = useState(localStorage.getItem('token') ? jwtDecode(localStorage.getItem('token')) : null)
  const [toggelLabel, setToggleLabel] = useState(false)

  const [filesComponent, setFilesComponent] = useState([])
  const [filesComponentViewer, setFilesComponentViewer] = useState([])

  const [files] = useState([
    {
      'title': 'Ma passion pour les chats',
      'type': 'png',
      'author': 'Sylvain',
      'date': '15-02-2019',
      'size': '3 Mo',
      'src': 'http://lorempixel.com/400/200/cats/',
    },
    {
      'title': 'Mes plats',
      'type': 'png',
      'author': 'Sylvain',
      'date': '13-01-2019',
      'size': '2 Mo',
      'src': 'http://lorempixel.com/400/200/food/',
    },
    {
      'title': 'Mon PDF',
      'type': 'pdf',
      'author': 'Sylvain',
      'date': '10-01-2019',
      'size': '207 ko',
      'src': 'https://assets.awwwards.com/awards/submissions/2016/12/58415e2c44e79.jpg',
    },
    {
      'title': 'Vacances',
      'type': 'png',
      'author': 'Sylvain',
      'date': '19-02-2019',
      'size': '3 Mo',
      'src': 'http://lorempixel.com/400/200/nature/\'',
    },
  ])

  useEffect(() => {
    let files_result = []
    let files_viewer = []
    
    files.forEach((file, id) => {
      files_result.push(
        <AdministrationFileRowTable key={id} title={file.title} type={file.type} author={file.author} date={file.date} size={file.size} id={id} />
      )
    })

    _.take(files, 3).forEach( (file, id) => {
      files_viewer.push(
        <AdministrationFileViewer key={id} src={file.src} title={file.title} type={file.type} author={file.author} date={file.date} size={file.size}/>
      )
    })

    setFilesComponent(files_result)
    setFilesComponentViewer(files_viewer)
  },[])

  return (
    <div>
      <Navbar/>
      <Container className="main-container">
        <Row>
          <Col md="3" className="no-margin-left no-margin-right">
            <div className="user-container">
              <img src={localStorage.getItem('avatar')} alt="Avatar"/>
              <h5>{session.firstname + ' ' + session.lastname}</h5>
              <p className="rank"><Rank id={session.rank}/></p>
            </div>

            <AdministrationSideMenu/>
          </Col>
          <Col md="9" className="no-margin-left no-margin-right">
            <SearchContainer className="user-container">
              <Container>
                <Row>
                  <ColContainer md="2">
                    <h4>Fichiers</h4>
                  </ColContainer>
                  <ColContainer md="7">
                    <InputGroup>
                      <AnimatedLabel pose={toggelLabel ? 'up' : 'down'}>Rechercher</AnimatedLabel>
                      <SearchInput
                        onFocus={() => setToggleLabel(true)}
                        onBlur={() => setToggleLabel(false)}
                      />
                      <InputGroupAddon addonType="append">
                        <Button color="info">
                          <FontAwesomeIcon icon={faSearch}/>
                        </Button>
                      </InputGroupAddon>
                    </InputGroup>
                  </ColContainer>
                  <ColContainer md="3">
                    <UploadButton color="info"><FontAwesomeIcon icon={faUpload}/> Uploader</UploadButton>
                  </ColContainer>
                </Row>
              </Container>
            </SearchContainer>
            <div className="user-container admin-dashboard">
              <Container>
                <Row>
                  {filesComponentViewer && filesComponentViewer.length > 0 ? filesComponentViewer : 'Il n\'y a pas de fichier'}
                </Row>
              </Container>
            </div>
            <Container>
              <Row>
                <Col md="12">
                  <FileHeaderTableContainer className="user-container admin-dashboard">
                    <Container>
                      <Row>
                        <Text md="2"><TextHeader><FontAwesomeIcon icon={faSort}/> Nom</TextHeader></Text>
                        <Text md="2"><TextHeader><FontAwesomeIcon icon={faSort}/> Type</TextHeader></Text>
                        <Text md="2"><TextHeader><FontAwesomeIcon icon={faSort}/> Propriétaire</TextHeader></Text>
                        <Text md="2"><TextHeader><FontAwesomeIcon icon={faSort}/> Date</TextHeader></Text>
                        <Text md="2"><TextHeader><FontAwesomeIcon icon={faSort}/> Taille</TextHeader></Text>
                      </Row>
                    </Container>
                  </FileHeaderTableContainer>
                  {filesComponent && filesComponent.length> 0 ? filesComponent : <NoFile>Il n'y a pas de fichier</NoFile>}
                </Col>
              </Row>
            </Container>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default AdministrationManageFilesPage