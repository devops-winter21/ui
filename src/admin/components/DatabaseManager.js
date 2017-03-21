import React, {PropTypes} from 'react'
import DatabaseTable from 'src/admin/components/DatabaseTable'

const DatabaseManager = ({
  databases,
  notify,
  addDatabase,
  onEditDatabase,
  onKeyDownDatabase,
  onCancelDatabase,
  onConfirmDatabase,
  onStartDeleteDatabase,
  onDatabaseDeleteConfirm,
  onAddRetentionPolicy,
  onEditRetentionPolicy,
  onStopEditRetentionPolicy,
  onCancelRetentionPolicy,
  onCreateRetentionPolicy,
  onUpdateRetentionPolicy,
  onRemoveRetentionPolicy,
}) => {
  return (
    <div className="panel panel-info">
      <div className="panel-heading u-flex u-ai-center u-jc-space-between">
        <h2 className="panel-title">{databases.length === 1 ? '1 Database' : `${databases.length} Databases`}</h2>
        <div className="btn btn-sm btn-primary" onClick={addDatabase}>Create Database</div>
      </div>
      <div className="panel-body">
        {
          databases.map(db =>
            <DatabaseTable
              key={db.links.self}
              database={db}
              notify={notify}
              onEditDatabase={onEditDatabase}
              onKeyDownDatabase={onKeyDownDatabase}
              onCancelDatabase={onCancelDatabase}
              onConfirmDatabase={onConfirmDatabase}
              onStartDeleteDatabase={onStartDeleteDatabase}
              onDatabaseDeleteConfirm={onDatabaseDeleteConfirm}
              onAddRetentionPolicy={onAddRetentionPolicy}
              onEditRetentionPolicy={onEditRetentionPolicy}
              onStopEditRetentionPolicy={onStopEditRetentionPolicy}
              onCancelRetentionPolicy={onCancelRetentionPolicy}
              onCreateRetentionPolicy={onCreateRetentionPolicy}
              onUpdateRetentionPolicy={onUpdateRetentionPolicy}
              onRemoveRetentionPolicy={onRemoveRetentionPolicy}
            />
          )
        }
      </div>
    </div>
  )
}

const {
  arrayOf,
  func,
  shape,
} = PropTypes

DatabaseManager.propTypes = {
  databases: arrayOf(shape()),
  notify: func,
  addDatabase: func,
  onEditDatabase: func,
  onKeyDownDatabase: func,
  onCancelDatabase: func,
  onConfirmDatabase: func,
  onStartDeleteDatabase: func,
  onDatabaseDeleteConfirm: func,
  onAddRetentionPolicy: func,
  onEditRetentionPolicy: func,
  onStopEditRetentionPolicy: func,
  onCancelRetentionPolicy: func,
  onCreateRetentionPolicy: func,
  onUpdateRetentionPolicy: func,
  onRemoveRetentionPolicy: func,
}

export default DatabaseManager

