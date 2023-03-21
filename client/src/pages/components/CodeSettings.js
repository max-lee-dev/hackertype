import React from 'react'
import {auth} from './firebase'
import {
        Center,
        Input,
        Divider,
        Modal,
        ModalOverlay,
        ModalContent,
        ModalHeader,
        ModalCloseButton,
        ModalBody,
        FormControl,
        FormLabel,
        FormHelperText,
        ModalFooter,
        Button,
        Stack

        
      } from '@chakra-ui/react'



import {
        Search2Icon,
        EditIcon,
        CheckIcon,
} from '@chakra-ui/icons'
export default function CodeSettings({
        startCounting, id, language, isSearchOpen, onSearchOpen, onSearchClose, isWordsOpen, onWordsOpen, onWordsClose, wordLimit, handleWordLimit, Restart, cppRange, javaRange, pythonRange, setId
}) {
        
        const initialRef = React.useRef(null)
        const finalRef = React.useRef(null)
        const displayLimit = wordLimit === 50000 ? 'Word Limit' : wordLimit
        const displayId = id === '' ? 'No ID' : id
        function test(e) {
                console.log({e, id})
                setId(e.target.value)
          }
  return (
        
        <div>
                
                {!startCounting && <Center width='700px' height='100px'>
                        <Stack isInline>
                                <Stack>
                                        <Button minWidth={'125px'} className = 'wordLimitButton' size='xl' leftIcon={<EditIcon/>} variant='outline'  colorScheme='whiteAlpha' onClick={onWordsOpen}>{displayLimit}</Button>
                                        <Modal initialFocusRef={initialRef} finalFocusRef={finalRef} isOpen={isWordsOpen} onClose={onWordsClose}>
                                        <ModalOverlay />
                                        <ModalContent>
                                        <ModalHeader>
                                                <ModalCloseButton />
                                        </ModalHeader>

                                        <ModalBody>
                                        
                                        <FormControl>
                                                        <FormLabel>Word Limit</FormLabel>
                                                        <Input
                                                                ref={initialRef}
                                                                className = 'maxWordsForm' 
                                                                placeholder={`Enter a word limit (e.g. 40)`} 
                                                                type='text'
                                                                onChange={(e) => handleWordLimit(e.target.value)}
                                                        />
                                                        
                                                        <FormHelperText>
                                                        
                                                        </FormHelperText>
                                                        
                                        </FormControl>
                                                
                                        </ModalBody>
                        
                                        <ModalFooter>
                                                <Button 
                                                width='500px' 
                                                backgroundColor='#bdf2c9' 
                                                type="submit" 
                                                onClick={() => closeLimitModal()}>
                                                        <CheckIcon/>
                                                </Button>
                                        </ModalFooter>
                                        </ModalContent>
                                
                                        </Modal>
                                </Stack>
                                
                                
                                        
                                       
                                        
                                        
                                <Divider orientation='vertical' size='xl' width='50px' borderRadius='full' borderColor={'white'}/>
                                
                                        <div className = 'languageSettings'>
                                        <Button _hover={{bg: '#a0a0a0'  }} backgroundColor={language === 'C++' ? '' : '#404040'} onClick={() => Restart('C++', wordLimit)}>C++ {cppRange}</Button>
                                        <Button _hover={{bg: '#a0a0a0'  }} backgroundColor={language === 'Java' ? '' : '#404040'} onClick={() => Restart('Java', wordLimit)}>Java {javaRange}</Button>
                                        <Button _hover={{bg: '#a0a0a0'  }} backgroundColor={language === 'Python' ? '' : '#404040'} onClick={() => Restart('Python', wordLimit)}>Python {pythonRange}</Button>
                                        </div>
                                <Divider orientation='vertical' size='xl' width='50px'/>

                                
                                <Stack>
                                        <Button 
                                        className = 'wordSearchButton' 
                                        size='xl' 
                                        minWidth={'125px'}
                                        leftIcon={<Search2Icon/>} 
                                        variant='outline'  
                                        colorScheme='whiteAlpha' 
                                        onClick={onSearchOpen}
                                        > {displayId} </Button>
                                        <Modal initialFocusRef={initialRef} finalFocusRef={finalRef} isOpen={isSearchOpen} onClose={onSearchClose}>
                                        <ModalOverlay />
                                        <ModalContent>
                                        <ModalHeader>
                                                <ModalCloseButton />
                                        </ModalHeader>

                                        <ModalBody>
                                        
                                        <FormControl>
                                                        <FormLabel>Solution Search</FormLabel>
                                                        <Input
                                                                ref={initialRef}
                                                                className = 'maxWordsForm' 
                                                                placeholder={`Enter an ID (e.g. 455)`} 
                                                                type='text'
                                                                onChange={(e) => test(e)}
                                                        />
                                                        
                                                        <FormHelperText>
                                                        
                                                        </FormHelperText>
                                                        
                                        </FormControl>
                                                
                                        </ModalBody>
                        
                                        <ModalFooter>
                                                <Button id='search-close' width='500px' backgroundColor='#bdf2c9' type="submit" onClick={() => closeSearchModal()}>
                                                        <CheckIcon/>
                                                </Button>
                                        </ModalFooter>
                                        </ModalContent>
                                
                                        </Modal>
                                </Stack>
                        </Stack>
                </Center>
                }
        </div>
        

      
  )

  
  function closeLimitModal() {
        onWordsClose()
        console.log("id: " + id)
        Restart(language === '' ? 'Java' : language, wordLimit, id === '' ? undefined : id)
        }

function closeSearchModal() {
        onSearchClose()
        Restart(language === '' ? 'Java' : language, wordLimit, id === '' ? id : undefined)
}

        
}
