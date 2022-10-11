import React from "react";
import * as tf from "@tensorflow/tfjs";
import { modelUrlGenerator } from "../api";

export const withUnprojection = WrappedComponent => {
    return class extends React.PureComponent {
        constructor(props) {
            super(props);
            this.state = {decoder: null};
            this.unproject = this.unproject.bind(this);
            this.fetchModel = this.fetchModel.bind(this);
        }

        componentDidMount() {
            this.fetchModel();
            this.unproject();
        }

        componentDidUpdate(prevProps, prevState, snapshot) {
            if (prevProps.embedding !== this.props.embedding) {
                this.fetchModel()
            }
            if (prevProps.dataset !== this.props.dataset) {
                this.fetchModel()
            }
            if ((prevState.decoder !== this.state.decoder) || (prevProps.coordsToUnproject !== this.props.coordsToUnproject)) {
                this.unproject()
            }
        }

        fetchModel() {
            const url = modelUrlGenerator(this.props.dataset, this.props.embedding);
            tf.loadLayersModel(url).then(
                (result) => {
                    this.setState({decoder: result});
                }
            );
        }

        unproject() {
            if (this.state.decoder != null)
            {
                const nonsense = () => {
                    return tf.tidy(() => {
                        const inpt = tf.tensor([[this.props.coordsToUnproject.x, this.props.coordsToUnproject.y]]);
                        return this.state.decoder.predict(inpt);
                    });
                };
                const unprojectedData = nonsense();
                this.props.handleUnprojectedDataChange(unprojectedData);
            }
        }

        render() {
            return <WrappedComponent {...this.props} />
        }
    }
};
