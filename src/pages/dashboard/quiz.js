import Header from '@/components/Header';
import useWindowDimensions from '@/contexts/hooks/useWindowDimensions';
import { Box, Chip, TextField, Typography } from '@mui/material';
import { useRouter } from 'next/router';

export default function Quiz() {
    const router =useRouter();
    const { width } = useWindowDimensions();
    return (<Box><Header />
        <Box sx={{
            backgroundColor: "#F2F1F6",
            display: 'flex',
            flexDirection: 'column'

        }}>
            <Box sx={{ alignSelf: 'center', p: width > 450 ? 5 : 1 }}>
                <Box sx={{ width: width > 450 ? width - 200 : width - 100, overflow: 'hidden' }}>
                    <Box>
                        <Chip clickable onClick={()=>{
                            router.push("/dashboard")
                        }} label="Go back" />
                    </Box>
                    <Typography sx={{ color: "black", fontSize: 40, fontWeight: 600, fontFamily: "Montserrat", fontStyle: "bold" }}>Create a new Quiz</Typography>
                    <Box sx={{ my: 2 }}>
                        <Typography>Create questions to pop up during your discussion to make sure your students are listening!</Typography>
                    </Box>
                    <Box sx={{ width: 600 }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                            <TextField size='small' placeholder='Untiled Question' />
                            <Box sx={{ mt: 1 }}>
                                <TextField size='small' />
                            </Box>
                        </Box>
                    </Box>

                    <Box>
                        <Chip label="Add Question" />
                    </Box>
                </Box>
            </Box>
        </Box>
    </Box>

    )
}