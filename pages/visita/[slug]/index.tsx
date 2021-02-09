import React from 'react'
import AquaClient from '../../../graphql/aquaClient'
import Head from 'next/head'
import { FunctionComponent } from 'react';

interface Props {
    redirect: string
}

export const GET_BONUS_BY_SLUG = `
    query GET_BONUS_BY_SLUG($slug:String){
        bonuses(where:{ slug: $slug, country: {code:"it"}}){
        id
        name
        country{
          code
        }
        bonus_guide{
          slug
        }
        rating
        withDeposit
        noDeposit
        backgroundColor
        borderColor
        link
        description
        legacyId
        circular_image{
            url
        }
        }   
    }
`

const index: FunctionComponent<Props> = ({ redirect }) => {

    console.log('redirecting to unibt')
    return (
        <div>
            <Head>
                <meta httpEquiv='refresh' content={`0.1;url=${redirect}`}></meta>
            </Head>
        </div>
    )
}

// unibet https://dspk.kindredplc.com/redirect.aspx?pid=5615153&bid=27508

export async function getServerSideProps({ query, res }) {


    const slug = query.slug as string

    let redirect

    if (slug === 'starvegas') redirect = 'https://www.starvegas.it/gmg/refer/5ee3b2e8e32951000129f2d7'
    if (slug === 'leovegas') redirect = 'https://ads.leovegas.com/redirect.aspx?pid=3701288&bid=14965'


    return {
        props: {
            redirect
        }
    }
}

export default index
