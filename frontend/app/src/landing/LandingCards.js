import React from "react";
import {Card} from "react-bootstrap";
import { Redirect } from "react-router-dom";

class LandingCard extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {redirect: null};
        this.onCardClick = this.onCardClick.bind(this);
    }

    onCardClick() {
        this.setState({ redirect: this.props.pageUrl});
    }

    render() {
        if (this.state.redirect) {
            return <Redirect push to={this.state.redirect} />
        }
        return (
            <Card style={{flex: 1, width:800, height:300}} onClick={this.onCardClick}>
                <Card.Body>
                    {this.props.children}
                    <Card.Title>{this.props.cardTitle}</Card.Title>
                    <Card.Text>
                        {this.props.text}
                    </Card.Text>
                </Card.Body>
            </Card>
        )
    }
}

export class InterpolationCard extends React.PureComponent {
    render() {
        return (
            <LandingCard cardTitle={"Interpolation"} pageUrl={'/interpolation'}>
                <img alt={""} src={require('./interpolation.png')} width="300" height="200"/>
            </LandingCard>
        )
    }
}

export class ComparisonCard extends React.PureComponent {
    render() {
        return <LandingCard cardTitle={"Comparison"} pageUrl={'/comparison'}>
            <img alt={""} src={require('./comparison.png')} width="300" height="200"/>
        </LandingCard>
    }
}

export class ClassifierCard extends React.PureComponent {
    render() {
        return (
            <LandingCard cardTitle={"Classifiers"} pageUrl={'/classifiers'}>
                <img alt={""} src={require('./classifiers.png')} width="300" height="200"/>
            </LandingCard>
        )
    }
}

export class ValidationCard extends React.PureComponent {
    render() {
        return (
            <LandingCard cardTitle={"Validation"} pageUrl={'/validation'}>
                <img alt={""} src={require('./validation.png')} width="300" height="200"/>
            </LandingCard>
        )
    }
}

export class GradientCard extends React.PureComponent {
    render() {
        return (
            <LandingCard cardTitle={"Gradient"} pageUrl={'/gradient'}>
                <img alt={""} src={require('./gradient.png')} width="300" height="200"/>
            </LandingCard>
        )
    }
}