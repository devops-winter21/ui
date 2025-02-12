// Libraries
import React, {PureComponent} from 'react'
import {connect, ConnectedProps} from 'react-redux'
import {Route, RouteComponentProps, Switch} from 'react-router-dom'

// Components
import TasksHeader from 'src/tasks/components/TasksHeader'
import TasksList from 'src/tasks/components/TasksList'
import {ComponentSize, Page, Sort} from '@influxdata/clockface'
import {ErrorHandling} from 'src/shared/decorators/errors'
import FilterList from 'src/shared/components/FilterList'
import GetResources from 'src/resources/components/GetResources'
import GetAssetLimits from 'src/cloud/components/GetAssetLimits'
import AssetLimitAlert from 'src/cloud/components/AssetLimitAlert'
import TaskExportOverlay from 'src/tasks/components/TaskExportOverlay'

// Utils
import {pageTitleSuffixer} from 'src/shared/utils/pageTitles'
import {isFlagEnabled} from 'src/shared/utils/featureFlag'

// Actions
import {
  addTaskLabel,
  cloneTask,
  deleteTask,
  runTask,
  updateTaskName,
  updateTaskStatus,
} from 'src/tasks/actions/thunks'

import {
  setSearchTerm as setSearchTermAction,
  setShowInactive as setShowInactiveAction,
} from 'src/tasks/actions/creators'

import {checkTaskLimits as checkTasksLimitsAction} from 'src/cloud/actions/limits'

// Types
import {AppState, ResourceType, Task} from 'src/types'
import {SortTypes} from 'src/shared/utils/sort'
import {extractTaskLimits} from 'src/cloud/utils/limits'
import {TaskSortKey} from 'src/shared/components/resource_sort_dropdown/generateSortItems'

// Selectors
import {getAll} from 'src/resources/selectors'

type ReduxProps = ConnectedProps<typeof connector>
type Props = ReduxProps & RouteComponentProps<{orgID: string}>

interface State {
  isImporting: boolean
  taskLabelsEdit: Task
  sortKey: TaskSortKey
  sortDirection: Sort
  sortType: SortTypes
}

const Filter = FilterList<Task>()

@ErrorHandling
class TasksPage extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props)

    if (!props.showInactive) {
      props.setShowInactive()
    }

    this.state = {
      isImporting: false,
      taskLabelsEdit: null,
      sortKey: 'name',
      sortDirection: Sort.Ascending,
      sortType: SortTypes.String,
    }
  }

  public render(): JSX.Element {
    const {sortKey, sortDirection, sortType} = this.state
    const {
      setSearchTerm,
      updateTaskName,
      searchTerm,
      setShowInactive,
      showInactive,
      onAddTaskLabel,
      onRunTask,
      checkTaskLimits,
      limitStatus,
    } = this.props

    return (
      <>
        <Page titleTag={pageTitleSuffixer(['Tasks'])}>
          <TasksHeader
            onCreateTask={this.handleCreateTask}
            setShowInactive={setShowInactive}
            showInactive={showInactive}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            sortKey={sortKey}
            sortDirection={sortDirection}
            sortType={sortType}
            onSort={this.handleSort}
          />
          <Page.Contents
            fullWidth={false}
            scrollable={true}
            scrollbarSize={ComponentSize.Large}
            autoHideScrollbar={true}
          >
            <GetResources resources={[ResourceType.Tasks, ResourceType.Labels]}>
              <GetAssetLimits>
                <Filter
                  list={this.filteredTasks}
                  searchTerm={searchTerm}
                  searchKeys={['name', 'labels[].name', 'id']}
                >
                  {ts => (
                    <TasksList
                      searchTerm={searchTerm}
                      tasks={ts}
                      totalCount={this.totalTaskCount}
                      onActivate={this.handleActivate}
                      onDelete={this.handleDelete}
                      onCreate={this.handleCreateTask}
                      onClone={this.handleClone}
                      onAddTaskLabel={onAddTaskLabel}
                      onRunTask={onRunTask}
                      onFilterChange={setSearchTerm}
                      onUpdate={updateTaskName}
                      sortKey={sortKey}
                      sortDirection={sortDirection}
                      sortType={sortType}
                      checkTaskLimits={checkTaskLimits}
                    />
                  )}
                </Filter>
                {this.hiddenTaskAlert}
                <AssetLimitAlert
                  resourceName="tasks"
                  limitStatus={limitStatus}
                />
              </GetAssetLimits>
            </GetResources>
          </Page.Contents>
        </Page>
        <Switch>
          <Route
            path="/orgs/:orgID/tasks/:id/export"
            component={TaskExportOverlay}
          />
        </Switch>
      </>
    )
  }

  private handleSort = (
    sortKey: TaskSortKey,
    sortDirection: Sort,
    sortType: SortTypes
  ) => {
    this.setState({sortKey, sortDirection, sortType})
  }

  private handleActivate = (task: Task) => {
    this.props.updateTaskStatus(task)
  }

  private handleDelete = (task: Task) => {
    this.props.deleteTask(task.id)
  }

  private handleClone = (task: Task) => {
    this.props.cloneTask(task)
  }

  private handleCreateTask = () => {
    const {
      history,
      match: {
        params: {orgID},
      },
    } = this.props

    if (isFlagEnabled('createWithFlows')) {
      history.push(`/notebook/from/task`)
    } else {
      history.push(`/orgs/${orgID}/tasks/new`)
    }
  }

  private get filteredTasks(): Task[] {
    const {tasks, showInactive} = this.props
    const matchingTasks = tasks.filter(t => {
      let activeFilter = true
      if (!showInactive) {
        activeFilter = t.status === 'active'
      }

      return activeFilter
    })

    return matchingTasks
  }

  private get totalTaskCount(): number {
    return this.props.tasks.length
  }

  private get hiddenTaskAlert(): JSX.Element {
    const {showInactive, tasks} = this.props

    const hiddenCount = tasks.filter(t => t.status === 'inactive').length

    const allTasksAreHidden = hiddenCount === tasks.length

    if (allTasksAreHidden || showInactive) {
      return null
    }

    if (hiddenCount) {
      const pluralizer = hiddenCount === 1 ? '' : 's'
      const verb = hiddenCount === 1 ? 'is' : 'are'

      return (
        <div className="hidden-tasks-alert">{`${hiddenCount} inactive task${pluralizer} ${verb} hidden from view`}</div>
      )
    }
  }
}

const mstp = (state: AppState) => {
  const {resources} = state
  const {status, searchTerm, showInactive} = resources.tasks

  return {
    tasks: getAll<Task>(state, ResourceType.Tasks),
    status: status,
    searchTerm,
    showInactive,
    limitStatus: extractTaskLimits(state),
  }
}

const mdtp = {
  updateTaskStatus,
  updateTaskName,
  deleteTask,
  cloneTask,
  setSearchTerm: setSearchTermAction,
  setShowInactive: setShowInactiveAction,
  onAddTaskLabel: addTaskLabel,
  onRunTask: runTask,
  checkTaskLimits: checkTasksLimitsAction,
}

const connector = connect(mstp, mdtp)

export default connector(TasksPage)
