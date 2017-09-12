// @flow

import React from 'react';
import styled from 'styled-components';

type ButtonProps = {
    icon?: React.Element<*>,
    children?: React.Element<*>,
    primary?: boolean,
    onClick?: (e: MouseEvent) => void
};

const ButtonContainer = styled.button`
    line-height: 4rem;
    padding:0 2rem;
    border-radius: 40px;
    transition: background 0.25s;
    background: ${props => props.primary ? '#ebeced' : 'none'};
    font-size: 1.6rem;
    border: none;
    
    &:hover {
        cursor: pointer;
        background: ${props => props.primary ? '#dcddde' : 'none'};        
    }
`;

const ButtonIcon = styled.span`
    margin-right: 0.8rem;
`;

const Button = (props: ButtonProps) => (
    <ButtonContainer {...props}>
        {props.icon && <ButtonIcon>{props.icon}</ButtonIcon>}
        {props.children}
    </ButtonContainer>
);

export default Button;
