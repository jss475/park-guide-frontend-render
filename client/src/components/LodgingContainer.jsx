import {useEffect, useState} from 'react'
import {Flex, Heading} from '@chakra-ui/react'
import LodgingCard from './LodgingCard'

function LodgingContainer(){

    const [allLodging, setAllLodging] = useState([])
    useEffect(()=> {
        const getLodging = async () => {
            let req = await fetch('/lodgings')

            if (req.ok){
                let res = await req.json()
                console.log(res)
                setAllLodging(res)
            }else{
                console.error("No data :(")
            }      
        }
        getLodging();
    },[])
    console.log(allLodging)

    //create filter based off of upvote
    if(allLodging.length > 0){
        allLodging.sort(function(a,b) {
            return parseInt(b.upvote) - parseInt(a.upvote)
        })
    }

    return(
        <>
            <Heading mt="40px" ml="25px">Lodging at Yosemite!</Heading>
            <Flex flexWrap="wrap" justifyContent="left" >
                {allLodging.map(lodging => {
                return <LodgingCard key={lodging.id} lodging={lodging} />
                })}
            </Flex>
        </>
    )

}

export default LodgingContainer