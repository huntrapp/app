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
    
    @media(min-width: ${breakpoints.XL}px) and (max-width: ${breakpoints.XXL -1}px) {
        grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
    }
    
    @media(min-width: ${breakpoints.XXL}px) {
        grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
    }
`;

type FeedProps = {
    feed: FeedState,
    token: string,
    getFeed: (token: string, page: ?number) => void
};

@connect(
    ({ feed, token }) => ({ feed, token }),
    dispatch => ({
        getFeed: (token: string, page = 1) => dispatch(getFeed(token, page))
    })
)
class Feed extends Component {
    props: FeedProps;
    feedContainerBounds: ClientRect;
    feedContainer: HTMLElement;

    componentDidMount() {
        this.props.getFeed(this.props.token);
        window.addEventListener('resize', this.onResize);
    }
    
    componentWillUnmount() {
        window.removeEventListener('resize', this.onResize);
        if(this.feedContainer) {
            this.feedContainer.removeEventListener('scroll', this.onScroll);
        }
    }
    
    onResize = () => {
        if(this.feedContainerBounds) {
            this.feedContainerBounds = this.feedContainer.getBoundingClientRect();
        }
    }
    
    debounce: ?number = null;
    
    onScroll = () => {
        if(this.debounce) {
            clearTimeout(this.debounce);
        }
        this.debounce = setTimeout(() => {
            if ((window.scrollY + window.innerHeight) > (this.feedContainerBounds.bottom - INFINITE_SCROLL_OFFSET)
                && this.props.feed.items.pages >= this.props.feed.items.page
                && !this.props.feed.isLoading) {
                this.props.getFeed(this.props.token, this.props.feed.items.page + 1);
            }
        }, 2000);
    }

    render() {
        const { docs } = this.props.feed.items;
        return (
            <div>
                <TransitionMotion
                    styles={docs.map((doc: ICard, index: number) => ({
                        key: index,
                        style: {
                            translateY: spring(0),
                            opacity: spring(1)
                        },
                        data: {
                            doc
                        }
                    }))}
                willEnter={() => ({
                    translateY: 180,
                    opacity: 0
                })}>
                    {styles => (
                        <FeedContainer innerRef={(feedContainer: HTMLElement) => {
                            this.feedContainer = feedContainer;
                            if(feedContainer) {
                                this.feedContainerBounds = feedContainer.getBoundingClientRect();
                                feedContainer.addEventListener('scroll', this.onScroll);
                            }
                        }}>
                            {styles.map((config) =>
                                <Card key={config.key} card={config.data.doc} style={{
                                    opacity: config.style.opacity,
                                    transform: `translateY(${config.style.translateY}px)`
                                }}/>
                            )}
                        </FeedContainer>
                    )}
                </TransitionMotion>
            </div>
        );
    }
}

export default Feed;