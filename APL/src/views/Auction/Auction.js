import React, { useEffect, useState, useContext } from 'react';
import axios from "axios";
import { makeStyles, useTheme } from '@material-ui/core/styles';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import Typography from '@material-ui/core/Typography';
import Table from "components/Table/Table.js";
import Grid from "@material-ui/core/Grid";
import GridItem from "components/Grid/GridItem.js";
import Button from '@material-ui/core/Button';
// import MenuItem from '@material-ui/core/MenuItem';
// import FormControl from '@material-ui/core/FormControl';
// import DoneIcon from '@material-ui/icons/Done';
// import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
// import NavigateNextIcon from '@material-ui/icons/NavigateNext';
//import Container from "@material-ui/core/Container";
// import Select from "@material-ui/core/Select";
// import DialogActions from '@material-ui/core/DialogActions';
// import DialogContent from '@material-ui/core/DialogContent';
// import DialogContentText from '@material-ui/core/DialogContentText';
// import Drawer from '@material-ui/core/Drawer';
// import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
// import ChevronRightIcon from '@material-ui/icons/ChevronRight';
// import IconButton from '@material-ui/core/IconButton';
// import CheckSharpIcon from '@material-ui/icons/CheckSharp';
// import ClearSharpIcon from '@material-ui/icons/ClearSharp';
// import Input from '@material-ui/core/Input';
import Avatar from "@material-ui/core/Avatar"
import Card from "components/Card/Card.js";
import CardAvatar from "components/Card/CardAvatar.js";
import CardBody from "components/Card/CardBody.js";
import { BlankArea, NoGroup, DisplayPageHeader, MessageToUser } from 'CustomComponents/CustomComponents.js';
import { UserContext } from "../../UserContext";
import socketIOClient from "socket.io-client";
import { hasGroup } from 'views/functions';


const drawerWidth = 100;
const useStyles = makeStyles((theme) => ({
    infoButton: {
        backgroundColor: '#FCDC00',
        ":disabled": {
            backgroundColor: '#cddc39',
        }
    },
    margin: {
        margin: theme.spacing(1),
    },
    hdrText:  {
        // right: 0,
        // fontSize: '12px',
        // color: red[700],
        // // position: 'absolute',
        align: 'center',
        marginTop: '0px',
        marginBottom: '0px',
    },
    image: {
        height: "200px"
    },
    bidButton: {
        padding: "4px"
    },
    container: {
        backgroundImage: `url(${process.env.PUBLIC_URL}/0.JPG)`,
        backgroundSize: 'cover'
    }, drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
    },
    drawerHeader: {
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
        justifyContent: 'flex-start',
    },
    sold: {
        color: "green"
    }, 
    cardCategoryWhite: {
        color: "rgba(255,255,255,.62)",
        margin: "0",
        fontSize: "14px",
        marginTop: "0",
        marginBottom: "0"
    },
    cardTitleWhite: {
        color: "#FFFFFF",
        marginTop: "0px",
        minHeight: "auto",
        fontWeight: "300",
        fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
        marginBottom: "0px",
        textDecoration: "none"
    }, 
    large: {
        width: theme.spacing(12),
        height: theme.spacing(12),
    },
    medium: {
        width: theme.spacing(9),
        height: theme.spacing(9),
    },
    playerinfo: {
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(0, 0),
        justifyContent: 'flex-start',
    },
}));


function leavingAuction(myConn) {
    //console.log("Leaving Auction wah wah ");
    myConn.disconnect();
  }
  
  

