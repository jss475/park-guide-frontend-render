import {useEffect, useState} from 'react'
import {useParams, useHistory} from 'react-router-dom'
import {Heading, Box, Image, Text, Flex, UnorderedList, ListItem, Spacer, Link, Divider, Avatar, Button, Icon, FormControl, Textarea, FormLabel} from '@chakra-ui/react'
import {FiExternalLink} from 'react-icons/fi'
import {BiUpvote, BiDownvote} from 'react-icons/bi'
import {FaStar, FaRegStar} from 'react-icons/fa'
import {GoogleMap, useLoadScript, Marker} from "@react-google-maps/api"
import '../lodgingpage.css'


function LodgingPage({isLoggedIn}){
    //get the id Data from the history push with UseLocation
    //set the data for the lodging
    const { id } = useParams()
    //set usehistory to push later
    const history = useHistory()

    const [lodgingData, setLodgingData] = useState({
        user_lodgings: [{reviews: '', user: {id: '',name: '', ["favorite?"]: ''}, lodging: {id: ''}}]
    })

    //set an on change state for when a review is typed in
    const [reviewAdded, setReviewAdded] = useState()

    //set state for clicking the favorite button
    const [favClicked, setFavClicked] = useState(false)

    //pull the lodging data for just the one lodging
    useEffect(()=> {
        const getLodging = async () => {
            let req = await fetch(`https://park-guide.onrender.com/lodgings/${id}`);
        
            if (req.ok) {
                let res = await req.json();
                setLodgingData(res);
            } else {
                console.error("whoops");
            }
            };
            getLodging();
    },[id])

    //refactor the lodging data into its attributes 
    const {name, address, website, lodging_amenity, room_amenity, upvote, downvote, image, user_lodgings} = lodgingData

    ///////////////////////////////////  CREATING MAPS     /////////////////////////////////////////////////////////////
    //hide the API key for google maps
    const {isLoaded} = useLoadScript({googleMapsApiKey: "AIzaSyCXVWFVfSaFjIvSik2mxgwdo_tEyRQKmcg"})
    
    //create state to take in the lat and long of the address
    const [latlong, setLatlong] = useState({lat: "", lng: ""})

    //geocoder API call
    useEffect(() => {
        const data = async () => {
            if(address){
                let added_plus = address.split(' ').join('+')
                let req = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?new_forward_geocoder=true&address=${added_plus}&key=AIzaSyCrpgYxdZIWNFA8ahKCUt9-94SCnTUS7EQ`);

                if (req.ok){
                    let res = await req.json()
                    if(res){
                        setLatlong(res.results[0].geometry.location)
                    }
                    
                }
            }
        } 

       data()
    },[address])

    //creating the google map
    // const [map, setMap] = useState(<></>)
 
    // console.log(latlong)
    //creating the google map
    let map
    if(!isLoaded){
        map = <div>Loading...</div>
    }else if(isLoaded && latlong.lat && latlong.lng){
        map = <GoogleMap zoom={13} center={{lat: latlong.lat, lng: latlong.lng}} mapContainerClassName="map-container">

            <Marker position={{lat: latlong.lat, lng: latlong.lng}} label="SL"  />
        </GoogleMap>
    }

    ////////////////////////////////////////////////////////////////////////////////////

    ///////////////////////  WEATHER API ////////////////////////////

    const [weatherData, setWeatherData] = useState([])
    useEffect(() => {
        const getWeatherData = async() => {
            let req = await fetch(`https://api.weather.gov/points/${latlong.lat},${latlong.lng}`);

            if(req.ok){
                let res = await req.json()
                
                const get_forecast = async() => {
                    console.log(res)
                    let w_req = await fetch(res.properties.forecast)    
                
                    if(w_req.ok){
                        let data = await w_req.json()
                        setWeatherData(data.properties.periods)
                    }
                }
                get_forecast()
            }
        }
        if(latlong.lat % 1 !== 0){
            getWeatherData()
        }

        // if(!isLoaded){
        //     setMap(<div>Loading...</div>)
        // }else if(isLoaded && latlong.lat && latlong.lng){
        //     setMap(<GoogleMap zoom={13} center={{lat: latlong.lat, lng: latlong.lng}} mapContainerClassName="map-container">
    
        //         <Marker position={{lat: latlong.lat, lng: latlong.lng}} label="SL"  />
        //     </GoogleMap>)
        // }
            
    },[latlong])

    //weather JSX data
    let weather = []
    const current_date= new Date()
    const current_hour = current_date.getHours()

    
    if(weatherData.length > 0){
        //get every other weather data
        let output = [...weatherData].map((n,index) => index % 2 === 0 ? n : null)
        let temp_low = [...weatherData].map((n,index) => index % 2 !== 0 ? n : null)
        let filtered_output = output.filter(el => el !== null)
        let temp_low_filtered = temp_low.filter(el => el !== null)
        //pop the last two for a five day forecase
        filtered_output.pop()
        filtered_output.pop()
        temp_low_filtered.pop()
        temp_low_filtered.pop()

        
        if(filtered_output && temp_low_filtered){
            //if it's night time do temp_low_filtered first
            if(temp_low_filtered[0] > filtered_output[0]){
                //map the JSX data
                temp_low_filtered.pop()
                temp_low_filtered.unshift(filtered_output[0])
                weather = temp_low_filtered.map((day,index) => {
                    return(
                        <>
                            <Box borderWidth="1px" padding="5px" borderColor="grey" className="weather-box" backgroundColor="white">
                                <Text textAlign="center" >{day.name}</Text>
                                <Image src = {day.icon} w="90px" borderRadius="10px" ml="auto" mr="auto"/>
                                <Flex flexWrap="inline">
                                    <Text color="grey"  pr="5px">{day.temperature} F</Text>
                                    <Spacer />
                                    <Text color="grey"  pl="5px">{filtered_output[index].temperature} F</Text>
                                </Flex>
                            </Box>
                        </>
                    )
                })
            }else{
                //map the JSX data
                weather = filtered_output.map((day,index) => {
                    return(
                        <>
                            <Box borderWidth="1px" padding="5px" borderColor="grey" className="weather-box" backgroundColor="white"> 
                                <Text textAlign="center" >{day.name}</Text>
                                <Image src = {day.icon} w="90px" borderRadius="10px" ml="auto" mr="auto"/>
                                <Flex flexWrap="inline">
                                    <Text color="grey"  pl="5px">{day.temperature} F</Text>
                                    <Spacer />
                                    <Text color="grey"  pr="5px">{temp_low_filtered[index].temperature} F</Text>
                                </Flex>
                            </Box>
                        </>
                    )
                })
            }
        }
    }
    
    /////////////////////////////////////////////////////////////////
    //on click for the upvote
    function handleUpvoteClick(){
        //if you aren't logged in you get pushed to login
        if(!isLoggedIn){
            history.push('/login')
        }

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
                lodging_id: id
            })
        }

    
        fetch(`https://park-guide.onrender.com/user_lodgings/upvote`,configObj)
            .then(res => res.json())
            .then(data => {
                if(data.error){
                    console.log(data.error)
                }else{
                    setLodgingData(data)
                }
            })
    }

    //on click for the downvote
    function handleDownvoteClick(){
        //if you aren't logged in you get pushed to login
        if(!isLoggedIn){
            history.push('/login')
        }

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
                lodging_id: id
            })
        }

    
        fetch(`https://park-guide.onrender.com/user_lodgings/downvote`,configObj)
            .then(res => res.json())
            .then(data => {
                if(data.error){
                    console.log(data.error)
                }else{
                    setLodgingData(data)
                }
            })
    }

    ////////////////////////////////     ADD/CHANGE User lodgings Table //////////////////////////////////////

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
                lodging_id: id,
                review: reviewAdded,
            })
        }

        fetch('https://park-guide.onrender.com/user_lodgings/', configObj)
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
            let filtered_data = lodgingData.user_lodgings.filter((ul,index) => {
                
                if(ul.id === filter_id){
                    filteredIndex = index
                }
                
                return ul.id === filter_id})
  
            //if it exists, replace the old isntance and replace with the new instance
            if(filtered_data.length > 0) {
                let mutable_lodgingData = {...lodgingData}
                mutable_lodgingData.user_lodgings.splice(+filteredIndex,1)
                filtered_data[0]["review"]=reviewAdded
                mutable_lodgingData.user_lodgings.push(filtered_data[0])
                setLodgingData(mutable_lodgingData)
            //if it doesn't exist, add the new instance
            }else{
                let mutable_lodgingData = {...lodgingData}
                mutable_lodgingData.user_lodgings.push(data)
                setLodgingData(mutable_lodgingData)
            }
        })
    }

     //handle clicking the favorite button
     function handleFavClick(){
        //if you aren't logged in you get pushed to login
        if(!isLoggedIn){
            history.push('/login')
        }

        if(isLoggedIn){
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
                    lodging_id: id,
                    "favorite?": !favClicked
                })
            }

            fetch('https://park-guide.onrender.com/user_lodgings', configObj)
                .then(res => res.json())
                .then(data => {
                    
                    let filter_id = data.id
                    let filteredIndex
                    let filtered_data = lodgingData.user_lodgings.filter((ul,index)=> {
                        if(ul.id === filter_id){
                            filteredIndex = index
                        }
                        return ul.id === filter_id
                    })

                    let mutable_lodgingData = {...lodgingData}
                    if(filtered_data.length > 0){
                        mutable_lodgingData.user_lodgings.splice(+filteredIndex,1)
                        filtered_data[0]["favorite?"] = !favClicked
                        mutable_lodgingData.user_lodgings.push(filtered_data[0])
                        setLodgingData(mutable_lodgingData)
                    }else{
                        mutable_lodgingData.user_lodgings.push(data)
                        setLodgingData(mutable_lodgingData)
                    }
                })
        }
    }

    
 

    //////////////// see if favorite already clicked ///////////////////////
    const [alreadyClicked, setAlreadyClicked] = useState(false)

    //check to see if favorite has already been clicked
    useEffect(() => {
        let found = findFirstTime()
        setAlreadyClicked(found)
        setFavClicked(found)
    },[lodgingData])

    //find first instance of favorite click
    function findFirstTime(){
        const user_id = localStorage.getItem("id")
        //if user lodgings attribute exists and you're logged in 
        if(user_lodgings && isLoggedIn){
            let find_ul = user_lodgings.filter(ul => {
                return +ul.user.id === +user_id && +ul.lodging.id === +id})
            if(find_ul.length > 0){
                if(find_ul[0]["favorite?"] === true){
                    return true
                }else{
                    return false
                }
            }else{
                return false
            }
        }
    }

    //map out the reviews with the user name
    let reviews = []
    if(user_lodgings){
        reviews = user_lodgings.sort(function(a,b) {
            let a_date = new Date(a.updated_at)
            let b_date = new Date(b.updated_at)
            
            return b_date - a_date
        
        }).map(ul => {
            if(ul["review"]){
                return (
                    <>
                    <Divider mt="15px"/>
                    <Box mt="25px"  mb="25px" fontFamily="Lato">
                        <Flex flexWrap="inline">
                            <Avatar name={ul.user.name} src='https://bit.ly/broken-link' />
                            <Text mt="1%" ml="10px">{ul.user.name}</Text>
                        </Flex>
                        <Text mt="15px">{ul["review"]}</Text>
                    </Box>
                    {/* <Divider mt="25px"/> */}
                    </>
                )
            }
        })
    }


    return (
        <>
            <Flex flexWrap="inline" justifyContent="center" mt="15px" fontFamily="Lato">
                {weather}
            </Flex>
            <Box mt="40px" ml = "25px" w="85%" fontFamily="Lato">
                <Flex w="100%" justifyContent="right">
                    <Heading fontFamily="Raleway" w="80%">{name}</Heading>
                    <Flex w="20%" justifyContent="right">
                        <Flex flexWrap="inline" mt="auto" mb="auto">
                                <Icon as={BiUpvote} mr="10px" mt = "5px" onClick={handleUpvoteClick}/> 
                                <Text>{upvote}</Text>
                            </Flex>
                            <Flex flexWrap="inline" mt="auto" mb="auto" ml="20px">
                                <Icon as={BiDownvote} mr="10px" mt = "5px" onClick={handleDownvoteClick}/> 
                                <Text>{downvote}</Text>
                            </Flex>
                            <Flex mt="auto" mb="auto" ml="20px" onClick={handleFavClick}>
                                {favClicked || alreadyClicked ? <Icon as={FaStar} /> : <Icon as={FaRegStar} />}
                        </Flex>
                    </Flex>
                </Flex>
                
                
               <Flex wrap="inline" >
                    <Image src={image} w="60%" borderRadius="20px" minH = "350px" maxH = "37px" maxW="800px" mt="auto" mb="auto" />
                    <Box w="40%" pl="20px" mt="auto" mb="auto">
                        {map}
                    </Box>
                    
               </Flex>
                
                <Box
                        color='gray.500'
                        fontWeight='semibold'
                        letterSpacing='wide'
                        fontSize='sm'
                        ml='0'
                        mt="-15px"
                    >
                        <Flex flexWrap="inline"> 
                            <Text>{address}</Text>  
                        </Flex>
                        <Flex flexWrap="inline" color="blue">
                            <Link href={website} isExternal>
                                Book Today!
                            </Link>
                            <FiExternalLink mx="2px"/>
                        </Flex>
                </Box>
                <Flex flexWrap="inline" mt="15px">
                    <Box>
                        <Text fontWeight="semibold">Lodging Amenity</Text>
                        <UnorderedList>
                            {lodging_amenity ? lodging_amenity.map(amenity => {
                                return <ListItem>{amenity}</ListItem>
                            }) : null    
                            }
                        </UnorderedList>
                    </Box>
                    <Box ml="10%">
                        <Text fontWeight="semibold">Room Amenity</Text>
                        <UnorderedList>
                            {room_amenity ? room_amenity.map(amenity => {
                                return <ListItem>{amenity}</ListItem>
                            }) : null    
                            }
                        </UnorderedList> 
                    </Box>
                </Flex>
                
            

                {/* If logged in you can leave a review */}
                {isLoggedIn ? 
                    <>
                        <form onSubmit={handleAddReview} >
                            <Box w="80%" ml="auto" mr="auto" mt="50px">
                                <FormControl isRequired  >
                                    <FormLabel>Add a Review!</FormLabel>
                                    <Textarea onChange={handleReviewChange} borderColor="black" backgroundColor="white"></Textarea>            
                                </FormControl>
                                <Button type="submit" float="right" mt="10px"  mb="50px">Submit</Button>
                            </Box>
                        </form>
                    </>
            
                : null}

                {/* Add user reviews */}
                <Text fontSize='2xl' fontWeight="semibold" mt="50px" >User Reviews</Text>
                {reviews}
            </Box>

        </>
    )
}

export default LodgingPage