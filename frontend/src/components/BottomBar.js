import React, { Component } from 'react'
import { withTranslation } from "react-i18next";
import {FormControlLabel, Link, Switch, CircularProgress, Badge, Tooltip, TextField, ListItemAvatar, Button, Avatar,Paper, Grid, IconButton, Typography, Select, MenuItem, List, ListItemText, ListItem, ListItemIcon, ListItemButton, Divider, Dialog, DialogContent} from "@mui/material";
import MediaQuery from 'react-responsive'
import { Link as LinkRouter } from 'react-router-dom'

// Icons
import SettingsIcon from '@mui/icons-material/Settings';
import PeopleIcon from '@mui/icons-material/People';
import InventoryIcon from '@mui/icons-material/Inventory';
import SellIcon from '@mui/icons-material/Sell';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PercentIcon from '@mui/icons-material/Percent';
import PriceChangeIcon from '@mui/icons-material/PriceChange';
import BoltIcon from '@mui/icons-material/Bolt';
import GitHubIcon from '@mui/icons-material/GitHub';
import EqualizerIcon from '@mui/icons-material/Equalizer';

import PublicIcon from '@mui/icons-material/Public';
import NumbersIcon from '@mui/icons-material/Numbers';
import PasswordIcon from '@mui/icons-material/Password';
import ContentCopy from "@mui/icons-material/ContentCopy";
import DnsIcon from '@mui/icons-material/Dns';
import WebIcon from '@mui/icons-material/Web';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { AmbossIcon , BitcoinSignIcon} from "./Icons";

import {
    CommunityDialog,
    ExchangeSummaryDialog,
    ProfileDialog,
} from './Dialogs';

import { getCookie } from "../utils/cookies";
import { pn } from "../utils/prettyNumbers";

class BottomBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            openStatsForNerds: false,
            openCommuniy: false,
            openExchangeSummary:false,
            openClaimRewards: false,
            num_public_buy_orders: 0,
            num_public_sell_orders: 0,
            book_liquidity: 0,
            active_robots_today: 0,
            maker_fee: 0,
            taker_fee: 0,
            last_day_nonkyc_btc_premium: 0,
            last_day_volume: 0,
            lifetime_volume: 0,
            robosats_running_commit_hash: '000000000000000',
            openProfile: false,
            profileShown: false,
            alternative_site: 'robosats...',
            node_id: '00000000',
            showRewards: false,
            referral_code: '',
            earned_rewards: 0,
            rewardInvoice: null,
            badInvoice: false,
            showRewardsSpinner: false,
            withdrawn: false,
        };
    }

    componentDidMount() {
        this.getInfo();
    }

    getInfo() {
        this.setState(null)
        fetch('/api/info/')
          .then((response) => response.json())
          .then((data) => this.setState(data)
          & this.setState({active_order_id: data.active_order_id ? data.active_order_id : null,
            last_order_id: data.last_order_id ? data.last_order_id : null})
          & this.props.setAppState({nickname:data.nickname, loading:false}));
      }

    handleClickOpenStatsForNerds = () => {
        this.setState({openStatsForNerds: true});
    };

    handleClickCloseStatsForNerds = () => {
        this.setState({openStatsForNerds: false});
    };

    StatsDialog =() =>{
        const { t } = this.props;
    return(
        <Dialog
        open={this.state.openStatsForNerds}
        onClose={this.handleClickCloseStatsForNerds}
        aria-labelledby="stats-for-nerds-dialog-title"
        aria-describedby="stats-for-nerds-description"
        >
        <DialogContent>
            <Typography component="h5" variant="h5">{t("Stats For Nerds")}</Typography>
            <List dense>
                <Divider/>
                <ListItem>
                    <ListItemIcon><BoltIcon/></ListItemIcon>
                    <ListItemText primary={this.state.lnd_version} secondary={t("LND version")}/>
                </ListItem>

                <Divider/>
                {this.state.network == 'testnet'?
                <ListItem>
                    <ListItemIcon><DnsIcon/></ListItemIcon>
                    <ListItemText secondary={this.state.node_alias}>
                         <Link target="_blank" href={"https://1ml.com/testnet/node/"
                        + this.state.node_id}>{this.state.node_id.slice(0, 12)+"... (1ML)"}
                        </Link>
                    </ListItemText>
                </ListItem>
                :
                <ListItem>
                    <ListItemIcon><AmbossIcon/></ListItemIcon>
                    <ListItemText secondary={this.state.node_alias}>
                            <Link target="_blank" href={"https://amboss.space/node/"
                        + this.state.node_id}>{this.state.node_id.slice(0, 12)+"... (AMBOSS)"}
                        </Link>
                    </ListItemText>
                </ListItem>
                }

                <Divider/>
                <ListItem>
                    <ListItemIcon><WebIcon/></ListItemIcon>
                    <ListItemText secondary={this.state.alternative_name}>
                        <Link target="_blank" href={"http://"+this.state.alternative_site}>{this.state.alternative_site.slice(0, 12)+"...onion"}
                        </Link>
                    </ListItemText>
                </ListItem>

                <Divider/>
                <ListItem>
                    <ListItemIcon><GitHubIcon/></ListItemIcon>
                    <ListItemText secondary={t("Currently running commit hash")}>
                        <Link target="_blank" href={"https://github.com/Reckless-Satoshi/robosats/tree/"
                        + this.state.robosats_running_commit_hash}>{this.state.robosats_running_commit_hash.slice(0, 12)+"..."}
                        </Link>
                    </ListItemText>
                </ListItem>

                <Divider/>
                <ListItem>
                    <ListItemIcon><EqualizerIcon/></ListItemIcon>
                    <ListItemText secondary={t("24h contracted volume")}>
                        <div style={{ cursor: "pointer", display:'flex',alignItems:'center', flexWrap:'wrap'}}>
                            {pn(this.state.last_day_volume)}
                            <BitcoinSignIcon sx={{width:14,height:14}} color={"text.secondary"}/>
                        </div>
                    </ListItemText>
                </ListItem>

                <Divider/>
                <ListItem>
                    <ListItemIcon><EqualizerIcon/></ListItemIcon>
                    <ListItemText secondary={t("Lifetime contracted volume")}>
                        <div style={{ cursor: "pointer", display:'flex',alignItems:'center', flexWrap:'wrap'}}>
                            {pn(this.state.lifetime_volume)}
                            <BitcoinSignIcon sx={{width:14,height:14}} color={"text.secondary"}/>
                        </div>
                    </ListItemText>
                </ListItem>

                <Divider/>
                <ListItem>
                    <ListItemIcon><PublicIcon/></ListItemIcon>
                    <ListItemText primary={
                        <div style={{display:'flex', alignItems:'center', justifyContent:'left', flexWrap:'wrap'}}>
                            <span>{t("Made with")+" "}</span>
                            <FavoriteIcon sx={{ color: "#FF0000", height: '22px',width: '22px'}}/>
                            <span>{" "+t("and")+" "}</span>
                            <BoltIcon sx={{ color: "#fcba03", height: '23px',width: '23px'}}/>
                        </div>}
                        secondary={t("... somewhere on Earth!")}/>
                </ListItem>
            </List>

            </DialogContent>
        </Dialog>
    )
    }

    handleClickOpenCommunity = () => {
        this.setState({openCommuniy: true});
    };
    handleClickCloseCommunity = () => {
        this.setState({openCommuniy: false});
    };

    handleClickOpenProfile = () => {
        this.getInfo();
        this.setState({openProfile: true, profileShown: true});
    };
    handleClickCloseProfile = () => {
        this.setState({openProfile: false});
    };

    handleSubmitInvoiceClicked=(rewardInvoice)=>{
        this.setState({
            badInvoice:false,
            showRewardsSpinner: true,
        });

        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type':'application/json', 'X-CSRFToken': getCookie('csrftoken'),},
            body: JSON.stringify({
              'invoice': rewardInvoice,
            }),
        };
        fetch('/api/reward/', requestOptions)
        .then((response) => response.json())
        .then((data) => console.log(data) & this.setState({
            badInvoice:data.bad_invoice,
            openClaimRewards: data.successful_withdrawal ? false : true,
            earned_rewards: data.successful_withdrawal ? 0 : this.state.earned_rewards,
            withdrawn: data.successful_withdrawal ? true : false,
            showRewardsSpinner: false,
        }));
    }

    getHost(){
        var url = (window.location != window.parent.location) ? this.getHost(document.referrer) : document.location.href;
        return url.split('/')[2]
      }

