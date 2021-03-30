import React from "react"
import ReactDOM from "react-dom"
import renderer from "react-test-renderer"
import {Container, Row, Col} from "./"

it("renders correctly", () => {
  const tree = renderer.create(<Container />)

  expect(tree).toMatchSnapshot()
})

it("renders correctly with params", () => {
  const tree = renderer.create(<Container className="randomClass" fluid />)

  expect(tree).toMatchSnapshot()
})

it("Row renders correctly", () => {
  const tree = renderer.create(<Row />)

  expect(tree).toMatchSnapshot()
})

it("Row renders correctly with params", () => {
  const tree = renderer.create(
    <Row
      className="randomClass"
      alignItems="center"
      justifyContent="end"
      noGutters
    />
  )

  expect(tree).toMatchSnapshot()
})

it("Col renders correctly", () => {
  const tree = renderer.create(<Col />)

  expect(tree).toMatchSnapshot()
})

it("Col renders correctly with params", () => {
  const tree = renderer.create(
    <Col
      className="randomClass"
      size={12}
      sm={12}
      md={12}
      lg={12}
      xl={12}
      offset={1}
      offsetSm={1}
      offsetMd={1}
      offsetLg={1}
      offsetXl={1}
      push={1}
      pushSm={1}
      pushMd={1}
      pushLg={1}
      pushXl={1}
      pull={1}
      pullSm={1}
      pullMd={1}
      pullLg={1}
      pullXl={1}
      alignSelf="end"
      flex="end"
      alignItems="center"
      justifyContent="center"
    />
  )

  expect(tree).toMatchSnapshot()
})

it("renders whole grid correctly", () => {
  const tree = renderer.create(
    <Container>
      <Row>
        <Col>
          <p>Test</p>
        </Col>
        <Col>
          <p>Test</p>
        </Col>
      </Row>
      <Row>
        <Col>
          <p>Test</p>
        </Col>
        <Col>
          <p>Test</p>
        </Col>
      </Row>
    </Container>
  )

  expect(tree).toMatchSnapshot()
})
