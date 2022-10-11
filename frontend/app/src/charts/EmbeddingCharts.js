import React from "react";
import { scaleOrdinal } from 'd3-scale';
import { schemeCategory10 } from 'd3-scale-chromatic';
import {CartesianGrid, Cell, Dot, Legend, Scatter, ScatterChart, XAxis, YAxis} from "recharts";


const colors = scaleOrdinal(schemeCategory10).range();


export class LabeledEmbeddingChart extends React.PureComponent {

    constructor(props) {
        super(props);
        this.legendColors = [
            { value: '0', type: 'circle', color: colors[0]},
            { value: '1', type: 'circle', color: colors[1]},
            { value: '2', type: 'circle', color: colors[2]},
            { value: '3', type: 'circle', color: colors[3]},
            { value: '4', type: 'circle', color: colors[4]},
            { value: '5', type: 'circle', color: colors[5]},
            { value: '6', type: 'circle', color: colors[6]},
            { value: '7', type: 'circle', color: colors[7]},
            { value: '8', type: 'circle', color: colors[8]},
            { value: '9', type: 'circle', color: colors[9]}];
    }

    render () {
        const left = (this.props.dataset === 'classifiers') ? "95px" : "80px";
        const imgStyle = {
            position: "absolute",
            top: "20px"
        };
        const height = (this.props.dataset === 'classifiers') ? 507 : 531;
        return (
            <div>
                {this.props.dataset === 'classifiers' && <img alt="img" style={imgStyle} src={require('./tsne_classifiers.png')} width="501" height={height}/>}
                <ScatterChart
                    width={600}
                    height={600}
                    margin={{
                        top: 20, right: 20, bottom: 20, left: 20,
                    }}
                    onMouseMove={
                        (position) => {
                            if (position != null) {
                                this.props.handleHoveredCoordsChange({x: position.xValue, y: position.yValue})
                            }
                        }
                    }>
                    <CartesianGrid />
                    <XAxis type="number" dataKey="x" name="x"/>
                    <YAxis type="number" dataKey="y" name="y"/>
                    <Legend payload={this.legendColors}/>
                    <Scatter name={this.props.embedding} data={this.props.coords} shape={<Dot r={2}/>} fill="#8884d8"
                             onMouseOver={
                                (point) => {
                                    this.props.handleSelectedInstanceIdChange(point.id);
                                }
                             }
                    >
                        {
                            this.props.coords.map((entry, index) => {
                                return <Cell name={entry.label} key={`cell-${index}`} stroke={colors[entry.label]} fill={colors[entry.label]} fillOpacity={1}/>
                            })
                        }
                    </Scatter>
                </ScatterChart>
            </div>
        );
    }
}

export class EmbeddingChart extends React.PureComponent {
    render () {
        const divStyle = {
            position: "relative",
            display: "inline-block",
            // transition: "transform 150ms ease-in-out"
        };
        const svgStyle = {
            position: "relative",
            top: "0px",
            left: "0px"
        };
        const imgStyle = {
            position: "absolute",
            top: "20px",
            left: "80px"
        };
        return (
            <div className="img-overlay-wrap" style={divStyle}>
                <img alt="img" style={imgStyle} src={require('./' + this.props.embedding + '_mag.png')} width="501" height="531"/>
                <ScatterChart
                    width={600}
                    height={600}
                    margin={{
                        top: 20, right: 20, bottom: 20, left: 20,
                    }}
                    onMouseMove={
                        (position) => {
                            if (position != null) {
                                this.props.handleHoveredCoordsChange({x: position.xValue, y: position.yValue})
                            }
                        }
                    }
                    style={svgStyle}>
                    <CartesianGrid />
                    <XAxis type="number" dataKey="x" name="x"/>
                    <YAxis type="number" dataKey="y" name="y"/>
                    <Scatter name={this.props.embedding} data={this.props.coords} fill="#8884d8" onMouseOver={
                        (point) => {
                            this.props.handleSelectedInstanceIdChange(point.id);
                        }
                    }>
                    </Scatter>
                </ScatterChart>
            </div>
        );
    }
}
