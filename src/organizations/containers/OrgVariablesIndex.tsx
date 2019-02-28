// Libraries
import React, {Component} from 'react'
import {withRouter, WithRouterProps} from 'react-router'
import {connect} from 'react-redux'

// Components
import {ErrorHandling} from 'src/shared/decorators/errors'
import OrganizationNavigation from 'src/organizations/components/OrganizationNavigation'
import OrgHeader from 'src/organizations/containers/OrgHeader'
import {Tabs} from 'src/clockface'
import {Page} from 'src/pageLayout'
import {SpinnerContainer, TechnoSpinner} from '@influxdata/clockface'
import TabbedPageSection from 'src/shared/components/tabbed_page/TabbedPageSection'
import GetOrgResources from 'src/organizations/components/GetOrgResources'
import Variables from 'src/organizations/components/Variables'

// APIs
import {client} from 'src/utils/api'

//Actions
import * as NotificationsActions from 'src/types/actions/notifications'
import * as notifyActions from 'src/shared/actions/notifications'

// Types
import {Organization, Variable} from '@influxdata/influx'
import {AppState} from 'src/types/v2'

const getVariables = async (org: Organization): Promise<Variable[]> => {
  return await client.variables.getAllByOrg(org.name)
}

interface RouterProps {
  params: {
    orgID: string
  }
}

interface DispatchProps {
  notify: NotificationsActions.PublishNotificationActionCreator
}

interface StateProps {
  org: Organization
}

type Props = WithRouterProps & RouterProps & DispatchProps & StateProps

@ErrorHandling
class OrgVariablesIndex extends Component<Props> {
  public render() {
    const {org} = this.props

    return (
      <Page titleTag={org.name}>
        <OrgHeader orgID={org.id} />
        <Page.Contents fullWidth={false} scrollable={true}>
          <div className="col-xs-12">
            <Tabs>
              <OrganizationNavigation tab={'variables'} orgID={org.id} />
              <Tabs.TabContents>
                <TabbedPageSection
                  id="org-view-tab--variables"
                  url="variables"
                  title="Variables"
                >
                  <GetOrgResources<Variable>
                    organization={org}
                    fetcher={getVariables}
                  >
                    {(_, loading) => {
                      return (
                        <SpinnerContainer
                          loading={loading}
                          spinnerComponent={<TechnoSpinner />}
                        >
                          <Variables org={org} />
                        </SpinnerContainer>
                      )
                    }}
                  </GetOrgResources>
                </TabbedPageSection>
              </Tabs.TabContents>
            </Tabs>
          </div>
        </Page.Contents>
      </Page>
    )
  }
}

const mstp = (state: AppState, props: Props) => {
  const {orgs} = state
  const org = orgs.find(o => o.id === props.params.orgID)
  return {
    org,
  }
}

const mdtp: DispatchProps = {
  notify: notifyActions.notify,
}

export default connect<StateProps, DispatchProps, {}>(
  mstp,
  mdtp
)(withRouter<{}>(OrgVariablesIndex))
