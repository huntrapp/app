// @flow

import React from 'react';
import type { ICard } from '../../entities/index';
import Source from '../Source';
import styled from 'styled-components';
import ProgressiveImage from '../ProgressiveImage';
import Raven from 'raven-js';
import Vibrant from 'node-vibrant';
import { setColor } from '../../redux/colors';
import type { RootState } from '../../createStore';
import { connect } from 'react-redux';

type ProductHuntProps = {
    card: ICard,
    color: string,
    setColor: Function
};

const mapDispatchToProps = (dispatch: Function) => ({
    setColor: (url: string, color: string) => dispatch(setColor(url, color)),
});

const mapStateToProps = ({ colors }: RootState, { card: { data } }: ProductHuntProps) => ({
    color: data.image in colors ? colors[data.image] : null,
});

const ProductHuntHolder = styled.div`
    display:flex;
    flex-direction:column;
    top:0;
    left:0
    right:0;
    bottom:0;
    position:absolute;
    z-index:4;
`;

const ProductHuntText = styled.div`
    padding:1.6rem;
    position:relative;
    color: white;
    
    h1 {
        font-size:${props => props.size === 'small' ? '2.2' : '2.4'}rem;
        font-weight:bold;
        -webkit-line-clamp: 2;
        margin-bottom:.5em;
        line-height: ${props => props.size === 'small' ? '2.2' : '2.4'}rem;
    }
    
    p {
        margin-top:.5em;
        font-size:${props => props.size === 'small' ? '1.4' : '1.6'}rem;
        -webkit-line-clamp: 3;
        line-height: ${props => props.size === 'small' ? '1.6' : '1.8'}rem;
    }
    
    p, h1 {
        overflow:hidden;
        -webkit-box-orient: vertical;
        display: -webkit-box;
    }
`;

const ProductHunt = (props: ProductHuntProps) => (
    <div>
        <ProgressiveImage
            src={props.card.data.image}
            placeholder={props.card.data.thumb}
            fallbackSeed={props.card._id}
            onFullLoad={async (element: HTMLImageElement) => {
                if (!props.color) {
                    const vibrant = Vibrant.from(element);
                    try {
                        const palette = await vibrant.getPalette();
                        const swatch = palette.DarkVibrant || palette.Muted || null;
                        if (swatch) {
                            props.setColor(element.src, swatch.getHex());
                        }
                    } catch (ex) {
                        console.error(ex); // eslint-disable-line no-console
                        Raven.captureException(ex);
                    }
                }
            }}
            crossOrigin="anonymous"
            background
            blendWith={props.color}/>
        <ProductHuntHolder>
            <Source logoElement={productHuntLogo} description={props.card.title} color="#da552f"/>
            <div style={{ flexGrow: 1 }}/>
            <ProductHuntText size={props.card.size}>
                <h1>{caret} {props.card.score}</h1>
                <p>{props.card.data.tagline}</p>
            </ProductHuntText>
        </ProductHuntHolder>
    </div>
);

const caret = (
    <svg width="12" height="12" viewBox="0 0 14 14">
        <g id="Canvas" transform="translate(-4828 -4785)">
            <g id="Polygon 2">
                <path id="path0_fill" d="M 8 0L 14.9282 13.5L 1.0718 13.5L 8 0Z" transform="translate(4827 4785)"
                    fill="#FFFFFF"/>
            </g>
        </g>
    </svg>
);

const productHuntLogo = (
    <svg width="18" height="18" viewBox="0 0 12 12">
        <title>producthunt</title>
        <desc>Created using Figma</desc>
        <g id="Canvas" transform="translate(-1039 -723)">
            <g id="producthunt">
                <path transform="translate(1044.25 727.35)" fill="#FFFFFF" fillRule="evenodd"
                    d="M 1.5 9.9476e-14L -7.13393e-06 0L 0 0.15L 0 1.65L 1.55025 1.65C 1.66294 1.65788 1.77603 1.64233 1.88241 1.60431C 1.98878 1.5663 2.08612 1.50665 2.16829 1.42914C 2.25046 1.35162 2.31567 1.25792 2.35981 1.15394C 2.40395 1.04995 2.42606 0.937954 2.42475 0.825C 2.42475 0.32775 2.25 9.9476e-14 1.5 9.9476e-14Z"/>
                <path id="path1_fill"
                    d="M 6 1.66533e-16C 4.81331 7.91034e-16 3.65328 0.351894 2.66658 1.01118C 1.67989 1.67047 0.910851 2.60754 0.456725 3.7039C 0.00259969 4.80025 -0.11622 6.00665 0.115291 7.17054C 0.346802 8.33443 0.918247 9.40352 1.75736 10.2426C 2.59648 11.0818 3.66557 11.6532 4.82946 11.8847C 5.99335 12.1162 7.19974 11.9974 8.2961 11.5433C 9.39246 11.0891 10.3295 10.3201 10.9888 9.33342C 11.6481 8.34672 12 7.18669 12 6C 12 4.4087 11.3679 2.88258 10.2426 1.75736C 9.11742 0.632141 7.5913 9.99201e-16 6 0L 6 1.66533e-16ZM 6.80025 7.2L 5.1 7.2L 5.1 9L 3.9 9L 3.9 3L 6.80025 3C 7.07603 3 7.3491 3.05432 7.60389 3.15985C 7.85867 3.26539 8.09017 3.42007 8.28518 3.61507C 8.48018 3.81008 8.63486 4.04158 8.7404 4.29636C 8.84593 4.55115 8.90025 4.82422 8.90025 5.1C 8.90025 5.37577 8.84593 5.64885 8.7404 5.90363C 8.63486 6.15842 8.48018 6.38992 8.28518 6.58492C 8.09017 6.77993 7.85867 6.93461 7.60389 7.04015C 7.3491 7.14568 7.07603 7.2 6.80025 7.2Z"
                    transform="translate(1039 723)" fill="#FFFFFF"/>
            </g>
        </g>
        <defs>

            <path id="path1_fill"
                d="M 6 1.66533e-16C 4.81331 7.91034e-16 3.65328 0.351894 2.66658 1.01118C 1.67989 1.67047 0.910851 2.60754 0.456725 3.7039C 0.00259969 4.80025 -0.11622 6.00665 0.115291 7.17054C 0.346802 8.33443 0.918247 9.40352 1.75736 10.2426C 2.59648 11.0818 3.66557 11.6532 4.82946 11.8847C 5.99335 12.1162 7.19974 11.9974 8.2961 11.5433C 9.39246 11.0891 10.3295 10.3201 10.9888 9.33342C 11.6481 8.34672 12 7.18669 12 6C 12 4.4087 11.3679 2.88258 10.2426 1.75736C 9.11742 0.632141 7.5913 9.99201e-16 6 0L 6 1.66533e-16ZM 6.80025 7.2L 5.1 7.2L 5.1 9L 3.9 9L 3.9 3L 6.80025 3C 7.07603 3 7.3491 3.05432 7.60389 3.15985C 7.85867 3.26539 8.09017 3.42007 8.28518 3.61507C 8.48018 3.81008 8.63486 4.04158 8.7404 4.29636C 8.84593 4.55115 8.90025 4.82422 8.90025 5.1C 8.90025 5.37577 8.84593 5.64885 8.7404 5.90363C 8.63486 6.15842 8.48018 6.38992 8.28518 6.58492C 8.09017 6.77993 7.85867 6.93461 7.60389 7.04015C 7.3491 7.14568 7.07603 7.2 6.80025 7.2Z"/>
        </defs>
    </svg>
);

export default connect(mapStateToProps, mapDispatchToProps)(ProductHunt);
