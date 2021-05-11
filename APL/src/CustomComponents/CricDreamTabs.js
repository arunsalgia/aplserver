import React, { useEffect } from 'react';
import axios from "axios";
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import HomeIcon from '@material-ui/icons/Home';
import MenuIcon from '@material-ui/icons/Menu';
import GroupIcon from '@material-ui/icons/Group';
import Button from '@material-ui/core/Button';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu'; 
import {red, blue, green} from '@material-ui/core/colors';
import Divider from '@material-ui/core/Divider';
import {cdRefresh, specialSetPos, upGradeRequired, clearBackupData} from "views/functions.js"
/// cd items import
import { BlankArea } from './CustomComponents';
import Modal from 'react-modal';
//import {upGradeRequired} from "views/functions";


const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)'
  }
};

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    // marginRight: theme.spacing(2),
    marginLeft: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  icon : {
    color: '#FFFFFF',
    marginRight: theme.spacing(0),
    marginLeft: theme.spacing(0),
  },
  dashButton: {
    // marginRight: theme.spacing(2),
    marginLeft: theme.spacing(2),
  },
  statButton: {
    //marginRight: theme.spacing(2),
    marginLeft: theme.spacing(2),
  },
  teamButton: {
    marginRight: theme.spacing(0),
    marginLeft: theme.spacing(0),
  },
  new: {
    fontSize: theme.typography.pxToRem(20),
    fontWeight: theme.typography.fontWeightBold,
  },
  title: {
    flexGrow: 1,
  },
  avatar: {
    margin: theme.spacing(0),
    // backgroundColor: theme.palette.secondary.main,
    // width: theme.spacing(10),
    // height: theme.spacing(10),
  
  },

}));

export function setTab(num) {
  //myTabPosition = num;
  //console.log(`Menu pos ${num}`);
  localStorage.setItem("menuValue", num);
  cdRefresh();
}

export function CricDreamTabs() {
  const classes = useStyles();
  // for menu 
  const [auth, setAuth] = React.useState(true);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  // for group menu
  const [grpAuth, setGrpAuth] = React.useState(true);
  const [grpAnchorEl, setGrpAnchorEl] = React.useState(null);
  const grpOpen = Boolean(grpAnchorEl);
  const [arunGroup, setArunGroup] = React.useState(false);
  const [value, setValue] = React.useState(parseInt(localStorage.getItem("menuValue")));
  const [upgrade, setUpgrade] = React.useState(false);
  const [modalIsOpen,setIsOpen] = React.useState(true);
  const [userGroup, setUserGroup] = React.useState([]);

  useEffect(() => {       
    const testUpgrade = async () => {
      //console.log("about to call upgrade");
    }
    testUpgrade();
}, []);


  //console.log(`in Tab function  ${localStorage.getItem("menuValue")}`);

  const handleChange = (event) => {
    setAuth(event.target.checked);
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  function handleGrpMenu(event) {
    setGrpAnchorEl(event.currentTarget);
    // console.log(event.currentTarget);
    var myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/group/memberof/${localStorage.getItem("uid")}`;
    axios.get(myUrl).then((response) => {
      let allGroups = response.data[0].groups;
      if (allGroups.length > 0) {
        let tmp = allGroups.find(x => x.defaultGroup == true);
        if (!tmp) {
          tmp = allGroups[0];
          tmp.defaultGroup = true;
          localStorage.setItem("gid", tmp.gid.toString());
          localStorage.setItem("groupName", tmp.groupName);
          localStorage.setItem("tournament", tmp.tournament);
          localStorage.setItem("admin", tmp.admin);
          clearBackupData();
        }
      }
      setUserGroup(allGroups);
      // console.log('Everything is awesome.');
      setArunGroup(true);
    }).catch((error) => {
      console.log('Not good man :(');
      console.log(error);
      setUserGroup([]);
      setArunGroup(true);
    })
  };

  function handleGroupSelect(index) {
    setArunGroup(false);
    let gRec = userGroup[index];
    localStorage.setItem("gid", gRec.gid);
    localStorage.setItem("groupName", gRec.groupName);
    localStorage.setItem("tournament", gRec.tournament);
    localStorage.setItem("admin", gRec.admin);
  }
  
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleGrpClose = () => {
    setGrpAnchorEl(null);
    setArunGroup(false);
  };

  function setMenuValue(num) {
    setValue(num);
    handleClose();
    localStorage.setItem("menuValue", num);
  }




  function handleUpgrade() {
    //console.log("upgrade requested");
    closeModal();
  }

  function openModal() { setIsOpen(true); }
 
  function afterOpenModal() {
    // references are now sync'd and can be accessed.
    //subtitle.style.color = '#f00';
  }
 
  function closeModal(){ setIsOpen(false); }

 
    
  let mylogo = `${process.env.PUBLIC_URL}/APLLOGO1.ICO`;
  return (
    <div className={classes.root}>
      {/* <FormGroup>
        <FormControlLabel
          control={<Switch checked={auth} onChange={handleChange} aria-label="login switch" />}
          label={auth ? 'Logout' : 'Login'}
        />
      </FormGroup> */}
      <AppBar position="static">
        <Toolbar>
          {/* <Avatar variant="square" className={classes.avatar}  src={mylogo}/> */}
       </Toolbar>
      </AppBar>
    </div>
  );
}