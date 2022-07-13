
import { Box, Image, Icon, Flex, Text} from '@chakra-ui/react'
import {GiHamburger, GiWaterDrop} from 'react-icons/gi'
import {useHistory, useLocation} from 'react-router-dom'
import {BiUpvote, BiDownvote} from 'react-icons/bi'



function TrailsCard({trail}) {

    const {id, name, mileage, route_type, difficulty, estimated_time, water, food, pictures, upvote, downvote} = trail


    //create burger icons for number of foods
    let burgerIcon = []
    for(let i = 0; i < food; i++){
        burgerIcon.push(<Icon as={GiHamburger} />)
    }
    
    //create water icons for number of water needed (in L's)
    let waterIcon = []
    for(let i=0; i < water; i++){
        waterIcon.push(<Icon as={GiWaterDrop} />)
    }

    //handle click on box to send to individual trail page

    //initialize use history
    let history = useHistory()
    const {pathname} = useLocation()
    function handleTrailCardClick(){
        if (pathname !== `/yosemite/trails/${id}`){
            history.push({pathname: `/yosemite/trails/${id}`,
                          state: {
                            id: id
                          }
        })
        }
    }

      return (
        <Box w="calc(100% * (1/4) - 25px - 20px)" backgroundColor="white" borderColor="black" fontFamily="Lato" borderWidth='1px' borderRadius='lg' overflow='hidden' m='5' onClick={handleTrailCardClick}>
          <Image src={pictures[0]} alt="Picture of trail" w="100%" pl="10px" pr="10px" pt="10px" borderRadius="20px"/>
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
                        {difficulty} &bull; {route_type} &bull; {estimated_time} ({mileage} mi)
                    </Box>
                </Box>
                {/* title of the card */}
                <Box
                    mt='1'
                    fontWeight='semibold'
                    as='h4'
                    lineHeight='tight'
                    noOfLines={1}
                    fontFamily="Raleway"
                    >
                    {name}
                </Box>
                <Box
                    mt='1'
                    lineHeight='tight'
                    noOfLines={1}
                    >
                    {burgerIcon} &bull; {waterIcon}
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

                {/*  */}
            </Box>
        </Box>
      )
}

export default TrailsCard