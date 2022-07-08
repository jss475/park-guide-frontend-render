import {useEffect, useState} from 'react'
import {useParams} from 'react-router-dom'
import {Heading, Box, Image, Text, Flex, UnorderedList, ListItem, Link, Divider, Avatar, Button, Icon, FormControl, Textarea, FormLabel} from '@chakra-ui/react'
import {FiExternalLink} from 'react-icons/fi'
import {BiUpvote, BiDownvote} from 'react-icons/bi'
import {FaStar, FaRegStar} from 'react-icons/fa'

function LodgingPage({isLoggedIn}){
    //get the id Data from the history push with UseLocation
    //set the data for the lodging
    const { id } = useParams()
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
            let req = await fetch(`/lodgings/${id}`);
        
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
                lodging_id: id
            })
        }

    
        fetch(`/user_lodgings/upvote`,configObj)
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

    
        fetch(`/user_lodgings/downvote`,configObj)
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
        fetch('/user_lodgings/', configObj)
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
                filteredIndex = index
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

            fetch('/user_lodgings', configObj)
                .then(res => res.json())
                .then(data => {
                    
                    let filter_id = data.id
                    let filteredIndex
                    let filtered_data = lodgingData.user_lodgings.filter((ul,index)=> {
                        filteredIndex = index
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
        reviews = user_lodgings.map(ul => {
            if(ul["review"]){
                return (
                    <>
                    <Divider mt="15px"/>
                    <Box mt="25px" ml="25px" mb="25px">
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
            <Box mt="80px" ml = "25px" w="80%">
                <Flex>
                    <Heading w="70%">{name}</Heading>
                    <Flex w="30%" mr="30px">
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
               
                <Image src={image} w="100%" borderRadius="20px" maxW="1366px"/>
                <Box
                        color='gray.500'
                        fontWeight='semibold'
                        letterSpacing='wide'
                        fontSize='sm'
                        ml='0'
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

            {/* Add user reviews */}
            <Text fontSize='2xl' fontWeight="semibold" ml="25px" mt="50px" mb="50px">User Reviews</Text>
            {reviews}


        </>
    )
}

export default LodgingPage