import React, { useState , useEffect, useContext} from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';

import Button from '@material-ui/core/Button';
import Select from "@material-ui/core/Select";
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import Box from "@material-ui/core/Box";
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import LinearProgressWithLabel from '@material-ui/core/LinearProgress';
import LinearProgress from '@material-ui/core/LinearProgress';
import CircularProgressWithLabel from '@material-ui/core/LinearProgress';

import loadshUniqBy from 'lodash/uniqBy';

// import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import {red, blue} from '@material-ui/core/colors';
import { useHistory } from "react-router-dom";
// import {ValidComp, BlankArea, CricDreamLogo} from "CustomComponents/CustomComponents.js"
// import {encrypt} from "views/functions.js"
// import { SettingsCellOutlined } from '@material-ui/icons';
import axios from "axios";
import download from 'js-file-download';

const debug = false;
const fileTypeList = ["TeamLogo", "PlayerImage"];
const fileTypeDesc = {
                      Binary: "File type binary (exe/apk)",
                      TeamLogo: "Team logo (jpg)",
                      PlayerImage: "Player Image (jpg)"
                    };
const extAllowed = {
                    Binary: ".exe,.apk",
                    TeamLogo: ".jpg",
                    PlayerImage: ".jpg"
                  }

                 
const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  downloadText: {
    color: red[700],
    fontWeight: theme.typography.fontWeightBold,     //theme.typography.fontWeightBold,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  error:  {
      fontSize: '12px',
      color: red[700],
      alignItems: 'center',
      marginTop: '0px',
      fontWeight: theme.typography.fontWeightBold,
    },
  success:  {
    fontSize: '12px',
    color: blue[700],
    alignItems: 'center',
    marginTop: '0px',
    fontWeight: theme.typography.fontWeightBold,
},
textData: {
    fontSize: '14px',
    margin: theme.spacing(0),
  },
}));


