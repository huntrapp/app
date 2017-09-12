// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import type { FeedState } from '../redux/feed';
import { getFeed } from '../redux/feed';
import Card from './Card';
import { spring, TransitionMotion } from 'react-motion';
import type { ICard } from '../entities';
import breakpoints from '../constants/breakpoints';
import CloudOffIcon from 'react-icons/lib/md/cloud-off';
import Button from './Button';

const INFINITE_SCROLL_OFFSET = 100;

const FeedContainer = styled.div`
    display: grid;
    grid-auto-flow: dense;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr 1fr 1fr 1fr 1fr;
    margin:.5rem;
    position: relative;
    height: calc(100vh - 4.8rem);
    overflow: auto;
    
    @media(min-width: ${breakpoints.M}px) and (max-width:${breakpoints.L - 1}px) {
        grid-template-columns: 1fr 1fr 1fr;
    }
    
    @media(min-width: ${breakpoints.L}px) and (max-width: ${breakpoints.XL - 1}px) {
        grid-template-columns: 1fr 1fr 1fr 1fr;
    }
    
    @media(min-width: ${breakpoints.XL}px) and (max-width: ${breakpoints.XXL - 1}px) {
        grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
    }
    
    @media(min-width: ${breakpoints.XXL}px) {
        grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
    }
`;

const FeedError = styled.div`
    height: 100%;
    width: 100%;
    display:flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    
    h1 {
        font-size: 2.2rem;
        margin: 0.8rem 0;
        margin-top: 2rem;
    }
    
    p {
        font-size: 1.8rem;
        color: rgba(0, 0, 0, 0.50);
        margin:0.8rem 0;
        margin-bottom: 2rem;
    }
`;

const reloadIcon = (
    <svg width="16" height="16" viewBox="0 0 16 16" style={{ position: 'relative', top: 2 }}>
        <path fill="#000" id="path0_fill"
            d="M 13.64 2.35C 12.19 0.9 10.2 0 7.99 0C 3.57 0 2.28882e-07 3.58 2.28882e-07 8C 2.28882e-07 12.42 3.57 16 7.99 16C 11.72 16 14.83 13.45 15.72 10L 13.64 10C 12.82 12.33 10.6 14 7.99 14C 4.68 14 1.99 11.31 1.99 8C 1.99 4.69 4.68 2 7.99 2C 9.65 2 11.13 2.69 12.21 3.78L 8.99 7L 15.99 7L 15.99 0L 13.64 2.35Z"/>
    </svg>
);

type FeedProps = {
    feed: FeedState,
    token: string,
    getFeed: (token: string, page: ?number) => void
};

@connect(
    ({ feed, token }) => ({ feed, token }),
    dispatch => ({
        getFeed: (token: string, page = 1) => dispatch(getFeed(token, page)),
    }),
)
class Feed extends Component {
    props: FeedProps;
    feedContainerBounds: ClientRect;
    feedContainer: HTMLElement;

    componentDidMount () {
        this.props.getFeed(this.props.token);
        window.addEventListener('resize', this.onResize);
    }

    componentWillUnmount () {
        window.removeEventListener('resize', this.onResize);
        if (this.feedContainer) {
            this.feedContainer.removeEventListener('scroll', this.onScroll);
        }
    }

    onResize = () => {
        if (this.feedContainerBounds) {
            this.feedContainerBounds = this.feedContainer.getBoundingClientRect();
        }
    };

    debounce: ?number = null;

    onScroll = () => {
        if (this.debounce) {
            clearTimeout(this.debounce);
        }
        this.debounce = setTimeout(() => {
            if ((window.scrollY + window.innerHeight) > (this.feedContainerBounds.bottom - INFINITE_SCROLL_OFFSET) &&
                this.props.feed.items.pages >= this.props.feed.items.page &&
                !this.props.feed.isLoading) {
                this.props.getFeed(this.props.token, this.props.feed.items.page + 1);
            }
        }, 2000);
    };

    render () {
        const { items: { docs }, error } = this.props.feed;
        return (
            <div style={{ height: '100%' }}>
                {error && docs.length === 0 && (
                    <FeedError>
                        <CloudOffIcon width="80px" height="80px"/>
                        <h1>Unable to connect to Quarry's servers</h1>
                        <p>Check your internet connection</p>
                        <Button primary icon={reloadIcon} onClick={() => this.props.getFeed(this.props.token)}>
                            Try again
                        </Button>
                    </FeedError>
                )}

                {!error && docs.length > 0 && (
                    <TransitionMotion
                        styles={docs.map((doc: ICard, index: number) => ({
                            key: index,
                            style: {
                                translateY: spring(0),
                                opacity: spring(1),
                            },
                            data: {
                                doc,
                            },
                        }))}
                        willEnter={() => ({
                            translateY: 180,
                            opacity: 0,
                        })}>
                        {styles => (
                            <FeedContainer innerRef={(feedContainer: HTMLElement) => {
                                this.feedContainer = feedContainer;
                                if (feedContainer) {
                                    this.feedContainerBounds = feedContainer.getBoundingClientRect();
                                    feedContainer.addEventListener('scroll', this.onScroll);
                                }
                            }}>
                                {styles.map((config) =>
                                    <Card key={config.key} card={config.data.doc} style={{
                                        opacity: config.style.opacity,
                                        transform: `translateY(${config.style.translateY}px)`,
                                    }}/>,
                                )}
                            </FeedContainer>
                        )}
                    </TransitionMotion>
                )}
            </div>
        );
    }
}

export default Feed;
