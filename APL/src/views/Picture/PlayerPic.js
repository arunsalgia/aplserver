import React, { useEffect, useState, useContext } from 'react';
import axios from "axios";
import { useParams } from 'react-router-dom';
// import { makeStyles } from '@material-ui/core/styles';
// import { getImageName } from "views/functions.js"
// import {red, blue } from '@material-ui/core/colors';



export default function SU_PlayerPicture() {
  const [{srcBlob, srcDataUri }, setSrc] = useState({srcBlob: null, srcDataUri: null });
  const [picFound, setPicFound] = useState(false);  
   
  const params = useParams();
  // console.log(params);

  useEffect(() => {
    let isUnmounted = false;    

    async function getPicture() {
      try {
        let response =  await axios({method: 'get', responseType: 'arraybuffer',
          url: `${process.env.REACT_APP_AXIOS_BASEPATH}/apl/downloadimage/PlayerImage/${params.playerPid}.JPG`
        });

        if(isUnmounted) {
          setPicFound(false);
          return;
        }            

        const blob = new Blob([response.data])
        const srcBlob = URL.createObjectURL(blob);
        setSrc(state => ({...state, srcBlob}));
        setPicFound(true);
      } catch (e) {    
        console.log("in axios catch", e);
        setPicFound(false);
      }
    }
    getPicture();

    return () => {
      isUnmounted = true;
    }

  }, [])
  
         
  // console.log("Found", picFound);
  if (picFound)
    return (
      <div>
      <img src={srcBlob} alt="image blob"/>
      </div>
    );
  else
    return null;
}



