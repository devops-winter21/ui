// Libraries
import React, {PureComponent} from 'react'
import {withRouter, WithRouterProps} from 'react-router'
import {connect} from 'react-redux'
import {get} from 'lodash'

// Components
import BucketRow, {PrettyBucket} from 'src/buckets/components/BucketRow'
import {IndexList} from 'src/clockface'

// Actions
import {setBucketInfo} from 'src/dataLoaders/actions/steps'

// Selectors
import {getSortedResource} from 'src/shared/selectors/sort'

// Types
import {OverlayState} from 'src/types'
import {DataLoaderType} from 'src/types/dataLoaders'
import {setDataLoadersType} from 'src/dataLoaders/actions/dataLoaders'
import {AppState} from 'src/types'
import {Sort} from '@influxdata/clockface'
import {SortTypes} from 'src/shared/selectors/sort'

type SortKey = keyof PrettyBucket

interface OwnProps {
  buckets: PrettyBucket[]
  emptyState: JSX.Element
  onUpdateBucket: (b: PrettyBucket) => void
  onDeleteBucket: (b: PrettyBucket) => void
  onFilterChange: (searchTerm: string) => void
  sortKey: string
  sortDirection: Sort
  sortType: SortTypes
  onClickColumn: (mextSort: Sort, sortKey: SortKey) => void
}

interface DispatchProps {
  onSetBucketInfo: typeof setBucketInfo
  onSetDataLoadersType: typeof setDataLoadersType
}

interface StateProps {
  dataLoaderType: DataLoaderType
  sortedBuckets: PrettyBucket[]
}

type Props = OwnProps & StateProps & DispatchProps

interface State {
  bucketID: string
  bucketOverlayState: OverlayState
  sortedBuckets: PrettyBucket[]
}

class BucketList extends PureComponent<Props & WithRouterProps, State> {
  constructor(props) {
    super(props)
    const bucketID = get(this, 'props.buckets.0.id', null)

    this.state = {
      bucketID,
      bucketOverlayState: OverlayState.Closed,
      sortedBuckets: this.props.sortedBuckets,
    }
  }

  componentDidUpdate(prevProps) {
    const {buckets, sortedBuckets, sortKey, sortDirection} = this.props

    if (
      prevProps.sortDirection !== sortDirection ||
      prevProps.sortKey !== sortKey ||
      prevProps.buckets.length !== buckets.length
    ) {
      this.setState({sortedBuckets})
    }
  }

  public render() {
    const {emptyState, sortKey, sortDirection, onClickColumn} = this.props

    return (
      <>
        <IndexList>
          <IndexList.Header>
            <IndexList.HeaderCell
              sortKey={this.headerKeys[0]}
              sort={sortKey === this.headerKeys[0] ? sortDirection : Sort.None}
              columnName="Name"
              width="40%"
              onClick={onClickColumn}
            />
            <IndexList.HeaderCell
              sortKey={this.headerKeys[1]}
              sort={sortKey === this.headerKeys[1] ? sortDirection : Sort.None}
              columnName="Retention"
              width="40%"
              onClick={onClickColumn}
            />
            <IndexList.HeaderCell columnName="" width="20%" />
          </IndexList.Header>
          <IndexList.Body columnCount={3} emptyState={emptyState}>
            {this.listBuckets}
          </IndexList.Body>
        </IndexList>
      </>
    )
  }

  private get headerKeys(): SortKey[] {
    return ['name', 'ruleString']
  }

  private get listBuckets(): JSX.Element[] {
    const {onDeleteBucket, onFilterChange} = this.props
    const {sortedBuckets} = this.state

    return sortedBuckets.map(bucket => (
      <BucketRow
        key={bucket.id}
        bucket={bucket}
        onEditBucket={this.handleStartEdit}
        onDeleteBucket={onDeleteBucket}
        onAddData={this.handleStartAddData}
        onUpdateBucket={this.handleUpdateBucket}
        onFilterChange={onFilterChange}
      />
    ))
  }

  private handleStartEdit = (bucket: PrettyBucket) => {
    const {orgID} = this.props.params

    this.props.router.push(`/orgs/${orgID}/buckets/${bucket.id}/edit`)
  }

  private handleStartAddData = (
    bucket: PrettyBucket,
    dataLoaderType: DataLoaderType,
    link: string
  ) => {
    const {onSetBucketInfo, onSetDataLoadersType, router} = this.props
    onSetBucketInfo(
      bucket.organization,
      bucket.organizationID,
      bucket.name,
      bucket.id
    )

    this.setState({
      bucketID: bucket.id,
    })

    onSetDataLoadersType(dataLoaderType)
    router.push(link)
  }

  private handleUpdateBucket = async (updatedBucket: PrettyBucket) => {
    await this.props.onUpdateBucket(updatedBucket)
    this.setState({bucketOverlayState: OverlayState.Closed})
  }
}

const mstp = (state: AppState, props: OwnProps): StateProps => {
  return {
    dataLoaderType: state.dataLoading.dataLoaders.type,
    sortedBuckets: getSortedResource(props.buckets, props),
  }
}

const mdtp: DispatchProps = {
  onSetBucketInfo: setBucketInfo,
  onSetDataLoadersType: setDataLoadersType,
}

export default connect<StateProps, DispatchProps, OwnProps>(
  mstp,
  mdtp
)(withRouter<Props>(BucketList))
