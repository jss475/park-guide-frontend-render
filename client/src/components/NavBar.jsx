import React from 'react';
import {Link as ReactLink, useHistory} from 'react-router-dom';
import {
    Drawer,
    DrawerBody,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    Button,
    Link,
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon,
    Box,
    Flex,
    Image
  } from '@chakra-ui/react'
import { useDisclosure } from '@chakra-ui/react'
import {GiHamburgerMenu} from 'react-icons/gi'
import '../navbar.css'
import logo from '../park_guide.gif'
// import {Link as ReachLink} from '@reach/router'

function NavBar({isLoggedIn, handleLSLoggedIn}){
  const { isOpen, onOpen, onClose } = useDisclosure()
  const btnRef = React.useRef()

  //set to push page to different page
  let history = useHistory()
  //handle the button click for the signup event
  function handleSignUpClick(){
    history.push('/signup')
  }

  //handle the sing in button click
  function handleLoginClick(){
    history.push('/login')
  }

  //handle the logout click
  const handleLogOut= async () => {
    await fetch('https://park-guide.onrender.com/logout', {
      method: "DELETE"
    });
    handleLSLoggedIn(false)
    history.push("/about")
  }

  //handle the add a trail button click
  function handleAddTrailClick(){
    history.push('/yosemite/trails/new')
    onClose()
  }

  //handle the add a food button click
  function handleAddFoodClick(){
    history.push('/yosemite/food/new')
    onClose()
  }

    //handle the add a lodging button click
    function handleAddLodgingClick(){
      history.push('/yosemite/lodging/new')
      onClose()
    }

  return (
    <Box >
      <Button className="navbar-text" ref={btnRef} leftIcon={<GiHamburgerMenu />}colorScheme='red' backgroundColor="whiteAlpha.500" onClick={onOpen} variant='outline' position="fixed" top="0" right = "0" m='4'>
        Open
      </Button>
      <Drawer
        isOpen={isOpen}
        placement='right'
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader ml="auto" mr="auto" mb="-30px">
            <Link as={ReactLink} to='/about' onClick={onClose}>
              <Image src={logo} alt="Logo" h="150px"/>
            </Link>
          </DrawerHeader>
          {/* This is where I put in the links */}
          {/* this is when logged in you have the me page show up */}
          <DrawerBody>
            {isLoggedIn ? 
              <Box mb="15px">
                  <Link className="navbar-text" as={ReactLink} to='/me' onClick={onClose}>
                    Me!
                  </Link>
              </Box>
             : null }
            {/* <Box>
              <Link as={ReactLink} to='/about' className="navbar-about" onClick={onClose}>
                About
              </Link>
            </Box> */}
            
            <h1 className="navbar-title">National Parks</h1>
            <Accordion defaultIndex={[0]} allowMultiple >
              <AccordionItem>
                <h2>
                  <AccordionButton>
                    <Box flex='1' textAlign='left'>
                      <Link className="navbar-text" as={ReactLink} to='/yosemite'>
                        Yosemite
                      </Link>
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={4}>
                  <Link className="navbar-text" as={ReactLink} to='/yosemite/lodging' onClick={onClose}>
                    Lodging
                  </Link>
       
                </AccordionPanel>
                <AccordionPanel pb={4}>
                  <Link className="navbar-text" as={ReactLink} to='/yosemite/food' onClick={onClose}>
                      Food
                  </Link>
                </AccordionPanel>
                <AccordionPanel pb={4}>
                  <Link className="navbar-text" as={ReactLink} to='/yosemite/trails' onClick={onClose}>
                      Trails
                  </Link>
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
          

          
          {/* When logged in you can add stuff */}
          {/* got rid of drawer body encapsulating the Flexs, can always add back in */}
          {isLoggedIn ? 
          
            <Flex flexDirection="column" mt="20px">
              <Button className="navbar-text" onClick={handleAddTrailClick}>Add a Trail!</Button>
              <Button className="navbar-text" onClick={handleAddLodgingClick} mt="10px">Add Lodging!</Button>
              <Button className="navbar-text" onClick = {handleAddFoodClick} mt="10px">Add Food!</Button>
            </Flex>
          :
          null
          }
          </DrawerBody>
          <DrawerFooter>
            {!isLoggedIn ? 
              <>
                  <Button className="navbar-text" colorScheme='blue' mr={3} onClick={()=> {
                    handleLoginClick()
                    onClose()
                  }}>Login</Button>
                  <Button className="navbar-text" colorScheme='blue' mr={3} onClick={()=> {
                    handleSignUpClick()
                    onClose()
                  }}>
                  Sign Up
                  </Button> 
              </> :
                <Button className="navbar-text" variant='outline' mr={3} onClick={()=> {
                  onClose()
                  handleLogOut()
                  }}>
                  Logout
                </Button>
          }
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </Box>
  )
}

export default NavBar