import './App.css';
import Navigation from './components/Navigation/Navigation';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import { useCallback } from "react";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import React, { useState } from 'react'





const App = () => {
  const handleSignOut = () => {
    resetState();
  };
  const resetState = () => {
    setInput('');
    setImageUrl('');
    setBox({});
    setRoute('signin');
    setIsSignedIn(false);
    setUser({
      id: '',
      name: '',
      email: '',
      entries: 0, 
      joined: ''
    });
  };
  const [imageUrl, setImageUrl] = useState('');
  const [box, setBox] = useState({});
  const [route, setRoute] = useState('signin');
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [user, setUser] = useState({
    id: '',
    name: '',
    email: '',
    entries: 0, 
    joined: ''
  })
  const [input, setInput] = useState('');

  const onRouteChange = (route) => {
    if (route === 'signout') {
        handleSignOut();
    } else if (route === 'home') {
        setIsSignedIn(true);
    }
    setRoute(route);
}

    const particlesInit = useCallback(async engine => {
    //   console.log(engine);
      // you can initiate the tsParticles instance (engine) here, adding custom shapes or presets
      // this loads the tsparticles package bundle, it's the easiest method for getting everything ready
      // starting from v2 you can add only the features you need reducing the bundle size
      await loadFull(engine);
  }, []);

  const particlesLoaded = useCallback(async container => {
    //   await console.log(container);
  }, []);



    const onInputChange = (event) => {
        setInput(event.target.value);
  }


  const calculateFaceLocation = (data) => {
        const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
        const image = document.getElementById('inputimage');
        const width = Number(image.width);
        const height = Number(image.height);
        return {
            leftCol: clarifaiFace.left_col * width,
            topRow: clarifaiFace.top_row * height,
            rightCol: width - (clarifaiFace.right_col * width),
            bottomRow: height - (clarifaiFace.bottom_row * height)
        }
  }
  const displayFaceBox = (box) => {
            setBox(box);
  }
  
  




  
 
  const loadUser = (data) => {
    setUser({
        id: data.id,
        name: data.name,
        email: data.email,
        entries: data.entries,
        joined: data.joined
    })
  }
  
  const onButtonSubmit = () => {
    setImageUrl(input);
    fetch("https://node-js-production-cabf.up.railway.app/imageurl", {
            method: "post",
            headers: { "Content-type": "application/json" },
            body: JSON.stringify({
              input: input,
            }),
          })
      .then((response) => response.json())
      .then((response) => {
        displayFaceBox(calculateFaceLocation(response));
        if (response) {
          fetch("https://node-js-production-cabf.up.railway.app/image", {
            method: "put",
            headers: { "Content-type": "application/json" },
            body: JSON.stringify({
              id: user.id,
            }),
          })
            .then((response) => response.json())
            .then((count) => {
              setUser((prevUser) => ({ ...prevUser, entries: count }));
            })
            .catch(console.log);
        }
      })
      .catch((error) => console.log("error", error));
  };
  

    return (
      <div className="App">

<Particles className='particles'
              id="tsparticles"
              init={particlesInit}
              loaded={particlesLoaded}
            options={{
                // background: {
                //     color: {
                //         value: "#0d47a1",
                //     },
                // },
                // fpsLimit: 120,
                // interactivity: {
                //     events: {
                //         onClick: {
                //             enable: true,
                //             mode: "push",
                //         },
                //         onHover: {
                //             enable: true,
                //             mode: "repulse",
                //         },
                //         resize: true,
                //     },
                //     modes: {
                //         push: {
                //             quantity: 4,
                //         },
                //         repulse: {
                //             distance: 200,
                //             duration: 0.4,
                //         },
                //     },
                // },
                particles: {
                    // color: {
                    //     value: "#ffffff",
                    // },
                    links: {
                        color: "#ffffff",
                        distance: 300,
                        enable: true,
                        opacity: 0.5,
                        width: 1,
                    },
                    collisions: {
                        enable: false,
                    },
                    move: {
                        // directions: "none",
                        enable: true,
                        // outModes: {
                        //     default: "bounce",
                        // },
                        random: true,
                        speed: 1,
                        straight: true,
                    },
                    number: {
                        density: {
                            enable: true,
                            area: 600,
                        },
                        value: 40,
                    },
                    // opacity: {
                    //     value: 0.5,
                    // },
                    // shape: {
                    //     type: "circle",
                    // },
                    // size: {
                    //     value: { min: 1, max: 5 },
                    // },
                },
                detectRetina: false,
            }}
        />


        <Navigation isSignedIn={isSignedIn} onRouteChange={onRouteChange} />
        { route === 'home'
            ? <div>
            <Logo />
            <Rank name={user.name} entries={user.entries} />
            <ImageLinkForm onInputChange={onInputChange} onButtonSubmit={onButtonSubmit} />
            <FaceRecognition box={box} imageUrl={imageUrl} />
            </div>

            : (
                route === 'signin'
                ? <Signin onRouteChange={onRouteChange} loadUser={loadUser} />
                : <Register onRouteChange={onRouteChange} loadUser={loadUser} />
            )
        }
    </div>
    );
  }


export default App;