export default function FileDownload() {
  const classes = useStyles();
  // const history = useHistory();
  const [userRequest, setUserRequest] = useState("");
  const [registerStatus, setRegisterStatus] = useState(0);
  const [fileList, setFileList] = useState([]);
  const [state, setState] = useState({selectedFile: null });

  const [fileType, setFileType] = useState("");
  const [validExt, setValidExt] = useState([])

  const [masterData, setMasterData] = useState([]);
  const [products, setProducts] = useState([]);
  const [versions, setVersions] = useState([]);
  const [currProduct, setCurrProduct] = useState("");
  const [currVersion, setCurrVersion] = useState("");
  const [currRecord, setCurrRecord] = useState(null);
  //
  const [percentage, setPercentage] = useState(0);
  const [showProgress, setShowProgress] = useState(false);
  const [downloadInProgress, setDownloadInProgress] = useState(false);

  useEffect(() => {
    const fdl = async () => {
      try {
        // console.log("in use");
        let resp = await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/apl/getbinarynames`);
        setMasterData(resp.data);

        // get uniq product names
        let myProducts = resp.data.map(x => x.name);
        myProducts = loadshUniqBy(myProducts);
        console.log(myProducts);

        setProducts(myProducts);
        if (myProducts.length > 0) {

          setCurrProduct(myProducts[0]);
          let tmp = resp.data.filter(x => x.name === myProducts[0]);
          setVersions(tmp);
          setCurrVersion(tmp[0].version);
          setCurrRecord(tmp[0]);
          //console.log(myProducts);
          //console.log(tmp.version);
        }
      } catch (e) {
        console.log(e);
      }
    }
    fdl();
}, []);

    
  function ShowResisterStatus() {
    let myMsg;
    switch (registerStatus) {
      case 0:
        myMsg = ``;
        break;
      case 200:
        myMsg = `Successfully downloaded file`;
        break;
      case 601:
        myMsg = `Error downloading file`;
        break;
      default:
        myMsg = "Unknown Error";
        break;
  }
  return(
    <div>
      <Typography className={(registerStatus === 200) ? classes.success : classes.error}>{myMsg}</Typography>
    </div>
  )}

  function onFileChange(event) {
    // Update the state
    let tmp = event.target.files[0];
    // tmp.name = tmp.name.toUpperCase();
    setState({ selectedFile:  tmp});
  };


function OrgonFileDownload() {
  setPercentage(0);
  setDownloadInProgress(true);
  if (debug) console.log("on file download start");
  setRegisterStatus(0);
  setShowProgress(true);
  try {
  axios({
		method: 'get',
		url: `${process.env.REACT_APP_AXIOS_BASEPATH}/apl/downloadbinary/${fileType}/${currSelect}`,
		responseType: 'arraybuffer',
		onDownloadProgress: (progressEvent) => {
      let newPercent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
      // if ((newPercent - percentage) > 5)
      setPercentage(newPercent);
      if (debug) console.log("File download in progress ", newPercent);
		},
    })
    .then(
      (response) => {
        if (debug) console.log("FIle download complete");
        setRegisterStatus(200);
        setShowProgress(false);
        download(response.data, currSelect);
        // console.log(response)
        //   this.setState({
        //       results: response.data.results,
        //       error: null,
        //       totalPages: Math.ceil(response.data.count / response.data.results.length)
        //   })  
      }
    )
    .catch(
        (error) => {
            // this.setState({
            //     loading: null,
            //     error: true
            // })  
            setRegisterStatus(601);
            setShowProgress(false);
            console.log(error);
            console.log("in axios catch");
        }
    ); 
  } catch (e) {
    console.log(e);
    if (debug) console.log("in try catch");
    setRegisterStatus(601);
    setShowProgress(false);
  } 
  if (debug) console.log("Debu complete");
  setDownloadInProgress(false);
};

function onFileDownload() {
  let pname = currRecord.name;
  let ptype = currRecord.type;
  let pver = currRecord.version;
  let newFile = pname + "." + ptype;
  setPercentage(0);
  setDownloadInProgress(true);
  if (debug) console.log("on file download start");
  setRegisterStatus(0);
  setShowProgress(true);
  try {
  axios({
		method: 'get',
		url: `${process.env.REACT_APP_AXIOS_BASEPATH}/apl/downloadbinary/${pname}/${ptype}/${pver}`,
		responseType: 'arraybuffer',
		onDownloadProgress: (progressEvent) => {
      let newPercent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
      // if ((newPercent - percentage) > 5)
      setPercentage(newPercent);
      if (debug) console.log("File download in progress ", newPercent);
		},
    })
    .then(
      (response) => {
        if (debug) console.log("FIle download complete");
        setRegisterStatus(200);
        setShowProgress(false);
        download(response.data, newFile);
        // console.log(response)
        //   this.setState({
        //       results: response.data.results,
        //       error: null,
        //       totalPages: Math.ceil(response.data.count / response.data.results.length)
        //   })  
      }
    )
    .catch(
        (error) => {
            // this.setState({
            //     loading: null,
            //     error: true
            // })  
            setRegisterStatus(601);
            setShowProgress(false);
            console.log(error);
            console.log("in axios catch");
        }
    ); 
  } catch (e) {
    console.log(e);
    if (debug) console.log("in try catch");
    setRegisterStatus(601);
    setShowProgress(false);
  } 
  if (debug) console.log("Debu complete");
  setDownloadInProgress(false);
};



  function FileData() {
    if (state.selectedFile) {         
      return (
        <div>
          <Box>
            <Typography>File Details:</Typography>
            <Typography>Name: {state.selectedFile.name}</Typography>
            <Typography>Type: {state.selectedFile.type}</Typography>
            <Typography>
              Last Modified:{" "}
              {state.selectedFile.lastModifiedDate.toDateString()}
            </Typography>
          </Box>
        </div>
      );
    } else {
      return (
        <div>
          <br />
          <h4>Choose before Pressing the Upload button</h4>
        </div>
      );
    }
  };

  function DisplayProgress() {
    // console.log(percentage);
    if (showProgress)
      return(
        <div align="center">
        <Typography className={classes.downloadText}>{`Progress ${percentage}%`}</Typography>
        {/* <CircularProgressWithLabel variant="determinate" value={percentage} /> */}
        <LinearProgressWithLabel color="secondary" variant="determinate" value={percentage} />
        </div>
      );
    else
      return null;
  }

  function BinaryInfo() {
    return null;
  }

  function DownLoad() {    
    // console.log(currRecord);
    return (
    <div>
      <div>
        <DisplayProgress />
        <h3></h3>
        <Button align="center" key="filterbtn" variant="contained" 
          color="primary" size="small"
          disabled={((currRecord === null) || (downloadInProgress === true))}
          className={classes.button} onClick={onFileDownload}>Download
        </Button>
      </div>
      {/* <FileData /> */}
    </div>
    );
  }
   
  // const fileTypeList = ["Binary", "TeamLogo", "PlayerImage"];
  function handleFileTypeSelect(fType) {
    // console.log("File type ", fType);
    setFileType(fType);
    setState({selectedFile: null});
    let myFiles = [];
    switch (fType) {
      case "Binary":   myFiles = binFiles; break;
      case "TeamLogo": myFiles = teamFiles; break;
      case "PlayerImage": myFiles  = playerFiles; break;
    }
    setCurrFIles(myFiles);
    setCurrSelect(myFiles.length > 0 ? myFiles[0] : "");
  }

  function handleProductSelect(newProduct) {
    setCurrProduct(newProduct);
    let tmp = masterData.filter(x => x.name === newProduct);
    setVersions(tmp);
    setCurrVersion(tmp[0].version);
    setCurrRecord(tmp[0]);
    setRegisterStatus(0);
  }

  
  function handleVersionSelect(newVersion) {
    setCurrVersion(newVersion);
    let tmp = masterData.find(x => x.name === currProduct && x.version === newVersion);
    setCurrRecord(tmp);
    setRegisterStatus(0);
  }


  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div align="center">
        <h3>Download Binary exe or apk </h3>
        <Select labelId='product' variant="outlined" required fullWidth
          label="Product" name="product"
          id="product"
          value={currProduct}
          // onChange={handleFileTypeSelect}
          onChange={(event) => { handleProductSelect(event.target.value); }}
        >
          {products.map(x =>
          <MenuItem key={x} value={x}>{x}</MenuItem>)}
        </Select>
        <h3></h3>
        <Select labelId='version' variant="outlined" required fullWidth
          label="Version" name="version"
          id="version"
          value={currVersion}
          // onChange={handleFileTypeSelect}
          onChange={(event) => { handleVersionSelect(event.target.value); }}
        >
          {versions.map(x =>
          <MenuItem key={x.version} value={x.version}>{x.version}</MenuItem>)}
        </Select>
        <br/>
        <h3></h3>
        <BinaryInfo />
        <DownLoad />
        <ShowResisterStatus/>
      </div>
    </Container> 
  );
}
