import React, { Component } from 'react';
import logo from '../assets/img/logo.png';
import logo_small from '../assets/img/logo-small.png';
import $ from 'jquery';

class Register extends Component {

  componentDidMount() {
    setInterval(() => {
      let container = $('.single-form-subcontainer.right .container');
      let img = $('.single-form-subcontainer.right .container img');
      let subcontainer = $('.single-form-subcontainer.right');

      container.width(subcontainer.width());
      img.css('top',(subcontainer.height()-img.height())/2 + 'px');
      img.css('left',(subcontainer.width()-img.width())/2 + 'px');

      container.fadeIn();
      img.fadeIn();
    }, 300);
  }

  render() {
    return (
      <div className="App">
        <div className="single-form-container">
          <div className="single-form-subcontainer left">

           <div className="slogan register-title">
                     <img src={logo_small} alt="logo"/>
  <h2>Inscription</h2>
           </div>

           <form method="post">
            <label>Adresse email<input type="email" placeholder="john.doe@bitsky.be"/></label>
            <label>Mot de passe<input type="password" placeholder="••••••••"/></label>
            <label>Répétez le mot de passe<input type="password" placeholder="••••••••"/></label>
            <label>Nom<input type="text" placeholder="Doe"/></label>
            <label>Prénom<input type="text" placeholder="John"/></label>
           
            <div className="button-group">
              <button className="primary"><span>Inscription</span></button>
              <button className="secondary" onClick={ () => this.props.history.push('/login') }>Déjà inscrit ?</button>
            </div>
            
           </form>
          </div>
          <div className="single-form-subcontainer right">
            <div className="overlay"></div>
            <div className="container">
              <nav>
                <ul>
                  <li><a href="">À propos</a></li>
                  <li><a href="">Support</a></li>
                  <li><a href="">Mises à jour</a></li>
                  <li><a href="">Documentation</a></li>
                </ul>
              </nav>
              <img src={logo} alt="logo"/>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
}

export default Register;
