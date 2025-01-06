'use client'


import { useEffect, useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import {  Box } from '@mui/material';
import { DataGrid, GridToolbarContainer, GridToolbarExport } from '@mui/x-data-grid';
import LinearProgress from '@mui/material/LinearProgress';
import { fetchData } from './GetDatabaseComponent';

const ExpansionTracker = () => {

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCard, setShowCard] = useState(false);
  useEffect(() => {
    const fetchDataAPI = async () => {
      try {
            const result = await fetchData();
       
            setData(result);
            setLoading(false);
            // console.log(result.data)
        } catch (error) {
          console.error('Error:', error);

        }
      };
      fetchDataAPI();
  }, []);
  //return remainder >= 0 && remainder <= 3 && data.length !== 0;
  useEffect(() => {
    if (data.length >= 50) {
      const remainder = data.length % 50;
      if (remainder >= 0 && remainder <= 3){
        setShowCard(true);
      }
     //return remainder >= 0 && remainder <= 3 && data.length !== 0;

      // Use setTimeout to hide the card after 10 seconds
      const timer = setTimeout(() => {
        setShowCard(false);
      }, 10000); // 10 seconds = 10,000 milliseconds

      return () => {
        // Clear the timer when the component unmounts
        clearTimeout(timer);
      };
    }
  }, [data]);
  const handleClose = () => {
    setShowCard(false);
  };
  const convertToGB = (size) => {
    if (size >= 1024 * 1024 * 1024) {
      // If size is >= 1 GB in MB
      return size / (1024 * 1024);  // Convert to GB
    }else if (size >= 1024) {
      // If size is >= 1 MB in MB
      return size / 1024;  // Convert to GB
    } else {
      return size/1024;  // Size is in MB
    }
};



  const columns = [
    {
        field: 'request_number',
        headerName: 'Request Number',
        width: 150,headerClassName: 'custom-header',

        renderCell: (params) => (params.value.toUpperCase()
         
        ),
      },

    { field: 'array_name', headerName: 'Array Name', width: 150,headerClassName: 'custom-header',
      renderCell:(params)=>params.value.toUpperCase()
    },
    { field: 'vserver_name', headerName: 'Vserver Name', width: 180,headerClassName: 'custom-header',
      renderCell:(params)=>params.value.toUpperCase()
    },
   
    // Add more columns as needed
  ];
  function CustomToolbar() {
    return (
      <GridToolbarContainer>
        <GridToolbarExport printOptions={{ disableToolbarButton: true }} />
      </GridToolbarContainer>
    );
  }
  return (
    
    <div style={{ marginTop: '60px' }}>
    <div>
      <h1>Netapp Volume Expansion</h1>
    </div>
    <div>
    <div style={{ height: 800,width: '100%',marginTop:'30px' }}>
      {loading ? (
        <Box sx={{ width: '100%' }}>
          <LinearProgress color="info" />
        </Box>
      ) : (
        <DataGrid
          getRowId={(row) => row.request_id} rows={data} columns={columns} 
          
          slots={{
            toolbar: CustomToolbar,
          }} 
          
          />
          )}
      </div>
      </div>
      <div style={{ position: 'fixed', bottom: 20, right: 20, zIndex: 999 }}>
        {showCard && (
          <Card sx={{ maxWidth: 345 }}>
            <CardActionArea>
              <CardMedia
                component="img"
                height="180"
                image="/milestone.png"
                alt="milestone"
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  Milestone Unlocked
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {data.length}+ Successful Volume Expansions Automated!
                </Typography>
              </CardContent>
            </CardActionArea>
            <IconButton
              style={{ position: 'absolute', top: 5, right: 5 }}
              onClick={handleClose}
            >
              <CloseIcon />
            </IconButton>
          </Card>
        )}
      </div>
    </div>
    
  );
};



  
export default ExpansionTracker;