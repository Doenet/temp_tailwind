import React, { useEffect, useState, useRef } from 'react';
import { useRecoilValue, useRecoilCallback } from 'recoil';
import { searchParamAtomFamily } from '../NewToolRoot';
// import { loadAssignmentSelector } from '../../../_reactComponents/Drive/NewDrive';
import axios from 'axios';
import { creditAchievedAtom, currentAttemptNumber } from '../ToolPanels/AssignmentViewer';


export default function CreditAchieved(){
  const recoilAttemptNumber = useRecoilValue(currentAttemptNumber);
  const recoilDoenetId = useRecoilValue(searchParamAtomFamily('doenetId'));
  const recoilUserId = useRecoilValue(searchParamAtomFamily('userId'));
  const recoilTool = useRecoilValue(searchParamAtomFamily('tool'));

  const lastAttemptNumber = useRef(null)
  let [disabled,setDisabled] = useState(false);

  const {creditByItem,creditForAttempt,creditForAssignment,totalPointsOrPercent} = useRecoilValue(creditAchievedAtom);
  let [stage,setStage] = useState('Initialize');
  let creditByItemsJSX = creditByItem.map((x,i)=>{
    return <div key={`creditByItem${i}`}>Credit For Item {i+1}: {x?Math.round(x*1000)/1000:0}</div> 
  })

  const initialize = useRecoilCallback(({set})=> async (attemptNumber,doenetId,userId,tool)=>{

  
   const { data }  = await axios.get(`api/loadAssessmentCreditAchieved.php`,{params:{attemptNumber,doenetId,userId,tool}});

  const { 
    creditByItem, 
    creditForAssignment, 
    creditForAttempt,
    showCorrectness,
    totalPointsOrPercent
 } = data;

    if (Number(showCorrectness) === 0 && tool.substring(0,9) !== 'gradebook'){
      setDisabled(true);
    }else{
      set(creditAchievedAtom,(was)=>{
        let newObj = {...was};
        newObj.creditByItem = creditByItem;
        newObj.creditForAssignment = creditForAssignment;
        newObj.creditForAttempt = creditForAttempt;
        newObj.totalPointsOrPercent = totalPointsOrPercent;
        return newObj;
      })
    }
    
    lastAttemptNumber.current = attemptNumber;
    setStage('Ready');

  },[])

  // console.log(`>>>>stage -${stage}-`);
  if (!recoilAttemptNumber || !recoilDoenetId || !recoilTool){
    return null;
  }
  // if (stage === 'Initialize'){
  //   initialize(recoilAttemptNumber,recoilDoenetId);
  //   return null;
  // }

  if (lastAttemptNumber.current !== recoilAttemptNumber){
    initialize(recoilAttemptNumber,recoilDoenetId,recoilUserId,recoilTool);
    return null;
  }
  if (disabled){
    return <div style={{fontSize:"20px",textAlign:"center"}}>Not Shown</div>
  }


  let score = 0;
  if (creditForAssignment){
    score = Math.round(creditForAssignment* totalPointsOrPercent*100)/100 ;
  }

 return <div>
   <div>Possible Points: {totalPointsOrPercent}</div>
   <div>Score: {score}</div>
   <div>Credit For Assignment: {creditForAssignment?Math.round(creditForAssignment*1000)/1000:0}</div>
   <div>Credit For Attempt {recoilAttemptNumber}: {creditForAttempt?Math.round(creditForAttempt*1000)/1000:0}</div>
   <div>{creditByItemsJSX}</div>
 </div>
}