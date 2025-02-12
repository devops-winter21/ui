// Libraries
import React, {FC, useContext} from 'react'
import {Switch, Route, Link} from 'react-router-dom'

// Components
import DataExplorer from 'src/dataExplorer/components/DataExplorer'
import {Page, Icon, IconFont} from '@influxdata/clockface'
import SaveAsButton from 'src/dataExplorer/components/SaveAsButton'
import VisOptionsButton from 'src/timeMachine/components/VisOptionsButton'
import GetResources from 'src/resources/components/GetResources'
import TimeZoneDropdown from 'src/shared/components/TimeZoneDropdown'
import RateLimitAlert from 'src/cloud/components/RateLimitAlert'
import SaveAsOverlay from 'src/dataExplorer/components/SaveAsOverlay'
import ViewTypeDropdown from 'src/timeMachine/components/ViewTypeDropdown'
import {AddAnnotationDEOverlay} from 'src/overlays/components/index'
import {EditAnnotationDEOverlay} from 'src/overlays/components/index'

// Utils
import {pageTitleSuffixer} from 'src/shared/utils/pageTitles'
import {event, useLoadTimeReporting} from 'src/cloud/utils/reporting'
import {FeatureFlag} from 'src/shared/utils/featureFlag'

// Types
import {ResourceType} from 'src/types'

import 'src/shared/components/cta.scss'
import {AppSettingContext} from 'src/shared/contexts/app'

const DataExplorerPage: FC = () => {
  const {flowsCTA, setFlowsCTA} = useContext(AppSettingContext)
  useLoadTimeReporting('DataExplorerPage load start')

  const hideFlowsCTA = () => {
    setFlowsCTA({explorer: false})
  }

  const recordClick = () => {
    event('Data Explorer Page - Clicked Notebooks CTA')
  }

  return (
    <Page titleTag={pageTitleSuffixer(['Data Explorer'])}>
      <Switch>
        <Route
          path="/orgs/:orgID/data-explorer/save"
          component={SaveAsOverlay}
        />
        <Route
          path="/orgs/:orgID/data-explorer/add-annotation"
          component={AddAnnotationDEOverlay}
        />
        <Route
          path="/orgs/:orgID/data-explorer/edit-annotation"
          component={EditAnnotationDEOverlay}
        />
      </Switch>
      <GetResources resources={[ResourceType.Variables]}>
        <Page.Header fullWidth={true} testID="data-explorer--header">
          <Page.Title title="Data Explorer" />
          <RateLimitAlert />
        </Page.Header>
        {flowsCTA.explorer && (
          <FeatureFlag name="flowsCTA">
            <div className="header-cta--de">
              <div className="header-cta">
                <Icon glyph={IconFont.BookPencil} />
                Now you can use Notebooks to explore and take action on your
                data
                <Link to="/notebook/from/default" onClick={recordClick}>
                  Create a Notebook
                </Link>
                <span className="header-cta--close-icon" onClick={hideFlowsCTA}>
                  <Icon glyph={IconFont.Remove_New} />
                </span>
              </div>
            </div>
          </FeatureFlag>
        )}
        <Page.ControlBar fullWidth={true}>
          <Page.ControlBarLeft>
            <ViewTypeDropdown />
            <VisOptionsButton />
          </Page.ControlBarLeft>
          <Page.ControlBarRight>
            <TimeZoneDropdown />
            <SaveAsButton />
          </Page.ControlBarRight>
        </Page.ControlBar>
        <Page.Contents fullWidth={true} scrollable={false}>
          <DataExplorer />
        </Page.Contents>
      </GetResources>
    </Page>
  )
}

export default DataExplorerPage
