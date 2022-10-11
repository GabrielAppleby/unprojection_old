import React from "react";
import {CardDeck, Col, Container, Row, ToggleButton, ToggleButtonGroup} from "react-bootstrap";
import {DatasetDropdown, StatusCard, StatusPortion} from "./TextComponents";
import {StatefulUnprojectionCoord3DComponent, StatefulDatabaseCoord3DComponent} from "./TextComponents";
import {coord3DUrlGenerator} from "../api";
import DashboardNav from "./Navbar";
import {EmbeddingChart, EmbeddingChartWithBackground} from "../charts/TestEmbeddingCharts";

export default class Coord3DHoverDashboardRender extends React.PureComponent {
    render() {
        let availableDatasets = ["sphere", "swissroll"];
        if (this.props.dashboardType === 'gradient')
        {
            availableDatasets=["spherefulldata", "swissrollfulldata"];
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
                        {this.props.dashboardType === 'gradient' ?
                            <EmbeddingChartWithBackground
                                coords={this.props.coords}
                                displayCoords={this.props.displayCoords}
                                handleHoveredCoordsChange={this.props.handleHoveredCoordsChange}
                                handleSelectedInstanceIdChange={this.props.handleSelectedInstanceIdChange}
                                size={500}
                                dataset={this.props.dataset}
                                embedding={this.props.embedding}
                                dashboardType={this.props.dashboardType}/>
                            :
                            <EmbeddingChart
                                coords={this.props.coords}
                                handleHoveredCoordsChange={this.props.handleHoveredCoordsChange}
                                handleSelectedInstanceIdChange={this.props.handleSelectedInstanceIdChange}
                                size={500}
                                embedding={this.props.embedding}
                                dashboardType={this.props.dashboardType}/>}
                    </Col>
                    <Col>
                        <Row style={{height:"40%"}}>
                            <Col>
                                <CardDeck style={{margin:"10px"}}>
                                    <StatefulDatabaseCoord3DComponent
                                        title={"Original"}
                                        dataset={this.props.dataset}
                                        embedding={this.props.embedding}
                                        hoveredCoords={this.props.hoveredCoords}
                                        urlGenerator={coord3DUrlGenerator}
                                        itemId={this.props.selectedInstanceId}/>
                                    <StatefulUnprojectionCoord3DComponent
                                        title={"Decoded"}
                                        dataset={this.props.dataset}
                                        embedding={this.props.embedding}
                                        coordsToUnproject={this.props.hoveredCoords}/>
                                </CardDeck>
                            </Col>
                        </Row>
                        <Row style={{height:"50%"}}>
                            <Col>
                                <StatusPortion
                                    embedding={this.props.embedding}
                                    hoveredCoords={this.props.hoveredCoords}
                                    selectedInstanceId={this.props.selectedInstanceId}
                                    handleEmbeddingChange={this.props.handleEmbeddingChange}
                                    handleDisplayUnprojectionChange={this.props.handleDisplayUnprojectionChange}
                                    dataset={this.props.dataset}
                                    handleDatasetChange={this.props.handleDatasetChange}>
                                    <StatusCard text={"Currently displaying: " + this.props.dataset}>
                                        <DatasetDropdown handleDatasetChange={this.props.handleDatasetChange} availableDatasets={availableDatasets}/>
                                    </StatusCard>
                                </StatusPortion>
                                {this.props.dashboardType === 'gradient' ?
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
