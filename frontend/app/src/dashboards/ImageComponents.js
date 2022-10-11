import React from "react";
import {Card} from "react-bootstrap";
import * as tf from "@tensorflow/tfjs";
import {withUnprojection} from "../utility/UnprojectionComponent";
import {withDatabase} from "../utility/DatabaseComponent";
//
// class ImageComponent extends React.PureComponent  {
//     render() {
//         return (
//             <Col>
//                 <h4>{this.props.title}</h4>
//                 { this.props.data && <img alt="" src={this.props.data} height="56" width="56"/> }
//             </Col>
//         );
//     }
// }

class ImageCard extends React.PureComponent {
    render() {
        const style = {flexBasis: "33%"};
        return (
            <Card style={style}>
                {this.props.title && <Card.Title>{this.props.title}</Card.Title>}
                <Card.Body>
                    { this.props.data && <img alt="" src={this.props.data} height="56" width="56"/> }
                </Card.Body>
            </Card>
        )
    }
}

const withImageState = WrappedComponent => {
    return class extends React.PureComponent {
        constructor(props) {
            super(props);
            this.state = {image: null};
            this.handleImageChange = this.handleImageChange.bind(this);
        }

        handleImageChange(newValue) {
            this.setState({image: newValue})
        }

        render() {
            return <WrappedComponent data={this.state.image} handleDataChange={this.handleImageChange} {...this.props} />
        }
    }
};

const withImageUrlConversion = WrappedComponent => {
    return class extends React.PureComponent {
        constructor(props) {
            super(props);
            this.state = {responseData: null};
            this.convertToImage = this.convertToImage.bind(this);
            this.handleResponseDataChange = this.handleResponseDataChange.bind(this);
        }

        componentDidUpdate(prevProps, prevState, snapshot) {
            if (prevState.responseData !== this.state.responseData) {
                this.convertToImage()
            }
        }

        convertToImage() {
            if (this.state.responseData !== null)
            {
                this.state.responseData.blob().then(res => this.props.handleDataChange(URL.createObjectURL(res)));
            }
        }

        handleResponseDataChange(newValue){
            this.setState({responseData: newValue})
        }

        render() {
            return <WrappedComponent {...this.props} handleDataChange={this.handleResponseDataChange} />
        }
    }
};

const withImageUnprojectionConversion = WrappedComponent => {
    return class extends React.PureComponent {
        constructor(props) {
            super(props);
            this.state = {unprojectedData: null};
            this.convertToImage = this.convertToImage.bind(this);
            this.handleUnprojectedDataChange = this.handleUnprojectedDataChange.bind(this);
        }

        componentDidUpdate(prevProps, prevState, snapshot) {
            if (prevState.unprojectedData !== this.state.unprojectedData) {
                this.convertToImage()
            }
        }

        convertToImage() {
            if (this.state.unprojectedData !== null)
            {
                const nonsense = () => {
                    return tf.tidy(() => {
                        const res = this.state.unprojectedData.mul(255).cast('int32');
                        return res.reshape([28, 28]);
                    });
                };
                const reshaped = nonsense();
                const canvas = document.createElement('canvas');
                tf.browser.toPixels(reshaped, canvas).then(() => {
                    tf.dispose([reshaped]);
                    this.props.handleDataChange(canvas.toDataURL());
                });
            }
        }

        handleUnprojectedDataChange(newValue){
            this.setState({unprojectedData: newValue})
        }

        render() {
            return <WrappedComponent handleUnprojectedDataChange={this.handleUnprojectedDataChange} {...this.props} />
        }
    }
};

export const StatefulDatabaseImageComponent = withImageState(withImageUrlConversion(withDatabase(ImageCard)));
export const StatefulUnprojectionImageComponent = withImageState(
    withImageUnprojectionConversion(withUnprojection(ImageCard)));
