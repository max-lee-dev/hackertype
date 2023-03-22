import React, {useEffect, useState} from 'react'
import {db} from './components/firebase'
import {orderBy, where, query, collection, getDocs} from '@firebase/firestore'

export default function Leaderboard({submissions}) {
  const[loading, setLoading] = useState(true)
  const [top, setTop] = useState([])
  useEffect(() => {
    setLoading(true)
    async function getSubmissions() {
        const tempTopArray = []
        const submissionsCollectionRef = collection(db, "submissions");
        const onlyWR = query(submissionsCollectionRef, where("rank", "==", 1));
        const onlyBest = query(onlyWR, where("isBestSubmission", "==", true));
        const top = query(onlyBest, orderBy("solution_id", "asc"));
        const topQuerySnapshot = await getDocs(top);
        topQuerySnapshot.forEach((doc) => {
          tempTopArray.push(doc.data())
        });
        setTop(tempTopArray)
      }
      getSubmissions().then(() => setLoading(false))
  }, []);
  


  return (
   


    <div className ='aboutContainer'>
      <h1 className='site-title'>Leaderboard</h1>
      <div>
        Just shows data for now :))
    
      </div>
      <br/>
      {loading && <div className = 'site-title'>Loading...</div>}
        <div className='reminder'>
          <div>
            {top.map(submission => (
              
              <div key={submission.id}>
                <br/>
                <h1 className = 'mainFont font500'>{submission.solution_id}</h1>
                <h1>{submission.user} {submission.rank}</h1>
                <h1>Language: {submission.language}</h1>
                <h1>WPM: {submission.wpm}</h1>
                
                
              </div>
              
            ))}
          </div>
        </div>
    </div>
  )
}
