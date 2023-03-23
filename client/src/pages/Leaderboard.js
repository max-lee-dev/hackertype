import React, {useEffect, useState} from 'react'
import {db} from './components/firebase'
import {orderBy, where, query, collection, getDocs} from '@firebase/firestore'
import {
  Center,
  Stack,
  Text
} from '@chakra-ui/react'
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
   

    <Center>
    <div className ='profileContianer'>
      <Center>
        <Stack dir='column'>
        <Text className='site-title whiteText mainFont'>Leaderboard</Text>
        <div className = 'whiteText mainFont'>
          Just shows data for now :))
      
        </div>
        </Stack>
      </Center>
      <br/>
      {loading && <div className = 'site-title'>Loading...</div>}
        <Center>
          <div>
          <Center>
            <Stack dir='column'>
            {top.map(submission => (
              <div className = 'leaderboardSolutionContainer'>
                <div className = 'whiteText'>
                
                  <div key={submission.id}>
                  <Stack dir = 'row'>
                    <Text className = 'mainFont font500'>{submission.solution_id}</Text>
                  
                    </Stack>
                  </div>
                  
                </div>
                
              </div>
              
            ))}
            </Stack>
          </Center>
          </div>
        </Center>
      </div>
      
        </Center>
  )
}
