// Libraries
import React, {FC, memo} from 'react'

import {
  Panel,
  FlexBox,
  FlexDirection,
  ComponentSize,
  AlignItems,
  Heading,
  HeadingElement,
  FontWeight,
} from '@influxdata/clockface'
import VersionInfo from 'src/shared/components/VersionInfo'

// Types

import DocSearchWidget from 'src/me/components/DocSearchWidget'
import {isFlagEnabled} from 'src/shared/utils/featureFlag'

import LogoutButton from 'src/me/components/LogoutButton'
import DashboardsList from 'src/me/components/DashboardsList'
import GetResources from 'src/resources/components/GetResources'
import {ResourceType} from 'src/types'

const ResourceLists: FC = () => {
  return (
    <FlexBox
      direction={FlexDirection.Column}
      alignItems={AlignItems.Stretch}
      stretchToFitWidth={true}
      margin={ComponentSize.Small}
    >
      {isFlagEnabled('docSearchWidget') ? (
        <Panel testID="documentation--panel">
          <Panel.Header>
            <Heading element={HeadingElement.H3} weight={FontWeight.Medium}>
              <label htmlFor="documentation">Documentation</label>
            </Heading>
          </Panel.Header>
          <Panel.Body>
            <DocSearchWidget />
          </Panel.Body>
        </Panel>
      ) : (
        <>
          <Panel>
            <Panel.Header>
              <Heading element={HeadingElement.H3}>Account</Heading>
              <LogoutButton />
            </Panel.Header>
          </Panel>
          <Panel testID="recent-dashboards--panel">
            <Panel.Header>
              <Heading element={HeadingElement.H3}>
                <label htmlFor="filter-dashboards">Recent Dashboards</label>
              </Heading>
            </Panel.Header>
            <Panel.Body>
              <GetResources resources={[ResourceType.Dashboards]}>
                <DashboardsList />
              </GetResources>
            </Panel.Body>
          </Panel>
        </>
      )}
      <Panel>
        {isFlagEnabled('newUsagePanel') && CLOUD ? (
          <>
            <Panel.Header>
              <Heading element={HeadingElement.H3} weight={FontWeight.Medium}>
                {`Usage Rates (${
                  !quartzMe || quartzMe?.accountType === 'free'
                    ? 'Free'
                    : 'PAYG'
                })`}
              </Heading>
            </Panel.Header>
            <Panel.Body>
              <UsagePanel />
            </Panel.Body>
          </>
        ) : (
          <>
            <Panel.Header>
              <Heading element={HeadingElement.H3}>Useful Links</Heading>
            </Panel.Header>
            <Panel.Body>
              <Support />
            </Panel.Body>
          </>
        )}
        <Panel.Footer>
          <VersionInfo />
        </Panel.Footer>
      </Panel>
    </FlexBox>
  )
}

export default memo(ResourceLists)
