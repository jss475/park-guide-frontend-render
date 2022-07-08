import {useState, useEffect} from 'react'
import {useParams} from 'react-router-dom'
import {Heading, Box, Image, Text, Flex, Spacer, Link, Divider, Avatar, FormControl, FormLabel, Textarea, Button, TableContainer, Table, Tbody, Td, Tr, Icon} from '@chakra-ui/react'
import {FiExternalLink} from 'react-icons/fi'
import {BiUpvote, BiDownvote} from 'react-icons/bi'
import {FaStar, FaRegStar} from 'react-icons/fa'

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
                    filteredIndex = index
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
                    <Box mt="25px" ml="25px" mb="25px">
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
            <Box mt="80px" ml = "25px" w="80%">
                <Flex>
                    <Heading w="80%">{name}</Heading>
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
                <Image src={pictures[0]} w="100%" borderRadius="20px" maxW="1366px"/>
                <Box
                        color='gray.500'
                        fontWeight='semibold'
                        letterSpacing='wide'
                        fontSize='sm'
                        ml='0'
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
            <Text fontSize='2xl' fontWeight="semibold" ml="25px" mt="50px">User Reviews</Text>
            {reviews}
        </>
    )
}

export default FoodPage