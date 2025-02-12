import React, {FC} from 'react'
import {
  Panel,
  ComponentSize,
  ComponentColor,
  Gradients,
  Grid,
  Columns,
  Heading,
  HeadingElement,
  FontWeight,
  Button,
} from '@influxdata/clockface'
import {useHistory} from 'react-router-dom'

const PAYGConversion: FC = () => {
  const history = useHistory()

  const handleClick = () => {
    history.push('/checkout')
  }

  return (
    <>
      <Heading
        element={HeadingElement.H2}
        weight={FontWeight.Regular}
        className="section-header"
      >
        Need more wiggle room?
      </Heading>
      <Grid testID="payg-grid--container">
        <Grid.Row>
          <Grid.Column widthSM={Columns.Eight} offsetSM={Columns.Two}>
            <Panel gradient={Gradients.HotelBreakfast}>
              <Panel.Header size={ComponentSize.Medium}>
                <Heading element={HeadingElement.H2}>
                  Switch to a usage-based plan to get:
                </Heading>
              </Panel.Header>
              <Panel.Body size={ComponentSize.Medium}>
                <div>
                  <div className="conversion-panel--list">
                    <ul className="conversion-panel--benefits">
                      <li>Unlimited buckets to store your data</li>
                      <li>Unlimited storage retention</li>
                      <li>Unlimited dashboards</li>
                      <li>Unlimited tasks</li>
                      <li>Unlimited alert checks and notification rules</li>
                      <li>HTTP and PagerDuty notifications</li>
                      <li>Up to 1,000,000 series cardinality</li>
                    </ul>
                  </div>
                </div>
                <p className="conversion-panel--final-p">
                  No upfront commitments. Pay only for what you use. Turn off
                  when you don’t need it.
                </p>
              </Panel.Body>
              <Panel.Footer
                size={ComponentSize.Medium}
                testID="payg-button--upgrade"
              >
                <Button
                  color={ComponentColor.Primary}
                  size={ComponentSize.Large}
                  text="Upgrade to a Usage-Based Plan"
                  className="cf-cta-button conversion-panel--cta"
                  onClick={handleClick}
                />
              </Panel.Footer>
            </Panel>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </>
  )
}

export default PAYGConversion
