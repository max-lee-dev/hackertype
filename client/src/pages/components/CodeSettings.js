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
        
      } from '@chakra-ui/react'
import {
        Search2Icon,
        EditIcon,
        CheckIcon
} from '@chakra-ui/icons'
export default function CodeSettings({
        id, language, isOpen, onOpen, onClose, wordLimit, handleWordLimit, Restart, solutionRange, setId
}) {

        
  return (
        
        <div>
                
                <Center>
                        <Stack isInline>
                                <IconButton icon={<Search2Icon/>} varaint='outline' colorScheme='cyan' onClick={onOpen}>Open</IconButton>
                                <Modal isOpen={isOpen} onClose={onClose}>
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
                                                                placeholder={`Selecting from ${solutionRange} ${language} solutions`} 
                                                                type='text'
                                                                onChange={(e) => handleWordLimit(e.target.value)}
                                                        />
                                                        
                                                        <FormHelperText>
                                                        Enter a word limit for solutions
                                                        </FormHelperText>
                                                        
                                        </FormControl>
                                        {solutionRange}
                                </ModalBody>
                
                                <ModalFooter>
                                        <Button justifyContent='center' width='500px' type="submit" form="new-note" onClick={onClose}>
                                                <CheckIcon/>
                                        </Button>
                                </ModalFooter>
                                </ModalContent>
                                </Modal>
                                        
                                       
                                        
                                        
                                <Divider orientation='vertical' size='xl' borderColor={'chakra-placeholder-color'}/>
                                        <div className = 'languageSettings'>
                                        <Button onClick={() => Restart('C++', wordLimit)}>C++ {solutionRange}</Button>
                                        <Button onClick={() => Restart('Java', wordLimit)}>Java</Button>
                                        <Button onClick={() => Restart('Python', wordLimit)}>Python</Button>
                                        </div>
                                <Divider orientation='vertical' size='xl' variant="thick" colorScheme='red'/>
                                        <div className = 'maxWordsDiv'>
                                        <Input
                                        className = 'searchForm' 
                                        placeholder={'#'}
                                        onChange={(e) => setId(e.target.value)}
                                        type='text'
                                        />
                                        <button onClick={() => Restart(language, wordLimit, undefined, id)}>Python</button>

                                        <p className='reminder'>Search for a specific solution</p>
                                        </div>
                        </Stack>
                </Center>
        </div>
  )
}
