import { useEffect, useState } from "react"
import { Flex, Heading} from '@chakra-ui/react'
import TrailsCard from "./TrailsCard"

function TrailsContainer() {
    
    //set state for fetching all the trails
    const [allTrails, setAllTrails] = useState([])

    useEffect(()=> {
        fetch("/trails")
            .then(res => res.json())
            .then(data => setAllTrails(data))
    },[])

    console.log(allTrails)
    //create filter based off of upvote
    if(allTrails.length > 0){
        allTrails.sort(function(a,b) {
            return parseInt(b.upvote) - parseInt(a.upvote)
        })
    }
    return(
        <>
            <Heading mt="40px" ml="25px" fontFamily="Raleway">Trails at Yosemite!</Heading>
            <Flex flexWrap="wrap" justifyContent="left" >
                {allTrails.map(trail => {
                    return <TrailsCard key={trail.id} trail={trail}/>
                })}
            </Flex>
        </>
    )
}

export default TrailsContainer