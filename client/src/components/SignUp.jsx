import React, {useState} from 'react'
import {useHistory} from 'react-router-dom'
import { Input, Button, FormControl, FormLabel, FormHelperText, Box, Text, Heading} from '@chakra-ui/react'


function SignUp({handleLSLoggedIn}){

    //set an error for when the user tries to sign up
    const [errors, setErrors] = useState([])
    let history = useHistory()
    
    //handle the signup and sending a post request to the server
    const handleSignUp = async (e) => {
        e.preventDefault()

        let form = new FormData(document.querySelector("#signup-form"))

        let req = await fetch("https://park-guide.onrender.com/signup", {
            method: "POST",
            body: form
        })
  
        if(req.ok){
            let data = await req.json()
            handleLSLoggedIn(true,data.id)
            history.push("/about")
        }else {
            let res = await req.json()
            let err_array = []

            for (let i in res.errors) {
                let message = `${i}: ${res.errors[i]}`;
                err_array.push(message);
            }
            setErrors(err_array)
        }
    }
    return(
        <Box mt="80px" w="50%" ml="auto" mr="auto">  
            <Heading textAlign="center">Sign Up</Heading>
            {errors.map(error => <Text color="red">{error}</Text>)}
            <form id="signup-form" onSubmit={handleSignUp}>
                <FormControl isRequired>
                    <FormLabel>Name</FormLabel>
                    <Input backgroundColor="white" borderColor="black" name="name" placeholder="Enter Your Name"/>
                </FormControl>
                <FormControl isRequired>
                    <FormLabel htmlFor="email">Email</FormLabel>
                    <Input backgroundColor="white" borderColor="black" name="email" placeholder="Enter your Email"/>
                </FormControl>
                <FormControl isRequired>
                    <FormLabel>Password</FormLabel>
                    <Input backgroundColor="white" borderColor="black" name = "password" type="password" placeholder="Enter your Password"/>

                </FormControl>
                <FormControl isRequired>
                    <FormLabel>Password Confirmation</FormLabel>
                    <Input backgroundColor="white" borderColor="black" name = "password_confirmation" type="password" placeholder="Confirm your Password"/>
                    <FormHelperText>Must be minimum 8 characters</FormHelperText>
                    <FormHelperText>Must contain at least 1 uppercase</FormHelperText>
                    <FormHelperText>Must contain at least 1 lowercase</FormHelperText>
                    <FormHelperText>Must contain a special character</FormHelperText>
                    <FormHelperText>Must contain at least 1 number</FormHelperText>
                </FormControl>
                <Button colorScheme="blue" mt="15px" type="submit">Submit</Button>
            </form>
        </Box>
    )
}

export default SignUp