import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import { Box, Button, Grid, Typography } from '@mui/material'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Header from '@/components/Header'
import { motion } from 'framer-motion';
import useWindowDimensions from '@/contexts/hooks/useWindowDimensions'
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { media } from '../../mock/images'
import { getMySets, getSets } from '@/utils/api'
import { getSession } from 'next-auth/react'


export default function Dashboard({ data }) {
  const { width } = useWindowDimensions();
  const router = useRouter();
  const [sets, setSets] = useState([])
  useEffect(() => {
    console.log(data)
    getMySets(data?.user.id).then((res) => {
      console.log(res)
      setSets(res.data)
    })
    // setSets([
    //   { icon: "🖥️", name: "Computer Science 101", description: "This is a math set for mathThis is a math set for math This is a math set for mathThis is a math set for math", questions: 20, photo: media[1].photo },
    //   { icon: "🖥️", name: "Biology 250", description: "This is a math set for math", questions: 12, photo: media[6].photo },
    //   { icon: "🖥️", name: "Chem 93", description: "This is a math set for math", questions: 32, photo: media[30].photo },
    //   { icon: "🖥️", name: "Computer Science 101", description: "This is a math set for math", questions: 20, photo: media[10].photo },
    //   { icon: "🖥️", name: "Biology 250", description: "This is a math set for math", questions: 12, photo: media[20].photo },
    //   { icon: "🖥️", name: "Chem 93", description: "This is a math set for math", questions: 32, photo: media[12].photo }
    // ])

  }, [])

  return (
    <>
      <Head>
        <title>Seminary✏️</title>
        <meta name="description" content="" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header user={data?.user} />
      <Box sx={{
        backgroundColor: "#F2F1F6",
        display: 'flex',
        flexDirection: 'column'

      }}>
        <Box sx={{ alignSelf: 'center', p: width > 450 ? 5 : 1 }}>
          <Box sx={{ width: width > 450 ? width - 200 : width - 100, overflow: 'hidden' }}>
            <Typography sx={{ fontWeight: 600 }}>Welcome, {data?.user.name}</Typography>
            <Typography sx={{ color: "black", fontSize: 40, fontWeight: 700, fontStyle: "bold" }}>My Seminary</Typography>
            <Box sx={{ my: 2 }}>


              <Grid sx={{ maxWidth: width > 450 ? width - 200 : width - 100, overflow: "hidden", p: 1 }} container spacing={{ xs: 0.1, md: 0.1 }} columns={{ xs: 2, sm: 3, md: 4 }}>
                <Grid item xs={1} sm={1} md={1}>
                  <Box
                    onClick={() => {
                      router.push("dashboard/quiz")
                    }}
                    sx={{
                      '&:hover': {
                        opacity: 0.7
                      },
                      overflow: 'hidden',
                      cursor: 'pointer',
                      borderRadius: 5,
                      backgroundColor: 'white',
                      m: 1
                    }}>
                    <Box sx={{ height: 300, display: 'flex', justifyContent: 'center', overflow: 'hidden', maxWidth: width / 2, alignItems: 'center', flexDirection: 'column' }}>
                      <AddCircleIcon />
                      <Typography sx={{ fontWeight: 600, }}>Start a New Set!</Typography>

                    </Box>
                    <Box sx={{ p: 1, minHeight: 30, display: 'flex', flexDirection: 'column' }}>
                      <Box sx={{ display: 'flex' }}>


                      </Box>
                    </Box>
                  </Box>
                </Grid>

                {sets.map((res, index) => {
                  return (
                    <Grid item xs={1} sm={1} md={1} key={index}>
                      <motion.div
                        animate={{ y: 2, scale: 1 }}
                        transition={{ type: 'spring', duration: 0.2 }}
                        initial={{ scale: 0 }}
                        whileHover={{ scale: 1.01 }}
                      >
                        <Box
                          sx={{
                            overflow: 'hidden',
                            cursor: 'pointer',
                            borderRadius: 5,
                            backgroundColor: 'white',
                            m: 1
                          }}>
                          <Box sx={{ display: 'flex', justifyContent: 'flex-end', overflow: 'hidden', maxWidth: width / 2 }}>
                            {/* <Tooltip title={`Created by ${row._user.firstname} ${row._user.lastname}`}>
                            <Avatar sx={{ fontSize: 14, position: 'absolute', mt: 1, mr: 1 }} src={row._user.photo_url} alt={row._user.firstname[0]} />
                          </Tooltip> */}
                            <Box sx={{ height: 270 }}>
                              <motion.div animate={{ y: 10, scale: 1.08 }} whileHover={{ scale: 1.2 }}>
                                <img
                                  style={{ display: 'flex', height: 270, marginLeft: 'auto', marginRight: 'auto', objectFit: 'cover' }}
                                  src={res.photo == '' ? '' : res.photo}
                                />
                              </motion.div>
                            </Box>
                          </Box>
                          <Box sx={{ p: 1, height: 60, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                            <Typography sx={{ display: '-webkit-box', overflow: 'hidden', WebkitBoxOrient: 'vertical', WebkitLineClamp: 2, fontWeight: 400, fontSize: 12 }}>
                              {res?.description.toLowerCase()}
                            </Typography>
                          </Box>
                        </Box>
                      </motion.div>
                    </Grid>
                  )
                })}


              </Grid>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  )
}


export async function getServerSideProps({ req }) {
  const session = await getSession({ req });
  console.log(session);
  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  return {
    props: { data: session },
  };
}