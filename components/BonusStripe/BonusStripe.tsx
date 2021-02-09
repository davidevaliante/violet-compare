import React, { useContext } from 'react'
import styled from 'styled-components'
import { FunctionComponent } from 'react';
import { Bonus } from './../../graphql/schema';
import LazyBonusImage from '../Lazy/LazyBonusImage';
import { injectCDN } from './../../utils/Utils';
import snakeCase from 'lodash';
import LazyImage from '../Lazy/LazyImage';
import Link from 'next/link';
import { countryContext } from './../../context/CountryContext';
import { StreamerBonus } from '../../models/streamer';
import { configuration } from '../../configuration';
import { desktop } from '../Responsive/Breakpoints';
import Router from 'next/router'

interface Props {
    bonus: StreamerBonus
    eng?: boolean,
    countryCode: string
}

const BonusStripe: FunctionComponent<Props> = ({ bonus, eng = false, countryCode }) => {

    console.log(bonus)

    const { currentCountry } = useContext(countryContext)

    const visit = () => {
        const linkToOpen = extractLink()
        if(linkToOpen.includes('leovegas')) Router.push('/visita/leovegas')
        if(linkToOpen.includes('starvegas')) Router.push('/visita/starvegas')
        window.open(extractLink())
    }

    const extractNoDepositText = () => {
        const texts = bonus.noDepositDescription
        const matchingText = texts.find(it => it.label === countryCode)
        if(matchingText) return matchingText.description
        else {
            const toReturn  = texts.find(it => it.label === 'row')
            if(toReturn) return toReturn.description
            else return ''
        } 
    }

    const extractWithDepositText = () => {
        const texts = bonus.withDepositDescription
        const matchingText = texts.find(it => it.label === countryCode)
        if(matchingText) return matchingText.description
        else {
            const toReturn  = texts.find(it => it.label === 'row')
            if(toReturn) return toReturn.description
            else return ''
        } 
    }

    const extractLink = () => {
        const links = bonus.links
        const matchingLink = links.find(it => it.label === `${bonus.compareCode} ${configuration.streamerName} ${countryCode}`)
        if(matchingLink) return matchingLink.link
        else {
            const toReturn =  links.find(it => it.label === `${bonus.compareCode} ${configuration.streamerName} row`)
            if(toReturn) return toReturn.link
            else return ''
        }
    }

    return (
        <Container>
            <Row onClick={() => visit()}>
                <LazyBonusImage
                    width={50}
                    height={50}
                    borderColor={bonus.borderColor}
                    src={`${configuration.api}${bonus.circularImage.url}`} />
                <div className='name-container'>
                    <h2>{bonus.name}</h2>
                    <StarContainer>
                        {[...Array(bonus.rating).keys()].map((s, i) => <img key={`${snakeCase(bonus.name)}_${i}_start_full`} alt='full_star_icon' className='star' src='/icons/star_full.svg' />)}
                        {[...Array(5 - bonus.rating).keys()].map((s, i) => <img key={`${snakeCase(bonus.name)}_${i}_start_empty`} alt='empty_star_icon' className='star' src='/icons/star_empty.svg' />)}
                    </StarContainer>
                </div>
                {/* <LazyImage width={30} height={30} src='/icons/italy_flag.svg' /> */}
            </Row>

            <RowDeposit onClick={() => visit()}>
                <div className='deposit-container'>
                    <h3>{!eng ? 'No Deposit' : 'No Deposit'}</h3>
                    <p>{extractNoDepositText()}</p>
                </div>

                <div className='deposit-container'>
                    <h3>{!eng ? 'With Deposit' : 'With Deposit'}</h3>
                    <p>{extractWithDepositText()}</p>
                </div>
            </RowDeposit>

            <Row style={{ marginTop: '.5rem' }}>
                {/* {bonus.bonus_guide && !eng && <GuideButton onClick={() => window.open(`https://www.spikeslot.com/guida/${bonus.bonus_guide!.slug}/${countryCode ? countryCode : currentCountry}`)}>
                    {!eng ? 'READ THE GUIDE' : 'READ THE GUIDE'}
                </GuideButton>} */}

                <WebSiteButton onClick={() => visit()}>
                    {!eng ? 'VISIT THE WEBSITE' : 'VISIT THE WEBSITE'}
                </WebSiteButton>
            </Row>
        </Container>
    )
}

const GuideButton = styled.div`
    cursor : pointer;
    border : 2px solid ${(props) => props.theme.colors.primary};
    padding : .5rem 1rem;
    width : 35%;
    text-align : center;
    font-weight : bold;
    color : ${(props) => props.theme.colors.primary};
    border-radius : 4px;
    max-width : 145px;
`

const WebSiteButton = styled.div`
    cursor : pointer;
    background : ${(props) => props.theme.colors.secondary};
    border : 2px solid ${(props) => props.theme.colors.secondary};
    padding : .5rem 1rem;
    width : 35%;
    text-align : center;
    color : white;
    font-weight : bold;
    border-radius : 4px;
`

const StarContainer = styled.div`
    display : flex;
    justify-content : flex-start;
    width: 100%;

    .star {
        width : 16px;
        height :16px;
    }
`

const Row = styled.div`
    display : flex;
    justify-content : center;
    margin : 0rem 1rem;
    align-items : center;
    flex-grow : 1;
    margin-bottom : 1rem;
    width : 280px;

    ${desktop}{
        margin-bottom : 0rem;
    }

    h2{
        text-align : start;
    }

    .name-container{
        flex-grow:1;
        margin-left : 2rem;

        h2{
            color : ${props => props.theme.colors.secondary};
        }
    }
`

const RowDeposit = styled.div`
    display : flex;
    justify-content : space-between;
    flex-grow : 1;
    padding : .5rem;
    margin-top : .4rem;

    margin-bottom : 1rem;

    ${desktop}{
        margin-bottom : 0rem;
    }

    .deposit-container{
        width : 45%;
    }

    h3{
        color : grey;
        font-weight : bold;
        font-size : .8rem;
        margin-bottom : .2rem;
    }

    p{
        color : black;
        font-weight : bold;
        line-height : 1.2rem;
    }
`

const Container = styled.div`
    display : flex;
    justify-content : space-around;
    flex-wrap : wrap;
    border  :1px solid ${(props) => props.theme.colors.primary};;
    padding : 1rem;
    margin : 1rem;
    background : #ffffff;
    border-radius : 8px;
    box-shadow: 3px 3px 5px 0px rgba(50, 50, 50, 0.75);
    a{
        all : unset;
        color : ${(props) => props.theme.colors.primary};
    }

    h2{
        font-weight : bold;
        font-size : 1.3rem;
        margin-bottom : .4rem;
    }
`

export default BonusStripe
