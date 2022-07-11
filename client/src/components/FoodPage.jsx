import {useState, useEffect} from 'react'
import {useParams} from 'react-router-dom'
import {Heading, Box, Image, Text, Flex, Spacer, Link, Divider, Avatar, FormControl, FormLabel, Textarea, Button, Icon} from '@chakra-ui/react'
import {FiExternalLink} from 'react-icons/fi'
import {BiUpvote, BiDownvote} from 'react-icons/bi'
import {FaStar, FaRegStar} from 'react-icons/fa'
import {GoogleMap, useLoadScript, Marker} from "@react-google-maps/api"

function FoodPage({isLoggedIn}){
    
    //get id of the food page
    const { id } = useParams()
    //set state for retrieving the data to this specific food page
    const [foodData, setFoodData] = useState({
        pictures: [],
        user_foods: [{reviews: '', user: {name: ''}, ["favorite?"]: ''}]
    })

    //set an on change state for when a review is typed in
    const [reviewAdded, setReviewAdded] = useState()

    //set state for clicking the favorite button
    const [favClicked, setFavClicked] = useState(false)

    //pull the food data for just the one food
    useEffect(()=> {
        const getFood = async () => {
            let req = await fetch(`/foods/${id}`);
        
            if (req.ok) {
                let res = await req.json();
                setFoodData(res);
            } else {
                console.error("whoops");
            }
            };
            getFood();
    },[id])

    ///////////////////////////////////  CREATING MAPS     /////////////////////////////////////////////////////////////
    //hide the API key for google maps
    const {isLoaded} = useLoadScript({googleMapsApiKey: process.env.REACT_APP_NEXT_PUBLIC_GOOGLE_MAPS_API_KEY})
    
    //create state to take in the lat and long of the address
    const [latlong, setLatlong] = useState({lat: "", lng: ""})

    //geocoder API call
    useEffect(() => {
        const data = async () => {
            let req = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?new_forward_geocoder=true&address=${address}&key=${process.env.REACT_APP_NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`);

            if (req.ok){
                let res = await req.json()
                setLatlong(res.results[0].geometry.location)
            }
        } 

       data()
    },[foodData])

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

                fetch(res.properties.forecast)
                    .then(res => res.json())
                    .then(data => 
                        setWeatherData(data.properties.periods)

                    )
            }

        }
        getWeatherData()
        
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
            if((current_hour >= 18 && current_hour <= 24) || (current_hour >=0 && current_hour <= 6)){
                //map the JSX data
                temp_low_filtered.pop()
                temp_low_filtered.unshift(filtered_output[0])
                weather = temp_low_filtered.map((day,index) => {
                    return(
                        <>
                            <Box borderWidth="1px" padding="5px" borderColor="grey" className="weather-box">
                                <Text textAlign="center">{day.name}</Text>
                                <Image src = {day.icon} w="120px" borderRadius="10px"/>
                                <Flex flexWrap="inline">
                                    <Text color="grey">{day.temperature} F</Text>
                                    <Spacer />
                                    <Text color="grey">{filtered_output[index].temperature} F</Text>
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
                            <Box borderWidth="1px" padding="5px" borderColor="grey" className="weather-box">
                                <Text textAlign="center">{day.name}</Text>
                                <Image src = {day.icon} w="120px" borderRadius="10px"/>
                                <Flex flexWrap="inline">
                                    <Text color="grey">{day.temperature} F</Text>
                                    <Spacer />
                                    <Text color="grey">{temp_low_filtered[index].temperature} F</Text>
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
                food_id: id
            })
        }

    
        fetch(`/user_foods/upvote`,configObj)
            .then(res => res.json())
            .then(data => {
                if(data.error){
                    console.log(data.error)
                }else{
                    setFoodData(data)
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
                food_id: id
            })
        }

    
        fetch(`/user_foods/downvote`,configObj)
            .then(res => res.json())
            .then(data => {
                if(data.error){
                    console.log(data.error)
                }else{
                    setFoodData(data)
                }
            })
    }


    ////////////////////////////////     ADD/CHANGE User Foods Table //////////////////////////////////////

    //fetch foods, if user_foods exists for this user, patch. If not, create a new user foods instance
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
                food_id: id,
                review: reviewAdded,
            })
        }
        fetch('/user_foods/', configObj)
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
            let filtered_data = foodData.user_foods.filter((uf,index) => {
                filteredIndex = index
                return uf.id === filter_id})
  
            //if it exists, replace the old isntance and replace with the new instance
            if(filtered_data.length > 0) {
                let mutable_foodData = {...foodData}
                mutable_foodData.user_foods.splice(+filteredIndex,1)
                filtered_data[0]["review"]=reviewAdded
                mutable_foodData.user_foods.push(filtered_data[0])
                setFoodData(mutable_foodData)
            //if it doesn't exist, add the new instance
            }else{
                let mutable_foodData = {...foodData}
                mutable_foodData.user_foods.push(data)
                setFoodData(mutable_foodData)
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
                food_id: id,
                "favorite?": !favClicked
            })
        }

        fetch('/user_foods', configObj)
            .then(res => res.json())
            .then(data => {
                
                let filter_id = data.id
                let filteredIndex
                let filtered_data = foodData.user_foods.filter((uf,index)=> {
                    if(uf.id === filter_id){
                        filteredIndex = index
                    }
                    return uf.id === filter_id
                })

                let mutable_foodData = {...foodData}
                if(filtered_data.length > 0){
                    mutable_foodData.user_foods.splice(+filteredIndex,1)
                    filtered_data[0]["favorite?"] = !favClicked
                    mutable_foodData.user_foods.push(filtered_data[0])
                    setFoodData(mutable_foodData)
                }else{
                    mutable_foodData.user_foods.push(data)
                    setFoodData(mutable_foodData)
                }
            })
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////

    //refactor the food data into its attributes
    const {name, address, website, proximity, pictures, food_type, description, user_foods, upvote, downvote} = foodData
    

    //////////////// see if favorite already clicked ///////////////////////
    const [alreadyClicked, setAlreadyClicked] = useState(false)

    //check to see if favorite has already been clicked
    useEffect(() => {
        let found = findFirstTime()
        setAlreadyClicked(found)
        setFavClicked(found)
    },[foodData])

    //find first instance of favorite click
    function findFirstTime(){
        const user_id = localStorage.getItem("id")
        if(user_foods && isLoggedIn){
            let find_uf = user_foods.filter(uf => +uf.user.id === +user_id && +uf.food.id === +id)
            if(find_uf.length > 0){
                if(find_uf[0]["favorite?"] === true){
                    return true
                }else{
                    return false
                }
            }else{
                return false
            }
        }

    }

    /////////////////////////////////////////////////////////////////////////////////////////////////////
        
    //map out the reviews with the user name
   let reviews = []
   if(user_foods){
    reviews = user_foods.map(uf => {
        if(uf["review"]){
            return (
                <div key={uf.id}>
                    <Divider mt="15px"/>
                    <Box mt="25px"  mb="25px">
                        <Flex flexWrap="inline">
                            <Avatar name={uf.user.name} src='https://bit.ly/broken-link' />
                            <Text mt="1%" ml="10px">{uf.user.name}</Text>
                        </Flex>
                        <Text mt="15px">{uf["review"]}</Text>
                    </Box>
                </div>
        
            )
        }
     })

   }

    /////////////////////////////////////////////////////////////////////////////////////////////////////
    return (
        <>
            <Flex flexWrap="inline" justifyContent="center" mt="15px">
                    {weather}
            </Flex>
            <Box mt="40px" ml = "25px" w="85%">
                <Flex flexWrap="inline" w="100%" justifyContent="right">
                    <Heading w="80%">{name}</Heading>
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
                <Flex wrap="inline">
                    <Image src={pictures[0]} w="60%" borderRadius="20px" maxW="800px" mt="15px"/>
                    <Box w="40%" p="20px" mt="auto" mb="auto">
                        {map}
                    </Box>
                </Flex>
                <Box
                        color='gray.500'
                        fontWeight='semibold'
                        letterSpacing='wide'
                        fontSize='sm'
                        ml='0'
                        mt="5px"
                    >
                        <Flex flexWrap="inline"> 
                            <Text>{address}</Text>
                            <Spacer />
                            <Text>{food_type}</Text>    
                        </Flex>
                        <Flex flexWrap="inline" color="blue">
                            <Link href={website} isExternal>
                                Official Website 
                            </Link>
                            <FiExternalLink mx="2px"/>
                        </Flex>
                </Box>
                <Box mt="15px">
                    <p style={{"whiteSpace": "pre-line"}}>{description}</p>
                </Box>
                
            

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

                {/* Add reviews */}
                <Text fontSize='2xl' fontWeight="semibold"  mt="50px">User Reviews</Text>
                {reviews}
            </Box>
        </>
    )
}

export default FoodPage