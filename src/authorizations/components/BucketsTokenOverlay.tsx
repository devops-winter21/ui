import React, {PureComponent, ChangeEvent} from 'react'
import {connect, ConnectedProps} from 'react-redux'

// Components
import {
  ComponentColor,
  Button,
  ButtonType,
  Grid,
  Columns,
  Input,
  Overlay,
  Form,
} from '@influxdata/clockface'
import BucketsSelector from 'src/authorizations/components/BucketsSelector'
import BucketsProvider from 'src/flows/context/buckets'

// Utils
import {
  specificBucketsPermissions,
  toggleSelectedBucket,
  allBucketsPermissions,
  BucketTab,
} from 'src/authorizations/utils/permissions'
import {isSystemBucket} from 'src/buckets/constants/index'
import {getOrg} from 'src/organizations/selectors'
import {getAll} from 'src/resources/selectors'

// Actions
import {createAuthorization} from 'src/authorizations/actions/thunks'

// Decorators
import {ErrorHandling} from 'src/shared/decorators/errors'

// Types
import {
  AppState,
  Bucket,
  Permission,
  Authorization,
  ResourceType,
} from 'src/types'

interface OwnProps {
  onClose: () => void
}

interface State {
  description: string
  readBuckets: string[]
  writeBuckets: string[]
  activeTabRead: BucketTab
  activeTabWrite: BucketTab
}

type ReduxProps = ConnectedProps<typeof connector>
type Props = OwnProps & ReduxProps

@ErrorHandling
class BucketsTokenOverlay extends PureComponent<Props, State> {
  public state = {
    description: '',
    readBuckets: [],
    writeBuckets: [],
    activeTabRead: BucketTab.Scoped,
    activeTabWrite: BucketTab.Scoped,
  }

  render() {
    const {
      description,
      readBuckets,
      writeBuckets,
      activeTabRead,
      activeTabWrite,
    } = this.state

    const {buckets} = this.props

    return (
      <Overlay.Container maxWidth={800}>
        <Overlay.Header
          title="Generate Read/Write API Token"
          onDismiss={this.handleDismiss}
        />
        <Form onSubmit={this.handleSave}>
          <Overlay.Body>
            <Form.Element label="Description">
              <Input
                placeholder="Describe this new API Token"
                value={description}
                onChange={this.handleInputChange}
                testID="input-field--descr"
              />
            </Form.Element>
            <Form.Element label="">
              <BucketsProvider>
                <Grid.Row>
                  <Grid.Column widthXS={Columns.Twelve} widthSM={Columns.Six}>
                    <BucketsSelector
                      onSelect={this.handleSelectReadBucket}
                      buckets={buckets}
                      selectedBuckets={readBuckets}
                      title="Read"
                      onSelectAll={this.handleReadSelectAllBuckets}
                      onDeselectAll={this.handleReadDeselectAllBuckets}
                      activeTab={activeTabRead}
                      onTabClick={this.handleReadTabClick}
                    />
                  </Grid.Column>
                  <Grid.Column widthXS={Columns.Twelve} widthSM={Columns.Six}>
                    <BucketsSelector
                      onSelect={this.handleSelectWriteBucket}
                      buckets={buckets}
                      selectedBuckets={writeBuckets}
                      title="Write"
                      onSelectAll={this.handleWriteSelectAllBuckets}
                      onDeselectAll={this.handleWriteDeselectAllBuckets}
                      activeTab={activeTabWrite}
                      onTabClick={this.handleWriteTabClick}
                    />
                  </Grid.Column>
                </Grid.Row>
              </BucketsProvider>
            </Form.Element>
          </Overlay.Body>
          <Form.Footer>
            <Overlay.Footer>
              <Button
                text="Cancel"
                color={ComponentColor.Tertiary}
                onClick={this.handleDismiss}
                testID="button--cancel"
              />

              <Button
                text="Save"
                color={ComponentColor.Success}
                type={ButtonType.Submit}
                testID="button--save"
              />
            </Overlay.Footer>
          </Form.Footer>
        </Form>
      </Overlay.Container>
    )
  }

  private handleReadTabClick = (tab: BucketTab) => {
    this.setState({activeTabRead: tab})
  }

  private handleWriteTabClick = (tab: BucketTab) => {
    this.setState({activeTabWrite: tab})
  }

  private handleSelectReadBucket = (bucketName: string): void => {
    const readBuckets = toggleSelectedBucket(bucketName, this.state.readBuckets)

    this.setState({readBuckets})
  }

  private handleSelectWriteBucket = (bucketName: string): void => {
    const writeBuckets = toggleSelectedBucket(
      bucketName,
      this.state.writeBuckets
    )

    this.setState({writeBuckets})
  }

  private handleReadSelectAllBuckets = () => {
    const readBuckets = this.props.buckets.map(b => b.name)
    this.setState({readBuckets})
  }

  private handleReadDeselectAllBuckets = () => {
    this.setState({readBuckets: []})
  }

  private handleWriteSelectAllBuckets = () => {
    const writeBuckets = this.props.buckets.map(b => b.name)
    this.setState({writeBuckets})
  }

  private handleWriteDeselectAllBuckets = () => {
    this.setState({writeBuckets: []})
  }

  private handleSave = () => {
    const {orgID, onCreateAuthorization} = this.props
    const {activeTabRead, activeTabWrite} = this.state

    let permissions = []

    if (activeTabRead === BucketTab.Scoped) {
      permissions = [...this.readBucketPermissions]
    } else {
      permissions = [...this.allReadBucketPermissions]
    }

    if (activeTabWrite === BucketTab.Scoped) {
      permissions = [...permissions, ...this.writeBucketPermissions]
    } else {
      permissions = [...permissions, ...this.allWriteBucketPermissions]
    }

    const token: Authorization = {
      orgID,
      description: this.state.description,
      permissions,
    }

    onCreateAuthorization(token)

    this.handleDismiss()
  }

  private get writeBucketPermissions(): Permission[] {
    const {buckets} = this.props

    const writeBuckets = this.state.writeBuckets.map(bucketName => {
      return buckets.find(b => b.name === bucketName)
    })

    return specificBucketsPermissions(writeBuckets, 'write')
  }

  private get readBucketPermissions(): Permission[] {
    const {buckets} = this.props

    const readBuckets = this.state.readBuckets.map(bucketName => {
      return buckets.find(b => b.name === bucketName)
    })

    return specificBucketsPermissions(readBuckets, 'read')
  }

  private get allReadBucketPermissions(): Permission[] {
    const {orgID} = this.props

    return allBucketsPermissions(orgID, 'read')
  }

  private get allWriteBucketPermissions(): Permission[] {
    const {orgID} = this.props

    return allBucketsPermissions(orgID, 'write')
  }

  private handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const {value} = e.target

    this.setState({description: value})
  }

  private handleDismiss = () => {
    this.props.onClose()
  }
}

const mstp = (state: AppState) => {
  const orgID = getOrg(state).id
  return {
    orgID: orgID,
    buckets: getAll<Bucket>(state, ResourceType.Buckets)
      .filter(bucket => !isSystemBucket(bucket.name))
      .filter(bucket => bucket.orgID === orgID),
  }
}

const mdtp = {
  onCreateAuthorization: createAuthorization,
}

const connector = connect(mstp, mdtp)

export default connector(BucketsTokenOverlay)
