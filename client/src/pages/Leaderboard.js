import React from 'react'

export default function Leaderboard({submissions}) {

  function displaySubmissions() {
    return (
      <div>
        {submissions.map(submission => (
          <div key={submission.id}>
            <h1>{submission.id}</h1>
            <h1>{submission.language}</h1>
            <h1>{submission.time}</h1>
            <h1>{submission.words}</h1>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className='reminder'>
      <div>
        {submissions.map(submission => (
          <div key={submission.id}>
            <h1>{submission.wpm}</h1>
            <h1>{submission.user}</h1>
            
          </div>
        ))}
      </div>
    </div>
  )
}
