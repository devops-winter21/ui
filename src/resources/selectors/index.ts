// Libraries
import {get} from 'lodash'

// Types
import {
  AppState,
  Bucket,
  Label,
  RemoteDataState,
  ResourceType,
  Secret,
  Task,
  Telegraf,
} from 'src/types'

export const getStatus = (
  {resources}: AppState,
  resource: ResourceType
): RemoteDataState => {
  return resources[resource].status
}

export const getAll = <R>(
  {resources}: AppState,
  resource: ResourceType
): R[] => {
  const allIDs: string[] = resources[resource].allIDs
  const byID: {[uuid: string]: R} = resources[resource].byID
  return (allIDs ?? []).map(id => byID[id])
}

export const getAllBuckets = (state: AppState): Bucket[] =>
  getAll(state, ResourceType.Buckets)

export const getAllTasks = (state: AppState): Task[] =>
  getAll(state, ResourceType.Tasks) || []

export const getAllTelegrafs = (state: AppState): Telegraf[] =>
  getAll(state, ResourceType.Telegrafs)

export const hasNoTasks = (state: AppState): boolean =>
  getAll(state, ResourceType.Tasks).length === 0

export const getAllSecrets = (state: AppState): Secret[] =>
  getAll(state, ResourceType.Secrets) || []

export const getToken = (state: AppState): string =>
  get(state, 'dataLoading.dataLoaders.token', '') || ''

export const getByID = <R>(
  {resources}: AppState,
  type: ResourceType,
  id: string
): R => {
  const byID = get(resources, `${type}.byID`)

  if (!byID) {
    throw new Error(`"${type}" resource has yet not been set`)
  }

  const resource = get(byID, `${id}`, null)

  return resource
}

export const getLabels = (state: AppState, labelIDs: string[]): Label[] => {
  return labelIDs
    .map(labelID => getByID<Label>(state, ResourceType.Labels, labelID))
    .filter(label => !!label)
}
