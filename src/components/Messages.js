// @flow

import React from 'react';
import type { IMessage } from '../entities/index';
import type { RootState } from '../createStore';
import Message from './Message';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { spring, TransitionMotion } from 'react-motion';

type MessagesProps = {
    messages: IMessage[]
};

const mapStateToProps = ({ messages }: RootState) => ({ messages });

const MessagesContainer = styled.div`
    position: fixed;
    top: 6.4rem;
    z-index: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    width:100%;
`;

const Messages = (props: MessagesProps) => (
    <MessagesContainer>
        <TransitionMotion
            styles={props.messages.map((message: IMessage, index: number) => ({
                key: index,
                data: {
                    ...message
                },
                style: {
                    opacity: spring(1),
                },
            }))}
            willLeave={() => ({
                opacity: spring(0),
            })}
            willEnter={() => ({
                opacity: 0,
            })}>
            {styles => (
                <div>
                    {styles.map((style) => (
                        <div key={style.key}
                            style={{
                                opacity: style.style.opacity,
                            }}>
                            <Message message={style.data}/>
                        </div>
                    ))}
                </div>
            )}
        </TransitionMotion>
    </MessagesContainer>
);

export default connect(mapStateToProps)(Messages);
