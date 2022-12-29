import {useState, useEffect} from 'react'
import {useParams, useHistory} from 'react-router-dom'
import {Heading, Box, Image, Text, Flex, Spacer, Link, Divider, Avatar, FormControl, FormLabel, Textarea, Button, Icon} from '@chakra-ui/react'
import {FiExternalLink} from 'react-icons/fi'
import {BiUpvote, BiDownvote} from 'react-icons/bi'
import {FaStar, FaRegStar} from 'react-icons/fa'
import {GoogleMap, useLoadScript, Marker} from "@react-google-maps/api"
import '../food_page.css'

function FoodPage({isLoggedIn}){
    
    //get id of the food page
    const { id } = useParams()
    //intialize usehistory to push later on
    const history = useHistory()
    //set state for retrieving the data to this specific food page
    const [foodData, setFoodData] = useState({
        pictures: [],
        user_foods: [{reviews: '', user: {name: ''}, ["favorite?"]: ''}],

    })

    //set an on change state for when a review is typed in
    const [reviewAdded, setReviewAdded] = useState()

    //set state for clicking the favorite button
    const [favClicked, setFavClicked] = useState(false)

    //pull the food data for just the one food
    useEffect(()=> {
        const getFood = async () => {
            let req = await fetch(`https://park-guide.onrender.com/foods/${id}`);
        
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
    const {isLoaded} = useLoadScript({googleMapsApiKey: "AIzaSyCXVWFVfSaFjIvSik2mxgwdo_tEyRQKmcg"})
    console.log("AIzaSyCXVWFVfSaFjIvSik2mxgwdo_tEyRQKmcg")
    //create state to take in the lat and long of the address
    const [latlong, setLatlong] = useState({lat: '', lng: ''})

    //geocoder API call
    useEffect(() => {
        const data = async () => {
            if(address){
                let added_plus = address.split(' ').join('+')
                console.log(process.env.REACT_APP_GEOCODING_API_KEY)
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
                
                const get_forecast = async() => {
                    let w_req = await fetch(res.properties.forecast)    
                
                    if(w_req.ok){
                        let data = await w_req.json()
                        setWeatherData(data.properties.periods)
                    }
                }
                get_forecast()
            }
        }
            if(latlong.lat % 1 !== 0 && latlong.lat !== -34.4845){
                getWeatherData()
            }
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
                                <Text textAlign="center" className="food-text">{day.name}</Text>
                                <Image src = {day.icon} w="90px" borderRadius="10px" ml="auto" mr="auto"/>
                                <Flex flexWrap="inline">
                                <Text color="grey" className="food-text" pr="5px">{day.temperature} F</Text>
                                    <Spacer />
                                    <Text color="grey" className="food-text" pl="5px">{filtered_output[index].temperature} F</Text>
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
                                <Text textAlign="center" className="food-text">{day.name}</Text>
                                <Image src = {day.icon} w="90px" borderRadius="10px" ml="auto" mr="auto"/>
                                <Flex flexWrap="inline">
                                    <Text color="grey" className="food-text" pl="5px">{day.temperature} F</Text>
                                    <Spacer />
                                    <Text color="grey" className="food-text" pr="5px">{temp_low_filtered[index].temperature} F</Text>
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
                food_id: id
            })
        }

    
        fetch(`https://park-guide.onrender.com/user_foods/upvote`,configObj)
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
                food_id: id
            })
        }

    
        fetch(`https://park-guide.onrender.com/user_foods/downvote`,configObj)
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
        fetch('https://park-guide.onrender.com/user_foods/', configObj)
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
                if(uf.id === filter_id){
                    filteredIndex = index
                }
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
        //if you aren't logged in you get pushed to login
        if(!isLoggedIn){
            history.push('/login')
        }

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

        fetch('https://park-guide.onrender.com/user_foods', configObj)
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
    reviews = user_foods.sort(function(a,b) {
        let a_date = new Date(a.updated_at)
        let b_date = new Date(b.updated_at)
        
        return b_date - a_date
    }).map(uf => {
        if(uf["review"]){
            return (
                <div key={uf.id}>
                    <Divider mt="15px"/>
                    <Box mt="25px"  mb="25px" className="food-text" fontFamily="Lato">
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
            <Box mt="40px" ml = "25px" w="85%" className="food-text" fontFamily="Lato">
                <Flex flexWrap="inline" w="100%" justifyContent="right">
                    <Text fontSize="4xl" w="80%" className="food-heading">{name}</Text>
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
                    <Image src={pictures[0]} w="60%" borderRadius="20px" minH = "350px" maxH = "375px" maxW="800px" mt="auto" mb="auto"/>
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
                            <Text className="food-text">{address}</Text>
                            <Spacer />
                            <Text className="food-text">{food_type}</Text>    
                        </Flex>
                        <Flex flexWrap="inline" color="blue">
                            <Link href={website} className="food-text" isExternal>
                                Official Website 
                            </Link>
                            <FiExternalLink mx="2px"/>
                        </Flex>
                </Box>
                <Box mt="15px">
                    <p className="food-description" style={{"whiteSpace": "pre-line"}}>{description}</p>
                </Box>
                
            

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

                {/* Add reviews */}
                <Text className="food-text" fontSize='2xl' fontWeight="semibold"  mt="50px">User Reviews</Text>
                {reviews}
            </Box>
        </>
    )
}

export default FoodPage