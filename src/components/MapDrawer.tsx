import { useState } from 'react';

import { zoneMetaMap } from './ZoneMetaMap';

import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import MapIcon from '@mui/icons-material/Map';
import RoomIcon from '@mui/icons-material/Room';
import { Button, Grid, ImageList, ImageListItem } from '@mui/material';

import AreaCty01 from '../assets/area/UI_MapArea_Cty01.webp';
import AreaCty02 from '../assets/area/UI_MapArea_Cty02.webp';
import AreaFld01 from '../assets/area/UI_MapArea_Fld01.webp';
import AreaFld02 from '../assets/area/UI_MapArea_Fld02.webp';
import AreaFld03 from '../assets/area/UI_MapArea_Fld03.webp';
import AreaFld04 from '../assets/area/UI_MapArea_Fld04.webp';

interface setBooleanFunc {
    (value: boolean): void;
}

interface setStringFunc {
    (value: string): void;
}

interface MapDrawerProps {
    drawerOpen: boolean,
    setDrawerOpen?: setBooleanFunc,
    setZoneId?: setStringFunc,
}

export const MapDrawer = (props: MapDrawerProps) => {
    const [tabValue, setTabValue] = useState(0);
    const {drawerOpen, setDrawerOpen, setZoneId} = props;
    const [zoneSwitchOpen, setZoneSwitchOpen] = useState(true);
    const [itemPanelOpen, setItemPanelOpen] = useState(false);

    const drawerWidth = '500px';
    const theme = useTheme();

    const DrawerHeader = styled('div')(({ theme }) => ({
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
        justifyContent: 'flex-start',
    }));

    const handleDrawerClose = () => {
        setDrawerOpen?.(false);
    };

    interface TabPanelProps {
        children?: React.ReactNode;
        index: number;
        value: number;
      }

    function CustomTabPanel(props: TabPanelProps) {
        const { children, value, index, ...other } = props;
      
        return (
            <div
                role="tabpanel"
                hidden={value !== index}
                id={`simple-tabpanel-${index}`}
                aria-labelledby={`simple-tab-${index}`}
                {...other}
            >
                {value === index && (
                    <Box sx={{ p: 3 }}>
                        {children}
                    </Box>
                )}
            </div>
        );
    }
    function a11yProps(index: number) {
        return {
            id: `simple-tab-${index}`,
            'aria-controls': `simple-tabpanel-${index}`,
        };
    }
    const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    const cityAreas = [AreaCty01, AreaCty02];
    const fieldAreas = [AreaFld01, AreaFld02, AreaFld03, AreaFld04];
    const fieldZoneIds = ['fld001', 'fld002', 'fld003', 'fld004'];
    const dungeonZoneIds = ['dng007', 'dng009', 'pat0201', 'pat0801', 'pat0802', 'pat0803'];
    return (
        <Drawer
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: drawerWidth,
                },
            }}
            variant="persistent"
            anchor="right"
            open={drawerOpen}
        >
            <DrawerHeader>
                <IconButton onClick={handleDrawerClose}>
                    {theme.direction === 'rtl' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                </IconButton>
            </DrawerHeader>
            <Divider />

            <List>
                <ListItemButton onClick={() => {setZoneSwitchOpen(!zoneSwitchOpen)}}>
                    <ListItemIcon>
                        <MapIcon />
                    </ListItemIcon>
                    <ListItemText primary="Map" />
                    {zoneSwitchOpen ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                <Collapse in={zoneSwitchOpen} timeout="auto" unmountOnExit>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs value={tabValue} onChange={handleChange} aria-label="basic tabs example">
                            <Tab label="Cities" {...a11yProps(0)} />
                            <Tab label="Fields" {...a11yProps(1)} />
                            <Tab label="Dungeons" {...a11yProps(2)} />
                        </Tabs>
                    </Box>
                    <CustomTabPanel value={tabValue} index={0}>
                        <ImageList >
                            {cityAreas.map((area, idx) => (
                                <ImageListItem key={`area-cty-${idx}`} sx={{display: 'flex', flexDirection: 'row'}}>
                                    <Button onClick={() => {console.log(area)}}>
                                        <img
                                            src={`${area}?w=164&h=164&fit=crop&auto=format`}
                                            srcSet={`${area}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                                            loading="lazy"
                                        />
                                    </Button>
                                </ImageListItem>
                            ))}
                        </ImageList>
                    </CustomTabPanel>
                    <CustomTabPanel value={tabValue} index={1}>
                        <ImageList>
                            {fieldAreas.map((area, idx) => (
                                <ImageListItem key={`area-fld-${idx}`} sx={{display: 'flex', flexDirection: 'row'}}>
                                    <Button onClick={() => {setZoneId?.(fieldZoneIds[idx])}}>
                                        <img
                                            src={`${area}?w=164&h=164&fit=crop&auto=format`}
                                            srcSet={`${area}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                                            loading="lazy"
                                        />
                                    </Button>
                                </ImageListItem>
                            ))}
                        </ImageList>
                    </CustomTabPanel>
                    <CustomTabPanel value={tabValue} index={2}>
                        <Grid container spacing={2}>
                            {dungeonZoneIds.map((zId) => (
                                <Grid item xs={6} key={`area-dng-${zId}`}>
                                    <ListItemButton onClick={() => {setZoneId?.(zId)}}>
                                        <ListItemText primary={zoneMetaMap[zId].name?.ja_JP} />
                                    </ListItemButton>
                                </Grid>
                            ))}
                        </Grid>
                    </CustomTabPanel>
                </Collapse>
                
                <Divider />

                <ListItemButton onClick={() => {setItemPanelOpen(!itemPanelOpen)}}>
                    <ListItemIcon>
                        <RoomIcon />
                    </ListItemIcon>
                    <ListItemText primary="Marker" />
                    {itemPanelOpen ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                <Collapse in={itemPanelOpen} timeout="auto" unmountOnExit>
                    {['没带', '就是', '没写'].map((text, index) => (
                        <ListItem key={text} disablePadding>
                            <ListItemButton>
                                <ListItemIcon>
                                    {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                                </ListItemIcon>
                                <ListItemText primary={text} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </Collapse>
            </List>
        </Drawer>
    );
}