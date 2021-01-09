import React from "react"
import { Link } from "gatsby"
import Header from "../components/header"

export default function Home() {
  return (
    <div style={{ margin: `3rem auto`, maxWidth: 600 }}>
      <Header headerText="Hi! I'm building a fake Gatsby site as part of a tutorial!" />
      <p>
        What do I like to do? Lots of course but definitely enjoy building
        websites.
      </p>
      <Link to="/contact/">Contact</Link>
    </div>
  )
}
