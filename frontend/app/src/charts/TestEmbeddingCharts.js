import React from 'react'
import * as d3 from 'd3';

// If you mess with any of these you need
// to regenerate background colored images
// :(
const BUFFER_PROPORTION = 1 / 20;
const MARGINS_PROPORTION = 1 / 8;
const CIRCLE_R = 2;


export class EmbeddingChart extends React.PureComponent {

    constructor(props){
        super(props);
        this.labelColors = d3.scaleOrdinal(d3.schemeCategory10);
        this.error_str = this.props.embedding + '_error';
        this.createEmbeddingChart = this.createEmbeddingChart.bind(this);
        this.getColor = this.getColor.bind(this);
        this.errorColors = d3.scaleLinear().domain([0, .56]).range(["black", "red"]);
        this.returnToRegularColor = this.returnToRegularColor.bind(this);
    }

    static defaultProps = {
        displayCoords: true
    };

    componentDidMount() {
        this.createEmbeddingChart()
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.coords !== this.props.coords || prevProps.displayCoords !== this.props.displayCoords)
        {
            this.error_str = this.props.embedding + '_error';
            const max = d3.max(this.props.coords, (d) => d[this.error_str]);
            this.errorColors = d3.scaleLinear().domain([0, max]).range(["black", "red"]);
            this.createEmbeddingChart();
        }
        if (prevProps.itemId !== this.props.itemId)
        {
            this.returnToRegularColor();
            d3.select(this.node).select("#id" + this.props.itemId)
                .attr('class', 'selected').style("fill", "#fff13b");
        }
    }

    getColor(d) {
        if (this.props.dashboardType === 'validation')
        {
            return this.errorColors(d[this.error_str]);
        }
        else if (this.props.dashboardType === 'classifiers')
        {
            if (d.label === 1)
            {
                return "#0000ff"
            }
            else
            {
                return "#ff0000"
            }
        }
        return this.labelColors(d.label);
    }

    returnToRegularColor() {
        d3.select(this.node)
            .select(".selected")
            .attr('class', null)
            .style('fill', (d) => {
                return this.getColor(d);
            });
    }

    createEmbeddingChart() {
        if (this.props.coords && this.props.coords.length > 1) {
            const dataset = this.props.coords;
            const width = this.props.size;
            const height = this.props.size;
            const margins = width * MARGINS_PROPORTION;
            const handleCoordChange = this.props.handleHoveredCoordsChange;
            const getX = (d) => d.x;
            const getY = (d) => d.y;
            const minX = d3.min(dataset, getX);
            const maxX = d3.max(dataset, getX);
            const minY = d3.min(dataset, getY);
            const maxY = d3.max(dataset, getY);
            const xScaleBuffer = (maxX - minX) * BUFFER_PROPORTION;
            const yScaleBuffer = (maxY - minY) * BUFFER_PROPORTION;

            const xScale = d3.scaleLinear().domain([minX - xScaleBuffer, maxX + xScaleBuffer]).range([margins, (width - margins)]);
            const yScale = d3.scaleLinear().domain([minY - yScaleBuffer, maxY + yScaleBuffer]).range([(height - margins), margins]);
            const xAxis = d3.axisBottom(xScale);
            const yAxis = d3.axisLeft(yScale);

            // console.log(minX - xScaleBuffer);
            // console.log(Math.abs(minX - xScaleBuffer) + Math.abs(maxX + xScaleBuffer));
            //
            // console.log(minY - yScaleBuffer);
            // console.log(Math.abs(maxY + yScaleBuffer) + Math.abs(minY - yScaleBuffer));

            const rootG = d3.select(this.node);


            rootG.selectAll('g').remove().exit();
            const returnColor = this.returnToRegularColor;

            if (handleCoordChange)
            {
                rootG
                    .on('mousemove', function () {
                        const mousePos = d3.mouse(this);
                        handleCoordChange({
                            x: xScale.invert(mousePos[0]),
                            y: yScale.invert(mousePos[1])
                        });
                    });
            }

            const circlesG = rootG.append('g');
            const xAxisG = rootG.append('g');
            const yAxisG = rootG.append('g');

            const handleSelectedInstanceIdChange = this.props.handleSelectedInstanceIdChange;

            if (this.props.displayCoords)
            {
                circlesG
                    .selectAll('circle')
                    .data(dataset)
                    .enter()
                    .append('circle')
                    .attr('cx', function (d) {
                        return xScale(d.x);
                    })
                    .attr('cy', function (d) {
                        return yScale(d.y);
                    })
                    .attr('r', CIRCLE_R)
                    .attr('id', (d) => {
                        return "id" + d.id;
                    })
                    .style("stroke", "black")
                    .style("stroke-width", .25)
                    .style("fill", (d) => {
                        return this.getColor(d);
                    })
                    .on("mouseover", function (d) {
                        returnColor();
                        d3.select(this).attr('class', 'selected').style("fill", "#fff13b");
                        handleSelectedInstanceIdChange(d.id);
                    });
            }

            xAxisG
                .attr("class", "axis")
                .attr("transform", "translate(0," + (height - margins) + ")")
                .call(xAxis);

            yAxisG
                .attr("class", "axis")
                .attr("transform", "translate(" + margins + ", 0)")
                .call(yAxis);
        }
    }

    render() {
        return <svg ref={node => this.node = node}
                    style={this.props.svgStyle} width={this.props.size} height={this.props.size}>
        </svg>
    }
}

const withImageBackground = WrappedComponent => {
    return class extends React.PureComponent {
        render() {
            const divStyle = {
                position: "relative",
                display: "inline-block",
            };
            const svgStyle = {
                position: "relative",
                top: "0px",
                left: "0px"
            };

            const width = this.props.size;
            const height = this.props.size;
            const margins = width * MARGINS_PROPORTION;
            const imgWidth = width - (margins * 2);
            const imgHeight = height - (margins * 2);

            const imgStyle = {
                position: "absolute",
                top: (margins) + "px",
                left: (margins) + "px"
            };
            return(
                <div style={divStyle}>
                    <img alt="img" style={imgStyle} src={require('./' + this.props.dataset + '_' + this.props.embedding + '_' + this.props.dashboardType + '.png')} width={imgWidth} height={imgHeight}/>
                    <WrappedComponent {...this.props} svgStyle={svgStyle}/>
                </div>

            )
        }
    }
};

export const EmbeddingChartWithBackground = withImageBackground(EmbeddingChart);