bottomBarDesktop =()=>{
    const { t } = this.props;
    var hasRewards = this.state.earned_rewards > 0 ? true: false;
    var hasOrder = this.state.active_order_id > 0 & !this.state.profileShown & this.props.avatarLoaded ? true : false;

    return(
        <Paper elevation={6} style={{height:40}}>
                {this.StatsDialog()}
                <Grid container>

                    <Grid item xs={1.9}>
                        <div style={{display: this.props.avatarLoaded ? '':'none'}}>
                        <ListItemButton onClick={this.handleClickOpenProfile} >
                            <Tooltip
                                open={hasRewards || hasOrder}
                                title={(hasRewards ? t("You can claim satoshis!")+" ": "" )+
                                    (hasOrder ? t("You have an active order"):"")}
                                >
                                <ListItemAvatar sx={{ width: 30, height: 30 }} >
                                    <Badge badgeContent={(this.state.active_order_id > 0 & !this.state.profileShown) ? "": null} color="primary">
                                    <Avatar className='flippedSmallAvatar' sx={{margin: 0, top: -13}}
                                        alt={this.props.nickname}
                                        imgProps={{
                                            onLoad:() => this.props.setAppState({avatarLoaded: true}),
                                        }}
                                        src={this.props.nickname ? window.location.origin +'/static/assets/avatars/' + this.props.nickname + '.png' : null}
                                        />
                                    </Badge>
                                </ListItemAvatar>
                            </Tooltip>
                            <ListItemText primary={this.props.nickname}/>
                        </ListItemButton>
                        </div>
                    </Grid>

                    <Grid item xs={1.9}>
                        <ListItem className="bottomItem">
                            <ListItemIcon size="small">
                                <IconButton onClick={this.handleClickOpenExchangeSummary}><InventoryIcon/></IconButton>
                            </ListItemIcon>
                            <ListItemText
                                primaryTypographyProps={{fontSize: '14px'}}
                                secondaryTypographyProps={{fontSize: '12px'}}
                                primary={this.state.num_public_buy_orders}
                                secondary={t("Public Buy Orders")} />
                        </ListItem>
                    </Grid>

                    <Grid item xs={1.9}>
                        <ListItem className="bottomItem">
                            <ListItemIcon size="small">
                            <IconButton onClick={this.handleClickOpenExchangeSummary}><SellIcon/></IconButton>
                            </ListItemIcon>
                            <ListItemText
                                primaryTypographyProps={{fontSize: '14px'}}
                                secondaryTypographyProps={{fontSize: '12px'}}
                                primary={this.state.num_public_sell_orders}
                                secondary={t("Public Sell Orders")} />
                        </ListItem>
                    </Grid>

                    <Grid item xs={1.9}>
                        <ListItem className="bottomItem">
                            <ListItemIcon size="small">
                            <IconButton onClick={this.handleClickOpenExchangeSummary}><SmartToyIcon/></IconButton>
                            </ListItemIcon>
                            <ListItemText
                                primaryTypographyProps={{fontSize: '14px'}}
                                secondaryTypographyProps={{fontSize: '12px'}}
                                primary={this.state.active_robots_today}
                                secondary={t("Today Active Robots")}/>
                        </ListItem>
                    </Grid>

                    <Grid item xs={1.9}>
                        <ListItem className="bottomItem">
                            <ListItemIcon size="small">
                                <IconButton onClick={this.handleClickOpenExchangeSummary}><PriceChangeIcon/></IconButton>
                            </ListItemIcon>
                            <ListItemText
                                primaryTypographyProps={{fontSize: '14px'}}
                                secondaryTypographyProps={{fontSize: '12px'}}
                                primary={this.state.last_day_nonkyc_btc_premium+"%"}
                                secondary={t("24h Avg Premium")} />
                        </ListItem>
                    </Grid>

                    <Grid item xs={1.5}>
                        <ListItem className="bottomItem">
                            <ListItemIcon size="small">
                            <   IconButton onClick={this.handleClickOpenExchangeSummary}><PercentIcon/></IconButton>
                            </ListItemIcon>
                            <ListItemText
                                primaryTypographyProps={{fontSize: '14px'}}
                                secondaryTypographyProps={{fontSize: '12px'}}
                                primary={(this.state.maker_fee + this.state.taker_fee)*100}
                                secondary={t("Trade Fee")} />
                        </ListItem>
                    </Grid>

                    <Grid container item xs={1}>
                        <Grid item xs={6}>
                            {this.LangSelect()}
                        </Grid>
                        <Grid item xs={3}>
                        <Tooltip enterTouchDelay={250} title={t("Show community and support links")}>
                            <IconButton
                            color="primary"
                            aria-label="Community"
                            onClick={this.handleClickOpenCommunity} >
                                <PeopleIcon />
                            </IconButton>
                        </Tooltip>
                        </Grid>
                        <Grid item xs={3}>
                            <Tooltip enterTouchDelay={250} title={t("Show stats for nerds")}>
                                <IconButton color="primary"
                                    aria-label="Stats for Nerds"
                                    onClick={this.handleClickOpenStatsForNerds} >
                                    <SettingsIcon />
                                </IconButton>
                            </Tooltip>
                        </Grid>

                    </Grid>
                </Grid>
            </Paper>
    )
}
    handleChangeLang=(e)=>{
        const { i18n } = this.props;
        i18n.changeLanguage(e.target.value)
    }

    LangSelect = () => {
        const { i18n} = this.props;
        return(
            <Select
                size = 'small'
                value = {i18n.resolvedLanguage.substring(0,2)}
                inputProps={{
                    style: {textAlign:"center"}
                }}
                onChange={this.handleChangeLang}>
                    <MenuItem value={'en'}>EN</MenuItem>
                    <MenuItem value={'es'}>ES</MenuItem>
                    <MenuItem value={'de'}>DE</MenuItem>
                    <MenuItem value={'pl'}>PL</MenuItem>
                    <MenuItem value={'fr'}>FR</MenuItem>
                    <MenuItem value={'ca'}>CA</MenuItem>
                    <MenuItem disabled={true} value={'ru'}>RU</MenuItem>
                    <MenuItem disabled={true} value={'zh'}>ZH</MenuItem>
                </Select>
        )
    }

    handleClickOpenExchangeSummary = () => {
        this.getInfo();
        this.setState({openExchangeSummary: true});
    };
    handleClickCloseExchangeSummary = () => {
        this.setState({openExchangeSummary: false});
    };

