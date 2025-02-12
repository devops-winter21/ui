// Libraries
import React, {FC} from 'react'
import {Panel} from '@influxdata/clockface'

// Components

// Types

// Constants

const ZuoraOutagePanel: FC = () => {
  return (
    <Panel className="zuora-outage-panel" testID="zuora-outage--panel">
      <Panel.Header>Sorry!</Panel.Header>
      <Panel.Body className="zuora-outage-panel-body">
        Our billing system is currently unavailable due to planned maintenance
        or unexpected downtime by our payment provider.
        <br />
        <br />
        <div>
          Please check back later or visit our{' '}
          <a target="_blank" href="https://status.influxdata.com/">
            status page
          </a>{' '}
          for more detail on when our payment system will be back online.
        </div>
      </Panel.Body>
    </Panel>
  )
}

export default ZuoraOutagePanel
