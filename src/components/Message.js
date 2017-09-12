// @flow

import React from 'react';
import type { IMessage } from '../entities/index';
import styled from 'styled-components';
import cloudOffIcon from 'react-icons/lib/md/cloud-off';
import checkIcon from 'react-icons/lib/md/check';
import warningIcon from 'react-icons/lib/md/warning';

type MessageProps = {
    message: IMessage
};

const iconMap = {
    'cloud_off': cloudOffIcon,
    'check': checkIcon,
    'warning': warningIcon,
};

const MessageContainer = styled.div`
    margin: .7rem;
    max-width:100%;
    background-color: ${(props: IMessage) => props.type === 'error' ? '#f45a4f' : '#202020'};
    color: #FFF;
    display: flex;
    padding:1rem;
    border-radius: 5rem;
    font-size: 1.4rem;
    
    p {
        margin-left: .5rem;
    }
`;

const Message = (props: MessageProps) => {
    const Icon = props.message.icon && iconMap[props.message.icon];
    return (
        <MessageContainer {...props.message}>
            {Icon && <Icon/>}
            <p>{props.message.text}</p>
        </MessageContainer>
    );
};

export default Message;
