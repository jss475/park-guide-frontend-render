import logo from '../park_guide.gif'
import yosemite from '../yosemite1.jpg'
import yosemite2 from '../yosemite2.jpg'
import great_smokey from '../great_smokey2.jpg'
import shenandoah from '../shenandoah.jpg'
import grand_canyon from '../grand_canyon.jpg'
import zion from '../zion.jpg'
import {Box, Text, Heading, Flex, Image} from '@chakra-ui/react'
import '../about.css'

function About(){
    
    return (
        <Box>
            <div className="about-title-container">
                <Text className="about-title" fontSize="6xl">Welcome to Park Guide</Text>
            </div>
            <Box >
                <Flex ml="25px" w="95%">
                    <Text className = "about-text" w="50%" mt="auto" mb="auto" >Park Guide aims to consolidate all the information you would need to visit a national park! Our mission is to help minimize the tabs that you have open when figuring out what to do at a national park. Nobody wants to have to read through twenty blogs, another five websites, or even books about a travel desination. Who wants to stress about a trip when it's supposed to be relaxing? We want you to connect with nature as soon as possible without all the hassle that usually comes with planning a trip. </Text>
                    <Image w="50%" src={logo} alt="logo" ml="auto" mr="auto"></Image>
                </Flex>
                <Flex ml="25px">
                    <Image w="50%" borderRadius="10px" src = {yosemite2} className="yosemite-img-2" ></Image>
                    <Image w="50%" borderRadius="10px" src= {yosemite} className="yosemite-img-1" position="absolute"></Image>
                    <Text w="50%" mt="auto" mb="auto" textAlign="center" padding="10px" fontSize="3xl" className="about-text2">
                        Come check out all the national parks that the US has to offer!
                    </Text>
                </Flex>
            </Box>
            <Box mt="50px" mb="50px"> 
                <Text textAlign="center" className="about-heading" fontSize="5xl">Here are some National Parks!</Text>
                <Flex>     
                    <Flex flexWrap="wrap" mt="20px" className="wrapper">
                        <Image src={shenandoah} alt="Shanandoah" className="hover" />
                        <p className="hide">Shenandoah National Park</p>
                    </Flex>
                    <Flex flexWrap="wrap" mt="20px" className="wrapper">
                        <Image src={great_smokey} alt="Great Smokey" className="hover" />
                        <p className="hide">Great Smokey Mountains National Park</p>
                    </Flex>
                    <Flex flexWrap="wrap" mt="20px" className="wrapper">
                        <Image src={grand_canyon} alt="Grand Canyon" className="hover" />
                        <p className="hide">Grand Canyon National Park</p>
                    </Flex>
                    <Flex flexWrap="wrap" mt="20px" className="wrapper">
                        <Image src={zion} alt="Zion" className="hover" />
                        <p className="hide">Zion National Park</p>
                    </Flex>
                </Flex>
            </Box>
        </Box>
    )
}

export default About