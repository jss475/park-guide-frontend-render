import {useState} from 'react'
import {useHistory} from 'react-router-dom'
import {Input, InputGroup, Icon, InputRightAddon, Button, Select, FormControl, Heading, FormLabel, Box, Text, Flex, FormHelperText} from '@chakra-ui/react'
import {GiHamburger} from 'react-icons/gi'

function NewTrailForm({isLoggedIn}){
    //set error for filling out the new trail form
    const [errors, setErrors] = useState([])
    let history = useHistory()


    //set const for all inputs
    const [allInputs, setAllInputs] = useState({pictures: []})

    //prepend website with https:// if not already present
    // function addhttp(url) {
    //     if (!/^(?:f|ht)tps?\:\/\//.test(url)) {
    //         url = "http://" + url;
    //     }
    //     return url;
    // }


    const handleNewTrailSubmit = async (e) => {
        e.preventDefault()
        // let form = new FormData(document.querySelector("#new-trail-form"))
    
        let req = await fetch("/trails", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(allInputs)
        })
        if(req.ok){
            setErrors(['Thanks for successfully submitting the new trail!'])
            let res = req.json()
            history.push('/yosemite/trails')
            console.log(res)
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

    const [inputHr, setInputHr] = useState("0")
    const [inputMin, setInputMin] = useState("0")
    function handleTimeInput(e){
        if(e.target.name === "hr"){
            setInputHr(e.target.value)
            setAllInputs({...allInputs,"estimated_time": `${e.target.value} h ${inputMin} min`})
        }else if(e.target.name === "min"){
            setInputMin(e.target.value)
            setAllInputs({...allInputs,"estimated_time": `${inputHr} h ${e.target.value} min`})
        }
    }

    let disabled_val
    if(isLoggedIn){
        disabled_val = false
    }else{
        disabled_val = true
    }

    console.log(allInputs)
    return (
        <Box mt="60px" w="80%" ml="auto" mr="auto" fontFamily="Lato"> 
            <Heading mb="15px" fontFamily="Raleway">Please Add a Trail!</Heading>
            {errors.map(error => <Text color="red">{error}</Text>)}
            <form id="new-trail-form" onSubmit={handleNewTrailSubmit}>
                <FormControl isRequired>
                    <FormLabel>Name</FormLabel>
                    <Input backgroundColor="white" name="name" placeholder="Enter Name of the Trail" onChange={(e)=> setAllInputs({...allInputs, [e.target.name]: e.target.value})}/>
                </FormControl>
                <FormControl isRequired w="300px" mt="10px">
                    <FormLabel>Mileage</FormLabel>
                    <Input backgroundColor="white" name="mileage" placeholder="Enter the length of the trail (mi)" onChange={(e)=> setAllInputs({...allInputs, [e.target.name]: e.target.value})}/>
                </FormControl>
                <Flex flexWrap="inline">       
                    <FormControl isRequired w="300px" mt="10px">
                        <FormLabel>Starting Elevation</FormLabel>
                        <InputGroup>
                            <Input backgroundColor="white" name = "starting_elevation" placeholder="Enter the starting elevation" onChange={(e)=> setAllInputs({...allInputs, [e.target.name]: e.target.value})}/>
                            <InputRightAddon children="ft"></InputRightAddon>
                        </InputGroup>
                    </FormControl>
                    <FormControl isRequired w="300px" mt="10px" ml="25px">
                        <FormLabel>Elevation Gain</FormLabel>
                        <InputGroup>
                            <Input backgroundColor="white" name = "elevation_gain" placeholder="Enter the elevation gain" onChange={(e)=> setAllInputs({...allInputs, [e.target.name]: e.target.value})}/>
                            <InputRightAddon children="ft"></InputRightAddon>
                        </InputGroup>
                    </FormControl>
                </Flex>
                <Flex flexWrap="inline">
                    <FormControl isRequired w="300px" mt="10px">
                        <FormLabel>Starting Latitude</FormLabel>
                        <Input backgroundColor="white" name = "starting_lat" placeholder="Enter the starting latitude" onChange={(e)=> setAllInputs({...allInputs, [e.target.name]: e.target.value})}/>
                    </FormControl>
                    <FormControl isRequired w="300px" mt="10px" ml="25px">
                        <FormLabel>Starting Longitude</FormLabel>
                        <Input backgroundColor="white" name = "starting_long" placeholder="Enter the starting longitude" onChange={(e)=> setAllInputs({...allInputs, [e.target.name]: e.target.value})}/>
                    </FormControl>
                </Flex>
                <Flex flexWrap="inline">               
                    <FormControl isRequired w="300px" mt="10px"> 
                        <FormLabel>Route Type</FormLabel>
                        <Select backgroundColor="white" name="route_type" placeholder = 'Select the route type' onChange={(e)=> setAllInputs({...allInputs, [e.target.name]: e.target.value})}>
                            <option value="Out & Back">Out & Back</option>
                            <option value="Loop">Loop</option>
                        </Select>
                    </FormControl>
                    <FormControl isRequired w="300px" ml="25px" mt="10px">
                        <FormLabel>Difficulty</FormLabel>
                        <Select backgroundColor="white" name="difficulty" placeholder = 'Select the difficulty' onChange={(e)=> setAllInputs({...allInputs, [e.target.name]: e.target.value})}>
                            <option value="Extremely Hard">Extremely Hard</option>
                            <option value="Hard">Hard</option>
                            <option value="Medium">Medium</option>
                            <option value="Easy">Easy</option>
                        </Select>
                    </FormControl>
                    <FormControl isRequired w="300px" ml="25px" mt="10px">
                        <FormLabel>Estimated Time</FormLabel>
                        <InputGroup name="estimated_time" onChange={(e)=> {
                            handleTimeInput(e) 
                        }}>
                            <Input backgroundColor="white" name="hr" placeholder="hr"></Input>
                            <InputRightAddon children=" hr"></InputRightAddon>
                            <Input backgroundColor="white" name = "min" placeholder="min"></Input>
                            <InputRightAddon > min</InputRightAddon>
                            {/* <Input name = "estimated_time" placeholder="Enter the estimated time" onChange={(e)=> setAllInputs({...allInputs, [e.target.name]: e.target.value})}/> */}
                        </InputGroup>
                        
                    </FormControl>
                </Flex>
                <Flex flexWrap="inline">                
                    <FormControl isRequired w="300px" mt="10px">
                        <FormLabel>Recommended Water</FormLabel>
                        <Select backgroundColor="white" name="water" placeholder = 'Select the water needed (L)' onChange={(e)=> setAllInputs({...allInputs, [e.target.name]: e.target.value})}>
                            <option value="1">1L</option>
                            <option value="2">2L</option>
                            <option value="3">3L</option>
                            <option value="4">4L</option>
                        </Select>
                    </FormControl>
                    <FormControl isRequired w="300px" ml="25px" mt="10px">
                        <FormLabel>Recommended Food</FormLabel>
                        <Select backgroundColor="white" name="food" placeholder = 'Select the food needed' onChange={(e)=> setAllInputs({...allInputs, [e.target.name]: e.target.value})}>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                        </Select>
                        <FormHelperText><Icon as={GiHamburger}/> = Light Snack</FormHelperText>
                        <FormHelperText><Icon as={GiHamburger}/><Icon as={GiHamburger}/> = Lunch</FormHelperText>
                        <FormHelperText><Icon as={GiHamburger}/><Icon as={GiHamburger}/><Icon as={GiHamburger}/> = Lunch + Snack</FormHelperText>
                        <FormHelperText><Icon as={GiHamburger}/><Icon as={GiHamburger}/><Icon as={GiHamburger}/><Icon as={GiHamburger}/> = Multiple Lunches + Snacks</FormHelperText>
                    </FormControl>
                </Flex>
                <FormControl isRequired mt="10px">
                    <FormLabel>Pictures</FormLabel>
                    <Input backgroundColor="white" name = "pictures" placeholder="Enter the pictures" onChange={(e)=> setAllInputs({...allInputs, [e.target.name]: [e.target.value]})}/>
                </FormControl>
                {/* Disable button when not logged in */}
                <Button colorScheme="blue" disabled={disabled_val} type="submit" mt="15px" mb="50px">Submit</Button>
            </form>
    </Box>
    )

}

export default NewTrailForm