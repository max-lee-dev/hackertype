import React from 'react'
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
        IconButton,
        Stack,
        Text,
        useDisclosure
        
      } from '@chakra-ui/react'
import {
        Search2Icon,
        EditIcon,
        CheckIcon
} from '@chakra-ui/icons'
export default function CodeSettings({
        id, language, isSearchOpen, onSearchOpen, onSearchClose, isWordsOpen, onWordsOpen, onWordsClose, wordLimit, handleWordLimit, Restart, cppRange, javaRange, pythonRange, setId
}) {
        
        const initialRef = React.useRef(null)
        const finalRef = React.useRef(null)
  return (
        
        <div>
                
                <Center width='700px' border={'8px'} height='100px'>
                        <Stack isInline>
                                <Stack>
                                        <Button className = 'wordLimitButton' size='xl' leftIcon={<EditIcon/>} variant='outline'  colorScheme='whiteAlpha' onClick={onWordsOpen}>{wordLimit}</Button>
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
                                                <Button idjustifyContent='center' width='500px' backgroundColor='#bdf2c9' type="submit" onClick={onWordsClose}>
                                                        <CheckIcon/>
                                                </Button>
                                        </ModalFooter>
                                        </ModalContent>
                                
                                        </Modal>
                                </Stack>
                                
                                
                                        
                                       
                                        
                                        
                                <Divider orientation='vertical' size='xl' width='50px' borderRadius='full' borderColor={'white'}/>
                                
                                        <div className = 'languageSettings'>
                                        <Button  backgroundColor={language === 'C++' ? '#808080' : ''} onClick={() => Restart('C++', wordLimit)}>C++ {cppRange}</Button>
                                        <Button backgroundColor={language === 'Java' ? '#808080' : ''} onClick={() => Restart('Java', wordLimit)}>Java {javaRange}</Button>
                                        <Button backgroundColor={language === 'Python' ? '#808080' : ''} onClick={() => Restart('Python', wordLimit)}>Python {pythonRange}</Button>
                                        </div>
                                <Divider orientation='vertical' size='xl' width='50px'/>\
                                <Stack>
                                        <Button 
                                        className = 'wordLimitButton' 
                                        size='xl' 
                                        leftIcon={<Search2Icon/>} 
                                        variant='outline'  
                                        colorScheme='whiteAlpha' 
                                        onClick={onSearchOpen}
                                        > {id} </Button>
                                        <Modal isOpen={isSearchOpen} onClose={onSearchClose}>
                                        <ModalOverlay />
                                        <ModalContent>
                                        <ModalHeader>
                                                <ModalCloseButton />
                                        </ModalHeader>

                                        <ModalBody>
                                        
                                        <FormControl>
                                                        <FormLabel>Word Limit</FormLabel>
                                                        <Input
                                                                
                                                                className = 'maxWordsForm' 
                                                                placeholder={`Enter a word limit (e.g. 40)`} 
                                                                type='text'
                                                                onChange={(e) => setId(e.target.value)}
                                                        />
                                                        
                                                        <FormHelperText>
                                                        
                                                        </FormHelperText>
                                                        
                                        </FormControl>
                                                
                                        </ModalBody>
                        
                                        <ModalFooter>
                                                <Button idjustifyContent='center' width='500px' backgroundColor='#bdf2c9' type="submit" onClick={onSearchClose}>
                                                        <CheckIcon/>
                                                </Button>
                                        </ModalFooter>
                                        </ModalContent>
                                
                                        </Modal>
                                </Stack>
                        </Stack>
                </Center>
        </div>
  )
}