bottomBarPhone =()=>{
    const { t } = this.props;
    var hasRewards = this.state.earned_rewards > 0 ? true: false;
    var hasOrder = this.state.active_order_id > 0 & !this.state.profileShown & this.props.avatarLoaded ? true : false;
    return(
        <Paper elevation={6} style={{height:40}}>
                {this.StatsDialog()}
                <Grid container>

                    <Grid item xs={1.6}>
                    <div style={{display: this.props.avatarLoaded ? '':'none'}}>
                    <Tooltip open={hasRewards || hasOrder}
                            title={(hasRewards ? t("You can claim satoshis!")+" ": "" )+
                                (hasOrder ? t("You have an active order"):"")}>
                        <IconButton onClick={this.handleClickOpenProfile} sx={{margin: 0, bottom: 17, right: 8}} >
                            <Badge badgeContent={(this.state.active_order_id >0 & !this.state.profileShown) ? "": null} color="primary">
                                <Avatar className='phoneFlippedSmallAvatar'
                                sx={{ width: 55, height:55 }}
                                alt={this.props.nickname}
                                imgProps={{
                                    onLoad:() => this.props.setAppState({avatarLoaded: true}),
                                }}
                                src={this.props.nickname ? window.location.origin +'/static/assets/avatars/' + this.props.nickname + '.png' : null}
                                />
                            </Badge>
                        </IconButton>
                    </Tooltip>
                    </div>
                    </Grid>

                    <Grid item xs={1.6} align="center">
                        <Tooltip enterTouchDelay={300} title={t("Number of public BUY orders")}>
                            <IconButton onClick={this.handleClickOpenExchangeSummary} >
                            <Badge badgeContent={this.state.num_public_buy_orders}  color="action">
                                <InventoryIcon />
                            </Badge>
                            </IconButton>
                        </Tooltip>
                    </Grid>

                    <Grid item xs={1.6} align="center">
                        <Tooltip enterTouchDelay={300} title={t("Number of public SELL orders")}>
                            <IconButton onClick={this.handleClickOpenExchangeSummary} >
                            <Badge badgeContent={this.state.num_public_sell_orders}  color="action">
                                <SellIcon />
                            </Badge>
                            </IconButton>
                        </Tooltip>
                    </Grid>

                    <Grid item xs={1.6} align="center">
                        <Tooltip enterTouchDelay={300} title={t("Today active robots")}>
                            <IconButton onClick={this.handleClickOpenExchangeSummary} >
                            <Badge badgeContent={this.state.active_robots_today}  color="action">
                                <SmartToyIcon />
                            </Badge>
                            </IconButton>
                        </Tooltip>
                    </Grid>

                    <Grid item xs={1.8} align="center">
                        <Tooltip enterTouchDelay={300} title={t("24h non-KYC bitcoin premium")}>
                            <IconButton onClick={this.handleClickOpenExchangeSummary} >
                            <Badge badgeContent={this.state.last_day_nonkyc_btc_premium+"%"}  color="action">
                                <PriceChangeIcon />
                            </Badge>
                            </IconButton>
                        </Tooltip>
                    </Grid>

                    <Grid container item xs={3.8}>
                        <Grid item xs={6}>
                            {this.LangSelect()}
                        </Grid>
                        <Grid item xs={3}>
                        <Tooltip enterTouchDelay={250} title={t("Show community and support links")}>
                            <IconButton
                            color="primary"
                            aria-label="Community"
                            onClick={this.handleClickOpenCommunity} >
                                <PeopleIcon />
                            </IconButton>
                        </Tooltip>
                        </Grid>
                        <Grid item xs={3}>
                        <Tooltip enterTouchDelay={250} title={t("Show stats for nerds")}>
                            <IconButton color="primary"
                                aria-label="Stats for Nerds"
                                onClick={this.handleClickOpenStatsForNerds} >
                                <SettingsIcon />
                            </IconButton>
                        </Tooltip>
                        </Grid>

                    </Grid>
                </Grid>
            </Paper>
    )
}

    render() {
        return (
            <div>
                <CommunityDialog
                    isOpen={this.state.openCommuniy}
                    handleClickCloseCommunity={this.handleClickCloseCommunity}
                />

                <ExchangeSummaryDialog
                    isOpen={this.state.openExchangeSummary}
                    handleClickCloseExchangeSummary={this.handleClickCloseExchangeSummary}
                    numPublicBuyOrders={this.state.num_public_buy_orders}
                    numPublicSellOrders={this.state.num_public_sell_orders}
                    bookLiquidity={this.state.book_liquidity}
                    activeRobotsToday={this.state.active_robots_today}
                    lastDayNonkycBtcPremium={this.state.last_day_nonkyc_btc_premium}
                    makerFee={this.state.maker_fee}
                    takerFee={this.state.taker_fee}
                />

                <ProfileDialog
                    isOpen={this.state.openProfile}
                    handleClickCloseProfile={this.handleClickCloseProfile}
                    nickname={this.props.nickname}
                    activeOrderId={this.state.active_order_id}
                    lastOrderId={this.state.last_order_id}
                    referralCode={this.state.referral_code}
                    handleSubmitInvoiceClicked={this.handleSubmitInvoiceClicked}
                    host={this.getHost()}
                    showRewardsSpinner={this.state.showRewardsSpinner}
                    withdrawn={this.state.withdrawn}
                    badInvoice={this.state.badInvoice}
                    earnedRewards={this.state.earned_rewards}
                    setAppState={this.props.setAppState}
                />

                <MediaQuery minWidth={1200}>
                    {this.bottomBarDesktop()}
                </MediaQuery>

                <MediaQuery maxWidth={1199}>
                    {this.bottomBarPhone()}
                </MediaQuery>
            </div>
        )
    }
}

export default withTranslation()(BottomBar);
