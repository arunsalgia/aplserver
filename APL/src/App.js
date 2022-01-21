import React, { useState, useMemo } from "react";
// import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import { createBrowserHistory } from "history";
import { UserContext } from "./UserContext";
import Button from '@material-ui/core/Button';
import Grid from "@material-ui/core/Grid";
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';

//import Admin from "layouts/Admin.js";
import "assets/css/material-dashboard-react.css?v=1.9.0";

// import { DesktopWindows } from "@material-ui/icons";

import FileDownload from "views/Image/FileDownload";
import FileUpload from "views/Image/FileUpload";

import BinaryUpload from "views/Binary/BinaryUpload";
import BinaryDownload from "views/Binary/BinaryDownload";
import ProductText from "views/Binary/BinaryText";

import PlayerPicture from "views/Picture/PlayerPic";
import TeamPicture from "views/Picture/TeamPic";

const hist = createBrowserHistory();

// styles
import globalStyles from "assets/globalStyles";


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
  const gClasses = globalStyles();

  const [user, setUser] = useState(null);
  const value = useMemo(() => ({ user, setUser }), [user, setUser]);

  const [currentSelection, setCurrentSelection] = useState("UploadBinary");

  function ShowButtons() {
    console.log(currentSelection);
    return (
      <div align="center">
        <div>
        <Button
          // type="submit"
          size="small"
          variant="contained"
          color="primary"
          disabled={currentSelection === "UPLOADBINARY"}
          onClick={() => {setCurrentSelection("UPLOADBINARY")}}
        >
          
        </Button>
        <Button
          //type="submit"
          size="small"
          variant="contained"
          color="primary"
          disabled={currentSelection === "DOWNLOADBINARY"}
          onClick={() => {setCurrentSelection("DOWNLOADBINARY")}}
        >
          DownLoad Binary
        </Button>
        </div>
        <div>
        <Button
          // type="submit"
          size="small"
          variant="contained"
          color="primary"
          disabled={currentSelection === "UPLOADIMAGE"}
          onClick={() => {setCurrentSelection("UPLOADIMAGE")}}
        >
          Upload Image
        </Button>
        <Button
          //type="submit"
          size="small"
          variant="contained"
          color="primary"
          disabled={currentSelection === "DOWNLOADIMAGE"}
          onClick={() => {setCurrentSelection("DOWNLOADIMAGE")}}
        >
          DownLoad Image
        </Button>
        </div>
        <div>
        <Button
          // type="submit"
          size="small"
          variant="contained"
          color="primary"
          disabled={currentSelection === "BINARYTEXT"}
          onClick={() => {setCurrentSelection("BINARYTEXT")}}
        >
          Product Text
        </Button>
        </div>
      </div>
    )
  }

  function DisplayFunctionItem(props) {
  let itemName = props.item;
  return (
		<Grid key={"BUT"+itemName} item xs={4} sm={4} md={2} lg={2} >
			<Typography onClick={() => setCurrentSelection(itemName)}>
				<span 
					className={(itemName === currentSelection) ? gClasses.functionSelected : gClasses.functionUnselected}>
				{itemName}
				</span>
			</Typography>
		</Grid>
  )}

	async function setSelection(item) {
		currentSelection(item);
	}
	

  function DisplayFunctionHeader() {
    return (
    <Box  className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1} >
    <Grid className={gClasses.noPadding} key="AllPatients" container align="center">
      <DisplayFunctionItem item="UploadBinary" />
      <DisplayFunctionItem item="DownloadBinary" />
      <DisplayFunctionItem item="UploadImage" />
      <DisplayFunctionItem item="DownloadImage" />
      <DisplayFunctionItem item="BinaryText" />
    </Grid>	
    </Box>
  )}

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
    switch (currentSelection) {
      case "UploadBinary": return <BinaryUpload />
      case "UploadImage" : return <FileUpload />
      case "DownloadBinary": return <BinaryDownload />
      case "DownloadImage" : return <FileDownload />
      case "BinaryText" : return <ProductText />
      default: return null;
    }
  }

  function ShowHome() {
    return (
      <div>
        {/*<ShowButtons />*/}
        <DisplayFunctionHeader />
        <DisplayOptions />
      </div>
    )
  }

  return (
    <BrowserRouter history={hist}> 
      <UserContext.Provider value={value}>
        <Route path="/image/upload" component={FileUpload} />
        <Route path="/image/download" component={FileDownload} />
        <Route path="/binary/upload" component={BinaryUpload} />
        <Route path="/binary/download" component={BinaryDownload} />
        <Route path="/binary/text" component={ProductText} />
        <Route path="/playerpic/:playerPid" component={PlayerPicture} />
        <Route path="/teampic/:teamName" component={TeamPicture} />
        <Route path="/home" component={ShowHome} />
        <Route exact path="/" component={ShowHome} />
        {/* <Redirect exact from="/" to="/home" /> */}
      </UserContext.Provider>
    </BrowserRouter>
  );

}

export default AppRouter;
