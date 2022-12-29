import { useEffect, useState } from "react"
import {FormControl, Select, FormLabel, Box, Button, Text} from '@chakra-ui/react'

function ItineraryGenerator(){

    //set state to save data for trails, lodging, and food
    const [trailData, setTrailData] = useState([])
    const [foodData, setFoodData] = useState([])
    const [lodgingData, setLodgingData] = useState([])

    //set state on input changes
    const [allInputs, setAllInputs] = useState({})

    //set state on errors
    const [errors, setErrors] = useState([])

    //fetch the data for trails, lodging, and food
    useEffect(()=> {
        fetch('https://park-guide.onrender.com/trails')
        .then(res => res.json())
        .then(data => setTrailData(data))

        fetch('https://park-guide.onrender.com/foods')
        .then(res => res.json())
        .then(data => setFoodData(data))

        fetch('https://park-guide.onrender.com/lodgings')
        .then(res => res.json())
        .then(data => setLodgingData(data))

    },[])

    function handleItineraryInput(e){
        setAllInputs({...allInputs, [e.target.name]: e.target.value})
    }

    function handleItinerarySubmit(e){
        e.preventDefault()
        let filtered_food = foodData.filter(food => food.food_type === allInputs.food_type)
        let filtered_trail = trailData.filter(trail => trail.difficulty === allInputs.difficulty)
        setErrors([])
        //if the food choice isn't available. Return it isn't available
        if(filtered_food.length === 0){
            setErrors([...errors, "The food choice is not available"])
        }else if(filtered_trail.length === 0){
            setErrors([...errors, "The trail difficulty is not available"])
        }
    }

    console.log(allInputs)
    console.log(errors)
    return(
        <>
            <Box mt="40px">      
              <form onSubmit={handleItinerarySubmit}>
                    <FormControl isRequired>
                        <FormLabel>Restaurant Type</FormLabel>
                        <Select name="food_type" backgroundColor="white" placeholder="Select the type of food you want" onChange={handleItineraryInput}>
                            <option value="African">African</option>
                            <option value="American">American</option>
                            <option value="Asian">Asian</option>
                            <option value="Bakery">Bakery/Cafe</option>
                            <option value="European">European</option>
                            <option value="Fast Food">Fast Food</option>
                            <option value="Latin American">Latin American</option>
                            <option value="Mediterranean">Mediterranean</option>
                        </Select>
                    </FormControl>
                    <FormControl isRequired>
                        <FormLabel>Trail Difficulty</FormLabel>
                        <Select name="difficulty" backgroundColor="white" placeholder="Select the hike difficulty" onChange={handleItineraryInput}>
                            <option value="Easy">Easy</option>
                            <option value="Medium">Medium</option>
                            <option value="Hard">Hard</option>
                            <option value="Extremely Hard">Extremely Hard</option>
                        </Select>
                    </FormControl>
                    {errors ? errors.map((error,index) => {
                        return <Text key={index} color="red">{error}</Text>
                    }) : null}
                    <Button type="submit">Submit</Button>
                </form>
            </Box>
        </>
    )
}

export default ItineraryGenerator