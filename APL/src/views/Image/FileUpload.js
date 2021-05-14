// This is only for IMAGE .JPG file upload

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
import { red, blue } from '@material-ui/core/colors';
import { useHistory } from "react-router-dom";
import axios from "axios";
import { func } from 'prop-types';

const fileTypeList = ["TeamLogo", "PlayerImage"];
const fileTypeDesc = {
                      TeamLogo: "Team logo (jpg)",
                      PlayerImage: "Player Image (jpg)"
                    };
const extAllowed = {
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
      marginTop: '10px',
      fontWeight: theme.typography.fontWeightBold,
  },
  success:  {
    fontSize: '12px',
    color: blue[700],
    alignItems: 'center',
    marginTop: '10px',
    fontWeight: theme.typography.fontWeightBold,
},
textData: {
    fontSize: '14px',
    margin: theme.spacing(0),
  },
}));


export default function FileUpload() {
  const classes = useStyles();
  // const history = useHistory();
  const [registerStatus, setRegisterStatus] = useState(0);
  const [state, setState] = useState({selectedFile: null });
  const [fileType, setFileType] = useState(fileTypeList[0]);
  const [productName, setProductName] = useState("");
  const [productVersion, setProductVersion] = useState("");
  // const [validExt, setValidExt] = useState([])

  // console.log("File transfer");
  useEffect(() => {
    const fup = async () => {
    }
    fup();
}, []);

    
  function ShowResisterStatus() {
    let myMsg;
    switch (registerStatus) {
      case 0:
        myMsg = ``;
        break;
      case 200:
        myMsg = `Successfully uploaded fIle ${state.selectedFile.name}`;
        break;
      case 601:
        myMsg = `Error loading file`;
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
    setState({ selectedFile:  tmp});
    setRegisterStatus(0);
  };

  async function onFileUpload() {
    // Create an object of formData
    const formData = new FormData();
  
    // Update the formData object
    formData.append(
      "file",
      state.selectedFile,
      state.selectedFile.name
    );
  
    console.log(state.selectedFile.name);
    try {
      let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/apl/uploadimage/${fileType}/${state.selectedFile.name}`
      await axios.post(myUrl, formData);
      setRegisterStatus(200);
    } catch (e) {
      setRegisterStatus(601);
      console.log(e);
    }
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

  function Upload() {    
    return (
    <div>
      <FileData />
      <input type="file" onChange={onFileChange} accept={extAllowed[fileType]} />
      <Button align="center" key="filterbtn" variant="contained" 
        color="primary" size="small"
        disabled={state.selectedFile === null}
        className={classes.button} onClick={onFileUpload}>Upload
      </Button>
    </div>
    );
  }
   
  function BinaryInfo() {
    console.log(fileType);
    if (fileType === "Binary")
    return (
      <div>
        <TextField id="productname" variant="outlined" required fullWidth
          label="Product Name" name="imagetype"
          // d={productName}
          // onChange={(event) => {setProductName(event.target.value);  setState({ selectedFile:  null}); setRegisterStatus(0)}}
        />
        <br/>
        <TextField id="productversion" variant="outlined" required fullWidth
          label="Product Version" name="imagetype"
          // value={productVersion}
          // onChange={(event) => {setProductVersion(event.target.value);  setState({ selectedFile:  null}); setRegisterStatus(0)}}
        />
      </div>
    )
    else
      return null;
  } 
  
  
  
  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div>
        <h3>Upload Player or Team Image</h3>
        <Select labelId='imagetype' variant="outlined" required fullWidth
        label="File Type" name="imagetype"
        id="imagetype"
        value={fileType}
        onChange={(event) => {setFileType(event.target.value);  setState({ selectedFile:  null}); setRegisterStatus(0)}}
        >
        {fileTypeList.map(x =>
        <MenuItem key={x} value={x}>{x}</MenuItem>)}
      </Select>
        {/* <br/>
        <Typography>Upload type {fileTypeDesc[fileType]}</Typography> */}
        <br/>
        {/* <BinaryInfo /> */}
        <br/>
        <Upload />
        <ShowResisterStatus/>
      </div>
    </Container> 
  );
}
