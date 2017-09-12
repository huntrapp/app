// @flow

import React from 'react';
import type { ICard } from '../../entities/index';
import Source from '../Source';
import styled from 'styled-components';

type DefaultContentProps = {
    card: ICard
};

const DefaultContentContainer = styled.div`
    height:100%;
    
    &:before {
        content:"";
        display:block;
        background-color: rgba(0, 0, 0, 0.50);
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
    }
`;

const DefaultContentHolder = styled.div`
    display:flex;
    flex-direction:column;
    height:100%;
    position:relative;
    z-index:4;
`;

const DefaultContentText = styled.div`
    padding:16px;
    flex-grow:1;
    position:relative;
    color: white;
    
    h1 {
        font-size:${props => props.size === 'small' ? '1.8' : '2'}rem;
        font-weight:bold;
        -webkit-line-clamp: 2;
        margin-bottom:.5em;
        line-height: ${props => props.size === 'small' ? '2' : '2.2'}rem;
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

const DefaultContent = (props: DefaultContentProps) => (
    <DefaultContentContainer>
        <DefaultContentHolder>
            <DefaultContentText size={props.card.size}>
                <h1>{props.card.title}</h1>
                {/* <p>Card description</p> */}
            </DefaultContentText>
            <Source description={`From ${props.card.type}`}/>
        </DefaultContentHolder>
    </DefaultContentContainer>
);

export default DefaultContent;
