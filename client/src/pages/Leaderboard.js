import React from 'react'

export default function Leaderboard({submissions, loading}) {

  

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
            {submissions.map(submission => (
              <div key={submission.id}>
                <br/>
                <h1>{submission.user}</h1>
                <h1>{submission.solution_id}</h1>
                <h1>WPM: {submission.wpm}</h1>
                
                
              </div>
            ))}
          </div>
        </div>
    </div>
  )
}
