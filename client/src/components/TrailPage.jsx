import { useState, useEffect } from "react"
import {useParams} from 'react-router-dom'
import { Text, Image, Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableContainer,
    Flex,
    Stat,
    StatLabel,
    StatNumber,
    StatHelpText,
    StatArrow,
    StatGroup,
    Icon,
    Divider,
    Box,
    Avatar,
    FormControl, FormLabel, Textarea, Button, Heading
} from "@chakra-ui/react"
import {GiHamburger, GiWaterDrop} from 'react-icons/gi'
import {BiUpvote, BiDownvote} from 'react-icons/bi'
import {GoogleMap, useLoadScript, Marker} from "@react-google-maps/api"
import '../trailpage.css'
import {FaStar, FaRegStar} from 'react-icons/fa'


function TrailPage({isLoggedIn}){
    //get pathname to retrieve the ID of the trail that was clicked
    const { id } = useParams()
    // let trailId = pathname[pathname.length-1]

    //review added state
    const [reviewAdded, setReviewAdded] = useState()
    //create state to take in trail data
    const [trailData, setTrailData] = useState({
        id: '',
        name: '',
        proximity: '',
        mileage: '', 
        elevation_gain: '', 
        starting_elevation: '', 
        starting_lat: 80, 
        starting_long: 80, 
        ending_lat: '', 
        ending_long: '', 
        route_type: '', 
        difficulty: '', 
        estimated_time: '', 
        water: '', 
        food: '', 
        pictures: [],
        upvote: '',
        downvote: '',
        user_trails: [{reviews: '', user: {name: '', id: ''}, trail: {id: ''}}]
    })

    //set state for clicking the favorite button
    const [favClicked, setFavClicked] = useState(false)

    //useParams for id
    //pull the trail data for just the one trail
    useEffect(()=> {
        fetch(`/trails/${id}`)
            .then(res => res.json())
            .then(data => setTrailData(data))
    },[id])

    //hide the API key for google maps
    const {isLoaded} = useLoadScript({googleMapsApiKey: process.env.REACT_APP_NEXT_PUBLIC_GOOGLE_MAPS_API_KEY})

    //refactor the trail data
    const {name, proximity, mileage, elevation_gain, starting_elevation, starting_lat, starting_long, ending_lat, ending_long, route_type, difficulty, estimated_time, water, food, pictures, upvote, downvote, user_trails} = trailData


    //creating the google map
    let map
    if(!isLoaded){
        map = <div>Loading...</div>
    }else{
        // debugger
        map = <GoogleMap zoom={13} center={{lat: starting_lat, lng: starting_long}} mapContainerClassName="map-container">

            <Marker position={{lat: starting_lat, lng: starting_long}} label="SL"  />
        </GoogleMap>
    }

    //create burger icons for number of foods
    let burgerIcon = []
    for(let i = 0; i < food; i++){
        burgerIcon.push(<Icon as={GiHamburger} />)
    }
    
    //create water icons for number of water needed (in L's)
    let waterIcon = []
    for(let i=0; i < water; i++){
        waterIcon.push(<Icon as={GiWaterDrop} />)
    }

    //on click for the upvote
    function handleUpvoteClick(){
        const user_id = localStorage.getItem("id")
        const configObj = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Accept': 'application/json',
            },
            mode: "cors",
            body: JSON.stringify({
                user_id: user_id,
                trail_id: id
            })
        }

    
        fetch(`/user_trails/upvote`,configObj)
            .then(res => res.json())
            .then(data => {
                if(data.error){
                    console.log(data.error)
                }else{
                    setTrailData(data)
                }
            })
    }

    //on click for the downvote
    function handleDownvoteClick(){
        const user_id = localStorage.getItem("id")
        const configObj = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Accept': 'application/json',
            },
            mode: "cors",
            body: JSON.stringify({
                user_id: user_id,
                trail_id: id
            })
        }

    
        fetch(`/user_trails/downvote`,configObj)
            .then(res => res.json())
            .then(data => {
                if(data.error){
                    console.log(data.error)
                }else{
                    setTrailData(data)
                }
            })
    }

    //handle review change
    function handleReviewChange(e){
        setReviewAdded(e.target.value)
    }

    //handle adding a review if logged in
    function handleAddReview(e){
        e.preventDefault()
        //reset the form fields
        e.target.reset()
        const user_id = localStorage.getItem("id")
        const configObj = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                user_id: user_id,
                trail_id: id,
                review: reviewAdded,
            })
        }
        fetch('/user_trails/', configObj)
            .then(res => res.json())
            .then(data => {

                let filter_id
                if(data.id){
                    filter_id = data.id
                }else{
                    filter_id = data[0].id
                }
                //see if this user trail table/data exists already
                let filteredIndex
                let filtered_data = trailData.user_trails.filter((ut,index) => {
                    filteredIndex = index
                    return ut.id === filter_id})
                //if it exists, replace the old isntance and replace with the new instance
                if(filtered_data.length > 0) {
                    let mutable_trailData = {...trailData}
                    mutable_trailData.user_trails.splice(+filteredIndex,1)
                    filtered_data[0]["review"]=reviewAdded
                    mutable_trailData.user_trails.push(filtered_data[0])
                    setTrailData(mutable_trailData)
                //if it doesn't exist, add the new instance
                }else{
                    let mutable_trailData = {...trailData}
                    mutable_trailData.user_trails.push(data)
                    setTrailData(mutable_trailData)
                }
            })
    }

    //handle clicking the favorite button
    function handleFavClick(){
        setFavClicked(prev => !prev)

        const user_id = localStorage.getItem("id")

        //need bang operator since state change is async
        const configObj = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                user_id: user_id,
                trail_id: id,
                "favorite?": !favClicked
            })
        }

        fetch('/user_trails', configObj)
            .then(res => res.json())
            .then(data => {
                
                let filter_id = data.id
                let filteredIndex
                let filtered_data = trailData.user_trails.filter((ut,index)=> {
                    filteredIndex = index
                    return ut.id === filter_id
                })

                let mutable_trailData = {...trailData}
                if(filtered_data.length > 0){
                    mutable_trailData.user_trails.splice(+filteredIndex,1)
                    filtered_data[0]["favorite?"] = !favClicked
                    mutable_trailData.user_trails.push(filtered_data[0])
                    setTrailData(mutable_trailData)
                }else{
                    mutable_trailData.user_trails.push(data)
                    setTrailData(mutable_trailData)
                }
            })
    }

    //////////////// see if favorite already clicked ///////////////////////
    const [alreadyClicked, setAlreadyClicked] = useState(false)

    //check to see if favorite has already been clicked
    useEffect(() => {
        let found = findFirstTime()
        setAlreadyClicked(found)
        setFavClicked(found)
    },[trailData])

  
    //find first instance of favorite click
    function findFirstTime(){
        const user_id = localStorage.getItem("id")
        if(user_trails && isLoggedIn){
            let find_ut = user_trails.filter(ut => { 
                return +ut.user.id === +user_id && +ut.trail.id === +id})
            if(find_ut.length > 0){
                if(find_ut[0]["favorite?"] === true){
                    return true
                }else{
                    return false
                }
            }else{
                return false
            }
        }

    }
        console.log(favClicked)
        console.log(user_trails)
    /////////////////////////////////////////////////////////////////////////////////////////////////////
   
    //map out the reviews with the user name
    let reviews = []
    if(user_trails){
        reviews = user_trails.map(ut => {
            if(ut["review"]){
                return (
                    <>
                    <Divider mt="15px" key={ut.id}/>
                        <Box mt="25px" ml="25px" mb="25px">
                            <Flex flexWrap="inline">
                                <Avatar name={ut.user.name} src='https://bit.ly/broken-link' />
                                <Text mt="1%" ml="10px">{ut.user.name}</Text>
                            </Flex>
                            <Text mt="15px">{ut["review"]}</Text>
                        </Box>
                    {/* <Divider mt="25px"/> */}
                    </>
                )
            }
        })
    }

    
     
    return (
        <>
        <Box ml = "25px" w="80%" className="trail-page-container">
            {/* Title and upvote and downvote */}
            <Flex w= "80%">
                <Heading w="80%" fontSize='3xl'>{name}</Heading>
                <Flex w="20%" justifyContent="right">
                    <Flex flexWrap="inline" mt="auto" mb="auto">
                        <Icon as={BiUpvote} mr="10px" onClick={handleUpvoteClick}/> 
                        <Text>{upvote}</Text>
                    </Flex>
                    <Flex flexWrap="inline" mt="auto" mb="auto" ml="20px">
                        <Icon as={BiDownvote} mr="10px" onClick={handleDownvoteClick}/> 
                        <Text>{downvote}</Text>
                    </Flex>
                    <Flex mt="auto" mb="auto" ml="20px" onClick={handleFavClick}>
                        {favClicked || alreadyClicked ? <Icon as={FaStar} /> : <Icon as={FaRegStar} />}
                    </Flex>
                </Flex>
            </Flex>
            
            {/* Image and Map container */}
            <Flex flexWrap="inline" w="100%" justifyContent="center">
                <Image className="trail-page-img" src={pictures[0]} w="50%" alt="trail page image" m="5px" borderRadius="5"/>
                <Box w="50%">
                    {map}
                </Box>
                
            </Flex>
            {/* {map} */}
            <Flex flexWrap="inline" w="100%" justifyContent="center">
                {/* Add 1st table */}
                <Flex w="80%">
                    <TableContainer w="100%" ml="5px" border="2px ridge" mt="10px" borderRadius="5px">
                        <Table variant='simple'  >
                            <Thead>
                            <Tr>
                                <Th>Difficulty</Th>
                                <Th>Miles</Th>
                                <Th>Estimated Time</Th>
                                <Th>Type</Th>
                            </Tr>
                            </Thead>
                            <Tbody>
                            <Tr>
                                <Td>{difficulty}</Td>
                                <Td>{mileage}</Td>
                                <Td>{estimated_time}</Td>
                                <Td>{route_type}</Td>
                            </Tr>
                            </Tbody>
                        </Table>
                    </TableContainer>
                </Flex>
            </Flex>
            <Flex flexWrap="inline" w="100%" justifyContent="center">
                <Flex w="80%">
                    <TableContainer w="70%" ml="15px">
                        <Table variant="simple">
                            <Thead>
                                <Tr>
                                    <Th>Recommended Food</Th>
                                    <Th>Recommended Water</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                <Tr>
                                    <Td>{burgerIcon}</Td>
                                    <Td>{waterIcon}</Td>
                                </Tr>
                            </Tbody>
                        </Table>
                    </TableContainer>
                    {/* creating stats table for the elevation */}
                    <StatGroup w="30%" ml = "10px"  mt="10px">
                        <Stat>
                            <StatLabel>Starting Elevation</StatLabel>
                            <StatNumber>{starting_elevation} ft</StatNumber>
                            <StatHelpText>
                            <StatArrow type={elevation_gain >=0 ?'increase' : 'decrease'} />
                            {elevation_gain} ft of elevation gain
                            </StatHelpText>
                        </Stat>
                    </StatGroup>
                </Flex>
            </Flex>
            {/* If logged in you can leave a review */}
            {isLoggedIn ? 
                <>
                    <form onSubmit={handleAddReview} >
                        <Box w="80%" ml="auto" mr="auto" mt="50px">
                            <FormControl isRequired  >
                                <FormLabel>Add a Review!</FormLabel>
                                <Textarea onChange={handleReviewChange}></Textarea>            
                            </FormControl>
                            <Button type="submit" float="right" mt="10px"  mb="50px">Submit</Button>
                        </Box>
                    </form>
                </>
        
            : null}
            {/* <Divider mt="50px"/> */}

            {/* Add reviews */}
            <Text fontSize='2xl' fontWeight="semibold" ml="25px" mt="50px">User Reviews</Text>
            {reviews}
        </Box>
        </>
    )
}

export default TrailPage