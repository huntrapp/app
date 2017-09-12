/**
 * ProgressiveImage progressively loads a big image:
 * First it loads a small thumbnail, and at the same time it loads the full image.
 * This is a nice extra feature, which is not intended to fully work in non-real browsers. (IE, Edge, whatever)
 */

import React from 'react';
import styled from 'styled-components';
import GeoPattern from 'geopattern';

const canUseBackgrounds = document.createElement('detect').style.objectFit !== '';

const ImageContainer = styled.div`
    transition: opacity .5s, transform .5s;
    opacity:${props => (props.isPlaceholder && props.active && !props.fullActive) || (!props.isPlaceholder && props.active) ? 1 : 0};
    position:absolute;
    top:0;
    left:0;
    width:100%;
    height:100%;
    z-index: ${props => props.isPlaceholder ? 2 : 1};
    background-position: center center;
    background-size: cover;
    background-image: ${props => props.backgroundImage ? props.backgroundImage : 'none'};
    background-blend-mode: ${props => props.blendWith ? 'multiply' : 'unset'};
    background-color: ${props => props.blendWith ? props.blendWith : '#EEE'};
    transition: background-color .25s;
    transform: ${props => props.isPlaceholder && props.active && !props.fullActive ? 'scale(1.1)' : 'scale(1)'};
    
    img {
        width:100%;
        height:100%;
        object-fit: cover;
    }
`;

type ProgressiveImageProps = {
    // source uri
    src: string,
    // optional source uri to use when on retina
    srcRetina?: string,
    // placeholder source uri
    placeholder?: string,
    // blur amount
    blur?: number,
    // does ProgressiveImage need to use background-image or can it use an img tag instead?
    background?: boolean,
    // optional styles
    style?: any,
    // a unique id to generate a fallback image from when loading fails
    fallbackSeed: string,
    // callback to call if all images loaded successfully
    onFullLoad?: (srcImage: HTMLImageElement) => void,
    // HTMLImageElement.crossOrigin value to pass on to images
    crossOrigin: string,
    // color to blend images with
    blendWith?: string
};

export default class ProgressiveImage extends React.Component {
    props: ProgressiveImageProps;

    static defaultProps = {
        blur: 10,
        // always use background if it's not supported by the browser...
        background: canUseBackgrounds,
    };

    state = {
        fullyLoaded: false,
        placeholderLoaded: false,
        errorInLoading: false,
    };

    onFullLoad () {
        if (this.refs.src.naturalWidth) {
            this.props.onFullLoad && this.props.onFullLoad(this.refs.src);
            this.setState({
                fullyLoaded: true,
                errorInLoading: false,
            });
        } else {
            this.setState({
                fullyLoaded: true,
                errorInLoading: true,
            });
        }
    }

    onPlaceholderLoad () {
        this.setState({
            placeholderLoaded: true,
        });
    }

    onError () {
        if (process.env.NODE_ENV !== 'production') {
            console.error(`${this.props.src} could not be loaded`); // eslint-disable-line no-console
        }
        this.setState({
            errorInLoading: true,
        });
    }

    componentWillReceiveProps (newProps) {
        if (newProps.src !== this.props.src) {
            this.setState({
                fullyLoaded: false,
                errorInLoading: false,
            });
        }
    }

    componentDidMount () {
        // check if images are already loaded, if so, dispatch load immediately
        if (this.refs.src && this.refs.src.complete) {
            this.onFullLoad();
        } else if (this.refs.placeholder && this.refs.placeholder.complete) {
            this.onPlaceholderLoad();
        }
    }

    render () {
        const { src, srcRetina, placeholder, blur, background, fallbackSeed, blendWith } = this.props;
        let backgroundImage = 'none';

        if (background) {
            backgroundImage = `url(${src})`;
            if (window.devicePixelRatio && window.devicePixelRatio >= 1.5) {
                backgroundImage = `url(${srcRetina || src})`;
            }
        }

        return (
            <div style={this.props.style}>
                {placeholder && !this.state.errorInLoading && (
                    <ImageContainer isPlaceholder active={this.state.placeholderLoaded}
                        fullActive={this.state.fullyLoaded}>
                        <img ref="placeholder" src={placeholder} onLoad={() => this.onPlaceholderLoad()}
                            crossOrigin={this.props.crossOrigin}
                            style={{
                                filter: `blur(${blur}px)`,
                            }}
                        />
                    </ImageContainer>
                )}
                {src && !this.state.errorInLoading && (
                    <ImageContainer active={this.state.fullyLoaded} backgroundImage={backgroundImage}
                        blendWith={blendWith}>
                        <img style={{ opacity: background ? 0 : 1 }} ref="src" src={src}
                            onLoad={() => this.onFullLoad()} onError={() => this.onError()}
                            crossOrigin={this.props.crossOrigin}/>
                    </ImageContainer>
                )}
                {(this.state.errorInLoading || !src) && (
                    <ImageContainer active={!this.state.fullyLoaded}
                        backgroundImage={GeoPattern.generate(fallbackSeed).toDataUrl()}/>
                )}
            </div>
        );
    }
}
