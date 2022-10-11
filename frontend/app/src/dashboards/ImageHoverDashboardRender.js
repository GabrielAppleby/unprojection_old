import React from "react";
import {CardDeck, Col, Container, Row, ToggleButton, ToggleButtonGroup} from "react-bootstrap";
import {EmbeddingChart, EmbeddingChartWithBackground} from "../charts/TestEmbeddingCharts"
import {StatefulDatabaseImageComponent, StatefulUnprojectionImageComponent} from "./ImageComponents"
import {DatasetDropdown, StatusCard, StatusPortion} from "./TextComponents";
import {imageUrlGenerator} from "../api";
import DashboardNav from "./Navbar";

export default class ImageHoverDashboardRender extends React.PureComponent {
    render() {
        let availableDatasets = ["mnist", "fashion"];
        if (this.props.dashboardType === 'classifiers')
        {
            availableDatasets=["classifiers", "binaryfashion"];
        }

        return(
            <Container>
                <Row>
                    <Col>
                        <DashboardNav/>
                    </Col>
                </Row>
                <Row>
                    <Col>

                        {this.props.dashboardType === 'interpolation' ?
                            <EmbeddingChart
                                coords={this.props.coords}
                                handleHoveredCoordsChange={this.props.handleHoveredCoordsChange}
                                handleSelectedInstanceIdChange={this.props.handleSelectedInstanceIdChange}
                                dataset={this.props.dataset}
                                embedding={this.props.embedding}
                                dashboardType={this.props.dashboardType}
                                size={500}/>
                            :
                            <EmbeddingChartWithBackground
                                coords={this.props.coords}
                                displayCoords={this.props.displayCoords}
                                handleHoveredCoordsChange={this.props.handleHoveredCoordsChange}
                                handleSelectedInstanceIdChange={this.props.handleSelectedInstanceIdChange}
                                size={500}
                                dataset={this.props.dataset}
                                embedding={this.props.embedding}
                                dashboardType={this.props.dashboardType}/>}
                    </Col>
                    <Col>
                        <Row style={{height:"40%", alignItems: "center", justifyContent: "center"}}>
                            <CardDeck style={{margin:"10px"}}>
                                <StatefulDatabaseImageComponent
                                    dataset={this.props.dataset}
                                    urlGenerator={imageUrlGenerator}
                                    embedding={"raw"}
                                    title={"Original"}
                                    itemId={this.props.selectedInstanceId}/>
                                <StatefulUnprojectionImageComponent
                                    dataset={this.props.dataset}
                                    embedding={this.props.embedding}
                                    title={"Decoded"}
                                    coordsToUnproject={this.props.hoveredCoords}/>
                            </CardDeck>
                        </Row>
                        <Row style={{height:"50%"}}>
                            <Col>
                                <StatusPortion
                                    embedding={this.props.embedding}
                                    hoveredCoords={this.props.hoveredCoords}
                                    selectedInstanceId={this.props.selectedInstanceId}
                                    handleEmbeddingChange={this.props.handleEmbeddingChange}
                                    dataset={this.props.dataset}
                                    handleDatasetChange={this.props.handleDatasetChange}/>
                                <StatusCard text={"Currently displaying: " + this.props.dataset}>
                                    <DatasetDropdown handleDatasetChange={this.props.handleDatasetChange} availableDatasets={availableDatasets}/>
                                </StatusCard>
                                {this.props.dashboardType === 'classifiers' ?
                                    <ToggleButtonGroup name={"ToggleCoords"} onChange={(evt) => {
                                        this.props.handleDisplayCoordsChange(evt)}}>
                                        <ToggleButton value={true}>Display Coords</ToggleButton>
                                        <ToggleButton value={false}>Hide Coords</ToggleButton>
                                    </ToggleButtonGroup>
                                    :<div/>}
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Container>
        );
    }
}
