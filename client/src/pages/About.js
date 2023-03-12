import React from 'react'
import {
  Heading,
  Text,
  UnorderdList,
  ListIcon,
  ListItem,
  List,
  
} from '@chakra-ui/react'

import {

} from '@chakra-ui/icons'

export default function About() {
  return <div className='aboutContainer'>
        <Heading size='xl'>About</Heading>
          <Text>HackerType is a simple typing website that practices your coding speed using LeetCode solutions</Text>
        <br/>
        <Heading size='xl'>What's Next </Heading>
          <List>
          <ListItem fontSize={'24px'}> • Profiles </ListItem>
            <List>
            <ListItem> - Personal Bests</ListItem>
            <ListItem> - Speed Percentile </ListItem>
            </List>
            
            <ListItem fontSize={'24px'}> • Leaderboard Page</ListItem>
            <ListItem fontSize={'24px'}> • Solution Set Page</ListItem>
            <ListItem fontSize={'24px'}> • More customization</ListItem>
            <ListItem fontSize={'24px'}> • Report Bad Solutions</ListItem>
            <ListItem fontSize={'24px'}> • Logo Design </ListItem>
        </List>
        <br/>
        <Heading size='xl'>Known Issues </Heading>
          <Text>Some of the solutions may have wrong indentation which is a problem within the webscraped code. Please report these solutions (when implemented) so they can be fixed!</Text>
        <br/>
        <Heading size='xl'>Follow Updates</Heading>
        <a href='https://github.com/max-lee-dev/hackertype'>GitHub</a>


          
        
        

        
  </div>
}
