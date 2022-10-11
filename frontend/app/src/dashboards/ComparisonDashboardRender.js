import React from "react";
import {Col, Container, Row, CardDeck} from "react-bootstrap";
import {StatefulDatabaseImageComponent} from "./ImageComponents";
import {imageUrlGenerator} from "../api";
import DashboardNav from "./Navbar";
import {EmbeddingChart} from "../charts/TestEmbeddingCharts";
import {DatasetDropdown, StatusCard} from "./TextComponents";

const CHART_SIZE = 200;
const IMAGE_CARD_STYLE = {};

export default class ImageComparisonDashboardRender extends React.PureComponent {
    render() {
        return(
            <Container>
                <Row>
                    <Col>
                        <DashboardNav/>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <EmbeddingChart
                            coords={this.props.tsne_coords}
                            itemId={this.props.selectedInstanceId}
                            handleHoveredCoordsChange={this.props.handleHoveredCoordsChange}
                            handleSelectedInstanceIdChange={this.props.handleSelectedInstanceIdChange}
                            size={CHART_SIZE}/>
                        <EmbeddingChart
                            coords={this.props.pca_coords}
                            itemId={this.props.selectedInstanceId}
                            handleHoveredCoordsChange={this.props.handleHoveredCoordsChange}
                            handleSelectedInstanceIdChange={this.props.handleSelectedInstanceIdChange}
                            size={CHART_SIZE}/>
                        <EmbeddingChart
                            coords={this.props.mds_coords}
                            itemId={this.props.selectedInstanceId}
                            handleHoveredCoordsChange={this.props.handleHoveredCoordsChange}
                            handleSelectedInstanceIdChange={this.props.handleSelectedInstanceIdChange}
                            size={CHART_SIZE}/>
                        <EmbeddingChart
                            coords={this.props.lle_coords}
                            itemId={this.props.selectedInstanceId}
                            handleHoveredCoordsChange={this.props.handleHoveredCoordsChange}
                            handleSelectedInstanceIdChange={this.props.handleSelectedInstanceIdChange}
                            size={CHART_SIZE}/>
                        <EmbeddingChart
                            coords={this.props.umap_coords}
                            itemId={this.props.selectedInstanceId}
                            handleHoveredCoordsChange={this.props.handleHoveredCoordsChange}
                            handleSelectedInstanceIdChange={this.props.handleSelectedInstanceIdChange}
                            size={CHART_SIZE}/>
                    </Col>
                    <Col>
                        <CardDeck style={{marginTop: "10px", height: "98%", width: "98%", display: 'flex', flexDirection: 'row', flexWrap: "wrap"}}>
                            <StatefulDatabaseImageComponent
                                style={IMAGE_CARD_STYLE}
                                dataset={this.props.dataset}
                                urlGenerator={imageUrlGenerator}
                                embedding={"raw"}
                                title={"original"}
                                itemId={this.props.selectedInstanceId}/>
                            <StatefulDatabaseImageComponent
                                style={IMAGE_CARD_STYLE}
                                dataset={this.props.dataset}
                                urlGenerator={imageUrlGenerator}
                                embedding={"tsne"}
                                title={"tsne"}
                                itemId={this.props.selectedInstanceId}/>
                            <StatefulDatabaseImageComponent
                                style={IMAGE_CARD_STYLE}
                                dataset={this.props.dataset}
                                urlGenerator={imageUrlGenerator}
                                embedding={"pca"}
                                title={"pca"}
                                itemId={this.props.selectedInstanceId}/>
                            <StatefulDatabaseImageComponent
                                style={IMAGE_CARD_STYLE}
                                dataset={this.props.dataset}
                                urlGenerator={imageUrlGenerator}
                                embedding={"mds"}
                                title={"mds"}
                                itemId={this.props.selectedInstanceId}/>
                            <StatefulDatabaseImageComponent
                                style={IMAGE_CARD_STYLE}
                                dataset={this.props.dataset}
                                urlGenerator={imageUrlGenerator}
                                embedding={"lle"}
                                title={"lle"}
                                itemId={this.props.selectedInstanceId}/>
                            <StatefulDatabaseImageComponent
                                style={IMAGE_CARD_STYLE}
                                dataset={this.props.dataset}
                                urlGenerator={imageUrlGenerator}
                                embedding={"umap"}
                                title={"umap"}
                                itemId={this.props.selectedInstanceId}/>
                        </CardDeck>
                        <StatusCard text={"Currently displaying: " + this.props.dataset}>
                            <DatasetDropdown handleDatasetChange={this.props.handleDatasetChange} availableDatasets={["mnist", "fashion"]}/>
                        </StatusCard>
                    </Col>
                </Row>
            </Container>
        );
    }
}