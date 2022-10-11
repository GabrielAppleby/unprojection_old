import React from "react";
import {Card, Dropdown, DropdownButton, CardDeck} from "react-bootstrap";
import * as tf from "@tensorflow/tfjs";
import {withUnprojection} from '../utility/UnprojectionComponent'
import {withDatabase} from "../utility/DatabaseComponent";

class CoordCard3D extends React.PureComponent {
    render() {
        return (
            <Card>
                {this.props.title && <Card.Title>{this.props.title}</Card.Title>}
                <Card.Body>
                    <Card.Text>
                        x: {this.props.data.x.toPrecision(4)}
                    </Card.Text>
                    <Card.Text>
                        y: {this.props.data.y.toPrecision(4)}
                    </Card.Text>
                    <Card.Text>
                        z: {this.props.data.z.toPrecision(4)}
                    </Card.Text>
                    {this.props.children}
                </Card.Body>
            </Card>
        )
    }
}

export class StatusCard extends React.PureComponent {
    render() {
        return (
            <Card>
                {this.props.title && <Card.Title>{this.props.title}</Card.Title>}
                <Card.Body>
                    <Card.Text>
                        {this.props.text}
                    </Card.Text>
                    {this.props.children}
                </Card.Body>
            </Card>
        )
    }
}

class EmbeddingDropdown extends React.PureComponent {
    render() {
        return (
            <DropdownButton id="dropdown-basic-button" title="Chart Embedding" onSelect={(evt) => {this.props.handleEmbeddingChange(evt)}}>
                <Dropdown.Item eventKey="tsne">TSNE</Dropdown.Item>
                <Dropdown.Item eventKey="pca">PCA</Dropdown.Item>
                <Dropdown.Item eventKey="mds">MDS</Dropdown.Item>
                <Dropdown.Item eventKey="lle">LLE</Dropdown.Item>
                <Dropdown.Item eventKey="umap">UMAP</Dropdown.Item>
            </DropdownButton>
        );
    }
}

export class DatasetDropdown extends React.PureComponent {
    render() {
        const datasets = this.props.availableDatasets;
        return (
            <DropdownButton id="dropdown-basic-button" title="Dataset" onSelect={(evt) => {this.props.handleDatasetChange(evt)}}>
                {datasets.map((value, index) => {
                    return <Dropdown.Item key={value} eventKey={value}>{value}</Dropdown.Item>
                })}
            </DropdownButton>
        );
    }
}

export class StatusPortion extends React.PureComponent {
    render()
    {
        return (
            <CardDeck style={{flexDirection: "column", flex: "auto"}}>
                <StatusCard text={"Currently displaying: " + this.props.embedding}>
                    <EmbeddingDropdown handleEmbeddingChange={this.props.handleEmbeddingChange}/>
                </StatusCard>
                {this.props.children}
                <StatusCard text={"Hovered coords: " + this.props.hoveredCoords.x.toPrecision(4) + " " + this.props.hoveredCoords.y.toPrecision(4)}/>
                <StatusCard text={"Selected instance ID: " + this.props.selectedInstanceId} />
            </CardDeck>
        );
    }
}

const withCoord3DState = WrappedComponent => {
    return class extends React.PureComponent {
        constructor(props) {
            super(props);
            this.state = {coord3D: {x: 0, y: 0, z: 0}};
            this.handleCoord3DChange = this.handleCoord3DChange.bind(this);
        }

        handleCoord3DChange(newValue) {
            if (newValue != null)
            {
                this.setState({coord3D: newValue})
            }
        }

        render() {
            return <WrappedComponent {...this.props} data={this.state.coord3D} handleCoord3DChange={this.handleCoord3DChange} />
        }
    }
};

const withCoord3DDatabaseConversion = WrappedComponent => {
    return class extends React.PureComponent {
        constructor(props) {
            super(props);
            this.state = {responseData: null};
            this.convertToCoord3D = this.convertToCoord3D.bind(this);
            this.handleResponseDataChange = this.handleResponseDataChange.bind(this);
        }

        componentDidUpdate(prevProps, prevState, snapshot) {
            if (prevState.responseData !== this.state.responseData) {
                this.convertToCoord3D()
            }
        }

        convertToCoord3D() {
            if (this.state.responseData !== null)
            {
                this.state.responseData.json().then(res => this.props.handleCoord3DChange(
                    {x: res['raw_x'], y: res['raw_y'], z: res['raw_z']}))
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

const withCoord3DUnprojectionConversion = WrappedComponent => {
    return class extends React.PureComponent {
        constructor(props) {
            super(props);
            this.state = {unprojectedData: null};
            this.convertToCoord = this.convertToCoord.bind(this);
            this.handleUnprojectedDataChange = this.handleUnprojectedDataChange.bind(this);
        }

        componentDidUpdate(prevProps, prevState, snapshot) {
            if (prevState.unprojectedData !== this.state.unprojectedData) {
                this.convertToCoord()
            }
        }

        handleUnprojectedDataChange(newValue){
            this.setState({unprojectedData: newValue})
        }

        convertToCoord() {
            if (this.state.unprojectedData !== null) {
                const nonsense = () => {
                    return tf.tidy(() => {
                        const res = this.state.unprojectedData;
                        res.data().then(data => {
                                this.props.handleCoord3DChange({x: data[0], y: data[1], z: data[2]});
                        });
                        return null;
                    });
                };
                nonsense();
            }
        }

        render() {
            return <WrappedComponent {...this.props} handleUnprojectedDataChange={this.handleUnprojectedDataChange} />
        }
    }
};

export const StatefulDatabaseCoord3DComponent = withCoord3DState(withCoord3DDatabaseConversion(withDatabase(CoordCard3D)));
export const StatefulUnprojectionCoord3DComponent = withCoord3DState(withCoord3DUnprojectionConversion(withUnprojection(CoordCard3D)));