export default function Auction() {

    window.onbeforeunload = () => setUser(null)

    // const { user, setUser } = useContext(UserContext);
    const classes = useStyles();
    const theme = useTheme();
    const [playerId, setPid] = useState(0);
    const [auctionStatus, setAuctionStatus] = useState("");
    const [playerName, setPlayerName] = useState("");
    const [playerImage, setPlayerImage] = useState("");
    const [team, setTeam] = useState("");
    const [role, setRole] = useState("");
    const [battingStyle, setBattingStyle] = useState("");
    const [bowlingStyle, setBowlingStyle] = useState("");
    const [bidPaused, setBidPaused] = useState(true);
    // const [open, setOpen] = useState(false);

    const [bidAmount, setBidAmount] = useState(0);
    const [bidUser, setBidUser] = useState("");
    const [bidUid, setBidUid] = useState(0);
    // const [bidOverMsg, setBidOverMsg] = useState("");
    // const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
    // const [selectedOwner, setSelectedOwner] = useState(null);
    const [backDropOpen, setBackDropOpen] = useState(false);
    const [playerStatus, setPlayerStatus] = useState("");
    const [AuctionTableData, setAuctionTableData] = useState([]);
    const [myBalanceAmount, setMyBalanceAmount] = useState(0);

    // const handleDrawerClose = () => {
    //     setOpen(false);
    // };
    // const handleModalClose = () => {
    //     setConfirmDialogOpen(false);
    // };
    function DisplayBidOverMsg(msg) {
        setPlayerStatus(msg);
        // setConfirmDialogOpen(false);
        setBackDropOpen(true); 
        setTimeout(() => setBackDropOpen(false), process.env.REACT_APP_MESSAGE_TIME);       
    }

    // console.log(`Dangerous ${playerId}`)
    useEffect(() => {
        // console.log(process.env.PUBLIC_URL);
        var sendMessage = {page: "AUCT", gid: localStorage.getItem("gid"), uid: localStorage.getItem("uid") };
        var sockConn = socketIOClient(process.env.REACT_APP_ENDPOINT);

        const makeconnection = async () => {
          await sockConn.connect();
          sockConn.emit("page", sendMessage);
        }

        function updatePlayerChange(newPlayerDetails, balanceDetails) {
            setBidPaused(false);
            // console.log("Player Changed");
            // console.log(`New: ${newPlayerDetails.pid}  Old: ${playerId} `)
            // first set PID so that display is better
            setPid(newPlayerDetails.pid)
            let tmp = `${process.env.PUBLIC_URL}/${newPlayerDetails.pid}.JPG`
            if (playerImage != tmp) {
                // console.log("Different image")
                setPlayerImage(`${process.env.PUBLIC_URL}/${newPlayerDetails.pid}.JPG`);
            } else {
                // console.log("Same player image")
            }
            setTeam(newPlayerDetails.Team)
            setRole(newPlayerDetails.role)
            setBattingStyle(newPlayerDetails.battingStyle)
            setBowlingStyle(newPlayerDetails.bowlingStyle)
            setPlayerName(newPlayerDetails.fullName)

            let ourBalance = balanceDetails.filter(balance => balance.uid == localStorage.getItem("uid"))
            setMyBalanceAmount(ourBalance[0].balance);
            // for ADMIN, NOW WE WILL SHOW BALANCE of himself/herself. Not of other members
            // let allUserBalance = (localStorage.getItem("admin") === "false") ? ourBalance : balanceDetails;
            let allUserBalance = ourBalance;
            setAuctionTableData(allUserBalance);
            setAuctionStatus("RUNNING");
        }

        makeconnection();    
        sockConn.on("connect", () => {
            sockConn.emit("page", sendMessage);

            sockConn.on("auctionStatus", (newAuctionStatus) => {
                //console.log(`auction status: ${newAuctionStatus}`);
                setAuctionStatus(newAuctionStatus);
            });

            sockConn.on("bidOver", (myrec) => {
                //console.log("bid over reveived");
                // console.log(myrec);
                DisplayBidOverMsg(`${myrec.playerName} successfully purchased by ${myrec.userName}`);
            });
            sockConn.on("newBid", (grec) => {
                // console.log("new bid reveived");
                // console.log(grec);
                setBidAmount(grec.auctionBid);
                setBidUser(grec.currentBidUser);
                setBidUid(grec.currentBidUid);
            });
            sockConn.on("playerChange", async (newPlayerDetails, balanceDetails) => {
                // console.log("Calling updatePlayerChange from socker");
                updatePlayerChange(newPlayerDetails, balanceDetails);
            });
        })

        const a = async () => {
            if (!hasGroup()) return;
            // console.log("Calling get auction status");
            const response = await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/group/getauctionstatus/${localStorage.getItem("gid")}`);
            // console.log(response.data)
            setAuctionStatus(response.data);
            if (response.data === "RUNNING") {
                // get current player details
                //same as when data rcvd in socket msg playerChange
                const response2 = await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/auction/current/${localStorage.getItem("gid")}`)
                // console.log("Calling updatePlayerChange from currentr");
                updatePlayerChange(response2.data.a, response2.data.b);
                // get whi has bidded
                const response1 = await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/auction/getbid/${localStorage.getItem("gid")}`);
                // console.log("GETBID");
                // console.log(response1.data)
                if (response1.status === 200) {
                    setBidAmount(response1.data.auctionBid)
                    setBidUser(response1.data.currentBidUser);
                    setBidUid(response1.data.currentBidUid);            
                }
            }
        }
        a();

        return () => {
            leavingAuction(sockConn);
        }
    }, []);


    // const handleOwnerChange = (event) => {
    //     setSelectedOwner(event.target.value);
    // };


    async function sellPlayer() {
        setBidPaused(true);
        let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/auction/add/${localStorage.getItem("gid")}/${bidUid}/${playerId}/${bidAmount}`
        // console.log(myUrl);
        let response = await fetch(myUrl);
        if (response.status == 200) {
            // console.log("getting balance");
            // const balance = await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/user/balance/${localStorage.getItem("gid")}/all`);
            // setAuctionTableData(balance.data);
        } else {
            var msg;
            switch (response.status) { 
                case 707: msg = "Already Purchased"; break;
                case 706: msg = "User does not belong to this group"; break;
                case 704: msg = "Invalid Player"; break;
                case 708: msg = "Insufficient Balance"; break;
                // case 200: msg = `${playerName} purchsed by ${bidUser} by bid amount ${bidAmount}`; break;
                default:  msg = `unknown error ${response.status}`; break;
            }
            DisplayBidOverMsg(msg);
        }
    }

    async function handleAuctionOver() {
        const response = await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/group/setauctionstatus/${localStorage.getItem("gid")}/OVER`);
        if (response.data) {
            setAuctionStatus("OVER");
        }
    }


    async function skipPlayer() {
        setBidPaused(true);
        await fetch(`${process.env.REACT_APP_AXIOS_BASEPATH}/auction/skip/${localStorage.getItem("gid")}/${playerId}`);
    }

    function DisplayRunningAuction() {
        // console.log(`Pid from admin auction ${playerId}`)
        return (<div align="center" className={classes.root}>
            <Grid container justify="center" alignItems="center" >
                <GridItem xs={12} sm={12} md={12} lg={12} >
                    <ShowPlayerAvatar pName={playerName} pImage={playerImage} pTeamLogo={team} /> 
                    <ShowValueButtons />
                    <ShowAdminButtons/>
                </GridItem>
            </Grid>
            <ShowBalance/>
            <ShowAuctionOverButton/>
            <MessageToUser mtuOpen={backDropOpen} mtuClose={setBackDropOpen} mtuMessage={playerStatus} />
            {/* <ShowDialog/> */}
        </div>
        );
    }

    function ShowPlayerAvatar(props) {
        let myTeam = `${process.env.PUBLIC_URL}/${props.pTeamLogo}.JPG`
        myTeam = myTeam.replaceAll(" ", "");
        // console.log(`Team:${myTeam}`);
        return (
            <div key="playerInfo">
                <Card profile>                    
                    <CardAvatar profile>
                        <img src={props.pImage} alt="..." />
                    </CardAvatar>
                    <CardBody profile>
                        {/* <h6 className={classes.cardTitle}>{props.pName}</h6> */}
                        <h6 className={classes.hdrText}>{props.pName}</h6>
                        <Grid container justify="center" alignItems="center">
                            {/* <Avatar variant="square" src={`${process.env.PUBLIC_URL}/${props.pTeamLogo}.JPG`} className={classes.medium} /> */}
                            <Avatar variant="square" src={myTeam} className={classes.medium} />
                        </Grid>
                        <div align="center"><h6 className={classes.hdrText} align="center">
                            {role}<br/>
                            {battingStyle}<br />
                            {bowlingStyle}
                        </h6></div>
                    </CardBody>
                </Card>
            </div>
        );
    }

    function ShowBalance() {
        return (
            <Table tableHeaderColor="warning" align="center"
                tableHead={["Franchise", "Player Count", "Balance"]}
                tableData={AuctionTableData.map(x => {
                    const arr = [x.userName, x.playerCount, x.balance]
                    return { data: arr, collapse: [] }
                })}/>
        );
    }

    async function handleMyBid(newBid) {
        var value = parseInt(newBid) + parseInt(bidAmount);

        let myURL=`${process.env.REACT_APP_AXIOS_BASEPATH}/auction/nextbid/${localStorage.getItem("gid")}/${localStorage.getItem("uid")}/${playerId}/${value}`;
        // console.log(myURL);
        var resp = await axios(myURL);
        // console.log(`Bid for value ${newBid}`)
        // setBidAmount();
    }

    function BidButton(props) {
        let btnMsg, btnDisable, btnSize;
        if (props.value === "AMOUNT") {
            // console.log(bidAmount);
            btnMsg = `Current Bid Amount:  ${bidAmount}`;
            btnDisable = true;
            btnSize = "medium";
        } else if (props.value === "NAME") {
            btnMsg = `Bid by :  ${bidUser}`;
            btnDisable = true;
            btnSize = "medium";
        } else {
            btnMsg = "+"+props.value;
            let newValue = parseInt(bidAmount) + parseInt(props.value);
            btnDisable = (newValue > parseInt(myBalanceAmount));
            btnSize = "small";
        }
        if (btnDisable) {
            return (
            <Button variant="contained"  size={btnSize}
            className={classes.infoButton}
            disabled>
            {btnMsg}
            </Button>
            );
        } else {
            return (
            <Button variant="contained"  size={btnSize}
            className={classes.infoButton}
            onClick={() => { handleMyBid(props.value); }}>
            {btnMsg}
            </Button>
            );
        }
    }

    function ShowValueButtons() {
        if (auctionStatus === "RUNNING")
            return (
            <div>
                <div align="center">
                    <BidButton value="AMOUNT"/>
                </div>
                <div align="center">
                    <BidButton value="NAME"/>
                </div>
                <Grid className={classes.bidButton} m={1} p={1} container justify="center" alignItems="center" />
                <Grid className={classes.bidButton} m={1} p={1} container justify="center" alignItems="center" >
                <GridItem xs={3} sm={3} md={3} lg={3} >
                    <BidButton value="5" />
                </GridItem>
                <GridItem xs={3} sm={3} md={3} lg={3} >
                    <BidButton value="10" />
                </GridItem>
                <GridItem xs={3} sm={3} md={3} lg={3} >
                    <BidButton value="15" />
                </GridItem>
                <GridItem xs={3} sm={3} md={3} lg={3} >
                    <BidButton value="20" />
                </GridItem>
                </Grid>
                <Grid className={classes.bidButton} m={1} p={1} container justify="center" alignItems="center" >
                <GridItem xs={3} sm={3} md={3} lg={3} >
                    <BidButton value="25" />
                </GridItem>
                <GridItem xs={3} sm={3} md={3} lg={3} >
                    <BidButton value="50" />
                </GridItem>
                <GridItem xs={3} sm={3} md={3} lg={3} >
                    <BidButton value="75" />
                </GridItem>
                <GridItem xs={3} sm={3} md={3} lg={3} >
                    <BidButton value="100" />
                </GridItem>
                </Grid>
            </div>);
        else
            return(<div></div>);
    }

    function ShowAuctionOverButton() {
        if (localStorage.getItem("admin").toLowerCase() === "true")
            return(
            <div align="center">
                <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    className={classes.button}
                    onClick={handleAuctionOver}>
                    AUCTION OVER
                </Button>
            </div>
            );
        else 
            return(<div></div>);
    }


    function ShowAdminButtons() {
        // console.log("admin buttons")
        // console.log(localStorage.getItem("admin").toLowerCase());
        if (localStorage.getItem("admin").toLowerCase() === "true")
            return(
            <div align="center" key="playerAuctionButton">
            <Grid className={classes.bidButton} m={1} p={1} container justify="center" alignItems="center" />
            <Grid className={classes.bidButton} m={1} p={1} container justify="center" alignItems="center" >
            <GridItem xs={2} sm={2} md={2} lg={2} />
            <GridItem xs={4} sm={4} md={4} lg={4} >
            <Button
                variant="contained"
                color="primary"
                size="small"
                className={classes.button}
                // startIcon={<CheckSharpIcon />}
                disabled={((bidAmount === 0) || (bidPaused === "true"))}
                onClick={sellPlayer}>
                SOLD
            </Button>
            </GridItem>
            <GridItem xs={4} sm={4} md={4} lg={4} >
            <Button
                variant="contained"
                color="primary"
                size="small"
                className={classes.button}
                // startIcon={<ClearSharpIcon />}
                disabled={((bidAmount !== 0) || (bidPaused === "true"))}
                onClick={() => skipPlayer()}>
                UNSOLD
            </Button>
            </GridItem>
            <GridItem xs={2} sm={2} md={2} lg={2} />
            </Grid>
            </div>
            );
        else 
            return(<div></div>);
    }

    // function OrgShowDialog() {
    //     return (
    //     <Dialog aria-labelledby="simple-dialog-title" open={backDropOpen}
    //         onClose={() => setBackDropOpen(false)} >
    //         <DialogTitle id="simple-dialog-title" className={classes.sold}>{playerStatus}</DialogTitle>
    //     </Dialog>
    //     );
    // }

    // function ShowDialog() {
    //     return (<MessageToUser mtuOpen={backDropOpen} mtuClose={setBackDropOpen} mtuMessage={playerStatus} />);
    // }

    // function SelctNewOwner() {
    //     return (
    //     <Select labelId="demo-simple-select-label" id="demo-simple-select"
    //         value={selectedOwner}
    //         displayEmpty
    //         onChange={handleOwnerChange}>
    //         {AuctionTableData.map(item => <MenuItem key={item.uid} value={item.uid}>{item.userName}</MenuItem>)}
    //     </Select>
    //     );
    // }

    // function ShowGroupName() {
    //     return(
    //         <div>
    //             <h3 align="center">Auction ({localStorage.getItem("groupName")})</h3>
    //             <br/>
    //         </div>
    //     );
    // }

    // function UserAuction() {
    //     return (
    //     <Grid container justify="center" alignItems="center" >
    //     <ShowGroupName/>
    //     <GridItem xs={12} sm={12} md={4} >
    //         <ShowPlayerAvatar pName={playerName} pImage={playerImage} pTeamLogo={team} /> 
    //         <ShowBalance/>
    //     </GridItem>
    //     </Grid>
    //     );
    // }

    const startAuction = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/group/setauctionstatus/${localStorage.getItem("gid")}/RUNNING`);
            setAuctionStatus("RUNNING");
        } catch (err) {
            // should show the display
            // console.log("cannot start auction");
            // console.log(err.response.status);
            DisplayBidOverMsg("Insufficient members in Group.")
        }
    }

    function DisplayPendingButton() {
        /* if current starting pending.
        */ 
        if (localStorage.getItem("admin") === "true")
            return ( 
                <Button variant="contained"
                color="primary"
                size="small"
                className={classes.button}
                // disabled={localStorage.getItem("admin") !== "true"}            
                // startIcon={<NavigateBeforeIcon />}
                onClick={() => startAuction("PENDING")}>Start Auction
                </Button>
            );
        else
            return <div></div>;
    }

    function DisplayPendingOver(props) {
        // console.log(props);
        return (<Typography align="center">{props.message}</Typography>);
    }

    function DisplayAuctionInformation() {
        if (hasGroup()) {
            // console.log(auctionStatus);
            if ( auctionStatus === "PENDING") {
                return (
                    <div align="center">
                        <DisplayPendingOver message="Auction has not yet started"/>
                        <DisplayPendingButton/>
                        <MessageToUser mtuOpen={backDropOpen} mtuClose={setBackDropOpen} mtuMessage={playerStatus} />
                    </div>);
            } else if (auctionStatus === "OVER") {
                return (
                    <div align="center">
                        <DisplayPendingOver message="Auction is Over"/>
                    </div>);
            } else if (auctionStatus === "RUNNING") {
                return (
                    <div align="center">
                        <DisplayRunningAuction />
                    </div>
                    ); 
            } else {
                return (<BlankArea/>);
        } 
        } else
            return <NoGroup/>;
    }

    return (
        <div align="center">
            <DisplayPageHeader headerName="AUCTION" groupName={localStorage.getItem("groupName")} tournament={localStorage.getItem("tournament")}/>
            <BlankArea/>
            <DisplayAuctionInformation/>
        </div>
    );

 
}