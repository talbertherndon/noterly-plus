import Header from "@/components/Header";
import useWindowDimensions from "@/contexts/hooks/useWindowDimensions";
import { Box, Chip, TextField, Typography, Button } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Carousel from 'react-material-ui-carousel';
import { media } from '../../mock/images';
import { motion } from 'framer-motion';
import { createSet } from "@/utils/api";


export default function Quiz() {
    const router = useRouter();
    const { width } = useWindowDimensions();
    const [set, setSet] = useState({
        name: "",
        description: "",
        user_id: 1,
        photo: '',
    })

    const [imageIndex, setImageIndex] = useState()

    function createSetHandler() {
        console.log(set)
        createSet(set).then((res)=>{
            console.log("SET CREATED")
            console.log(res)
        })
    }

    useEffect(() => {
        console.log("IMAGED CHANGED")
        setSet({ ...set, photo: media[imageIndex]?.photo })

    }, [imageIndex])

    return (<Box>
        <Header />
        <Box
            sx={{
                backgroundColor: "#F2F1F6",
                display: "flex",
                flexDirection: "column",
            }}
        >
            <Box sx={{ alignSelf: "center", p: width > 450 ? 5 : 1 }}>
                <Box
                    sx={{
                        width: width > 450 ? width - 200 : width - 100,
                        overflow: "hidden",
                    }}
                >
                    <Box>
                        <Chip
                            clickable
                            onClick={() => {
                                router.push("/dashboard");
                            }}
                            label="Go back"
                        />
                    </Box>
                    <Typography
                        sx={{
                            color: "black",
                            fontSize: 40,
                            fontWeight: 600,
                            fontFamily: "Montserrat",
                            fontStyle: "bold",
                        }}
                    >
                        Create a new Quiz
                    </Typography>
                    <Box sx={{ maxWidth: 300 }}>
                        <Carousel
                            index={imageIndex}
                            onChange={(e) => {
                                setImageIndex(e);
                            }}
                            navButtonsAlwaysVisible={true}
                            indicators={false}
                            cycleNavigation={false}
                            height={200}

                            autoPlay={false}>
                            {media.map((item, i) => (
                                <Box key={i} sx={{ justifyContent: 'center', alignItems: 'center', display: 'flex', height: '100%' }}>
                                    <Box sx={{ borderRadius: 4, overflow: 'hidden', width: 150, height: 150, boxShadow: 3 }}>
                                        <Box sx={{ height: 150, overflow: 'hidden' }}>
                                            <motion.div animate={{ y: 0, scale: 1.1 }} whileHover={{ scale: 1.5 }}>
                                                <img style={{ display: 'block', width: '100%', marginLeft: 'auto', marginRight: 'auto', objectFit: 'fill' }} src={item.photo} />
                                            </motion.div>
                                        </Box>

                                    </Box>
                                </Box>

                            ))}
                        </Carousel>
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <TextField
                            size="small"
                            placeholder="Name"
                            value={set.name}
                            onChange={(e) => {
                                setSet({ ...set, name: e.target.value });
                            }}
                        />
                        <TextField
                            sx={{ mt: 1 }}
                            multiline
                            rows={4}
                            size="small"
                            placeholder="Description"
                            value={set.description}
                            onChange={(e) => {
                                setSet({ ...set, description: e.target.value });
                            }}
                        />
                    </Box>
                    <Box sx={{ my: 2 }}>
                        <Typography>
                            Create questions to pop up during your discussion to make sure
                            your students are listening!
                        </Typography>
                    </Box>


                    <Box sx={{ width: 600 }}>
                        <Box sx={{ display: "flex", flexDirection: "column" }}>
                            <TextField size="small" placeholder="Untiled Question" />
                            <Box sx={{ mt: 1 }}>
                                <TextField size="small" />
                            </Box>
                        </Box>
                    </Box>

                    <Box>
                        <Chip label="Add Question" />
                    </Box>
                    <Box>
                        <Button variant="contained" onClick={createSetHandler}>Create Quiz</Button>
                    </Box>
                </Box>
            </Box>
        </Box>
    </Box>
    );
}
