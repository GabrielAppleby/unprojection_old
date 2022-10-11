import React from "react";
import {CardGroup} from "react-bootstrap";
import {InterpolationCard, ComparisonCard, ValidationCard, ClassifierCard, GradientCard} from "./LandingCards";

export default class LandingPage extends React.PureComponent {
    render() {
        return (<>
            <CardGroup>
                <InterpolationCard/>
                <ComparisonCard/>
                <ClassifierCard/>
            </CardGroup>
            <CardGroup>
                <ValidationCard/>
                <GradientCard/>
            </CardGroup>
        </>)
    }
}