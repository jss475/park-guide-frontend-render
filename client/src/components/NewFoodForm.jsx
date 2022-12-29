import {useState} from 'react'
import {useHistory} from 'react-router-dom'
import {Input, Button, Heading, Select, FormControl, FormLabel, Box, Textarea, Text, FormErrorMessage, FormHelperText} from '@chakra-ui/react'

function NewFoodForm({isLoggedIn}){
    //set error for filling out the new food form
    const [errors, setErrors] = useState([])
    let history = useHistory()

     //set const for all inputs
     const [allInputs, setAllInputs] = useState({pictures: []})

    //prepend website with https:// if not already present
    function addhttp(url) {
        if (!/^(?:f|ht)tps?\:\/\//.test(url)) {
            url = "http://" + url;
        }
        return url;
    }

    const handleNewFoodSubmit = async (e) => {
        e.preventDefault()
        
        let form = new FormData(document.querySelector("#new-food-form"))
        //append website if needed

        let req = await fetch("https://park-guide.onrender.com/foods", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(allInputs)
        })
        if(req.ok){
            setErrors(['Thanks for successfully submitting!'])
            let res = req.json()
            console.log(res)
            history.push('/yosemite/food')
        }else{
            let res = await req.json()
            let err_array = []

            for(let i in res.errors) {
                let message = `${i}: ${res.errors[i]}`
                err_array.push(message)
            }
            setErrors(err_array)
        }

    }

    let disabled_val
    if(isLoggedIn){
        disabled_val = false
    }else{
        disabled_val = true
    }

    return (
        <Box mt="60px" w="80%" ml="auto" mr="auto" fontFamily="Lato">  
            <Heading fontFamily="Raleway" mb="15px">Please Add a Restaurant/Grocery!</Heading>
            {errors.map(error => <Text color="red">{error}</Text>)}
            <form id="new-food-form" onSubmit={handleNewFoodSubmit}>
                <FormControl isRequired>
                    <FormLabel>Name</FormLabel>
                    <Input backgroundColor="white" borderColor="black" name="name" placeholder="Enter name of the place" onChange={(e)=> setAllInputs({...allInputs, [e.target.name]: e.target.value})}/>
                </FormControl>
                <FormControl isRequired w="300px" mt="10px">
                    <FormLabel>Address</FormLabel>
                    <Input backgroundColor="white" borderColor="black" name="address" placeholder="Enter the address" onChange={(e)=> setAllInputs({...allInputs, [e.target.name]: e.target.value})}/>
                </FormControl>
                <FormControl isRequired w="300px" mt="10px">
                    <FormLabel>Website</FormLabel>
                    <Input backgroundColor="white" borderColor="black" name = "website" placeholder="Enter the website" onChange={(e)=> setAllInputs({...allInputs, [e.target.name]: addhttp(e.target.value)})}/>
                </FormControl>
                <FormControl isRequired w="300px" mt="10px">
                    <FormLabel>Food Type</FormLabel>
                    <Select backgroundColor="white" borderColor="black" name="food_type" placeholder = 'Select the food type' onChange={(e)=> setAllInputs({...allInputs, [e.target.name]: e.target.value})}>
                        <option value="African">African</option>
                        <option value="Asian">Asian</option>
                        <option value="American">American</option>
                        <option value="Bakery">Bakery/Cafe</option>
                        <option value="European">European</option>
                        <option value="Fast Food">Fast Food</option>
                        <option value="Grocery">Grocery</option>
                        <option value="Latin American">Latin American</option>
                        <option value="Mediterranean">Mediterranean</option>
                    </Select>
                </FormControl>
                <FormControl isRequired mt="10px">
                    <FormLabel>Description</FormLabel>
                    <Textarea backgroundColor="white" borderColor="black" name = "description" placeholder="Enter a description" onChange={(e)=> setAllInputs({...allInputs, [e.target.name]: e.target.value})}/>
                    <FormHelperText>Minimum 50 characters</FormHelperText>
                </FormControl>
                <FormControl isRequired w="300px" mt="10px">
                    <FormLabel>Picture</FormLabel>
                    <Input backgroundColor="white" borderColor="black" name = "pictures" placeholder="Enter URL for picture" onChange={(e)=> setAllInputs({...allInputs, [e.target.name]: [e.target.value]})}/>
                </FormControl>
                {/* Disable button when not logged in */}
                <Button colorScheme="blue" mb="50px" disabled={disabled_val} type="submit" mt="15px" >Submit</Button>
            </form>
    </Box>
    )

}

export default NewFoodForm