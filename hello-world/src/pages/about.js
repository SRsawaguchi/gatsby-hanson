import React from "react"
import Header from "../components/header"
import Layout from "../components/layout"

export default function About() {
  return (
    <Layout style={{color: `teal`}}>
      <Header headerText="About Gatsby" />
      <p>Such wow. Very React.</p>
    </Layout>
  )
}
