import React from "react"
import {render} from "react-dom"
import Root from "./Root"
import "./index.scss"

// Rendering the Root component, which is the top level component of our application.
render(
        <Root/>,
    document.getElementById("root")
)