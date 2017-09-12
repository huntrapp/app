// @flow

import React, { Component } from 'react';
import styled from 'styled-components';
import ProgressiveImage from '../ProgressiveImage';
import type { IFeedlyCard } from '../../entities/providers';
import cleanHTML from '../../services/cleanHTML';
import Vibrant from 'node-vibrant';
import { connect } from 'react-redux';
import type { RootState } from '../../createStore';
import { setColor } from '../../redux/colors';
import removeBackground from '../../services/removeBackground';
import { setLogo } from '../../redux/logos';
import Source from '../Source';
import tinycolor from 'tinycolor2';
import Raven from 'raven-js';

type FeedlyProps = {
    card: IFeedlyCard,
    color: ?string,
    logoColor: ?string,
    logo: ?string,
    setColor: Function,
    setLogo: Function,
};

const mapStateToProps = ({ colors, logos }: RootState, { card: { data } }: FeedlyProps) => ({
    color: data.visual && 'edgeCacheUrl' in data.visual && data.visual.edgeCacheUrl in colors ? colors[data.visual.edgeCacheUrl] : null,
    logoColor: data.logoUrl in colors ? colors[data.logoUrl] : null,
    logo: data.logoUrl in logos ? logos[data.logoUrl] : data.logoUrl,
});

const mapDispatchToProps = (dispatch: Function) => ({
    setColor: (url: string, color: string) => dispatch(setColor(url, color)),
    setLogo: (logoUrl: string, dataUrl: string) => dispatch(setLogo(logoUrl, dataUrl)),
});

const FeedlyContainer = styled.div`
    height:100%;
`;

const FeedlyHolder = styled.div`
    display:flex;
    flex-direction:column-reverse;
    height:100%;
    position:relative;
    z-index:3;
`;

const FeedlyText = styled.div`
    padding:16px;
    position:relative;
    color: ${props => props.color};
    text-align: ${props => props.direction === 'rtl' ? 'right' : 'left'};
    direction: ${props => props.direction};
    z-index: 1;

    h1 {
        font-size:${props => props.size === 'small' ? 2.8 : 3.2}rem;
        font-weight:bold;
        line-height: ${props => props.size === 'small' ? 3 : 3.6}rem;
        font-family: Cabin, sans-serif;
        font-weight:700;
        -webkit-box-orient: vertical;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        overflow:hidden;
    }
`;

const FeedlyLogo = styled.img`
    max-width:100px;
    max-height:20px;
    align-self: flex-end;
    transition: opacity .25s;
    opacity: 0;
`;

class Feedly extends Component {
    props: FeedlyProps;

    async onVisualLoad (element: HTMLImageElement) {
        if (!this.props.color) {
            const vibrant = Vibrant.from(element);
            try {
                const palette = await vibrant.getPalette();
                const swatch = palette.DarkVibrant || palette.Muted || null;
                if (swatch) {
                    this.props.setColor(element.src, swatch.getHex());
                }
            } catch (ex) {
                console.error(ex); // eslint-disable-line no-console
                Raven.captureException(ex);
            }
        }
    }

    onLogoLoad (event: Event & { target: HTMLImageElement }) {
        const { target } = event;
        if (target.src.startsWith('data:')) {
            target.style.opacity = '1';
            return;
        }

        window.requestIdleCallback(async () => {
            // get logo color
            if (!this.props.logoColor) {
                const vibrant = Vibrant.from(target).quality(1);
                try {
                    const palette = await vibrant.getPalette();
                    const swatch = palette.LightVibrant || palette.Vibrant || null;
                    if (swatch) {
                        const color = tinycolor(swatch.getHex());
                        color.setAlpha(0.6);
                        this.props.setColor(target.src, color.toRgbString());
                    }
                } catch (ex) {
                    Raven.captureException(ex);
                    console.error(ex); // eslint-disable-line no-console
                }
            }

            // remove and add outlines to logo
            const url = removeBackground(target);
            this.props.setLogo(target.src, url);
            target.src = url;
            target.style.opacity = '1';
        });
    }

    render () {
        const hasContent = !!this.props.card.data.content;
        return (
            <FeedlyContainer>
                <FeedlyHolder>
                    <ProgressiveImage
                        src={this.props.card.data.visual && 'edgeCacheUrl' in this.props.card.data.visual ? this.props.card.data.visual.edgeCacheUrl : null}
                        fallbackSeed={this.props.card._id}
                        onFullLoad={(...args) => this.onVisualLoad(...args)}
                        crossOrigin="anonymous"
                        background
                        blendWith={this.props.color ? this.props.color : this.props.logoColor}/>

                    <Source
                        logoElement={(
                            <div>
                                {this.props.card.data.logoUrl && (
                                    <FeedlyLogo alt={this.props.card.name} crossOrigin="anonymous" src={this.props.logo}
                                        onLoad={(...args) => this.onLogoLoad(...args)}/>
                                )}
                            </div>
                        )}
                        style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 3 }}
                        color={this.props.logoColor ? this.props.logoColor : 'rgba(0, 0, 0, 0.6)'}
                        description={this.props.card.name}/>
                    <FeedlyText size={this.props.card.size} hasContent={hasContent}
                        contentDirection={hasContent ? this.props.card.data.content.direction : 'ltr'}
                        direction={this.props.card.data.direction}
                        color={'#FFF'}>
                        <h1>{cleanHTML(this.props.card.title)}</h1>
                    </FeedlyText>
                    <div style={{ flexGrow: 1 }}/>
                </FeedlyHolder>
            </FeedlyContainer>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Feedly);
