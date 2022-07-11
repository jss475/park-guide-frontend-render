import { useEffect, useState } from "react"
import {Divider, Grid, GridItem, Avatar, Text, Box, Flex, Heading, Image, Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon} from '@chakra-ui/react'
import '../user.css'

function UserPage(){
    //create state for storing all user data
    const [userData, setUserData] = useState({
        user_trails: [],
        user_foods: [],
        user_lodgings: []
    })

    //create time message
    // const [timeMessage, setTimeMessage] = useState()

    //fetch specific user data
    useEffect(()=> {
        let user_id = localStorage.getItem("id")
        const getUser = async () => {
        let req = await fetch(`/users/${user_id}`)

        if (req.ok) {
            let res = await req.json()
            setUserData(res)
        }else{
            console.error("whoops")
        }}
        getUser()
    },[])

    const {email, name, user_foods, user_lodgings, user_trails, created_at} = userData

    //calculate days you've been a member
    const current = new Date()
    const created_at_date = new Date(created_at)
    // const created_at_date = new Date(98, 1)

    const time_diff = (current - created_at_date)
    const days_since_created = Math.round(time_diff/(1000*60*60*24))
    
    let timeMessage
    if(days_since_created===0){
        timeMessage = '< 1 day'
    }else if(days_since_created< 365){
        timeMessage = `${days_since_created} days`
    }else if (days_since_created%365 === 0){
        timeMessage = `${days_since_created/365} year(s)`
    }else{
        let years = Math.floor(days_since_created/365)
        let days = days_since_created%365
        timeMessage = `${years} year(s) and ${days} day(s)`
    }

    //filter for just favorites
    let user_foods_fav_filtered = [...user_foods].filter(uf => uf["favorite?"] === true)
    let user_lodgings_fav_filtered = [...user_lodgings].filter(ul => ul["favorite?"] === true)
    let user_trails_fav_filtered = [...user_trails].filter(ut => ut["favorite?"] === true)

    //filter for those with reviews
    let user_foods_review_filter = [...user_foods].filter(uf => uf["review"])
    let user_lodgings_review_filter = [...user_lodgings].filter(ul => ul["review"])
    let user_trails_review_filter = [...user_trails].filter(ut => ut["review"])
    ////////////////////////////////////////////////////////////////////////////////////////

    return (
        <>
        <Box w="80%" mt="40px" ml="auto" mr="auto">
            <Box textAlign="center">
                <Avatar name = {name} src="https://bit.ly/broken-link" />
                <Text>{name}</Text>
                <Text>{email}</Text>
                <Text>Member since: {timeMessage}</Text>
            </Box>

            {/* accordion for all favorites */}
            <Accordion defaultIndex={[0]} allowMultiple mt="50px">
                <AccordionItem>
                        <AccordionButton>
                            <Flex w="100%">
                                <Heading textAlign="left" size="md" w="60%">Favorites</Heading>
                                <Text w = "40%">Click to see your favorites!</Text>
                            </Flex>
                            
                            <AccordionIcon />
                        </AccordionButton>
                    <Grid templateColumns="repeat(3, 250px)" gap={6}>

                        {userData ? 
                            user_foods_fav_filtered.map(uf => {
                                return (
                                    <div>
                                        {uf["favorite?"]===true ? 
                                            <GridItem className="user-card">
                                            <AccordionPanel>
                                                <Text  noOfLines={1} fontSize="lg" fontWeight = "semibold" key={uf.id}>{uf.food.name}</Text> 
                                                <Image className="place-image" src={uf.food.pictures[0]} alt="User Food"/>
                                            </AccordionPanel>
                                            </GridItem>
                                        : null}
                                    </div>
                                )
                            })
                        : null}
                                        {userData ? 
                        user_lodgings_fav_filtered.map(ul => {
                            return (
                            <div >
                                {ul["favorite?"]===true  ?
                                <GridItem className="user-card">
                                    <AccordionPanel>
                                        <Text noOfLines={1} fontSize="lg" fontWeight = "semibold" key={ul.id}>{ul.lodging.name}</Text> 
                                        <Image className="place-image" src={ul.lodging.image} alt="User Lodging" />
                                    </AccordionPanel>
                                    </GridItem>
                                : null}
                            </div>
                            )
                        })
                        : null}
                        {userData ? 
                            user_trails_fav_filtered.map(ut => {
                                return (
                                <div >
                                    {ut["favorite?"]===true  ?
                                    <GridItem className="user-card">
                                        <AccordionPanel>
                                            {/* <Divider /> */}
                                            <Text noOfLines={1} fontSize="lg" fontWeight = "semibold" key={ut.id}>{ut.trail.name}</Text> 
                                            <Image className="place-image" src={ut.trail.pictures[0]} alt="User User Trail" />
                                        </AccordionPanel>
                                        </GridItem>
                                    : null}
                                </div>
                                )
                            })
                        : null}
                    </Grid>
                </AccordionItem>
            </Accordion>

            {/* accordion for user_trails */}
            <Accordion allowMultiple mt="50px">
                <AccordionItem>
                    <AccordionButton>
                        <Flex w="100%">
                            <Heading textAlign="left" size="md" w="60%">Trail Reviews</Heading>
                            <Text w = "40%">Click to see your reviews!</Text>
                        </Flex>
                        
                        <AccordionIcon />
                    </AccordionButton>
                    <Grid templateColumns="repeat(3, 250px)" gap={6}>
                        {userData ? 
                            user_trails_review_filter.map(ut => {
                                return (
                                <>
                                    {ut["review"] ?
                                    <GridItem>
                                        <AccordionPanel>
                                            <Text fontSize="lg" fontWeight = "semibold" key={ut.id}>{ut.trail.name}</Text> 
                                            <Text >{ut["review"]}</Text>
                                            <Image className="place-image" src={ut.trail.pictures[0]} alt="User Trail"/>
                                        </AccordionPanel>
                                        </GridItem>
                                    : null}
                                </>
                                )
                            })
                        : null}
                    </Grid>
                </AccordionItem>
            </Accordion>

            {/* accordion for user_lodgings */}
            <Accordion  allowMultiple>
                <AccordionItem>
                    <h2>            
                        <AccordionButton>
                            <Flex w="100%">
                                <Heading textAlign="left" size="md" w="60%">Lodging Reviews</Heading>
                                <Text w = "40%">Click to see your reviews!</Text>
                            </Flex>
                            
                            <AccordionIcon />
                        </AccordionButton>
                    </h2>
                <Grid templateColumns="repeat(3, 250px)" gap={6}> 
                    {userData ? 
                        user_lodgings_review_filter.map(ul => {
                            return (
                            <>
                                {ul["review"] ?
                                <GridItem>
                                    <AccordionPanel>
                                        <Text fontSize="lg" fontWeight = "semibold" key={ul.id}>{ul.lodging.name}</Text> 
                                        <Text >{ul["review"]}</Text>
                                        <Image className="place-image" src={ul.lodging.image} alt="User Lodging"/>
                                    </AccordionPanel>
                                    </GridItem>
                                : null}
                            </>
                            )
                        })
                    : null}
                </Grid>
                </AccordionItem>
            </Accordion>

            {/* accordion for user_foods */}
            <Accordion allowMultiple>
                <AccordionItem>
                    <AccordionButton>
                        <Flex w="100%">
                            <Heading textAlign="left" size="md" w="60%">Food Reviews</Heading>
                            <Text w = "40%">Click to see your reviews!</Text>
                        </Flex>
                        
                        <AccordionIcon />
                    </AccordionButton>
                <Grid templateColumns="repeat(3, 250px)" gap={6}>
                    {userData ? 
                        user_foods_review_filter.map(uf => {
                            return (
                            <>
                                {uf["review"] ? 
                                    <GridItem>
                                        <AccordionPanel>
                                            <Text fontSize="lg" fontWeight = "semibold" key={uf.id}>{uf.food.name}</Text> 
                                            <Text >{uf["review"]}</Text>
                                            <Image className="place-image" src={uf.food.pictures[0]} alt="User Food"/>
                                        </AccordionPanel>
                                    </GridItem>
                                : null}
                            </>
                            )
                        })
                    : null}
                </Grid>
                </AccordionItem>
            </Accordion>
        </Box>
        </>
    )
}

export default UserPage