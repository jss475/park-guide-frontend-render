import {Image, Box, Text, Flex, Icon} from '@chakra-ui/react'
import {useHistory, useLocation} from 'react-router-dom'
import {BiUpvote, BiDownvote} from 'react-icons/bi'

function FoodCard({food}){

    //refactor the food instance
    const {id, name, pictures, upvote, downvote} = food

    //create history to push
    const history = useHistory()
    const {pathname} = useLocation()

    //create onclick to send to individual food page
    function handleFoodCardClick(){
        if (pathname !== `/yosemite/food/${id}`){
            history.push({pathname: `/yosemite/food/${id}`,
                          state: {
                            id: id
                          }
        })
        }
    }

    return (
        <>
        <Box w="calc(100% * (1/4) - 25px - 20px)" fontFamily="Lato" backgroundColor="white" borderColor="black" height="285px" borderWidth='1px' borderRadius='lg' overflow='hidden' m='5' onClick={handleFoodCardClick}>
            <Image src={pictures[0]} alt="Picture of food" w="100%" h="60%" ml ="auto" mr="auto" pl="10px" pr="10px" pt="10px" borderRadius="20px"/>
            <Box p='6'>
                {/* difficult + route_type + estimate_time */}
                <Box display='flex' alignItems='baseline'>
                    <Box
                        color='gray.500'
                        fontWeight='semibold'
                        letterSpacing='wide'
                        fontSize='sm'
                        textTransform='uppercase'
                        ml='0'
                    >
                        {/* {difficulty} &bull; {route_type} &bull; {estimated_time} ({mileage} mi) */}
                    </Box>
                </Box>
                {/* title of the card */}
                <Box
                    mt='1'
                    fontWeight='semibold'
                    as='h4'
                    lineHeight='tight'
                    noOfLines={2}
                    fontFamily="Raleway"
                    >
                    {name}
                </Box>
                <Flex 
                    flexWrap="inline"
                    color='gray.500'
                    fontWeight='semibold'
                    letterSpacing='wide'
                    fontSize='sm'
                    textTransform='uppercase'
                    ml='0'
                >
                    <Flex>
                        <Icon as={BiUpvote} mt="4px"/>
                        <Text>{upvote}</Text>
                    </Flex>
                    <Flex>
                        <Icon as={BiDownvote} ml = "15px" mt="4px"/>
                        <Text >{downvote}</Text>
                    </Flex>
                    
                </Flex>

            </Box>
        </Box>

        </>
    )

}

export default FoodCard