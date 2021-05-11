import React, { useState, useMemo } from "react";
// import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import { createBrowserHistory } from "history";
import { UserContext } from "./UserContext";
import Button from '@material-ui/core/Button';
//import Admin from "layouts/Admin.js";
import "assets/css/material-dashboard-react.css?v=1.9.0";

// import { DesktopWindows } from "@material-ui/icons";
import Player from "views/SuperUser/Player"
import FileDownload from "views/APL/FileDownload"
import FileUpload from "views/APL/FileUpload";
import BinaryUpload from "views/APL/BinaryUpload";
import BinaryDownload from "views/APL/BinaryDownload";
import PlayerPicture from "views/SuperUser/PlayerPic"
import TeamPicture from "views/SuperUser/TeamPic"

const hist = createBrowserHistory();


function initCdParams() {
  localStorage.setItem("joinGroupCode", "");
  let ipos = 0;
  if ((localStorage.getItem("tabpos") !== null) &&
  (localStorage.getItem("tabpos") !== "") ) {
    ipos = parseInt(localStorage.getItem("tabpos"));
    if (ipos >= process.env.REACT_APP_BASEPOS) localStorage.setItem("tabpos", ipos-process.env.REACT_APP_BASEPOS);
  } else
    localStorage.setItem("tabpos", 0);
  console.log(`ipos: ${ipos}   Tabpos ${localStorage.getItem("tabpos")}`)
}


function AppRouter() {
  const [user, setUser] = useState(null);
  const value = useMemo(() => ({ user, setUser }), [user, setUser]);

  const [upDown, setupDown] = useState("DOWNLOADIMAGE");

  function ShowButtons() {
    console.log(upDown);
    return (
      <div align="center">
        <Button
          // type="submit"
          size="small"
          variant="contained"
          color="primary"
          disabled={upDown === "UPLOADBINARY"}
          onClick={() => {setupDown("UPLOADBINARY")}}
        >
          Upload Binary
        </Button>
        <Button
          //type="submit"
          size="small"
          variant="contained"
          color="primary"
          disabled={upDown === "DOWNLOADBINARY"}
          onClick={() => {setupDown("DOWNLOADBINARY")}}
        >
          DownLoad Binary
        </Button>
        <Button
          // type="submit"
          size="small"
          variant="contained"
          color="primary"
          disabled={upDown === "UPLOADIMAGE"}
          onClick={() => {setupDown("UPLOADIMAGE")}}
        >
          Upload Image
        </Button>
        <Button
          //type="submit"
          size="small"
          variant="contained"
          color="primary"
          disabled={upDown === "DOWNLOADIMAGE"}
          onClick={() => {setupDown("DOWNLOADIMAGE")}}
        >
          DownLoad Image
        </Button>
      </div>
    )
  }


  function DispayTabs() {
    // console.log(localStorage.getItem("uid"));
    // console.log(`Status is ${isUserLogged()}`)

    if (isUserLogged())
      return (<CricDreamTabs/>)  
    else {
      if (localStorage.getItem("currentLogin") === "SIGNUP")
        return (<SignUp/>)
      else if (localStorage.getItem("currentLogin") === "RESET")
        return (<ForgotPassword/>)
      else
        return (<SignIn/>)
    }
  }
  // localStorage.clear()
  window.onbeforeunload = () => Router.refresh();
  //console.log("in before unload");
  // localStorage.clear();
  // console.log("clearing local storage");
  initCdParams();
  //console.log("GTP "+window.location.pathname.toLowerCase());
  let mypath = window.location.pathname.split("/");

  function DisplayOptions() {
    switch (upDown) {
      case "UPLOADBINARY": return <BinaryUpload />
      case "UPLOADIMAGE" : return <FileUpload />
      case "DOWNLOADBINARY": return <BinaryDownload />
      case "DOWNLOADIMAGE" : return <FileDownload />
      default: return null;
    }
  }

  function ShowHome() {
    return (
      <div>
        <ShowButtons />
        <DisplayOptions />
      </div>
    )
  }

  return (
    <BrowserRouter history={hist}> 
      <UserContext.Provider value={value}>
        <Route path="/uploadimage" component={FileUpload} />
        <Route path="/downloadimage" component={FileDownload} />
        <Route path="/uploadbinary" component={BinaryUpload} />
        <Route path="/downloadbinary" component={BinaryDownload} />
        <Route path="/playerpic/:playerPid" component={PlayerPicture} />
        <Route path="/teampic/:teamName" component={TeamPicture} />
        <Route path="/home" component={ShowHome} />
        <Route exact path="/" component={ShowHome} />
        {/* <Redirect exact from="/" to="/home" /> */}
      </UserContext.Provider>
    </BrowserRouter>
  );

// return (
//       <Router history={hist}> 
//       <UserContext.Provider value={value}>
//       </UserContext.Provider>
//       <DispayTabs />
//       </Router>
//   );

}

export default AppRouter;
