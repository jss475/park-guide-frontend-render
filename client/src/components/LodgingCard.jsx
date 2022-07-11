import {useHistory, useLocation} from 'react-router-dom'
import {Box, Image, Text, Flex, Icon} from '@chakra-ui/react'
import {BiUpvote, BiDownvote} from 'react-icons/bi'

function LodgingCard({lodging}){

    //refactor the lodging instance
    const {id, name, upvote, downvote, image} = lodging

    //create history to push
    const history = useHistory()
    const {pathname} = useLocation()

    //create onclick to send to individual food page
    function handleLodgingCardClick(){
        if (pathname !== `/yosemite/lodging/${id}`){
            history.push({pathname: `/yosemite/lodging/${id}`,
                            state: {
                            id: id
                            }
        })
        }
    }
    
    return (
        <>
        <Box w="calc(100% * (1/4) - 25px - 20px)" height="320px" borderWidth='1px' borderRadius='lg' overflow='hidden' m='5' onClick={handleLodgingCardClick}>
          <Image src={image} alt="Picture of lodging" w="100%"  pl="10px" pr="10px" pt="10px" borderRadius="20px"/>
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
                    noOfLines={5}
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

export default LodgingCard