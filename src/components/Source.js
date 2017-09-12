// @flow

import React from 'react';
import type { Element } from 'react';
import styled from 'styled-components';

const DefaultLogo = styled.span`
    display: inline-block;
    background-color: rgba(0, 0, 0, 0.38);
    height: 24px;
    width: 24px;
`;

const DefaultLogoInner = styled.span`
    display: inline-block;
    margin: 2px;
    height: 20px;
    width: 20px;
    background-color: white;
    border-radius: 24px;
`;

export type SourceProps = {
    description: string,
    color?: string,
    logoElement?: ?Element<*>,
    style?: any
};

const SourceContainer = styled.div`
    width: 100%;
    height: 4rem;
    background-color:${props => props.color};
    display: flex;
    padding:0 1rem;
`;

const SourceText = styled.span`
    color: white;
    font-size: 1.6rem;
    line-height: 4rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    flex-grow: 1;
`;

const SourceIcon = styled.span`
    display: inline-block;
    display: flex;
    align-items: center;
    margin-left: 1rem;
`;

const Source = (props: SourceProps) => (
    <SourceContainer color={props.color} style={props.style}>
        <SourceText>{props.description}</SourceText>
        <SourceIcon>
            {props.logoElement}
        </SourceIcon>
    </SourceContainer>
);

Source.defaultProps = {
    logoElement: (
        <DefaultLogo>
            <DefaultLogoInner/>
        </DefaultLogo>
    ),
    color: 'rgba(143, 143, 148, 0.75)',
};

export default Source;
