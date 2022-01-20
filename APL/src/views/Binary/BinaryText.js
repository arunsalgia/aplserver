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
import {
  checkText, textToInternal, internalToText,
} from "views/functions.js"
import axios from "axios";
import download from 'js-file-download';

const debug = false;
const extensionType = ["EXE", "APK"];
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


export default function ProductText() {
  const classes = useStyles();
  // const history = useHistory();
  // const [userRequest, setUserRequest] = useState("");
  const [registerStatus, setRegisterStatus] = useState(0);
  const [fileList, setFileList] = useState([]);
  const [state, setState] = useState({selectedFile: null });

  // const [fileType, setFileType] = useState("");
  // const [validExt, setValidExt] = useState([])

  const [masterData, setMasterData] = useState([]);
  const [products, setProducts] = useState([]);
  const [versions, setVersions] = useState([]);
  const [currProduct, setCurrProduct] = useState("");
  const [currVersion, setCurrVersion] = useState("");
  const [currType, setCurrType] = useState("");
  const [currRecord, setCurrRecord] = useState(null);
  const [currText, setCurrText] = useState("");
  //
  // const [percentage, setPercentage] = useState(0);
  // const [showProgress, setShowProgress] = useState(false);
  // const [downloadInProgress, setDownloadInProgress] = useState(false);

  useEffect(() => {
    const fdl = async () => {
      try {
        // console.log("in use");
        let resp = await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/apl/getbinarynames`);
        // console.log(resp.data);
        setMasterData(resp.data);
        let myProducts = resp.data.map(x => x.name);
        myProducts = loadshUniqBy(myProducts);
        setProducts(myProducts);

        if (myProducts.length > 0) {
          setCurrProduct(myProducts[0]);
          let tmp = resp.data.filter(x => x.name === myProducts[0]);
          setVersions(tmp);
          setCurrVersion(tmp[0].version);
          console.log(tmp[0]);
          setCurrType(tmp[0].type);
          setCurrText(internalToText(tmp[0].text));
          // console.log("0. CUrr type", tmp.version[0].type )
          setCurrRecord(tmp[0]);
          // console.log(myProducts);
          // console.log(tmp.version);
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
        myMsg = `Successfully Updated Product description`;
        break;
      case 601:
        myMsg = `Error updating product description`;
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





  function handleProductSelect(newProduct) {
    setCurrProduct(newProduct);
    let tmp = masterData.filter(x => x.name === newProduct);
    setVersions(tmp);
    setCurrVersion(tmp[0].version);
    setCurrRecord(tmp[0]);
    setCurrType(tmp[0].type);
    setCurrText(internalToText(tmp[0].text));
    setRegisterStatus(0);
  }

  
  function handleVersionSelect(newVersion) {
    setCurrVersion(newVersion);
    let tmp = masterData.find(x => x.name === currProduct && x.version === newVersion);
    console.log(tmp);
    setCurrType(tmp.type);
    setCurrText(internalToText(tmp.text));
    setCurrRecord(tmp);
    setRegisterStatus(0);
  }

  async function handleUpdateText() {
    let myText = document.getElementById("producttext").value;
    // console.log("Before",myText);
    setCurrText(myText);

    // checkText(myText);
    myText = textToInternal(myText);
    // console.log("After",myText);

    let pro = currRecord.name;
    let ver = currRecord.version;
    let typ = currRecord.type;
    try {
      let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/apl/setproducttext/${pro}/${typ}/${ver}/${myText}`;
      // console.log(myUrl);
      await axios.get(myUrl);
      setRegisterStatus(200);

    } catch(e) {
      console.log(e);
      setRegisterStatus(601);
    }
  }

  function ShowTextUpdate() {
    return (
      <div>
      <Typography>Update Description</Typography>
      <TextField variant="outlined" multiline fullWidth 
      id="producttext"
      label="Product Description" 
      autoFocus
      defaultValue={currText} 
      // onChange={(event) => setCurrText(event.target.value)}
      />
      <Button align="center" key="filterbtn" variant="contained" 
        color="primary" size="small"
        className={classes.button} onClick={handleUpdateText}>Update
      </Button>
      </div>
    )
  }


  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div align="center">
        <h3>Set detailed text of  Product</h3>
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
        <h3></h3>
        <TextField variant="outlined" fullWidth label="Product Type" value={currType} disabled />
        <h3></h3>
        <ShowTextUpdate />
        <ShowResisterStatus/>
      </div>
    </Container> 
  );
}
