import {useState} from 'react'
import {useHistory} from 'react-router-dom'
import {Input, Button, Heading, FormControl, FormLabel, Box, Stack, Checkbox, CheckboxGroup, Text, Flex, FormErrorMessage, FormHelperText} from '@chakra-ui/react'

function NewLodgingForm({isLoggedIn}){
    //set error for filling out the new food form
    const [errors, setErrors] = useState([])

    //set const for lodging amenity check
    const [checkedLAmenity, setCheckedLAmenity] = useState([])
    //set const for romm amenity check
    const [checkedRAmenity, setCheckedRAmenity] = useState([])

    //set const for all inputs
    const [allInputs, setAllInputs] = useState({lodging_amenity: []})

    let history = useHistory()

    //prepend website with https:// if not already present
    function addhttp(url) {
        if (!/^(?:f|ht)tps?\:\/\//.test(url)) {
            url = "http://" + url;
        }
        return url;
    }

    function array_maker(string){
        let arr = string.split(",")
        return arr
    }

   
    const handleNewLodgingSubmit = async (e) => {
        e.preventDefault()

        let req = await fetch("https://park-guide.onrender.com/lodgings", {
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
        }else{
            let res = await req.json()
            let err_array = []

            for(let i in res.errors) {
                let message = `${i}: ${res.errors[i]}`
                err_array.push(message)
            }
            setErrors(err_array)
            }
        history.push("/yosemite/lodging")
    }


    //disable and enabel submit button based on login status
    let disabled_val
    if(isLoggedIn){
        disabled_val = false
    }else{
        disabled_val = true
    }

    //handle onChange
    
    function handleLodgingAmenityChange(e){
        if(!checkedLAmenity.includes(e.target.value)){

            setCheckedLAmenity([...checkedLAmenity,e.target.value])
            setAllInputs({...allInputs, "lodging_amenity":[...checkedLAmenity,e.target.value]})
        }else{

            setCheckedLAmenity([...checkedLAmenity].filter(amenity => amenity !== e.target.value))
            setAllInputs({...allInputs, "lodging_amenity":[...checkedLAmenity].filter(amenity => amenity !== e.target.value)})
        }
    }

    function handleRoomAmenityChange(e){
        if(!checkedRAmenity.includes(e.target.value)){

            setCheckedRAmenity([...checkedRAmenity,e.target.value])
            setAllInputs({...allInputs, "room_amenity":[...checkedRAmenity,e.target.value]})
        }else{

            setCheckedRAmenity([...checkedRAmenity].filter(amenity => amenity !== e.target.value))
            setAllInputs({...allInputs, "room_amenity":[...checkedRAmenity].filter(amenity => amenity !== e.target.value)})
        }

    }

    
    return (
        <Box mt="60px" w="80%" ml="auto" mr="auto" fontFamily="Lato">  
            <Heading mb="15px" fontFamily="Raleway">Please Add a Lodging!</Heading>
            {errors.map(error => <Text color="red">{error}</Text>)}
            <form id="new-lodging-form" onSubmit={handleNewLodgingSubmit}>
                <FormControl isRequired>
                    <FormLabel>Name</FormLabel>
                    <Input w="600px" borderColor="black" backgroundColor="white" name="name" placeholder="Enter name of the place" onChange={(e)=> setAllInputs({...allInputs, [e.target.name]: e.target.value})}/>
                </FormControl>
                <FormControl isRequired w="300px" mt="10px">
                    <FormLabel>Address</FormLabel>
                    <Input backgroundColor="white" borderColor="black" name="address" placeholder="Enter the address" onChange={(e)=> setAllInputs({...allInputs, [e.target.name]: e.target.value})}/>
                </FormControl>
                <FormControl isRequired w="300px" mt="10px">
                    <FormLabel>Website</FormLabel>
                    <Input backgroundColor="white" borderColor="black" name = "website" placeholder="Enter the website" onChange={(e)=> setAllInputs({...allInputs, [e.target.name]: e.target.value})}/>
                </FormControl>
                <Flex mt="15px">
                    <FormControl>
                        <FormLabel>Lodging Amenity</FormLabel>
                        <Stack >
                            <CheckboxGroup >
                                <Checkbox borderColor="black" name = "room_service" value="Room Service" onChange={handleLodgingAmenityChange}>Room Service</Checkbox>
                                <Checkbox borderColor="black" name = "dining" value="Dining" onChange={handleLodgingAmenityChange}>Dining</Checkbox>
                                <Checkbox borderColor="black" value="Free Guest Parking" onChange={handleLodgingAmenityChange}>Free Guest Parking</Checkbox>
                                <Checkbox borderColor="black" value="Valet" onChange={handleLodgingAmenityChange}>Valet</Checkbox>
                                <Checkbox borderColor="black" value="Gift Shop" onChange={handleLodgingAmenityChange}>Gift Shop</Checkbox>
                                <Checkbox borderColor="black" value="ADA Accessible" onChange={handleLodgingAmenityChange}>ADA Accessible</Checkbox>
                                <Checkbox borderColor="black" value="Golf Course" onChange={handleLodgingAmenityChange}>Golf Course</Checkbox>
                                <Checkbox borderColor="black" value="Swimming Pool" onChange={handleLodgingAmenityChange}>Swimming Pool</Checkbox>
                                <Checkbox borderColor="black" value="Non Smoking" onChange={handleLodgingAmenityChange}>Non Smoking</Checkbox>
                                <Checkbox borderColor="black" value="Concierge" onChange={handleLodgingAmenityChange}>Concierge</Checkbox>
                                <Checkbox borderColor="black" value="Shuttle Access" onChange={handleLodgingAmenityChange}>Shuttle Access</Checkbox>
                            </CheckboxGroup>
                        </Stack>
                    </FormControl>
                    <FormControl>
                        <FormLabel>Room Amenity</FormLabel>
                        <Stack >
                            <CheckboxGroup >
                                <Checkbox borderColor="black" value="Hair Dryer" onChange={handleRoomAmenityChange}>Hair Dryer</Checkbox>
                                <Checkbox borderColor="black" value="Room Service" onChange={handleRoomAmenityChange}>Room Service</Checkbox>
                                <Checkbox borderColor="black" value="Private Room" onChange={handleRoomAmenityChange}>Private Room</Checkbox>
                                <Checkbox borderColor="black" value="Shared Room" onChange={handleRoomAmenityChange}>Shared Room</Checkbox>
                                <Checkbox borderColor="black" value="Rollaway Crib" onChange={handleRoomAmenityChange}>Rollaway Crib</Checkbox>
                                <Checkbox borderColor="black" value="Non-Smoking" onChange={handleRoomAmenityChange}>Non-Smoking</Checkbox>
                                <Checkbox borderColor="black" value="Iron/Ironing Board" onChange={handleRoomAmenityChange}>Iron/Ironing Board</Checkbox>
                                <Checkbox borderColor="black" value="Flat Screen TV" onChange={handleRoomAmenityChange}>Flat Screen TV</Checkbox>
                                <Checkbox borderColor="black" value="Mini Fridge" onChange={handleRoomAmenityChange}>Mini Fridge</Checkbox>
                                <Checkbox borderColor="black" value="No Pets Allowed" onChange={handleRoomAmenityChange}>No Pets Allowed</Checkbox>
                                <Checkbox borderColor="black" value="Toiletries" onChange={handleRoomAmenityChange}>Toiletries</Checkbox>
                                <Checkbox borderColor="black" value="Balcony/Patio" onChange={handleRoomAmenityChange}>Balcony/Patio</Checkbox>
                                <Checkbox borderColor="black" value="Daily Housekeeping" onChange={handleRoomAmenityChange}>Daily Housekeeping</Checkbox>
                                <Checkbox borderColor="black" value="Telephone" onChange={handleRoomAmenityChange}>Telephone</Checkbox>
                            </CheckboxGroup>
                        </Stack>
                    </FormControl>
                </Flex>
                <FormControl isRequired  mt="10px">
                    <FormLabel>Picture</FormLabel>
                    <Input backgroundColor="white" borderColor="black" name = "image" placeholder="Enter URL for picture" onChange={(e)=> setAllInputs({...allInputs, [e.target.name]: e.target.value})}/>
                </FormControl>
                {/* Disable button when not logged in */}
                <Button colorScheme="blue" disabled={disabled_val} type="submit" mt="15px" mb="50px">Submit</Button>
            </form>
    </Box>
    )
}

export default NewLodgingForm