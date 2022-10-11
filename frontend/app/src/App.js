import React from 'react';
import './App.css';
import { Switch, Route } from 'react-router-dom';
import LandingPage from "./landing/LandingPage";
import {InterpolationDashboard, ComparisonDashboard, ClassifierDashboard, CoordsInterpolationDashboard} from './dashboards/UnprojectionDashboards'
import {coordsUrlGenerator} from "./api";

const NoMatchPage = () => {
    return (
        <h3>404 - Not found</h3>
    );
};

const Main = () => (
    <Switch>
        <Route exact path='/' component={LandingPage}/>
        <Route exact path='/interpolation'
               render={
                () => <InterpolationDashboard
                    dataset={"mnist"}
                    dashboardType={"interpolation"}
                    urlGenerator={coordsUrlGenerator}
                />}
        />
        <Route exact path='/comparison'
               render={
                   () => <ComparisonDashboard
                       dataset={"mnist"}
                       dashboardType={"comparison"}
                       urlGenerator={coordsUrlGenerator}
                   />}
        />
        <Route exact path='/classifiers'
               render={
                   () => <ClassifierDashboard
                       dataset={"classifiers"}
                       dashboardType={"classifiers"}
                       urlGenerator={coordsUrlGenerator}
                   />}
        />
        <Route exact path='/validation'
               render={
                   () => <CoordsInterpolationDashboard
                       dataset={"sphere"}
                       dashboardType={"validation"}
                       urlGenerator={coordsUrlGenerator}
                   />}
        />
        <Route exact path='/gradient'
               render={
                   () => <CoordsInterpolationDashboard
                       dataset={"spherefulldata"}
                       dashboardType={"gradient"}
                       urlGenerator={coordsUrlGenerator}
                   />}
        />
        <Route component={NoMatchPage} />
    </Switch>
);

function App() {
    return (
        <div className="App">
            <Main/>
        </div>
    );
}

export default App;
