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
        <Box w="calc(100% * (1/4) - 25px - 20px)" fontFamily="Lato" backgroundColor="white" borderColor="black" maxH="300px" borderWidth='1px' borderRadius='lg' overflow='hidden' m='5' onClick={handleLodgingCardClick}>
          <Image src={image} alt="Picture of lodging" w="100%" maxH="195px" pl="10px" pr="10px" pt="10px" borderRadius="20px"/>
            <Box mt="-15px" p='6'>
                {/* difficult + route_type + estimate_time */}

                {/* title of the card */}
                <Box
                    mt='1'
                    fontWeight='semibold'
                    as='h4'
                    lineHeight='tight'
                    noOfLines={5}
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

export default LodgingCard