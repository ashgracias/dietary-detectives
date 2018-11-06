"use strict";

//modules
import React, { Component, Fragment } from "react";
import { render } from "react-dom";
import styled from "styled-components";
import { BrowserRouter, Route, Redirect } from "react-router-dom";

import { Header } from "./components/header";
import { Home } from "./components/home";
import { Search } from "./components/search";
import { Profile } from "./components/profile";
import { Favorites } from "./components/favorites";
import { Options } from "./components/options";
import { Review } from "./components/review";
import { Login } from "./components/login";
import { Logout } from "./components/logout";
import { Register } from "./components/register";

const defaultUser = {
    username: "",
    first_name: "",
    last_name: "",
    email: "",
    city: "",
    restrictions: []
};


const Grid = styled.div`
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: auto auto auto;
    grid-template-areas:
        "hd"
        "main"
        "ft";
        
    @media (min-width: 500px) {
        grid-template-columns: 40px 50px 1fr 50px 40px;
        grid-template-rows: auto auto auto;
        grid-template-areas:
            "hd hd hd hd hd"
            "sb sb main main main"
            "ft ft ft ft ft";
        }
    `;


class MyApp extends Component {
    constructor(props) {
        super(props);
        //sessionStorage info
        const data = window.__PRELOADED_STATE__;
        this.state = data.username ? data : defaultUser;
        console.log(`Welcome ${this.state.username}`);
        //bind instance methods
        this.loggedIn = this.loggedIn.bind(this);
        this.logIn = this.logIn.bind(this);
        this.logOut = this.logOut.bind(this);
    }

    loggedIn() {
        return this.state.username && this.state.email;
    }

    logIn(username) {
        fetch(`/v1/user/${username}`)
            .then(res => res.json())
            .then(user => {
                this.setState(user);
            })
            .catch(() => {
                alert("An unexpected error occurred.");
                this.logOut();
            });
    }

    logOut() {
        fetch("/v1/session", {
            method: "DELETE",
            credentials: "include"
        }).then(() => {
            this.setState(defaultUser);
        });
    }

    render() {
        return (
            < BrowserRouter>
                < Grid>
                    < Header user={this.state.username} email={this.state.email}/>
                    < Route exact path="/" component={Landing}/>
                    < Route
                        path="/login"
                        render={props =>
                            this.loggedIn() ? (
                                < Redirect to={`/profile/${this.state.username}`}/>
                            ) : (
                                < Login {...props} logIn={this.logIn}/>
                            )
                        }
                    />
                    < Route
                        path="/register"
                        render={props => {
                            return this.loggedIn() ? (
                                < Redirect to={`/profile/${this.state.username}`}/>
                            ) : (
                                < Register {...props} />
                            );
                        }}
                    />
                    < Route
                        path="/profile/:username"
                        render={props => (
                            <Profile {...props} currentUser={this.state.username}/>
                        )}
                    />
                </Grid>
            </BrowserRouter>
        );
    }
}

render(<MyApp />, document.getElementById("mainDiv"));