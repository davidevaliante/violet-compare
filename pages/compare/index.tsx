import React, { FunctionComponent, useEffect, useContext } from 'react'
import AquaClient from './../../graphql/aquaClient';
import { BONUSES_BY_NAME, STREAMER_BY_ID } from './../../graphql/queries/bonus';
import { Bonus } from '../../graphql/schema';
import styled from 'styled-components';
import { tablet } from '../../components/Responsive/Breakpoints';
import { initializeAnalytics } from './../../analytics/base';
import { cookieContext } from '../../context/CookieContext';
import CookieDisclaimer from '../../components/CookieDisclaimer/CookieDisclaimer';
import VideoDiscalimer from '../../components/VideoDisclaimer/VideoDisclaimer';
import BonusStripe from '../../components/BonusStripe/BonusStripe';
import { Streamer, StreamerBonus } from './../../models/streamer';
import {configuration} from '../../configuration'
import axios from 'axios';
import  Router  from 'next/router';
import lowerCase  from 'lodash/lowerCase'
import { useState } from 'react';
import { CircularProgress } from '@material-ui/core';
import FullPageLoader from './../../components/FullPageLoader';
import Wrapper from '../../components/Layouts/Wrapper';
import Container from '../../components/Layouts/Container';

interface Props {
    streamerData : Streamer
    bonusToShow : string[]
}

const Compare: FunctionComponent<Props> = ({ streamerData, bonusToShow }) => {

    console.log(bonusToShow)

    const [country, setCountry] = useState<string | undefined>(undefined)
    const [bonuses, setBonuses] = useState<StreamerBonus[] | undefined>(undefined)

  
    useEffect(() => {
        geoLocate()
    }, [])

    const geoLocate = async () => {
        const geolocation = await axios.get('https://ipapi.co/json/')
        const { country_code } = geolocation.data
        getBonusByName()
        if(country_code) setCountry(lowerCase(country_code))
    }

    const getBonusByName = () => {
        const streamerBonuses = streamerData.bonuses
        const placeholder : StreamerBonus[] = []

        bonusToShow.forEach((bonusCode) =>{
            const b = streamerBonuses.find(b => b.compareCode === bonusCode)
            if(b) placeholder.push(b)
        })

        setBonuses(placeholder)
        console.log(placeholder, 'bonus to show')
    }
    

    if(!country) return <FullPageLoader />
    return (
        <Wrapper>
            <Container>
                <div className='top-bar'>
                    <img className='logo' src='/icons/app_icon.png' />
                </div>

                <h1>Top Casino choice for this Slot Machine</h1>

                {bonuses && bonuses.length > 2 && bonuses.map((bonus : StreamerBonus) => <BonusStripe key={`${bonus.name}`} bonus={bonus} countryCode={country} />)}

                {bonuses && bonuses.length <= 2 && streamerData.bonuses.map((bonus : StreamerBonus) => <BonusStripe key={`${bonus.name}`} bonus={bonus} countryCode={country} />)}

                <div style={{ padding: '1rem' }}>
                    <VideoDiscalimer />
                </div>
                <div className='bottom'>
                    <p style={{textAlign : 'center'}}>This service is provided by <a href='https://www.topaffiliation.com'>Top Affiliation</a></p>
                </div>
            </Container>
        </Wrapper>
    )

}


export async function getServerSideProps({ query }) {

    const pickedBonus = query.options

    const aquaClient = new AquaClient()


    const bonusToShow = pickedBonus.split('-')

    const streamer = await axios.get(`${configuration.api}/streamers/${configuration.streamerId}`)
   
    return {
        props: {
            streamerData : streamer.data as Streamer,
            bonusToShow : bonusToShow,
        }
    }
}

export default Compare
