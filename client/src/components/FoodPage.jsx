import {useState, useEffect} from 'react'
import {useLocation, useParams} from 'react-router-dom'
import {Heading, Box, Image, Text, Flex, Spacer, Link, Divider, Avatar, FormControl, FormLabel, Textarea, Button, TableContainer, Table, Tbody, Td, Tr, Icon} from '@chakra-ui/react'
import {FiExternalLink} from 'react-icons/fi'
import {BiUpvote, BiDownvote} from 'react-icons/bi'
import {FaStar, FaRegStar} from 'react-icons/fa'

function FoodPage({isLoggedIn}){
    
    //get id of the food page
    let { id } = useParams()


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
    },[])
    //on click for the upvote
    function handleUpvoteClick(){
        const configObj = {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                'Accept': 'application/json',
            },
            mode: "cors",
            body: JSON.stringify({
                upvote: upvote+1
            })
        }
        fetch(`/foods/${id}`,configObj)
            .then(res => res.json())
            .then(data => setFoodData(data))
    }

    //on click for the downvote
    function handleDownvoteClick(){
        const configObj = {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                'Accept': 'application/json',
            },
            mode: "cors",
            body: JSON.stringify({
                downvote: downvote+1
            })
        }
        fetch(`/foods/${id}`,configObj)
            .then(res => res.json())
            .then(data => setFoodData(data))
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
            .then(data => setFoodData({...foodData, "user_foods": [...foodData.user_foods,data]}))
    }

    //handle clicking the favorite button
    function handleFavClick(){
        setFavClicked(prev => !prev)
        const user_id = localStorage.getItem("id")
        //since state doesn't change immediately when clicked to favorite, the value returned by favClicked is false even though we expect true
        //that's why following logic is as below

        //need to check if user_foods table exists for this user and food combo
        const find_uf = findUserFood()
        //if the instance exists, then patch. If not, post
        //state doesn't update whiel in this function so the bang operator is needed to submit correct value
        if(find_uf.length > 0){
            const configObj = {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "favorite?": !favClicked 
                })
            }
            fetch(`/user_foods/${find_uf[0].id}`, configObj)
                .then(res => res.json())
                .then(data => console.log(data))
        }else{
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
            fetch('/user_foods/', configObj)
            .then(res => res.json())
            .then(data => console.log(data))
        }
    }

    //function to find user food
    function findUserFood(){
        const user_id = localStorage.getItem("id")
        let find_uf = user_foods.filter(uf => +uf.user.id === +user_id && +uf.food.id === +id)
        if(find_uf.length > 0){
            return find_uf
        }else{
            return []
        }
    }

    
    // console.log(alreadyClicked)

    
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////

    //refactor the food data into its attributes
    const {name, address, website, proximity, pictures, food_type, description, user_foods, upvote, downvote} = foodData
    

    //////////////// see if favorite already clicked ///////////////////////
    const [alreadyClicked, setAlreadyClicked] = useState(false)

    //check to see if favorite has already been clicked
    useEffect(() => {
        let found = findFirstTime()
        setAlreadyClicked(found)
    },[foodData])

    //find first instance of favorite click
    function findFirstTime(){
        const user_id = localStorage.getItem("id")
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

    /////////////////////////////////////////////////////////////////////////////////////////////////////
        
    //map out the reviews with the user name
    let reviews = user_foods.map(uf => {
        return (
            <div key={uf.id}>
                <Divider mt="15px"/>
                <Box mt="25px" ml="25px" mb="25px">
                    <Flex flexWrap="inline">
                        <Avatar name={uf.user.name} src='https://bit.ly/broken-link' />
                        <Text mt="1%" ml="10px">{uf.user.name}</Text>
                    </Flex>
                    <Text mt="15px">{uf.review}</Text>
                </Box>
            </div>
    
        )
    })
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