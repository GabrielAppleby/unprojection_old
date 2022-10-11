import React from "react";
import {withDatabase} from "../utility/DatabaseComponent";
import ImageHoverDashboardRender from "./ImageHoverDashboardRender";
import Coord3DHoverDashboardRender from "./Coord3DHoverDashboardRender";
import ImageSelectionDashboardRender from "./ComparisonDashboardRender";

const SUPPORTED_EMBEDDINGS = ["tsne", "pca", "mds", "lle", "umap"];

export class UnprojectionDashboard extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            hoveredCoords: {x: 5, y: 5},
            selectedInstanceId: 2,
            embedding: "tsne",
            coords: []
        };
        this.handleEmbeddingChange = this.handleEmbeddingChange.bind(this);
        this.handleHoveredCoordsChange = this.handleHoveredCoordsChange.bind(this);
        this.handleSelectedInstanceIdChange = this.handleSelectedInstanceIdChange.bind(this);
        this.fetchCoords = this.fetchCoords.bind(this);
    }

    componentDidMount() {
        this.fetchCoords();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevState.embedding !== this.state.embedding) {
            this.fetchCoords()
        }
    }

    fetchCoords() {
        const url = this.props.urlGenerator(this.props.dataset, this.state.embedding);

        fetch(url)
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({coords: result});
                },
                // Note: it's important to handle errors here
                // instead of a catch() block so that we don't swallow
                // exceptions from actual bugs in components.
                (error) => {
                }
            )
    }

    handleEmbeddingChange(newValue){
        this.setState({embedding: newValue})
    }

    handleHoveredCoordsChange(newValue){
        this.setState({hoveredCoords: newValue})
    }

    handleSelectedInstanceIdChange(newValue){
        this.setState({selectedInstanceId: newValue})
    }

    render() {
        return (
            this.props.render(
                this.state.hoveredCoords,
                this.state.selectedInstanceId,
                this.props.dataset,
                this.state.embedding,
                this.state.coords,
                this.handleEmbeddingChange,
                this.handleHoveredCoordsChange,
                this.handleSelectedInstanceIdChange)
        );
    }
}

const withSingleEmbedding = WrappedComponent => {
    return class extends React.PureComponent {

        constructor(props) {
            super(props);
            this.state = {
                hoveredCoords: {x: 5, y: 5},
                embedding: "tsne",
                coords: []
            };
            this.handleEmbeddingChange = this.handleEmbeddingChange.bind(this);
            this.handleCoordsChange = this.handleCoordsChange.bind(this);
            this.handleHoveredCoordsChange = this.handleHoveredCoordsChange.bind(this);
        }

        handleEmbeddingChange(newValue) {
            this.setState({embedding: newValue})
        }

        handleCoordsChange(newValue) {
            newValue.json()
                .then(
                    (result) => {
                        this.setState({coords: result});
                    },
                    // Note: it's important to handle errors here
                    // instead of a catch() block so that we don't swallow
                    // exceptions from actual bugs in components.
                    (error) => {
                    }
                );
        }

        handleHoveredCoordsChange(newValue) {
            this.setState({hoveredCoords: newValue})
        }

        render() {
            return <WrappedComponent
                {...this.props}
                hoveredCoords={this.state.hoveredCoords}
                embedding={this.state.embedding}
                coords={this.state.coords}
                handleEmbeddingChange={this.handleEmbeddingChange}
                handleDataChange={this.handleCoordsChange}
                handleHoveredCoordsChange={this.handleHoveredCoordsChange}/>
        }
    }
};


const withMultiEmbeddings = WrappedComponent => {
    return class extends React.PureComponent {

        constructor(props) {
            super(props);
            this.state = {
                tsne_coords: [],
                pca_coords: [],
                mds_coords: [],
                lle_coords: [],
                umap_coords: []
            };
            this.fetchAllCoords = this.fetchAllCoords.bind(this);
        }

        componentDidMount() {
            this.fetchAllCoords();
        }

        componentDidUpdate(prevProps) {
            if (prevProps.dataset !== this.props.dataset)
            {
                this.fetchAllCoords();
            }
        }

        fetchAllCoords() {
            const promises = [];
            for (const embedding of SUPPORTED_EMBEDDINGS) {
                const url = this.props.urlGenerator(this.props.dataset, embedding);
                promises.push(fetch(url).then(res => res.json()));
            }
            Promise.all(promises).then(
                (results) => {
                    this.setState({
                        tsne_coords: results[0],
                        pca_coords: results[1],
                        mds_coords: results[2],
                        lle_coords: results[3],
                        umap_coords: results[4]
                    });
                },
                (error) => {
                }
                );
        }


        render() {
            return <WrappedComponent
                {...this.props}
                tsne_coords={this.state.tsne_coords}
                pca_coords={this.state.pca_coords}
                mds_coords={this.state.mds_coords}
                lle_coords={this.state.lle_coords}
                umap_coords={this.state.umap_coords}
            />
        }
    }
};

const withSelection = WrappedComponent => {
    return class extends React.PureComponent {
        constructor(props) {
            super(props);
            this.state = {selectedInstanceId: 2};
            this.handleSelectedInstanceIdChange = this.handleSelectedInstanceIdChange.bind(this);
        }

        handleSelectedInstanceIdChange(newValue){
            this.setState({selectedInstanceId: newValue})
        }

        render() {
            return <WrappedComponent {...this.props}
                                     selectedInstanceId={this.state.selectedInstanceId}
                                     handleSelectedInstanceIdChange={this.handleSelectedInstanceIdChange} />
        }
    }
};

const withSwappableDataset = WrappedComponent => {
    return class extends React.PureComponent {
        constructor(props) {
            super(props);
            this.state = {dataset: this.props.dataset};
            this.handleDatasetChange = this.handleDatasetChange.bind(this);
        }

        componentDidUpdate(prevProps, prevState, snapshot) {
            if (this.props.dataset !== prevProps.dataset)
            {
                this.setState({dataset: this.props.dataset})
            }
        }

        handleDatasetChange(newValue){
            this.setState({dataset: newValue})
        }

        render() {
            return <WrappedComponent {...this.props}
                                     dataset={this.state.dataset}
                                     handleDatasetChange={this.handleDatasetChange}/>
        }
    }
};

const withHiddableCoords = WrappedComponent => {
    return class extends React.PureComponent {
        constructor(props) {
            super(props);
            this.state = {displayCoords: true};
            this.handleDisplayCoordsChange = this.handleDisplayCoordsChange.bind(this);
        }

        handleDisplayCoordsChange(newValue){
            this.setState({displayCoords: newValue})
        }

        render() {
            return <WrappedComponent {...this.props}
                                     displayCoords={this.state.displayCoords}
                                     handleDisplayCoordsChange={this.handleDisplayCoordsChange}/>
        }
    }
};

export const InterpolationDashboard = withSwappableDataset(withSingleEmbedding(withSelection(withDatabase(ImageHoverDashboardRender))));
export const ClassifierDashboard = withSwappableDataset(withSingleEmbedding(withSelection(withDatabase(withHiddableCoords(ImageHoverDashboardRender)))));
export const CoordsInterpolationDashboard = withSwappableDataset(withSingleEmbedding(withSelection(withDatabase(withHiddableCoords(Coord3DHoverDashboardRender)))));
export const ComparisonDashboard = withSwappableDataset(withMultiEmbeddings(withSelection(ImageSelectionDashboardRender)));


