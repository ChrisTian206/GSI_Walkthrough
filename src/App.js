import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';
import { GSI_CLIENT_ID, GSI_CLIENT_SECRET } from './config'
import jwt_decode from 'jwt-decode'

function App() {
  const [user, setUser] = useState({});

  const handleCallbackResponse = (response) => {
    //this credential returned from Google server indicates the 
    //identity of the user, and confirmed this user has successfully logged in

    //need jwt-decode to break it down
    console.log("Encoded JWT ID token: " + response.credential)
    const user_object = jwt_decode(response.credential)
    console.log(user_object)
    setUser(user_object)
    document.getElementById('signInDiv').hidden = true
    alert('now signed in, login button is hidden')
  }

  const handleSignOut = (event) => {
    setUser({});
    document.getElementById('signInDiv').hidden = false;

  }

  useEffect(() => {
    /*global google*/
    google.accounts.id.initialize({
      client_id: GSI_CLIENT_ID,
      callback: handleCallbackResponse
    }
    );

    google.accounts.id.renderButton(
      document.getElementById('signInDiv'), {
      theme: 'outline',
      size: 'large'
    }
    );
  }, [])

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1>Test For Google Sign In</h1>
        <p>1. Go on to Google account console</p>
        <p>2. Under API/Creditials, create project</p>
        <p>3. Setup URLs, Scopes, Testers, then get the client ID and Secret </p>
        <p>4. include script in the public/index.html in the header tag</p>

        <div id='signInDiv' style={{ marginBottom: "20px" }}></div>

        {Object.keys(user).length != 0 &&
          <button onClick={(e) => handleSignOut(e)} style={{ margin: "20px" }}>Sign Out</button>
        }

        {user &&
          <div>
            <img src={user.picture}></img>
            <h3>{user.name}</h3>
            <h3>Here is the user's unique id: {user.sub}</h3>
            <h3>This can be used as a user_id for User model</h3>
          </div>}


      </header>
    </div >
  );
}

export default App;
